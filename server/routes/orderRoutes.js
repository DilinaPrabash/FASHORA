
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

// Place a new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
