const express = require("express");
const { authentication } = require("../Middleware/authentication");
const router = express.Router();
const { tryCatch } = require("../Middleware/tryCatch");

const {createCodOrders} = require("../Controllers/ordersControllers");

router.route("/cod").post(authentication.users, tryCatch(createCodOrders));

module.exports = router;
