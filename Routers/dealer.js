const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const upload = require("../Middleware/Storage");
const {
  login,
  products,
  users,
  orders,
  feedback,
  profile,
  orderHistory,
} = require("../Controllers/dealer-controller");

router.post("/login", login.Post);

router.get("/profile", authentication.dealers, profile.get);
router.put("/profile", authentication.dealers, profile.put);

router.get("/products", authentication.dealers, products.get);
router.post(
  "/products",
  upload.single("file"),
  authentication.dealers,
  products.post
);
router.put("/products", authentication.dealers, products.put);
router.patch("/products", authentication.dealers, products.patch);
router.delete("/products", authentication.dealers, products.delete);

router.get("/users", authentication.dealers, users.get);

router.get("/orders", authentication.dealers, orders.get);
router.patch("/orders", authentication.dealers, orders.patch);
router.get("/orders-history", authentication.dealers, orderHistory.get);

router.get("/feedback", authentication.dealers, feedback.get);
router.delete("/feedback", authentication.dealers, feedback.delete);
module.exports = router;
