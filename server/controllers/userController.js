
const User = require("../models/User");

// Admin - Get all registered customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get all customers error:", error);

    return res.status(500).json({
      message: "Failed to fetch customers.",
    });
  }
};

module.exports = {
  getAllCustomers,
};
