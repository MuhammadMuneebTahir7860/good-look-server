const express = require("express");
const BlogController = require("../controllers/service-ctrl");
const router = express.Router();

router.post("/addServicePost", BlogController.addBlogPost);
router.get("/getAllServicePost", BlogController.getAllBlogPost);
router.delete("/deleteServicePost/:id", BlogController.deleteBlogPost);
router.put("/updateServicePost", BlogController.updateBlogPost);

module.exports = router;
