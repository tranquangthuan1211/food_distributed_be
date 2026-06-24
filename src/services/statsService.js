const { client: cassandraClient } = require('../config/cassandra');

async function getTopFoods(yearMonth) {
  const keyspace = process.env.CASSANDRA_KEYSPACE || 'fooddelivery';
  const result = await cassandraClient.execute(
    `SELECT food_id, food_name, restaurant_id, total_sold FROM ${keyspace}.food_stats WHERE year_month = ? LIMIT 10`,
    [yearMonth],
    { prepare: true }
  );
  const rows = result.rows.map((r) => ({
    foodId: r.food_id,
    foodName: r.food_name,
    restaurantId: r.restaurant_id,
    totalSold: r.total_sold ? r.total_sold.toNumber() : 0,
  }));
  rows.sort((a, b) => b.totalSold - a.totalSold);
  return rows;
}

module.exports = { getTopFoods };
