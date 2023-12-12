const dealers = require("../Models/dealer");
const users = require("../Models/user");
const orders = require("../Models/orders");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_DEALER_KEY;
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
  dealersRegister: async (req, res) => {
    try {
      const { fullName, shopName, email, password, phone, location, address } =
        req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newDealer = await dealers.create({
        fullName: fullName,
        shopName: shopName,
        email: email,
        password: hashedPassword,
        phone: phone,
        location: location,
        address: address,
      });
      res.status(201).json({
        status: "success",
        message: "You have registered successfully",
        data: {
          createdDealer: newDealer,
        },
      });
    } catch (error) {
      if (error.keyPattern.email) {
        res.status(400).json({
          status: "Failed",
          message: "Email has already been taken",
        });
      } else if (error.keyPattern.phone) {
        res.status(400).json({
          status: "Failed",
          message: "Mobile number has already been taken",
        });
      } else
        res.status(400).json({
          status: "Failed",
          message: "Something wrong",
        });
    }
  },

  dealersLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dealer = await dealers.findOne({
        email: email,
        isActive: true,
        isDeleted: false,
      });
      bcrypt.compare(password, dealer.password, function (err, result) {
        if (result === true && email === dealer.email) {
          const dealerToken = jwt.sign({ id: dealer._id }, jwt_key);
          res.status(200).json({
            status: "success",
            message: "You have logged successfully",
            data: {
              token: dealerToken,
            },
          });
        } else {
          res.status(401).json({
            status: "Failed",
            message: "Invalid email or password",
          });
        }
      });
    } catch (error) {
      res.status(401).json({
        status: "Failed",
        message: "User not found",
      });
    }
  },

  paymentMod: async (req, res) => {
    const query = req.query;
    const { id } = req.body;
    const filter = {
      _id: id,
      isActive: true,
      isDeleted: false,
    };

    const updatePayment = await dealers.findOneAndUpdate(filter, query, {
      new: true,
    });
    res.status(200).json({
      status: " success",
      message: "Successfully updated payment mode",
      data: {
        updatedPayment: updatePayment,
      },
    });
  },

  //XXX Pending ================================================>>

  shopClose: {
    patch: async (req, res) => {
      try {
        const data = req.body;
        const closeDealers = await dealers.updateOne(
          { _id: data.dealerId },
          { isOpen: data.data }
        );
        res.status(202).send("success");
      } catch (error) {
        res.status(400).send("Something went wrong");
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
        const orderId = req.body.orderId;
        const status = req.body.orderStatus;
        if (status != "delivered") {
          const orderStatus = await orders.updateOne(
            { _id: orderId },
            { $set: { orderStatus: status } }
          );
          res.status(202).send("Accepted");
        }
        if (status == "delivered") {
          const orderStatus = await orders.updateOne(
            { _id: orderId },
            { $set: { orderStatus: status, paymentStatus: true } }
          );
          res.status(202).send("Accepted");
        }
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  orderHistory: {
    get: async (req, res) => {
      try {
        const dealerId = req.body.id;
        const order = await orders.find({
          dealerId: dealerId,
          $or: [{ orderStatus: "delivered" }, { orderStatus: "rejected" }],
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
        res.status(400).send("Bad Request");
      }
    },
  },
};
