const express = require("express");
const router = express.Router();
const { login, dashboard, Dealer } = require("../Controllers/admin-controller");

router.post("/login", login.post);
router.get("/dealers", Dealer.get);
router.post("/dealers", Dealer.post);
router.put("/dealers", Dealer.put);
router.patch("/dealers", Dealer.patch);
router.delete("/dealers", Dealer.delete);

module.exports = router;
