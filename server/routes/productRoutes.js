
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const { uploadProductImage } = require("../controllers/imageController");

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

// Admin - Get all products
router.get("/admin/all", protect, admin, getAdminProducts);

// Admin - Upload product image
router.post(
  "/upload-image",
  protect,
  admin,
  upload.single("image"),
  uploadProductImage
);

// Admin - Create product
router.post("/", protect, admin, createProduct);

// Admin - Update product
router.put("/:id", protect, admin, updateProduct);

// Admin - Delete product
router.delete("/:id", protect, admin, deleteProduct);

// Get single product
router.get("/:id", getProductById);

module.exports = router;
