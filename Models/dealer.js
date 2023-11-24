const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required:true
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
    pinCode: {
      type: String,
    },
    storeImage: {
      type: String,
    },
    storeBanner: {
      type: String,
    },
    adBanner: {
      type:String
    },
    COD: {
      type: Boolean,
      required: true,
      default: false,
    },
    onlinePayment: {
      type: Boolean,
      required: true,
      default: false,
    },
    isPromoted: {
      type: Boolean,
      required: true,
      default: false,
    },
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerifiedEmail: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVerifiedPhone: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

module.exports = mongoose.model("dealers", dealerSchema);

