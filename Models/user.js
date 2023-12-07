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
          trim: true,
          lowercase: true,
          required: true,
        },
        district: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
        },
        city: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
        },
        street: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
        },
        landmark: {
          type: String,
          trim: true,
          lowercase: true,
        },
        pinCode: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
        },
        flatNo: {
          type: String,
          trim: true,
          lowercase: true,
          required: true,
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
  },
  {
    timestamps: {
      createdAt: "createdDate",
      updatedAt: "updatedDate",
    },
  }
);

module.exports = mongoose.model("users", userSchema);
