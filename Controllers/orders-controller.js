const orders = require("../Models/orders");
const users = require("../Models/user");
const razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");

module.exports = {
  payment: {
    post: (req, res) => {
      try {
        const RZP_ID = process.env.RZP_ID;
        const RZP_KEY = process.env.RZP_KEY;
        let instance = new razorpay({
          key_id: RZP_ID,
          key_secret: RZP_KEY,
        });
        let options = {
          amount: req.body.totalAmount,
          currency: "INR",
          receipt: "order_rcptid_11",
        };
        instance.orders.create(options, function (err, order) {
          console.log(order, order.id);
          res.status(200).send({ orderId: order.id });
        });
      } catch (error) {
        console.log(error);
      }
    },
  },

  checkout: {
    post: async (req, res) => {
      try {
        const userId = req.body.id;
        const dealerId = req.query.dealerId;
        const orderData = req.body;

        const user = await users.findOne({ _id: userId });
        let totalAmount = 0;
        let noOfItems = 0;
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
          noOfItems = noOfItems + products.quantity;
        });

        console.log(totalAmount,noOfItems);

        const cart = await users.findOne(
          { _id: userId }, { cart: 1 }
          );
          console.log(cart);
        const order = await orders.insertMany({
          orderId: "My-mart:" + crypto.randomBytes(7).toString("hex"),
          userId: userId,
          dealerId: dealerId,
          orderDate: new Date().toLocaleString(),
          address: user.address,
          quantity: noOfItems,
          totalAmount: totalAmount,
          paymentMode: orderData.paymentMode,
          paymentStatus: orderData.paymentStatus,
          orderStatus: orderData.orderStatus,
        });
        const clearCart = await users.findOneAndUpdate(
          { _id: userId },
          { $set: { cart: [] } }
        );
        res.status(200).send("OK");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },
  
  feedback: {
    put: async(req, res) => {
      const data = req.body
      const feedback = await orders.updateOne(
        { userId: data.id,orderStatus:"delivered"},
        {$set:{feedback:data.feedback}}
      )
    }
  }
};
