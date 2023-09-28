const Product = require("../models/product-model");
const Order = require("../models/order-model");
const asyncHandler = require("../utilis/asyncHandler");
const express = require("express");

module.exports.getAllProducts = asyncHandler(async (req, res) => {
  try {
    const response = await Product.find();
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports.getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Product.findById(id).populate("userId");
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports.addProduct = asyncHandler(async (req, res) => {
  console.log(req.body, "body");
  const newProduct = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img ? req.body.img : "",
    price: req.body.price,
    category: req.body.category,
    location: req.body.location,
    phone: req.body.phone,
    brand: req.body.brand,
    userId: req.body.userId,
    createdAt: new Date(),
  };
  const resValue = new Product(newProduct);
  try {
    await resValue.save();
    res
      .status(200)
      .json({ data: resValue, message: "Successfully Product Aded" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports.deleteProduct = asyncHandler(async (req, res) => {
  try {
    if (req.params.id) {
      console.log("User Not Found");
    }
    await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "SuccessFully Deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports.updateProduct = async (req, res) => {
  const data = req.body.data;
  try {
    if (data?._id) {
      const productData = await Product.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ data: productData, message: "Updated!" });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(404).send(error);
  }
};

module.exports.searchProduct = async (req, res) => {
  const { title, category, price, location } = req.query;
  try {
    const query = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (category) query.category = { $regex: category, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (price) {
      // Assuming the price stored in the database is stored as a numeric value
      query.price = { $lt: parseFloat(price) };
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(404).send(error);
  }
};
