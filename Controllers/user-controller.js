const users = require("../Models/user");
const dealers = require("../Models/dealer");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_key = process.env.JWT_KEY;

module.exports = {
  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const userProfile = await users.findOne(
          { _id: id },
          { password: 0, cart: 0 }
        );
        res.status(200).json(userProfile);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },

    put: async (req, res) => {
      try {
        const data = req.body;
        const userProfile = await users.updateOne(
          { _id: data.id },
          {
            $set: {
              fullName: data.fullName,
              phone: data.phone,
              location: data.location,
              address: data.address,
              flatNo: data.flatNo,
            },
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    delete: async (req, res) => {
      try {
        const id = req.body.id;
        const userProfile = await users.deleteOne({ _id: id });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
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
            res.cookie("userId", userToken, { maxAge: 900000, httpOnly: true });
            res.status(200).send("OK");
          } else {
            res.status(401).send("Unauthorized");
          }
        });
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  register: {
    post: async (req, res) => {
      try {
        const data = req.body;
        const password = await bcrypt.hash(data.password, saltRounds);
        const newUser = await users.insertMany({
          fullName: data.fullName,
          email: data.email,
          password: password,
          phone: data.phone,
          location: data.location,
          address: data.address,
          flatNo: data.flatNo,
        });
        res.status(201).send("Created");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },

  products: {
    get: async (req, res) => {
      try {
        const products = await dealers.find({ active: true }, { password: 0 });
        res.status(200).json(products);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },
  cart: {
    get: async (req, res) => {
      try {
        const userId = req.body.id;
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
          description: user.description,
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
        const userId = req.body.id;
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
        const description = product.products[0].description;
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
                  description: description,
                },
              },
            }
          );
        }
        res.status(200).send("OK");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    delete: async (req, res) => {
      try {
        const data = req.body;
        const productId = req.query.productId;
        const product = await users.findOneAndUpdate(
          { _id: data.id },
          {
            $pull: {
              cart: {
                productId: productId,
              },
            },
          }
        );
        const userToken = jwt.sign({ id: data.id }, jwt_key);
        res.cookie("userId", userToken, { maxAge: 0, httpOnly: true });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  logout: {
    get: (req, res) => {
      try {
        const data = req.body;
        const userToken = jwt.sign({ id: data.id }, jwt_key);
        res.cookie("userId", userToken, { maxAge: 0, httpOnly: true });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
};
