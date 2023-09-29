var MeasurementSchema = require("../models/measurement-model");

module.exports.getAllBlogPost = async (req, res) => {
  try {
    const resValue = await MeasurementSchema.find();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.getBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const resValue = await MeasurementSchema.findOne({ _id: id });
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.addBlogPost = async (req, res) => {
  const newBlog = {
    userData: req.body.userData,
    kameezLength: req.body.kameezLength,
    arms: req.body.arms,
    teera: req.body.teera,
    Kalar: req.body.Kalar,
    gheera: req.body.gheera,
    chest: req.body.chest,
    waist: req.body.waist,
  };
  const resValue = new MeasurementSchema(newBlog);

  try {
    await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(404).json({ data: error.message });
  }
};

module.exports.deleteBlogPost = async (req, res) => {
  try {
    await MeasurementSchema.deleteOne({ _id: req.params.id });

    res.status(200).json({ data: "Successfully Deleted" });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.updateBlogPost = async (req, res) => {
  const data = req.body.data;
  try {
    if (data?._id) {
      const userData = await MeasurementSchema.findByIdAndUpdate(
        data?._id,
        data,
        {
          new: true,
        }
      );
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};
