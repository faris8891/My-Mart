const dealers = require("../Models/dealer");
const users = require("../Models/user");
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
        const { username, password } = req.body;
        const dealer = await dealers.findOne({ username: username });
        let hash = dealer.password;
        bcrypt.compare(password, hash, function (err, result) {
          if (result == true && username == dealer.username) {
            const userToken = jwt.sign({ id: dealer._id }, jwt_key);
            res.cookie("uid", userToken, { maxAge: 900000, httpOnly: true });
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

  products: {
    get: async (req, res) => {
      const dealerId = req.query.dealerId;
      try {
        const products = await dealers.find({ _id: dealerId }, { products: 1 });
        res.status(200).json(products);
      } catch (error) {
        res.status(400).send("Bad Request");
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
        console.log(product);
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
        console.log(product);
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
        console.log(dealerId, productId);
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
        const user = await users.find({}, { cart: 0, password: 0, orders: 0 });
        res.status(200).json(user);
      } catch (error) {
        console.log(error);
        res.status(404).send("Not Found");
      }
    },
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
        res.status(201).send("Created");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      try {
        const data = req.body;
        const id = req.query.id;
        const password = await bcrypt.hash(req.body.password, saltRounds);
        const userUpdate = await users.updateOne(
          { _id: id },
          {
            $set: {
              fullName: data.fullName,
              email: data.email,
              password: password,
              phone: data.phone,
              location: data.location,
              address: data.address,
              flatNo: data.flatNo,
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
        const id = req.query.id;
        const user = await users.updateOne(
          { _id: "642ea8f883b0388094fee652" },
          { $set: { active: false } }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    delete: async (req, res) => {
      try {
        const id = req.query.id;
        const userUpdate = await users.deleteOne({
          _id: id,
        });
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
};
