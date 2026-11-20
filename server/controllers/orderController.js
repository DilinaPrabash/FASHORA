
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

const SHIPPING_FEE = 500;

// Create a new order
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      customerName,
      email,
      phone,
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.postalCode
    ) {
      return res.status(400).json({
        message: "Please provide all required delivery details.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    if (paymentMethod && paymentMethod !== "COD") {
      return res.status(400).json({
        message: "Only Cash on Delivery is currently supported.",
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let itemsPrice = 0;

      for (const item of items) {
        const { productId, quantity, selectedSize = "" } = item;

        if (
          !mongoose.Types.ObjectId.isValid(productId) ||
          !Number.isInteger(quantity) ||
          quantity < 1
        ) {
          throw new Error("Invalid product or quantity.");
        }

        const product = await Product.findById(productId).session(session);

        if (!product) {
          throw new Error("A product in your cart no longer exists.");
        }

        if (!product.isAvailable || product.stock < quantity) {
          throw new Error(
            `${product.name} is out of stock or has insufficient stock.`
          );
        }

        if (
          product.sizes.length > 0 &&
          !product.sizes.includes(selectedSize)
        ) {
          throw new Error(`Please select a valid size for ${product.name}.`);
        }

        const updated = await Product.updateOne(
          {
            _id: product._id,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
            $set: { isAvailable: product.stock - quantity > 0 },
          },
          { session }
        );

        if (updated.modifiedCount !== 1) {
          throw new Error(`Insufficient stock for ${product.name}.`);
        }

        const itemTotal = product.price * quantity;
        itemsPrice += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
          selectedSize,
        });
      }

      const order = await Order.create(
        [
          {
            user: req.user.id,
            customerName,
            email,
            phone,
            items: orderItems,
            shippingAddress,
            paymentMethod: "COD",
            itemsPrice,
            shippingFee: SHIPPING_FEE,
            totalPrice: itemsPrice + SHIPPING_FEE,
            status: "Pending",
          },
        ],
        { session }
      );

      createdOrder = order[0];
    });

    return res.status(201).json({
      message: "Order placed successfully!",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(400).json({
      message: error.message || "Failed to place order.",
    });
  } finally {
    await session.endSession();
  }
};

// Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch your orders.",
    });
  }
};

// Admin - Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      message: "Failed to fetch orders.",
    });
  }
};

// Admin - Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Failed to update order status.",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
