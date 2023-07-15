const dealers = require("../Models/dealer");
const users = require("../Models/user");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
    folder: "MyMartProduct",
  });
  return res;
}
module.exports = {
  login: {
    Post: async (req, res) => {
      try {
        const { userName, password } = req.body;
        const dealer = await dealers.findOne({ userName: userName });
        let hash = dealer.password;
        bcrypt.compare(password, hash, function (err, result) {
          if (result == true && userName == dealer.userName) {
            const userToken = jwt.sign({ id: dealer._id }, jwt_key, {
              expiresIn: "1d",
            });
            res.cookie("dealerId", userToken, {
              maxAge: 900000,
              httpOnly: true,
            });
            res.status(200).json(userToken);
          } else {
            res.status(401).send("User name or password is incorrect");
          }
        });
      } catch (error) {
        console.log(error);
        res.status(401).send("User name or password is incorrect");
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
        const products = await dealers.find(
          { _id: dealerId },
          { products: 1, _id: 0 }
        );
        res.status(200).json(products[0]);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      try {
        const data = req.body;
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        const product = await dealers.updateOne(
          { _id: dealerId },
          {
            $push: {
              products: {
                productName: data.productName,
                price: data.price,
                category: data.category,
                noOfItem: data.noOfItem,
                defaultImage: cldRes.secure_url,
                productImages: data.description,
                description: data.description,
                productActive: data.productActive,
              },
            },
          }
        );
        console.log(product);
        res.status(200).send("OK");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      try {
        const data = req.body;
        const dealerId = req.body.id;
        const productId = req.query.productId;
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
        const dealerId = req.body.id;
        const productId = req.body.productId;
        const product = await dealers.updateOne(
          {
            _id: dealerId,
            "products._id": productId,
          },
          { $set: { "products.$.productActive": data.productStatus } }
        );
        if (product.acknowledged) {
          res.status(202).send("Product updated successfully");
        } else {
          res.status(400).send("Product update failed");
        }
      } catch (error) {
        res.status(400).send("Product update failed");
      }
    },
    delete: async (req, res) => {
      try {
        const data = req.body;
        const dealerId = req.body.id;
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
        const dealerId = req.body.id;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [
            { orderStatus: "pending" },
            { orderStatus: "confirmed" },
            { orderStatus: "on the way" },
          ],
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
          { $set: { orderStatus: status } }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  orderHistory: {
    get: async (req, res) => {
      try {
        console.log(req);
        const dealerId = req.body.id;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [{ orderStatus: "delivered" }],
        });
        res.status(200).json(order);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  feedback: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const feedback = await orders.find(
          { dealerId: id, feedback: { $exists: true } },
          { feedback: 1 }
        );
        console.log(feedback);
        res.status(200).json(feedback);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    delete: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const orderId = req.query.orderId;
        const feedback = await orders.updateOne(
          { _id: orderId, dealerId: dealerId },
          {
            $unset: { feedback: {} },
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
  },
};
