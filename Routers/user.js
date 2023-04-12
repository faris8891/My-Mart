const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  getHome,
  login,
  register,
  cart,
  logout,
  orders,
} = require("../Controllers/user-controller");

const { usersOrders,payment } = require("../Controllers/orders-controller");

router.get("/home", getHome);

router.post("/login", login.post);

router.post("/register", register.post);

router.get("/cart",authentication.users, cart.get);
router.post("/cart",authentication.users, cart.post);

// router.get("/orders", usersOrders.get);
router.post("/orders",authentication.users, usersOrders.post);

router.post("/payment",authentication.users, payment.post);

router.get("/logout",authentication.users, logout.get);

module.exports = router;
