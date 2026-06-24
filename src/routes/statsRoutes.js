const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Food sales statistics
 */

/**
 * @swagger
 * /api/stats/top-foods:
 *   get:
 *     summary: Get top selling foods by month (from Cassandra)
 *     tags: [Stats]
 *     parameters:
 *       - in: query
 *         name: month
 *         required: true
 *         schema:
 *           type: string
 *           example: "2024-01"
 *         description: Year-month in YYYY-MM format
 *     responses:
 *       200:
 *         description: Top foods for the given month
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
 *                       foodName:
 *                         type: string
 *                       restaurantId:
 *                         type: string
 *                       totalSold:
 *                         type: integer
 *       400:
 *         description: Missing month param
 *       500:
 *         description: Server error
 */
router.get('/top-foods', statsController.getTopFoods);

module.exports = router;
