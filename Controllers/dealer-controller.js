const dealers = require("../Models/dealer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;

module.exports = {
  dealerLoginGet: (req, res) => {
    res.send("dealer login page");
  },
  dealerLoginPost: async (req, res) => {
    try {
      const { username, password } = req.body;
      const dealer = await dealers.findOne({ username: username });
      let hash = dealer.password;
      bcrypt.compare(password, hash, function (err, result) {
        if (result == true && username == dealer.username) {
          const userToken = jwt.sign({ id: dealer._id }, jwt_key);
          res.cookie("uid", userToken, { maxAge: 900000, httpOnly: true });
          res.redirect("/dealer/dashboard");
        } else {
          res.redirect("/dealer/login");
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect("/dealer/login");
    }
  },
};
