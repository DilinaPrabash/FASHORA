
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Women", "Men", "Shoes", "Accessories"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically update availability based on stock.
productSchema.pre("save", function () {
  this.isAvailable = this.stock > 0;
});

module.exports = mongoose.model("Product", productSchema);
