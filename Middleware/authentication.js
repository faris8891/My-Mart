const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwt_key = process.env.JWT_KEY;

module.exports.authentication = function (req, res, next) {
  try {
    let uid = req.headers.cookie.slice(4);
    let data = jwt.verify(uid, jwt_key);
    next();
  } catch (error) {
    res.status(404).send('user not found');
  }
};
