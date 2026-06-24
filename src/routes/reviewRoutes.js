const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Restaurant and food reviews
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review for a restaurant after an order
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, restaurantId, rating]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d1"
 *               restaurantId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d2"
 *               orderId:
 *                 type: string
 *                 example: "64f1a2b3c4d5e6f7a8b9c0d3"
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Great food and fast delivery!
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, reviewController.createReview);

module.exports = router;
