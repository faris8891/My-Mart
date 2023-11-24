const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const upload = require("../Middleware/Storage");
const {
  dealersRegister,
  dealersLogin,
} = require("../Controllers/dealer-controller");
const { tryCatch } = require("../Middleware/tryCatch");

router.route("/login").post(tryCatch(dealersLogin));

router.route("/register").post(tryCatch(dealersRegister));

// =========================OLD========================>>

// router.get("/profile", authentication.dealers, profile.get);
// router.put("/profile", authentication.dealers, profile.put);

// router.patch("/cod", authentication.dealers, COD.patch);
// router.patch("/online-payment", authentication.dealers, onlinePayment.patch);

// router.patch("/close-shop", authentication.dealers, shopClose.patch);

// router.get("/products", authentication.dealers, products.get);
// router.post(
//   "/products",
//   upload.single("file"),
//   authentication.dealers,
//   products.post
// );
// router.put("/products", authentication.dealers, products.put);
// router.patch("/products", authentication.dealers, products.patch);
// router.delete("/products", authentication.dealers, products.delete);

// router.get("/orders", authentication.dealers, orders.get);
// router.patch("/orders", authentication.dealers, orders.patch);
// router.get("/orders-history", authentication.dealers, orderHistory.get);

// router.get("/feedback", authentication.dealers, feedback.get);
// router.delete("/feedback", authentication.dealers, feedback.delete);

module.exports = router;
