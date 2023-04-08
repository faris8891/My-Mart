const admin = require("../Models/admin");
const dealer = require("../Models/dealer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;

module.exports = {
  login: {
    async post(req, res) {
      try {
        const { userName, password } = req.body;
        const adminData = await admin.findOne({ userName: userName });
        if (password == adminData.password && userName == adminData.userName) {
          const userToken = jwt.sign({ id: adminData._id }, jwt_key);
          res.cookie("uid", userToken, { maxAge: 900000, httpOnly: true });
          res.status(200).send("OK");
        } else {
          res.status(400).send("Bad Request");
        }
      } catch (error) {
        console.log(error);
        res.status(401).send("Unauthorized");
      }
    },
  },

  Dealer: {
    get: async (req, res) => {
      try {
        const dealer = req.body;
        const dealerData = await dealer.find({}, { _id: 0, password: 0 });
        res.status(200).json(dealerData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      const dealerData = req.body;
      console.log(dealerData);
      try {
        const dealerRegister = await dealer.insertMany({
          fullName: dealerData.fullName,
          userName: dealerData.userName,
          password: dealerData.password,
          storeImage: dealerData.storeImage,
          location: dealerData.location,
          address: dealerData.address,
          mobile: dealerData.mobile,
          active: dealerData.active,
        });
        console.log(dealerRegister);
        res.status(201).send("Created");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      dealerData = req.body;
      id = req.query.id;
      try {
        dealerUpdate = await dealer.updateOne(
          { _id: id },
          {
            fullName: dealerData.fullName,
            userName: dealerData.userName,
            password: dealerData.password,
            storeImage: dealerData.storeImage,
            location: dealerData.location,
            address: dealerData.address,
            mobile: dealerData.mobile,
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    patch: async (req, res) => {
      id = req.query.id;
      dealerStatus = req.body.active;
      try {
        dealerActive = await dealer.updateOne(
          { _id: id },
          { active: dealerStatus }
        );
        res.status(200).send("Ok");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
    delete: async (req, res) => {
      id = req.query.id;
      try {
        dealerDelete = await dealer.deleteOne({ _id: id });
        res.status(200).send("Ok");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },
};
