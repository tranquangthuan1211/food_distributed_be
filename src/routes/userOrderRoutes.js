const express = require('express');
const router = express.Router({ mergeParams: true });
const { client: cassandraClient } = require('../config/cassandra');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/users/{id}/orders:
 *   get:
 *     summary: Get order history for a user (from Cassandra)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user orders
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
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const keyspace = process.env.CASSANDRA_KEYSPACE || 'fooddelivery';
    const result = await cassandraClient.execute(
      `SELECT * FROM ${keyspace}.order_history WHERE user_id = ?`,
      [userId],
      { prepare: true }
    );
    const orders = result.rows.map((r) => ({
      orderId: r.order_id,
      restaurantId: r.restaurant_id,
      restaurantName: r.restaurant_name,
      items: r.items,
      totalPrice: r.total_price,
      status: r.status,
      createdAt: r.created_at,
    }));
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
