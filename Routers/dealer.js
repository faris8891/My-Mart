const express = require("express");
const router = express.Router();
const { authentication } = require("../Middleware/authentication");
const {
  dealerLoginGet,
  dealerLoginPost,
} = require("../Controllers/dealer-controller");

router.get("/login", dealerLoginGet);
router.get("/login", dealerLoginPost);
router.get('/')
module.exports = router;
