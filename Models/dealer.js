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
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("dealer", dealerSchema);

// products: [
//   {
//     productName: { type: String, required: true },
//     price: {
//       type: Number,
//       required: true,
//     },
//     category: { type: String, required: true },
//     noOfItem: { type: Number, required: true },
//     defaultImage: { type: String, required: true },
//     productImages: { type: Array, required: true },
//     description: { type: String, required: true },
//     productActive: { type: Boolean, required: true },
//   },
// ],

// orders: [
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: true },
//     mobile: { type: Number, required: true },
//     driver: { type: String, required: true },
//     orderStatus: { default: "pending", type: String, required: true },
//     date: { type: Date, required: true },
//     product: [
//       {
//         productId: { type: String },
//         price: { type: Number },
//         totalPrice: { type: Number },
//         quantity: { type: Number },
//         dealerId: { type: String },
//       },
//     ],
//   },
// ],
