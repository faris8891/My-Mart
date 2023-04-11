const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique:true
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
    type: String
  },
});

module.exports = mongoose.model("order", orderSchema);
