const users = require("../Models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
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

  getLogin: (req, res) => {
    res.send("login page");
  },
  postLogin: async (req, res) => {
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
  getRegister: (req, res) => {
    res.send(`{
      "name":"",
      "email":"",
      "password":"",
      "phone":"",
      "location":"",
      "address":"",
      "flatNo":""
    }`);
  },
  postRegister: async (req, res) => {
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
  getCart: (req, res) => {
    res.send("this is cart page");
  },
  postCart: async (req, res) => {
    const cart = await users.updateOne(
      { _id: req.query.user_id },
      { $push: { cart: req.query.product_id } }
    );
  },

  getOrder: (req, res) => {
    res.send("this is order page");
  },
  postOrder: (req, res) => {
    res.send("order POST");
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
