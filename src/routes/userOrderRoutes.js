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
const Order = require('../models/mongodb/Order');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    // Use MongoDB instead of Cassandra (fallback)
    const orders = await Order.find({ userId })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    const formattedOrders = orders.map(order => ({
      orderId: order._id,
      restaurantId: order.restaurantId._id,
      restaurantName: order.restaurantId.name || order.restaurantName,
      items: order.items,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
    }));

    res.json({ success: true, data: formattedOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
