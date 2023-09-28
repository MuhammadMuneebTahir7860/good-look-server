var BlogModel = require("../models/blog-model");
var UserModel = require("../models/user-model");
const { v4: uuidv4 } = require("uuid");

module.exports.getAllBlogPost = async (req, res) => {
  try {
    console.log('working');
    const resValue = await BlogModel.find();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(400).json({ data: error.message });
  }
};

module.exports.addBlogPost = async (req, res) => {
  const newBlog = {
    title: req.body.title,
    description: req.body.description,
    img: req.body.img ? req.body.img : "",
    createdAt: new Date(),
  };
  const resValue = new BlogModel(newBlog);

  try {
    await resValue.save();
    res.status(200).json({ data: resValue });
  } catch (error) {
    res.status(404).json({ data: error.message });
  }
  console.log(newBlog, "newBlog");
};

module.exports.deleteBlogPost = async (req, res) => {
  try {
    await BlogModel.deleteOne({ _id: req.params.id });

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
      const userData = await BlogModel.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};

module.exports.addBlogComment = async (req, res) => {
  console.log(req.body);
  const dataOfPostedBy = await UserModel.findById(req.body.data.userId);
  if (!dataOfPostedBy) {
    return res.status(401).json({ msg: "Session expired" });
  }

  const blogComment = {
    comment: req.body.data.comment,
    whoPosted: dataOfPostedBy.name,
    postedProfile: dataOfPostedBy?.img ? dataOfPostedBy?.img : "",
    postedBy: req.body.data.userId,
    createAt: new Date(),
    commentId: uuidv4(),
    blogId: req.body.data.blogId,
  };
  const supplierData = await BlogModel.findOne({
    _id: req.body.data.blogId,
  });
  let data = await BlogModel.findByIdAndUpdate(
    req.body.data.blogId,
    {
      $push: { blogComment: blogComment },
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: blogComment });
};

module.exports.deleteBlogComment = async (req, res) => {
  const blogData = await BlogModel.findOne({
    _id: req.body.data.blogId,
  });
  console.log(req.body);
  const blogComments = blogData?.blogComment;
  const updatedArray = blogComments?.filter((item) => {
    if (item?.commentId != req.body.data.commentId) {
      return item;
    }
  });

  let data = await BlogModel.findByIdAndUpdate(
    req.body.data.blogId,
    {
      blogComment: updatedArray,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: req.body.data });
};

module.exports.updateBlogComment = async (req, res) => {
  const blogData = await BlogModel.findOne({
    _id: req.body.data.blogId,
  });
  const feedbacks = blogData?.blogComment;
  const updatedArray = feedbacks?.map((item) => {
    if (item?.commentId == req.body.data.commentId) {
      return req.body.data;
    } else {
      return item;
    }
  });
  let data = await BlogModel.findByIdAndUpdate(
    req.body.data.blogId,
    {
      blogComment: updatedArray,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: req.body.data });
};
