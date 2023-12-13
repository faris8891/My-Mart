const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    dealerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dealers",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingMode: {
      type: String,
      enum: ["standard", "express", "pickup"],
      default: "standard",
    },
    promotions: {
      type: Array,
    },
    isDelivered: {
      type:Boolean,
      default:false
    },
    address: {
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
    feedback: {
      message: { type: String },
      rating: { type: Number, min: 1, max: 5 },
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.virtual("subtotal").get(function () {
  return this.quantity * this.price;
});

orderSchema.virtual("tax").get(function () {
  return this.subtotal * 0.1;
});

orderSchema.virtual("discount").get(function () {
  return this.promotions.reduce((acc, curr) => acc + curr.amount, 0);
});

module.exports = mongoose.model("order", orderSchema);
