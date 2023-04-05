const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  getHome,
  getLogin,
  postLogin,
  getMobile,
  postMobile,
  getOtp,
  postOtp,
  getRegister,
  postRegister,
  getProducts,
  postProducts,
  getCart,
  postCart,
  getOrder,
  postOrder,
  getFeedback,
  postFeedback,
  getOrderHistory,
  getLogout,
} = require("../Controllers/user-controller");

router.get("/home", getHome);

router.get("/login", authentication, getLogin);
router.post("/login", postLogin);

router.get("/mobile-login", getMobile);
router.post("/mobile-login", postMobile);

router.get("/otp", getOtp);
router.post("/otp", postOtp);

router.get("/register", getRegister);
router.post("/register", postRegister);

router.get("/products", getProducts);
router.post("/products", postProducts);

router.get("/cart", getCart);
router.post("/cart", postCart);

router.get("/orders", getOrder);
router.post("/orders", postOrder);

router.get("/feedbacks", getFeedback);
router.post("/feedbacks", postFeedback);

router.get("/orders-history", getOrderHistory);

router.get("/logout", getLogout);

module.exports = router;
