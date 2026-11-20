
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getAdminAnalytics = async (req, res) => {
  try {
    // Current date and last 6 months
    const now = new Date();

    // Sri Lanka timezone: UTC +05:30
    const colomboOffset = 330;
    const currentMonthStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1) -
        colomboOffset * 60 * 1000
    );

    const sixMonthsAgo = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1) -
        colomboOffset * 60 * 1000
    );

    // Run independent database queries together
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueData,
      statusBreakdown,
      monthlySalesData,
      bestSellingProducts,
    ] = await Promise.all([
      // Total orders
      Order.countDocuments(),

      // Total customers (exclude admins)
      User.countDocuments({ role: "customer" }),

      // Total products (include out-of-stock products)
      Product.countDocuments(),

      // Revenue summary
      Order.aggregate([
        {
          $group: {
            _id: null,

            deliveredRevenue: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Delivered"] },
                  { $ifNull: ["$itemsPrice", 0] },
                  0,
                ],
              },
            },

            pendingRevenue: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$status", "Delivered"] },
                      { $ne: ["$status", "Cancelled"] },
                    ],
                  },
                  { $ifNull: ["$itemsPrice", 0] },
                  0,
                ],
              },
            },

            deliveredShipping: {
              $sum: {
                $cond: [
                  { $eq: ["$status", "Delivered"] },
                  { $ifNull: ["$shippingFee", 0] },
                  0,
                ],
              },
            },
          },
        },
      ]),

      // Order status breakdown
      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Monthly sales (last 6 months, delivered orders only)
      Order.aggregate([
        {
          $match: {
            status: "Delivered",
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: {
                  date: "$createdAt",
                  timezone: "Asia/Colombo",
                },
              },
              month: {
                $month: {
                  date: "$createdAt",
                  timezone: "Asia/Colombo",
                },
              },
            },
            sales: { $sum: { $ifNull: ["$itemsPrice", 0] } },
            orders: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      // Best selling products (delivered orders only)
      Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            quantitySold: { $sum: "$items.quantity" },
            revenue: {
              $sum: {
                $multiply: ["$items.price", "$items.quantity"],
              },
            },
          },
        },
        {
          $sort: {
            quantitySold: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: 1,
            image: 1,
            quantitySold: 1,
            revenue: 1,
          },
        },
      ]),
    ]);

    // Format revenue
    const revenue = revenueData[0] || {
      deliveredRevenue: 0,
      pendingRevenue: 0,
      deliveredShipping: 0,
    };

    // Format order statuses (include zero-count statuses)
    const allStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    const statusMap = Object.fromEntries(
      statusBreakdown.map((item) => [item._id, item.count])
    );

    const formattedStatusBreakdown = allStatuses.map((status) => ({
      status,
      count: statusMap[status] || 0,
    }));

    // Prepare all 6 months, including months with zero sales
    const monthlySales = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + i, 1)
      );

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;

      const found = monthlySalesData.find(
        (item) =>
          item._id.year === year && item._id.month === month
      );

      monthlySales.push({
        month: date.toLocaleString("en-US", {
          month: "short",
          timeZone: "UTC",
        }),
        year,
        sales: found ? found.sales : 0,
        orders: found ? found.orders : 0,
      });
    }

    return res.status(200).json({
      summary: {
        totalRevenue: revenue.deliveredRevenue,
        pendingRevenue: revenue.pendingRevenue,
        deliveredShipping: revenue.deliveredShipping,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      monthlySales,
      orderStatusBreakdown: formattedStatusBreakdown,
      bestSellingProducts,
    });
  } catch (error) {
    console.error("Get admin analytics error:", error);

    return res.status(500).json({
      message: "Failed to fetch analytics data.",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminAnalytics,
};
