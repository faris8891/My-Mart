const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const { addProducts } = require("../Controllers/ProductsController");
const { tryCatch } = require("../Middleware/tryCatch");

router.route("/products")
    .post(authentication.dealers, tryCatch(addProducts));

module.exports = router;
