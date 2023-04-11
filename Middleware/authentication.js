const admin = require("../Models/admin");
const dealers = require("../Models/dealer");
const users = require("../Models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_key = process.env.JWT_KEY;

module.exports.authentication = {
  admin: async (req, res, next) => {
    try {
      let uid = req.headers.cookie.slice(4);
      let data = jwt.verify(uid, jwt_key);
      const user = await admin.findOne({ _id: data.id });
      console.log(user);
      if (user) {
        next();
      } else {
        res.status(401).send("Unauthorized user");
      }
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
  dealers: async (req, res, next) => {
    try {
      let uid = req.headers.cookie.slice(4);
      let data = jwt.verify(uid, jwt_key);
      const user = await dealers.findOne({ _id: data.id });
      if (user && user.active == true) {
        next();
      } else {
        res.status(401).send("Unauthorized user");
      }
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
  users: async (req, res, next) => {
    try {
      let uid = req.headers.cookie.slice(4);
      let data = jwt.verify(uid, jwt_key);
      console.log(data.id);
      const user = await users.findOne({ _id: data.id });
      console.log(user);
      if (user) {
        next();
      } else {
        res.status(401).send("Unauthorized user");
      }
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
};
