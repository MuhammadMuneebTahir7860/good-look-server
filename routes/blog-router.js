const express = require("express");
const BlogController = require("../controllers/blog-ctrl");
const router = express.Router();

router.post("/addBlogPost", BlogController.addBlogPost);
router.get("/getAllBlogPost", BlogController.getAllBlogPost);
router.delete("/deleteBlogPost/:id", BlogController.deleteBlogPost);
router.put("/updateBlogPost", BlogController.updateBlogPost);
router.post("/addBlogComment", BlogController.addBlogComment);
router.put("/deleteBlogComment", BlogController.deleteBlogComment);
router.put("/updateBlogComment", BlogController.updateBlogComment);

module.exports = router;
