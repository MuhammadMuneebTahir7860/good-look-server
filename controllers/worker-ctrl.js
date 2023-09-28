var WorkerModel = require("../models/worker-model");

module.exports.getAllBlogPost = async (req, res) => {
  try {
    const resValue = await WorkerModel.find();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.addBlogPost = async (req, res) => {
  const newBlog = {
    name: req.body.name,
    workTitle: req.body.workTitle,
    img: req.body.img ? req.body.img : "",
  };
  const resValue = new WorkerModel(newBlog);

  try {
    await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(404).json({ data: error.message });
  }
};

module.exports.deleteBlogPost = async (req, res) => {
  try {
    await WorkerModel.deleteOne({ _id: req.params.id });

    res.status(200).json({ data: "Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.updateBlogPost = async (req, res) => {
  const data = req.body.data;
  try {
    if (data?._id) {
      const userData = await WorkerModel.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};
