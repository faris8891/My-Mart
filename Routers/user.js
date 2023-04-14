const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  profile,
  login,
  register,
  products,
  cart,
  feedback,
  logout,
  checkout,
  orderHistory
} = require("../Controllers/user-controller");

const { payment } = require("../Controllers/orders-controller");

router.post("/login", login.post);
router.post("/register", register.post);

router.get('/products',products.get)

router.get("/profiles",authentication.users, profile.get);
router.put("/profiles",authentication.users, profile.put);
router.delete("/profiles", authentication.users, profile.delete);

router.get("/cart", authentication.users, cart.get);
router.post("/cart", authentication.users, cart.post);
router.delete("/cart", authentication.users, cart.delete);

// router.get("/orders", usersOrders.get);
router.post("/checkout", authentication.users, checkout.post);

router.get("/orders-history", authentication.users, orderHistory.get);

router.patch("/feedback", authentication.users, feedback.patch);

router.post("/payment", authentication.users, payment.post);

router.get("/logout", authentication.users, logout.get);

module.exports = router;
