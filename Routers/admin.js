const express = require("express");
const router = express.Router();
const {
  login,
  Dealer,
  logout,
  users,
  profile,
  topShops,
  apiTest,
} = require("../Controllers/admin-controller");
const { authentication } = require("../Middleware/authentication");
const {tryCatch}=require("../Middleware/tryCatch")

router.post("/login", tryCatch(login.post));
router.get("/profile", authentication.admin,tryCatch(profile.get));
router.get("/dealers", authentication.admin,tryCatch(Dealer.get));
router.post("/dealers", authentication.admin,tryCatch(Dealer.post));
router.put("/dealers", authentication.admin,tryCatch(Dealer.put));
router.patch("/dealers", authentication.admin,tryCatch(Dealer.patch));
router.delete("/dealers", authentication.admin,tryCatch(Dealer.delete));

router.patch("/top-shops", authentication.admin, tryCatch(topShops.patch));

router.get("/users", authentication.admin, tryCatch(users.get));
router.post("/users", authentication.admin, tryCatch(users.post));
router.put("/users", authentication.admin, tryCatch(users.put));
router.patch("/users", authentication.admin, tryCatch(users.patch));
router.delete("/users", authentication.admin, tryCatch(users.delete));

router.get("/logout", authentication.admin, tryCatch(logout.get));
router.get("/api-test", tryCatch(apiTest.test));

module.exports = router;
