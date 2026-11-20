
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Customer - Get available products
router.get("/", getProducts);

// Admin - Get all products (including unavailable)
router.get("/admin/all", protect, admin, getAdminProducts);

// Get single product
router.get("/:id", getProductById);

// Admin - Create product
router.post("/", protect, admin, createProduct);

// Admin - Update product
router.put("/:id", protect, admin, updateProduct);

// Admin - Delete product
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
