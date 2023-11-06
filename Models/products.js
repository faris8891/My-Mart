const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dealers",
    },
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    coupons: {
      type: mongoose.Schema.Types.ObjectId,
    },
    stock: {
      type: Number,
      required: true,
    },
    productAvailability: {
      type: Date,
    },
    defaultImage: {
      type: String,
      required: true,
    },
    productImages: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviews: {
      type: String,
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tags",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

const productsModal = mongoose.Model("product", productSchema);

module.exports = productsModal;
