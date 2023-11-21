const express = require("express")
const router = express.Router();
const { authentication } = require("../Middleware/authentication")
const productController = require("../Controllers/ProductsController");
const {addProducts} = require("../Controllers/ProductsController");
const tryCatch = require("../Middleware/tryCatch");


router.use(tryCatch.tryCatch(productController))
router.post("/products", authentication.dealers, addProducts)
 

module.exports = router; 