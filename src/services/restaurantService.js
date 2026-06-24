const Restaurant = require('../models/mongodb/Restaurant');
const MenuItem = require('../models/mongodb/MenuItem');
const redisClient = require('../config/redis');
const { driver } = require('../config/neo4j');
const { MERGE_RESTAURANT } = require('../models/neo4j/graphQueries');

const CACHE_KEY = 'restaurants:all';

async function getRestaurants() {
  try {
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.warn('Redis get error:', err.message);
  }

  const restaurants = await Restaurant.find({});

  try {
    await redisClient.set(CACHE_KEY, JSON.stringify(restaurants), 'EX', 300);
  } catch (err) {
    console.warn('Redis set error:', err.message);
  }

  return restaurants;
}

async function createRestaurant(data) {
  const restaurant = new Restaurant(data);
  await restaurant.save();

  const session = driver.session();
  try {
    await session.run(MERGE_RESTAURANT, {
      restaurantId: restaurant._id.toString(),
      name: restaurant.name,
      category: restaurant.category || '',
    });
  } finally {
    await session.close();
  }

  try {
    await redisClient.del(CACHE_KEY);
  } catch (err) {
    console.warn('Redis del error:', err.message);
  }

  return restaurant;
}

async function getMenu(restaurantId) {
  const items = await MenuItem.find({ restaurantId, isAvailable: true });
  return items;
}

module.exports = { getRestaurants, createRestaurant, getMenu };
