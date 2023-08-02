const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    fullName: { //TODO:1 change to not required
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    storeImage: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    COD: { type: Boolean },
    onlinePayment: { type: Boolean },
    isTopShops: { type: Boolean },
    isOpen: { type: Boolean },

    products: [
      {
        productName: { type: String, required: true },
        price: {
          type: Number,
          required: true,
        },
        category: { type: String, required: true },
        noOfItem: { type: Number, required: true },
        defaultImage: { type: String, required: true },
        productImages: { type: Array, required: true },
        description: { type: String, required: true },
        productActive: { type: Boolean, required: true },
      },
    ],

    orders: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        mobile: { type: Number, required: true },
        driver: { type: String, required: true },
        orderStatus: { default: "pending", type: String, required: true },
        date: { type: Date, required: true },
        product: [
          {
            productId: { type: String },
            price: { type: Number },
            totalPrice: { type: Number },
            quantity: { type: Number },
            dealerId: { type: String },
          },
        ],
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("dealer", dealerSchema);
