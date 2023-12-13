const orders = require("../Models/orders");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const razorpay = require("razorpay");
const { ErrorHandler } = require("../Util/errorHandling");
const cartModel = require("../Models/cart");
const orderModel = require("../Models/orders");
const dayjs = require("dayjs");
require("dotenv").config();
const AppError = require("../Util/AppError");

const FAST_SMS = process.env.FAST_SMS;
const RZP_ID = process.env.RZP_ID;
const RZP_KEY = process.env.RZP_KEY;
const jwt_key = process.env.JWT_USER_KEY;

const orderController = {
  createCodOrders: async (req, res) => {
    const userId = req.body.id;
    const address = req.body.address;
    const paymentMode = req.body.paymentMode;

    if (paymentMode.toLowerCase() !== "cod") {
      const appError = new AppError("Failed", "Invalid payment mode", 400);
      ErrorHandler(appError, req, res);
    }

    const cart = await cartModel.find({ userId: userId }).populate("productId");
    const newOrders = [];

    cart.forEach(async (cartItem) => {
      const order = {
        orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
        orderDate: dayjs().format("YYYY-MM-DD"),
        userId: userId,
        dealerId: cartItem?.dealerId,
        product: cartItem?.productId,
        totalAmount: cartItem?.productId?.price * cartItem?.quantity,
        quantity: cartItem?.quantity,
        price: cartItem?.productId?.price,
        paymentMode: "cod",
        paymentStatus: true,
        address: address,
      };
      newOrders.push(order);
      await cartModel.findOneAndUpdate(
        { userId: userId, productId: cartItem?.productId },
        { isOrdered: true }
      );
    });

    const orders = await orderModel.insertMany(newOrders);

    res.status(200).json({
      status: "success",
      message: "You have successfully ordered",
      data: {
        orders: orders,
      },
    });
  },

  createPayment: async (req, res) => {
    // razorpay
    let instance = new razorpay({
      key_id: RZP_ID,
      key_secret: RZP_KEY,
    });
    let options = {
      amount: `${totalAmount}00`,
      currency: "INR",
      receipt: "My-mart:" + crypto.randomBytes(7).toString("hex"),
    };
    instance.orders.create(options, function (err, order) {
      const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
      const tenMinutesLater = currentTime + 600; // 10 minutes = 600 seconds
      const userToken = jwt.sign(
        { orderId: order.id, exp: tenMinutesLater },
        jwt_key
      );
      res.status(200).json({
        data: order,
        orderToken: userToken,
      });
    });
  },

  createOnlineOrders: async (req, res) => {
    const data = req.params.orderId;
    const razorpaySignature = req.body.razorpay_signature;
    const razorpayPaymentId = req.body.razorpay_payment_id;
    const orderId = jwt.verify(data, jwt_key).orderId;
    const generatedSignature = crypto
      .createHmac("sha256", RZP_KEY)
      .update(orderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature === razorpaySignature) {
      // creating order ==> online payment

      const userId = req.body.id;
      const address = req.body.address;

      const cart = await cartModel
        .find({ userId: userId })
        .populate("productId");
      const newOrders = [];

      cart.forEach(async (cartItem) => {
        const order = {
          orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
          orderDate: dayjs().format("YYYY-MM-DD"),
          userId: userId,
          dealerId: cartItem?.dealerId,
          product: cartItem?.productId,
          totalAmount: cartItem?.productId?.price * cartItem?.quantity,
          quantity: cartItem?.quantity,
          price: cartItem?.productId?.price,
          paymentMode: "cod",
          paymentStatus: true,
          address: address,
        };
        newOrders.push(order);
        await cartModel.findOneAndUpdate(
          { userId: userId, productId: cartItem?.productId },
          { isOrdered: true }
        );
      });

      const orders = await orderModel.insertMany(newOrders);

      res.status(200).json({
        status: "success",
        message: "You have successfully ordered",
        data: {
          orders: orders,
        },
      });
    } else {
      const appError = new AppError("Failed", "Payment failed", 400);
      ErrorHandler(appError, req, res);
    }
  },

  updateOrderStatus: async (req, res) => {
    const userId = req.body.id;
    const query = req.query;
    const orderId = req.params.orderId

    const filter = {
      _id: orderId,
      dealerId: userId,
    };

    const updateStatus = await orderModel.findOneAndUpdate(filter, query, {
      new: true,
    });

    res.status(200).json({
      status: " success",
      message: "Successfully updated order status",
      data: {
        updatedOrder: updateStatus,
      },
    });
  },
  updateDeliveredStatus: async (req, res) => {
    const userId = req.body.id;
    const query = req.query;

    const filter = {
      _id: orderId,
      userId: userId,
    };
    
    const updateDeliveredStatus = await orderModel.findOneAndUpdate(filter, query, {
      new: true,
    });

    res.status(200).json({
      status: " success",
      message: "Successfully updated order status",
      data: {
        updatedOrder: updateDeliveredStatus,
      },
    });
  }

};

module.exports = orderController;
