const reviewService = require('../services/reviewService');

async function createReview(req, res) {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { createReview };
