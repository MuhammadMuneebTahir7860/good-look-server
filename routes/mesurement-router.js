const express = require("express");
const BlogController = require("../controllers/measurement-ctrl");
const router = express.Router();

router.post("/addMeasurementPost", BlogController.addBlogPost);
router.get("/getAllMeasurementPost", BlogController.getAllBlogPost);
// router.get("/getBlogById/:id", BlogController.getBlogById);
router.delete("/deleteMeasurementPost/:id", BlogController.deleteBlogPost);
router.put("/updateMeasurementPost", BlogController.updateBlogPost);

module.exports = router;
