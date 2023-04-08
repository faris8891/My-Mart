const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  getHome,
  login,
  getMobile,
  postMobile,
  getOtp,
  postOtp,
  register,
  getProducts,
  postProducts,
  cart,
  order,
  getFeedback,
  postFeedback,
  getOrderHistory,
  getLogout,
  orders,
} = require("../Controllers/user-controller");

router.get("/home", getHome);

router.post("/login", login.post);

router.get("/mobile-login", getMobile);
router.post("/mobile-login", postMobile);

router.get("/otp", getOtp);
router.post("/otp", postOtp);

router.post("/register", register.post);

router.get("/products", getProducts);
router.post("/products", postProducts);

router.get("/cart", cart.get);
router.post("/cart", cart.post);

router.get("/orders", orders.get);
router.post("/orders", orders.post);

router.get("/feedbacks", getFeedback);
router.post("/feedbacks", postFeedback);

router.get("/orders-history", getOrderHistory);

router.get("/logout", getLogout);

module.exports = router;
