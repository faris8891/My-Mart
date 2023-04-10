const users = require("../Models/user");
const dealers = require("../Models/dealer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const jwt_key = process.env.JWT_KEY;

module.exports = {
  getHome: (req, res) => {
    res.send("This is home page");
  },
  getProducts: (req, res) => {
    res.send("product page");
  },
  postProducts: (req, res) => {
    res.send("product POST");
  },

  login: {
    post: async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await users.findOne({ email: email });

        let hash = user.password;
        bcrypt.compare(password, hash, function (err, result) {
          if (result == true && email == user.email) {
            const userToken = jwt.sign({ id: user._id }, jwt_key);
            res.cookie("uid", userToken, { maxAge: 900000, httpOnly: true });
            res.redirect("/home"); //------------------require edit
          } else {
            res.redirect("/login");
          }
        });
      } catch (error) {
        console.log(error);
        res.redirect("/login");
      }
    },
  },

  getMobile: (req, res) => {
    res.send("This is mobile login page");
  },
  postMobile: (req, res) => {
    res.send("Mobile number received");
  },
  getOtp: (req, res) => {
    res.send("this is otp page");
  },
  postOtp: (req, res) => {
    res.send("otp received");
  },

  register: {
    post: async (req, res) => {
      try {
        const data = req.body;
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await users.insertMany({
          fullName: data.fullName,
          email: data.email,
          password: password,
          phone: data.phone,
          location: data.location,
          address: data.address,
          flatNo: data.flatNo,
        });
        res.status(200);
      } catch (error) {
        console.log(error);
      }
    },
  },

  cart: {
    get: async (req, res) => {
      try {
        const userId = req.query.userId;
        const user = await users.findOne({ _id: userId });
        let totalAmount = 0;
        let noOfItems = 0;
        user.cart.forEach((products) => {
          totalAmount = totalAmount + products.price * products.quantity;
          noOfItems = noOfItems + products.quantity;
        });

        const cart = {
          totalAmount: totalAmount,
          noOfItems: noOfItems,
          address: user.address,
          defaultImage: user.defaultImage,
          listOfItems: user.cart,
        };
        res.status(200).json(cart);
      } catch (error) {
        console.log(error);
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      try {
        const dealer = req.query.dealerId;
        const cartProduct = req.query.productId;
        const userId = req.query.userId;

        const product = await dealers.findOne(
          {
            _id: dealer,
            "products._id": cartProduct,
          },
          { "products.$": true }
        );
        const quantity = req.body.quantity;
        const dealerId = product._id;
        const productId = product.products[0]._id;
        const price = product.products[0].price;
        const defaultImage = product.products[0].defaultImage;
        const productName = product.products[0].productName;
        // console.log(dealerId, productId, price, quantity);

        const existingCart = await users.find({
          "cart.productId": cartProduct,
        });
        // console.log(existingCart);

        if (existingCart.length > 0) {
          const quantity = await users.findOne(
            {
              _id: userId,
              "cart.productId": cartProduct,
            },
            { "cart.quantity.$": true }
          );
          let existingQuantity = quantity.cart[0].quantity;
          let updatedQuantity = ++existingQuantity;
          // console.log(updatedQuantity);

          const addCart = await users.updateOne(
            {
              _id: userId,
              "cart.productId": cartProduct,
            },
            { $set: { "cart.$.quantity": updatedQuantity } }
          );
          // console.log(addCart, "+++++++++++");
        } else {
          const cart = await users.updateOne(
            { _id: userId },
            {
              $push: {
                cart: {
                  productName: productName,
                  dealerId: dealerId,
                  productId: productId,
                  price: price,
                  defaultImage: defaultImage,
                  quantity: quantity,
                },
              },
            }
          );
        }

        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  orders: {
    get: (req, res) => {
      try {
        res.status(200).send("OK");
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: (req, res) => {},
  },

  getFeedback: (req, res) => {
    res.send("this is feedback page");
  },
  postFeedback: (req, res) => {
    res.send("feedback POST");
  },
  getOrderHistory: (req, res) => {
    res.send("This is order history page");
  },
  getLogout: (req, res) => {
    res.clearCookie("uid");
    res.redirect("/home");
  },
};
