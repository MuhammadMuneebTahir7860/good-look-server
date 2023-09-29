const express = require("express");

const applyController = require("../controllers/apply-supplier-ctrl");

const router = express.Router();

router.post("/apply", applyController.applySupplier);
router.get("/getSupplierRequests", applyController.getSupplierRequests);
router.delete("/deleteRequest/:id", applyController.deleteSupplierRequest);

module.exports = router;
