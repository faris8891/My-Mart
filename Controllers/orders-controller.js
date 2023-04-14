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

  

};
