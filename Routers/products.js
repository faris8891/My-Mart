const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  addProducts,
  getProducts,
  createCategory,
  getCategory,
} = require("../Controllers/ProductsController");
const { tryCatch } = require("../Middleware/tryCatch");

router.route("/")
  .get(authentication.dealers, tryCatch(getProducts))
  .post(authentication.dealers, tryCatch(addProducts));

router
  .route("/category").get(authentication.dealers, tryCatch(getCategory))
  .post(authentication.dealers, tryCatch(createCategory)); // TODO change auth to admin

module.exports = router;
