const { driver } = require('../config/neo4j');
const { GET_RECOMMENDATIONS, GET_USER_RESTAURANT_GRAPH } = require('../models/neo4j/graphQueries');

async function getRecommendations(userId) {
  const session = driver.session();
  try {
    const result = await session.run(GET_RECOMMENDATIONS, { userId });
    return result.records.map((r) => ({
      foodId: r.get('foodId'),
      name: r.get('name'),
      price: r.get('price'),
      score: r.get('score').toNumber ? r.get('score').toNumber() : r.get('score'),
    }));
  } finally {
    await session.close();
  }
}

async function getUserRestaurantGraph(userId) {
  const session = driver.session();
  try {
    const result = await session.run(GET_USER_RESTAURANT_GRAPH, { userId });
    return result.records.map((r) => ({
      userName: r.get('userName'),
      restaurantId: r.get('restaurantId'),
      restaurantName: r.get('restaurantName'),
      category: r.get('category'),
      orderCount: r.get('orderCount').toNumber ? r.get('orderCount').toNumber() : r.get('orderCount'),
      totalSpent: r.get('totalSpent'),
    }));
  } finally {
    await session.close();
  }
}

module.exports = { getRecommendations, getUserRestaurantGraph };
