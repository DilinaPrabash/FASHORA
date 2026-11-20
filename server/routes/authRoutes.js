
const express = require("express");
const router = express.Router();
const admin = require("../middleware/adminMiddleware");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected test route
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "Authentication successful!",
    user: req.user,
  });
});

// Admin protected test route
router.get("/admin-test", protect, admin, (req, res) => {
  res.status(200).json({
    message: "Welcome Admin! Access granted.",
    user: req.user,
  });
});

module.exports = router;
