const express = require("express");
const BlogController = require("../controllers/worker-ctrl");
const router = express.Router();

router.post("/addWorkerPost", BlogController.addBlogPost);
router.get("/getAllWorkerPost", BlogController.getAllBlogPost);
router.delete("/deleteWorkerPost/:id", BlogController.deleteBlogPost);
router.put("/updateWorkerPost", BlogController.updateBlogPost);

module.exports = router;
