const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const { tryCatch } = require("../Middleware/tryCatch");
const {
  addProducts,
  getProducts,
  createCategory,
  getCategories,
  getProduct,
  activateProduct,
  deleteProduct
} = require("../Controllers/ProductsController");

router
  .route("/")
  .get(tryCatch(getProducts))
  .post(authentication.dealers, tryCatch(addProducts));

router.route("/:id")
  .get(tryCatch(getProduct))
  .patch(authentication.dealers, tryCatch(activateProduct))
  .delete(authentication.dealers, tryCatch(deleteProduct))

router
  .route("/category")
  .get(authentication.dealers, tryCatch(getCategories))
  .post(authentication.dealers, tryCatch(createCategory)); // TODO change auth to admin

module.exports = router;
