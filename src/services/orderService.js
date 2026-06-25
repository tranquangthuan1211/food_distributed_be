const { v4: uuidv4 } = require('uuid');
const Order = require('../models/mongodb/Order');
const Restaurant = require('../models/mongodb/Restaurant');
const { client: cassandraClient } = require('../config/cassandra');
const { driver } = require('../config/neo4j');
const {
  MERGE_USER,
  MERGE_RESTAURANT,
  MERGE_FOOD,
  CREATE_ORDERED_REL,
  CREATE_FOOD_REL,
} = require('../models/neo4j/graphQueries');

async function createOrder(data) {
  const restaurant = await Restaurant.findById(data.restaurantId);
  if (!restaurant) throw new Error('Restaurant not found');

  const order = new Order({
    ...data,
    restaurantName: restaurant.name,
  });
  await order.save();

  const keyspace = process.env.CASSANDRA_KEYSPACE || 'fooddelivery';
  const yearMonth = new Date(order.createdAt).toISOString().slice(0, 7);

  try {
    // Convert MongoDB IDs to UUID format for Cassandra
    const userIdUUID = uuidv4();
    const orderIdUUID = uuidv4();

    await cassandraClient.execute(
      `INSERT INTO ${keyspace}.order_history (user_id, created_at, order_id, restaurant_id, restaurant_name, items, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userIdUUID,
        order.createdAt,
        orderIdUUID,
        order.restaurantId.toString(),
        order.restaurantName,
        order.items.map((i) => `${i.name} x${i.quantity}`),
        order.totalPrice,
        order.status,
      ],
      { prepare: true }
    );

    for (const item of order.items) {
      await cassandraClient.execute(
        `UPDATE ${keyspace}.food_stats SET total_sold = total_sold + ? WHERE year_month = ? AND food_id = ?`,
        [
          item.quantity,
          yearMonth,
          item.menuItemId ? item.menuItemId.toString() : item.name,
        ],
        { prepare: true }
      );
    }
  } catch (err) {
    console.warn('Cassandra write error:', err.message);
  }

  try {
    const neo4jSession = driver.session();
    try {
      const userIdStr = order.userId.toString();
      const restaurantIdStr = order.restaurantId.toString();

      // Get user from MongoDB for correct name
      const user = await User.findById(order.userId);
      await neo4jSession.run(MERGE_USER, {
        userId: userIdStr,
        name: user ? user.name : '',
        email: user ? user.email : '',
      });

      await neo4jSession.run(MERGE_RESTAURANT, {
        restaurantId: restaurantIdStr,
        name: order.restaurantName,
        category: restaurant.category || '',
      });

      await neo4jSession.run(CREATE_ORDERED_REL, {
        userId: userIdStr,
        restaurantId: restaurantIdStr,
        orderId: order._id.toString(),
        at: order.createdAt.toISOString(),
        total: order.totalPrice,
      });

      for (const item of order.items) {
        const foodId = item.menuItemId ? item.menuItemId.toString() : item.name;
        await neo4jSession.run(MERGE_FOOD, {
          foodId,
          name: item.name,
          price: item.price,
        });
        await neo4jSession.run(CREATE_FOOD_REL, {
          userId: userIdStr,
          foodId,
        });
      }
    } finally {
      await neo4jSession.close();
    }
  } catch (err) {
    console.warn('Neo4j write error:', err.message);
  }

  return order;
}

async function updateOrderStatus(orderId, status) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (!order) throw new Error('Order not found');
  return order;
}

module.exports = { createOrder, updateOrderStatus };
