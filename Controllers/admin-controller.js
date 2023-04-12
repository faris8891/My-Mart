const admin = require("../Models/admin");
const users = require("../Models/user");
const dealers = require("../Models/dealer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;
const saltRounds = 10;

module.exports = {
  login: {
    async post(req, res) {
      try {
        const { userName, password } = req.body;
        const adminData = await admin.findOne({ userName: userName });
        if (password == adminData.password && userName == adminData.userName) {
          const userToken = jwt.sign({ id: adminData._id }, jwt_key);
          res.cookie("adminId", userToken, { maxAge: 900000, httpOnly: true });
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
  profile: {
    get: async (req, res) => {
      try {
        const id = req.body.id;
        const adminData = await admin.findOne(
          { _id: id },
          { password: 0, _id: 0 }
        );
        res.status(200).json(adminData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
  },

  Dealer: {
    get: async (req, res) => {
      try {
        const dealersData = await dealers.find({}, { password: 0 });
        res.status(200).json(dealersData);
      } catch (error) {
        res.status(404).send("Not Found");
      }
    },
    post: async (req, res) => {
      try {
        const dealerData = req.body;
        const password = await bcrypt.hash(dealerData.password, saltRounds);
        const dealerRegister = await dealers.insertMany({
          fullName: dealerData.fullName,
          userName: dealerData.userName,
          password: password,
          storeImage: dealerData.storeImage,
          location: dealerData.location,
          address: dealerData.address,
          mobile: dealerData.mobile,
          active: dealerData.active,
        });
        res.status(201).send("Created");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    put: async (req, res) => {
      try {
        id = req.query.id;
        const dealerData = req.body;
        const password = await bcrypt.hash(dealerData.password, saltRounds);
        dealerUpdate = await dealers.updateOne(
          { _id: id },
          {
            fullName: dealerData.fullName,
            userName: dealerData.userName,
            password: password,
            storeImage: dealerData.storeImage,
            location: dealerData.location,
            address: dealerData.address,
            mobile: dealerData.mobile,
          }
        );
        res.status(202).send("Accepted");
      } catch (error) {
        console.log(error);
        res.status(400).send("Bad Request");
      }
    },
    patch: async (req, res) => {
      id = req.query.id;
      dealerStatus = req.body.active;
      try {
        dealerActive = await dealers.updateOne(
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
        dealerDelete = await dealers.deleteOne({ _id: id });
        res.status(200).send("Ok");
      } catch (error) {
        res.status(400).send("Bad Request");
      }
    },
  },

  // -----------------------------copy from dealer--------------
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
        console.log(error);
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
        const data = req.body.active;
        const id = req.query.id;
        const user = await users.updateOne(
          { _id: id },
          { $set: { active: data } }
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
  // -------------------------------------------

  logout: {
    get: (req, res) => {
      const id = req.body.id;
      const userToken = jwt.sign({ id: id }, jwt_key);
      res.cookie("adminId", userToken, { maxAge: 0, httpOnly: true });
      res.status(200).send("OK");
    },
  },
};
