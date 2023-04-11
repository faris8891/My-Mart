const express = require("express");
const router = express.Router();
const { login, Dealer, logout } = require("../Controllers/admin-controller");
const { authentication } = require("../Middleware/authentication");

router.post("/login", login.post);
router.get("/dealers", authentication.admin, Dealer.get);
router.post("/dealers", authentication.admin, Dealer.post);
router.put("/dealers", authentication.admin, Dealer.put);
router.patch("/dealers", authentication.admin, Dealer.patch);
router.delete("/dealers", authentication.admin, Dealer.delete);
router.get("/logout", authentication.admin, Dealer.get);

module.exports = router;
