import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Aggregate admin dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, revenueAgg, lowStockCount, recentOrders, bestSellers, totalCustomers] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Product.countDocuments({ $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] } }),
    Order.find().sort({ createdAt: -1 }).limit(10),
    Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', totalSold: { $sum: '$items.qty' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]),
    User.countDocuments({ role: 'customer' }),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      lowStockProductCount: lowStockCount,
      recentOrders,
      bestSellers,
      totalCustomers,
    },
  });
});
