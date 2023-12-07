const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },

    dealerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "dealers",
    },
    productId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
    },
    isOrdered: {
      type: Boolean,
      default:false
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

cartSchema.index({ userId: 1, dealerId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("carts", cartSchema);
