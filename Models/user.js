const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
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
      // required: true,
    },
    address: [
      {
        type: String,
        // required: true,
      },
    ],
    pinCode: {
      type: String,
    },
    flatNo: {
      type: String,
      // required: true,
    },
    profileImage: {
      type: String,
      // required: true,
    },
    isVerifiedEmail: {
      type: Boolean,
      default: false,
      required: true,
    },
    isVerifiedMobile: {
      type: Boolean,
      default: false,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    //need able to shop from deferent shops...
    selectedShop: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    cart: [
      {
        dealerId: {
          type: mongoose.Types.ObjectId,
          required: true,
          // ref:"add dealers collection"
        },
        productId: {
          type: mongoose.Types.ObjectId,
          required: true,
          // ref:"create new collection for products"
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

module.exports = mongoose.model("user", userSchema);
