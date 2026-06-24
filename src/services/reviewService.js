const Review = require('../models/mongodb/Review');
const Restaurant = require('../models/mongodb/Restaurant');

async function createReview(data) {
  const review = new Review(data);
  await review.save();

  const restaurant = await Restaurant.findById(data.restaurantId);
  if (restaurant) {
    const newCount = restaurant.ratingCount + 1;
    const newRating = (restaurant.rating * restaurant.ratingCount + data.rating) / newCount;
    restaurant.rating = Math.round(newRating * 10) / 10;
    restaurant.ratingCount = newCount;
    await restaurant.save();
  }

  return review;
}

module.exports = { createReview };
