
const express = require("express");
const router = express.Router();

const { getAllCustomers } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Admin - Get all customers
router.get("/admin/customers", protect, admin, getAllCustomers);

module.exports = router;
