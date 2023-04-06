const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    // unique: true,
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

  // orders: [
  //   {
  //     orderId: new mongoose.Types.ObjectId(),
  //     email: { type: String },
  //     address: { type: String },
  //     mobile: { type: Number },
  //     driver: { type: String },
  //     orderStatus: { type: String },
  //     items: [
  //       {
  //         itemId: { type: String },
  //         Reference: { type: String },
  //       },
  //     ],
  //   },
  // ],
});

module.exports = mongoose.model("dealer", dealerSchema);
