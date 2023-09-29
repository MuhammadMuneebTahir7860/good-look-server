const express = require("express");
const BlogController = require("../controllers/billing-ctrl");
const router = express.Router();

router.post("/addBillingPost", BlogController.addBlogPost);
router.get("/getAllBillingsPost", BlogController.getAllBlogPost);
router.get("/getBlogById/:id", BlogController.getBlogById);
router.delete("/deleteBillingPost/:id", BlogController.deleteBlogPost);
router.put("/updateBillingPost", BlogController.updateBlogPost);

module.exports = router;
