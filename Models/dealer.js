const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  fullName: {
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
  TemporaryDisable: { type: Boolean },
  products: [
    {
      productId: {
        type: String,
        unique: true,
      },
      price: { type: Number },
      category: { type: String },
      noOfItem: { type: String },
      defaultImage: { type: String },
      productImages: [],
      description: { type: String },
      ProductActive: { type: Boolean },
    },
  ],
  orders: [
    {
      orderId: { type: String, unique: true },
      email: { type: String },
      address: { type: String },
      mobile: { type: Number },
      driver: { type: String },
      orderStatus: { type: String },
      items: [
        {
          itemId: { type: String },
          Reference: { type: String },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("dealer", dealerSchema);
