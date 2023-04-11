const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  login,
  products,
  users,
  orders,
  feedback,
} = require("../Controllers/dealer-controller");

router.post("/login", login.Post);

router.get("/products", authentication.dealers, products.get);
router.post("/products", authentication.dealers, products.post);
router.put("/products", authentication.dealers, products.put);
router.patch("/products", authentication.dealers, products.patch);
router.delete("/products", authentication.dealers, products.delete);

router.get("/users", authentication.dealers, users.get);
router.post("/users", authentication.dealers, users.post);
router.put("/users", authentication.dealers, users.put);
router.patch("/users", authentication.dealers, users.patch);
router.delete("/users", authentication.dealers, users.delete);

router.get("/orders", authentication.dealers, orders.get);
router.patch("/orders", authentication.dealers, orders.patch);

router.get("/feedback", authentication.dealers, feedback.get);
router.delete("/feedback", authentication.dealers, feedback.delete);
module.exports = router;
