const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_USER_KEY = process.env.JWT_USER_KEY;
const JWT_DEALER_KEY = process.env.JWT_DEALER_KEY;
const JWT_ADMIN_KEY = process.env.JWT_ADMIN_KEY;

module.exports.authentication = {
  admin: async (req, res, next) => {
    try {
      const adminId = req.headers.authorization;
      let data = jwt.verify(adminId, JWT_ADMIN_KEY).id;
      req.body.id = data;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
  dealers: async (req, res, next) => {
    try {
      let dealerId = req.headers.authorization.split(" ")[1];
      let data = jwt.verify(dealerId, JWT_DEALER_KEY).id
      req.body.id = data;
      next();
    } catch (error) {
      res.status(401).json({
        status: "Failed",
        message: "Unauthorized user",
      });

    }
  },
  users: async (req, res, next) => {
    try {
      let userId = req.headers.authorization;
      let data = jwt.verify(userId, JWT_USER_KEY).id;
      req.body.id = data;
      next();
    } catch (error) {
      res.status(401).send("Unauthorized user");
    }
  },
};
