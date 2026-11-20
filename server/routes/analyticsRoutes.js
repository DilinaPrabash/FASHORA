
const express = require("express");
const router = express.Router();

const { getAdminAnalytics } = require("../controllers/analyticsController");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

router.get("/admin", protect, admin, getAdminAnalytics);

module.exports = router;
