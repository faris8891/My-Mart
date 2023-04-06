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
      product: {
        type: String,
        ref: "product",
      },
      totalPrice: {
        type: Number,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
