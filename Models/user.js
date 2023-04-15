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
    unique: true,
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
  active: {
    type: Boolean,
    default: true,
  },
  cart: [
    {
      productName: {
        type: String,
        required: true,
      },
      defaultImage: {
        type: String,
        required: true,
      },
      dealerId: {
        type: String,
        required: true,
      },
      productId: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
