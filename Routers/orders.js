const express = require("express");
const { authentication } = require("../Middleware/authentication");
const router = express.Router();
const { tryCatch } = require("../Middleware/tryCatch");

const {
  createCodOrders,
  createOnlineOrders,
  updateOrderStatus,
} = require("../Controllers/ordersControllers");

router.route("/cod").post(authentication.users, tryCatch(createCodOrders));
router
  .route("/online")
  .post(authentication.users, tryCatch(createOnlineOrders));

router
  .route("/status/:orderId")
  .patch(authentication.dealers, tryCatch(updateOrderStatus));

module.exports = router;
