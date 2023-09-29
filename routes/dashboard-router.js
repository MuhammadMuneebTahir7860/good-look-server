const express = require("express");
const BlogController = require("../controllers/dashboard-ctrl");
const router = express.Router();

router.get("/getDashboardData", BlogController.getDashboardData);

module.exports = router;
