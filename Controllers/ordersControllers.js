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
    const paymentMode = req.body.paymentMode
    
    if ( paymentMode.toLowerCase()!=="cod") {
      const appError = new AppError(
        "Login failed",
        "Invalid payment mode",
        401
      );
      ErrorHandler(appError, req, res);
    }
    const cart = await cartModel.find({ userId: userId }).populate("productId");
    const newOrders = [];

    cart.forEach( async (cartItem) => {
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
      await cartModel.findOneAndUpdate({userId:userId,productId:cartItem?.productId},{isOrdered:true})
    });

    const orders = await orderModel.insertMany(newOrders);


    res.status(200).json({
      status: "success",
      message: "You have successfully ordered",
      data: {
        orders: orders,
      },
    });

    //   // razorpay
    //   let instance = new razorpay({
    //     key_id: RZP_ID,
    //     key_secret: RZP_KEY,
    //   });
    //   let options = {
    //     amount: `${totalAmount}00`,
    //     currency: "INR",
    //     receipt: "My-mart:" + crypto.randomBytes(7).toString("hex"),
    //   };
    //   instance.orders.create(options, function (err, order) {
    //     const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
    //     const tenMinutesLater = currentTime + 600; // 10 minutes = 600 seconds
    //     const userToken = jwt.sign(
    //       { orderId: order.id, exp: tenMinutesLater },
    //       jwt_key
    //     );
    //     res.status(200).json({
    //       data: order,
    //       orderToken: userToken,
    //     });
    //   });
  },

  //   paymentVerify: {
  //     post: async (req, res) => {
  //       try {
  //         const data = req.params.orderId;
  //         const feedback = {
  //           message: "Awaiting feedback",
  //           rating: 0,
  //         };
  //         const razorpaySignature = req.body.razorpay_signature;
  //         const razorpayPaymentId = req.body.razorpay_payment_id;
  //         const orderId = jwt.verify(data, jwt_key).orderId;
  //         const generatedSignature = crypto
  //           .createHmac("sha256", RZP_KEY)
  //           .update(orderId + "|" + razorpayPaymentId)
  //           .digest("hex");

  //         if (generatedSignature === razorpaySignature) {
  //           // creating order ==> online payment

  //           const userId = req.body.id;
  //           const user = await users.findOne({ _id: userId });

  //           let totalAmount = 0;
  //           let noOfItems = 0;
  //           let dealerId = user.cart[0].dealerId;
  //           user.cart.forEach((products) => {
  //             totalAmount = totalAmount + products.price * products.quantity;
  //             noOfItems = noOfItems + products.quantity;
  //           });

  //           const order = await orders.insertMany({
  //             orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
  //             userId: userId,
  //             userName: user.fullName,
  //             dealerId: dealerId,
  //             orderDate: new Date().toLocaleString(),
  //             address: user.address,
  //             quantity: noOfItems,
  //             totalAmount: totalAmount,
  //             paymentMode: "online",
  //             paymentStatus: true,
  //             orderStatus: "pending",
  //             items: user.cart,
  //             feedback: feedback,
  //           });
  //           const clearCart = await users.findOneAndUpdate(
  //             { _id: userId },
  //             { $set: { cart: [] } }
  //           );
  //           res.status(200).send("Payment Successful");
  //         } else {
  //           res.status(404).send("Payment Failed");
  //         }
  //       } catch (error) {
  //         res.status(400).send("Something went wrong!");
  //       }
  //     },
  //   },
};

module.exports = orderController;
