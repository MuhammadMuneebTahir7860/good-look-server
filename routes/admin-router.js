const express = require("express");

const adminCtrl = require("../controllers/admin-ctrl");

const router = express.Router();

router.post("/registerAdmin", adminCtrl.adminSignup);
router.put("/updateAdmin", adminCtrl.updateAdmin);
router.post("/loginAdmin", adminCtrl.adminLogin);
router.get("/portfolio", adminCtrl.AdminPortfolio);
router.post("/getLoggedInAdmin", adminCtrl.getLoggedInUser);

module.exports = router;
