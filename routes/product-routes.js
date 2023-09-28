const express = require("express");
// const { protect } = require("../middlewares/auth");

const Product = require("../controllers/product-ctrl");

const router = express.Router();

router.get("/getAllProducts", Product.getAllProducts);
router.post("/addProduct", Product.addProduct);
router.delete("/deleteProduct/:id", Product.deleteProduct);
router.put("/updateProduct", Product.updateProduct);
router.get("/getSingleProduct/:id", Product.getSingleProduct);
router.get("/searchProduct", Product.searchProduct);

module.exports = router;
