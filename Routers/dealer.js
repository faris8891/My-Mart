const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const { login, products, users } = require("../Controllers/dealer-controller");

router.post("/login", login.Post);

router.get("/products", products.get);
router.post("/products", products.post);
router.put("/products", products.put);
router.patch("/products", products.patch);
router.delete("/products", products.delete);
router.get("/users", users.get);
router.post("/users", users.post);
router.put("/users", users.put);
router.patch("/users", users.patch);
router.delete("/users", users.delete);
module.exports = router;
