const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
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
  flatNo: {
    type: String,
    required: true,
  },
  orders: {
    type: Array,
  },
  active: {
    type: Boolean,
    default: true,
  },
  cart: [
    {
      productName: {
        type: String,
      },
      dealerId: {
        type: String,
      },
      productId: {
        type: String,
      },
      
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
    },
  ],
  orderSummery: [
    {
      totalAmount: {
        type: Number,
      },
      totalProducts: {
        type: Number,
      },
      address: {
        type: String,
      },
      paymentMode: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
