const express = require('express')
const { protect } = require("../middlewares/auth");

const adminCtrl = require('../controllers/admin-ctrl');

const router = express.Router()

router.post('/registerAdmin', adminCtrl.adminSignup)
router.post('/loginAdmin', adminCtrl.adminLogin)
router.post("/getLoggedInAdmin", adminCtrl.getLoggedInUser);



module.exports = router