const graphService = require('../services/graphService');

async function getRecommendations(req, res) {
  try {
    const data = await graphService.getRecommendations(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getUserRestaurantGraph(req, res) {
  try {
    const data = await graphService.getUserRestaurantGraph(req.params.userId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getRecommendations, getUserRestaurantGraph };
