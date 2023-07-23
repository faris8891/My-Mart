const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_key = process.env.JWT_KEY;

module.exports.authentication = {
  admin: async (req, res, next) => {
    try {
      const adminId = req.headers.authorization;
      let data = jwt.verify(adminId, jwt_key).id;
      req.body.id = data;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
  dealers: async (req, res, next) => {
    try {
      let dealerId = req.headers.authorization;
      let data = jwt.verify(dealerId, jwt_key).id;
      req.body.id = data;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send("Unauthorized user");
    }
  },
  users: async (req, res, next) => {
    try {
      let userId = req.cookies.userId;
      let data = jwt.verify(userId, jwt_key).id;
      req.body.id = data;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
};
