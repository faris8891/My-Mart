const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dealers",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
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
      default: 0,
    },
    productAvailability: {
      type: Date,
    },
    defaultImage: {
      type: String,
    },
    productImages: {
      type: Array,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
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

const productsModal = mongoose.model("product", productSchema);

module.exports = productsModal;
