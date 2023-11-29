const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cart: [
      {
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
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

module.exports = mongoose.model("carts", cartSchema);
