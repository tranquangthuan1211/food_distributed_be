const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Graph
 *   description: Neo4j graph queries for recommendations and relationships
 */

/**
 * @swagger
 * /api/recommendations/{userId}:
 *   get:
 *     summary: Get food recommendations based on graph relationships (Neo4j)
 *     tags: [Graph]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of recommended foods
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       foodId:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       score:
 *                         type: integer
 *       500:
 *         description: Server error
 */
router.get('/recommendations/:userId', authMiddleware, graphController.getRecommendations);

/**
 * @swagger
 * /api/graph/user-restaurant/{userId}:
 *   get:
 *     summary: Query user-restaurant relationship graph (Neo4j)
 *     tags: [Graph]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User-restaurant relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userName:
 *                         type: string
 *                       restaurantId:
 *                         type: string
 *                       restaurantName:
 *                         type: string
 *                       category:
 *                         type: string
 *                       orderCount:
 *                         type: integer
 *                       totalSpent:
 *                         type: number
 *       500:
 *         description: Server error
 */
router.get('/graph/user-restaurant/:userId', authMiddleware, graphController.getUserRestaurantGraph);

module.exports = router;
