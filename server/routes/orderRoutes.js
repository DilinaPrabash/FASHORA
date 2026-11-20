
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Customer - Place a new order
router.post("/", protect, createOrder);

// Customer - Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Admin - Get all orders
router.get("/admin/all", protect, admin, getAllOrders);

// Admin - Update order status
router.put("/admin/:id/status", protect, admin, updateOrderStatus);

module.exports = router;
