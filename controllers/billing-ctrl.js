var BillingsSchema = require("../models/billing-model");
var UserModel = require("../models/user-model");
const { v4: uuidv4 } = require("uuid");

module.exports.getAllBlogPost = async (req, res) => {
  try {
    const resValue = await BillingsSchema.find();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.getBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const resValue = await BillingsSchema.findOne({ _id: id });
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.addBlogPost = async (req, res) => {
  const newBlog = {
    billings: req.body.billings,
    userData: req.body.userData,
  };
  const resValue = new BillingsSchema(newBlog);

  try {
    await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(404).json({ data: error.message });
  }
};

module.exports.deleteBlogPost = async (req, res) => {
  try {
    await BillingsSchema.deleteOne({ _id: req.params.id });

    res.status(200).json({ data: "Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.updateBlogPost = async (req, res) => {
  const data = req.body.data;
  try {
    if (data?._id) {
      const userData = await BillingsSchema.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};
