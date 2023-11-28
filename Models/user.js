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
    isVerifiedEmail: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isVerifiedPhone: {
      type: Boolean,
      default: false,
    },
    address: [
      {
        state: {
          type: String,
        },
        district: {
          type: String,
        },
        city: {
          type: String,
        },
        street: {
          type: String,
        },
        landmark: {
          type: String,
        },
        pinCode: {
          type: String,
        },
        flatNo: {
          type: String,
        },
      },
    ],

    profileImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("users", userSchema);
