var ServiceModel = require("../models/service-model");

module.exports.getAllBlogPost = async (req, res) => {
  try {
    const resValue = await ServiceModel.find();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.addBlogPost = async (req, res) => {
  const newBlog = {
    title: req.body.title,
    price:req.body.price,
    description: req.body.description,
    img: req.body.img ? req.body.img : "",
    createdAt: new Date(),
  };
  const resValue = new ServiceModel(newBlog);

  try {
    await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(404).json({ data: error.message });
  }
};

module.exports.deleteBlogPost = async (req, res) => {
  try {
    await ServiceModel.deleteOne({ _id: req.params.id });

    res.status(200).json({ data: "Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.updateBlogPost = async (req, res) => {
  const data = req.body.data;
  console.log(data, "data");
  try {
    if (data?._id) {
      const userData = await ServiceModel.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};
