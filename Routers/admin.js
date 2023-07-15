const express = require("express");
const router = express.Router();
const {
  login,
  Dealer,
  logout,
  users,
  profile,
} = require("../Controllers/admin-controller");
const { authentication } = require("../Middleware/authentication");

router.post("/login", login.post);
router.get("/profile", authentication.admin, profile.get);
router.get("/dealers", authentication.admin, Dealer.get);
router.post("/dealers", authentication.admin, Dealer.post);
router.put("/dealers", authentication.admin, Dealer.put);
router.patch("/dealers", authentication.admin, Dealer.patch);
router.delete("/dealers", authentication.admin, Dealer.delete);

router.get("/users", authentication.admin, users.get);
router.post("/users", authentication.admin, users.post);
router.put("/users", authentication.admin, users.put);
router.patch("/users", authentication.admin, users.patch);
router.delete("/users", authentication.admin, users.delete);

router.get("/logout", authentication.admin, logout.get);

module.exports = router;
