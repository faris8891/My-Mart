const dealers = require("../Models/dealer");
const users = require("../Models/user");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;

module.exports = {
  login: {
    Post: async (req, res) => {
      try {
        const { userName, password } = req.body;
        const dealer = await dealers.findOne({ userName: userName });
        let hash = dealer.password;
        bcrypt.compare(password, hash, function (err, result) {
          if (result == true && userName == dealer.userName) {
            const userToken = jwt.sign({ id: dealer._id }, jwt_key);
            res.cookie("dealerId", userToken, {
              maxAge: 900000,
              httpOnly: true,
            });
            res.status(200).send("OK");
          } else {
            res.status(401).send("Unauthorized");
          }
        });
      } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
      }
    },
  },

  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const userData = await dealers.findOne(
          { _id: id },
          { _id: 0, products: 0, password: 0, userName: 0, orders: 0 }
        );
        console.log(userData);
        res.status(200).json(userData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    put: async (req, res) => {
      try {
        id = req.body.id;
        const dealerData = req.body;
        const password = await bcrypt.hash(dealerData.password, saltRounds);
        dealerUpdate = await dealers.updateOne(
          { _id: id },
          {
            fullName: dealerData.fullName,
            userName: dealerData.userName,
            password: password,
            storeImage: dealerData.storeImage,
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  products: {
    get: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const products = await dealers.find({ _id: dealerId }, { products: 1 });
        res.status(200).json(products);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      try {
        data = req.body;
        dealerId = req.query.dealerId;
        const product = await dealers.updateOne(
          { _id: dealerId },
          {
            $push: {
              products: ({
                productName,
                price,
                category,
                noOfItem,
                defaultImage,
                productImages,
                description,
                productActive,
              } = data),
            },
          }
        );
        res.status(200).send("OK");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      try {
        const data = req.body;
        const dealerId = req.query.dealerId;
        const productId = req.query.productId;
        console.log(dealerId, productId);
        const product = await dealers.updateOne(
          { _id: dealerId, "products._id": productId },
          {
            $set: {
              "products.$": ({
                productName,
                price,
                category,
                noOfItem,
                defaultImage,
                productImages,
                description,
                productActive,
              } = data),
            },
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    patch: async (req, res) => {
      try {
        const data = req.body;
        const dealerId = req.query.dealerId;
        const productId = req.query.productId;
        const product = await dealers.updateOne(
          {
            _id: dealerId,
            "products._id": productId,
          },
          { $set: { "products.$.productActive": data.productActive } }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    delete: async (req, res) => {
      try {
        const data = req.body;
        const dealerId = req.query.dealerId;
        const productId = req.query.productId;
        const product = await dealers.findOneAndUpdate(
          { _id: dealerId },
          { $pull: { products: { _id: productId } } }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  users: {
    get: async (req, res) => {
      try {
        const user = await users.find(
          { active: true },
          { cart: 0, password: 0, orders: 0 }
        );
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(404).send("Not Found");
      }
    },
  },

  orders: {
    get: async (req, res) => {
      try {
        const dealerId = req.query.dealerId;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [{ orderStatus: "confirmed" }, { orderStatus: "on the way" }],
        });
        res.status(200).json(order);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    patch: async (req, res) => {
      try {
        const orderId = req.query.orderId;
        const status = req.body.orderStatus;
        const orderStatus = await orders.updateOne(
          { _id: orderId },
          {
            orderStatus: status,
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
  // -------------need to update------------
  feedback: {
    get: async (req, res) => {
      try {
        const feedback = await dealers.find();
        console.log(feedback);
        res.status(200).send("OK");
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    delete: (req, res) => {},
  },
};
