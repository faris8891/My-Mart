const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  profile,
  login,
  register,
  shops,
  products,
  cart,
  feedback,
  logout,
  checkout,
  orderHistory,
  payment,
  paymentVerify,
  otpLogin,
  COD,
} = require("../Controllers/user-controller");

router.post("/register", register.post);
router.post("/login", login.post);

router.post("/otp-login", otpLogin.post);
router.put("/otp-login", otpLogin.put);

router.get("/shops", shops.get);

router.get("/products/:dealerId", products.get);

router.get("/profiles", authentication.users, profile.get);
router.put("/profiles", authentication.users, profile.put);
router.delete("/profiles", authentication.users, profile.delete);

router.get("/cart", authentication.users, cart.get);
router.post("/cart", authentication.users, cart.post);
router.delete("/cart", authentication.users, cart.delete);

router.post("/checkout", authentication.users, checkout.post);
router.post("/pay", authentication.users, payment.post);

router.post("/pay-verify/:orderId", authentication.users, paymentVerify.post);

router.get("/orders", authentication.users, orderHistory.get);

router.post("/feedback", authentication.users, feedback.post);

router.get("/logout", authentication.users, logout.get);

module.exports = router;
