const restaurantService = require('../services/restaurantService');

async function getRestaurants(req, res) {
  try {
    const restaurants = await restaurantService.getRestaurants();
    res.json({ success: true, data: restaurants });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function createRestaurant(req, res) {
  try {
    const restaurant = await restaurantService.createRestaurant(req.body);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function getMenu(req, res) {
  try {
    const items = await restaurantService.getMenu(req.params.id);
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getRestaurants, createRestaurant, getMenu };
