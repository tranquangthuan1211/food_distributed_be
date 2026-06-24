const statsService = require('../services/statsService');

async function getTopFoods(req, res) {
  try {
    const month = req.query.month;
    if (!month) return res.status(400).json({ success: false, message: 'month query param required (e.g. ?month=2024-01)' });
    const data = await statsService.getTopFoods(month);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getTopFoods };
