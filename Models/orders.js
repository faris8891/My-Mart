const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
  },
  dealerId: {
    type: String,
  },
  address: {
    type: String,
  },
  orderDate: {
    type: String,
  },
  items: {
    type:Array
  },
  quantity: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  paymentMode: {
    type: String,
  },
  paymentStatus: {
    type: Boolean,
  },
  orderStatus: {
    type: String,
    default: "Pending",
  },
  feedback: {
    message: { type: String },
    rating: { type: Number },
  },
});

module.exports = mongoose.model("order", orderSchema);