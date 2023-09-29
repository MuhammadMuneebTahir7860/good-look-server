const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const ProductModel = require("../models/product-model");
const asyncHandler = require("../utilis/asyncHandler");
const nodemailer = require("nodemailer");
const Token = require("../models/token");
const SendEmail = require("../utilis/SendEmail");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

module.exports.userSignup = async (req, res) => {
  const { email, password, fullName, } = req.body.data;
  let user = await UserModel.findOne({ email: email });
  if (user) {
    res.status(400).send("Email id already exists");
  } else {
    try {
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        email,
        password: encryptedPassword,
        fullName,
      });
      var token = await jwt.sign(
        { email: email, role: "user", _id: newUser._id },
        process.env.jwtKey
      );
      user = await newUser.save();
      const responseData = {
        data: {
          token: token,
          fullName: newUser.fullName,
          email: newUser.email,
          _id: newUser._id,
        },
        msg: "Registered",
      };
      res.status(201).send(responseData);
    } catch (err) {
      console.log(err.message);
      res.status(501).send(err);
    }
  }
};


module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(400).json({ msg: "Please enter valid email" });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Password incorrect." });
  } else {
    var token = await jwt.sign(
      { email: user.email, role: "user", _id: user._id },
      process.env.jwtKey
    );

    let userRecord = {
      // role: "user",
      email: user.email,
      fullName: user.fullName,
      token,
      _id: user._id,
    };
    return res.status(200).json({ data: userRecord });
  }
};

module.exports.getLoggedInUser = async (req, res) => {
  if (!req.body?.token) {
    res.status(400).json({
      status: "error",
      message: "Token not recieved",
      statusCode: 400,
    });
    return;
  } else {
    const { token } = req.body;

    try {
      var decoded = await jwt.verify(token, process.env.jwtKey);
      if (decoded.email) {
        const user = await UserModel.findOne({ email: decoded?.email });
        if (!user) {
          res.status(404).json({
            status: "error",
            message: "User not found",
            statusCode: 404,
          });
          return;
        }
        let data = {
          email: user.email,
          fullName: user.fullName,
          token,
          _id: user._id,
        };
        res.status(202).json({
          status: "success",
          message: "User get successfully",
          data: data,
          statusCode: 202,
        });
        return;
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(400).json({
          status: "error",
          message: "Session expired",
          statusCode: 400,
        });
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid token", statusCode: 400 });
      }
    }
  }
};

module.exports.getAllUsers = async (req, res) => {
  const usersList = await UserModel.find().sort("-createAt");
  res.status(200).json({ data: usersList });
};
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id, "id");
  if (id) {
    await UserModel.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Deleted!" });
  }
  return res.status(401).json({ msg: "Not found" });
};

module.exports.updateUser = async (req, res) => {
  const data = req.body.data;
  console.log(req.body.data);
  try {
    if (data?._id) {
      const userData = await UserModel.findByIdAndUpdate(data?._id, data, {
        new: true,
      });
      return res.status(200).json({ msg: "Updated!", data: userData });
    }
    return res.status(401).json({ msg: "Not found" });
  } catch (error) {
    res.status(200).send(error);
  }
};

module.exports.addFavourite = async (req, res) => {
  const { productId, userId } = req.body;
  const Product = await ProductModel.findById(productId);
  const added = await UserModel.findByIdAndUpdate(
    userId,
    {
      $push: { favouriteProducts: Product?._id },
    },
    {
      new: true,
    }
  );
  console.log(added, "added");
  if (!added) {
    res.status(404);
    throw new Error("Product Not Found");
  } else {
    res.json(Product);
  }
};
module.exports.removeFavourite = async (req, res) => {
  const { productId, userId } = req.body;
  const Product = await ProductModel.findById(productId);

  const removed = await UserModel.findByIdAndUpdate(
    userId,
    {
      $pull: { favouriteProducts: Product?._id },
    },
    {
      new: true,
    }
  );
  if (!removed) {
    res.status(404);
    throw new Error("Product Not Found");
  } else {
    res.json(Product);
  }
};

module.exports.giveFeedback = async (req, res) => {
  const dataOfPostedBy = await UserModel.findById(req.body.data.userId);
  if (!dataOfPostedBy) {
    return res.status(401).json({ msg: "Session expired" });
  }
  const feedback = {
    comment: req.body.data.comment,
    whoPosted: dataOfPostedBy.name,
    postedProfile: dataOfPostedBy?.img ? dataOfPostedBy?.img : "",
    postedBy: req.body.data.userId,
    createAt: new Date(),
    commentId: uuidv4(),
    rating: req.body.data.rating,
    supplierId: req.body.data.supplierId,
  };
  console.log(feedback, "feedback");
  const supplierData = await UserModel.findOne({
    _id: req.body.data.supplierId,
  });
  var stars = supplierData?.feedbacks ? supplierData?.feedbacks : [];
  var ratingData = [...stars, feedback];
  const sum = ratingData?.reduce((accumulator, value) => {
    return Number(accumulator) + Number(value.rating);
  }, 0);
  const ratingValue = (sum / ratingData?.length)?.toFixed(1);
  let data = await UserModel.findByIdAndUpdate(
    req.body.data.supplierId,
    {
      $push: { feedbacks: feedback },
      overAllRating: ratingValue,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: feedback });
};

module.exports.getFeedbacks = async (req, res) => {
  try {
    const _id = req.params.id;
    if (_id.length > 0) {
      const userFeedbacks = await UserModel.findOne({ _id: _id });
      res.status(200).send({ data: userFeedbacks?.feedbacks });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
module.exports.deleteFeedback = async (req, res) => {
  console.log(req.body, "body");
  const supplierData = await UserModel.findOne({
    _id: req.body.data.supplierId,
  });
  console.log(supplierData, "supplierData");
  const feedbacks = supplierData?.feedbacks;
  console.log(feedbacks, "feedbacks");

  const updatedArray = feedbacks?.filter((item) => {
    if (item?.commentId != req.body.data.commentId) {
      return item;
    }
  });
  var ratingData = updatedArray;
  const sum = ratingData?.reduce((accumulator, value) => {
    return Number(accumulator) + Number(value.rating);
  }, 0);
  const ratingValue = (sum / ratingData?.length)?.toFixed(1);
  let data = await UserModel.findByIdAndUpdate(
    req.body.data.supplierId,
    {
      feedbacks: updatedArray,
      overAllRating: ratingValue,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: req.body.data });
};

module.exports.updateFeedback = async (req, res) => {
  const supplierData = await UserModel.findOne({
    _id: req.body.data.supplierId,
  });
  const feedbacks = supplierData?.feedbacks;
  const updatedArray = feedbacks?.map((item) => {
    if (item?.commentId == req.body.data.commentId) {
      return req.body.data;
    } else {
      return item;
    }
  });
  var ratingData = updatedArray;
  const sum = ratingData?.reduce((accumulator, value) => {
    return Number(accumulator) + Number(value.rating);
  }, 0);
  const ratingValue = (sum / ratingData?.length)?.toFixed(1);
  let data = await UserModel.findByIdAndUpdate(
    req.body.data.supplierId,
    {
      feedbacks: updatedArray,
      overAllRating: ratingValue,
    },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: req.body.data });
};
// module.exports.updateFeedback = async (req, res) => {
//   const supplierData = await SupplierModel.findOne({
//     _id: req.body.data.supplierId,
//   });
//   const feedbacks = supplierData?.feedbacks;
//   const updatedArray = feedbacks?.map((item) => {
//     if (item?.commentId == req.body.data.commentId) {
//       return req.body.data;
//     } else {
//       return item;
//     }
//   });
//   var ratingData = updatedArray;
//   const sum = ratingData?.reduce((accumulator, value) => {
//     return Number(accumulator) + Number(value.rating);
//   }, 0);
//   const ratingValue = (sum / ratingData?.length)?.toFixed(1);
//   let data = await SupplierModel.findByIdAndUpdate(
//     req.body.data.supplierId,
//     {
//       feedbacks: updatedArray,
//       overAllRating: ratingValue,
//     },
//     {
//       new: true,
//     }
//   );
//   return res.status(200).json({ data: req.body.data });
// };

// module.exports.deleteFeedback = async (req, res) => {
//   const supplierData = await SupplierModel.findOne({
//     _id: req.body.data.supplierId,
//   });
//   const feedbacks = supplierData?.feedbacks;
//   const updatedArray = feedbacks?.filter((item) => {
//     if (item?.commentId != req.body.data.commentId) {
//       return item;
//     }
//   });
//   var ratingData = updatedArray;
//   const sum = ratingData?.reduce((accumulator, value) => {
//     return Number(accumulator) + Number(value.rating);
//   }, 0);
//   const ratingValue = (sum / ratingData?.length)?.toFixed(1);
//   let data = await SupplierModel.findByIdAndUpdate(
//     req.body.data.supplierId,
//     {
//       feedbacks: updatedArray,
//       overAllRating: ratingValue,
//     },
//     {
//       new: true,
//     }
//   );
//   return res.status(200).json({ data: req.body.data });
// };

// module.exports.getSupplierFeedbacks = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     if (_id.length > 0) {
//       const supplierFeedbacks = await SupplierModel.findOne({ _id: _id });
//       res.status(200).send({ data: supplierFeedbacks?.feedbacks });
//     }
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// };

// module.exports.getTopRatedSuppliersOftheMonth = async (req, res) => {
//   let { ctg, searchVal } = req.query;
//   try {
//     const match = { publish: true };
//     let suppliersList;
//     if (ctg == "Other") {
//       const suppliersDataList = await SupplierModel.find(match).sort(
//         "-createAt"
//       );
//       suppliersList = suppliersDataList?.filter((item) => {
//         const categoriesList = item?.category?.filter((category) => {
//           if (
//             category != "Photographer" &&
//             category != "Videographer" &&
//             category != "HMUA" &&
//             category != "Host" &&
//             category != "Sounds & Lights" &&
//             category != "Events Place/Design" &&
//             category != "Catering" &&
//             category != "Singer/Band" &&
//             category != "Coordinator"
//           ) {
//             return category;
//           }
//         });
//         if (categoriesList?.length > 0) {
//           return item;
//         }
//       });
//     } else {
//       if (ctg) match.category = ctg == "Sounds " ? "Sounds & Lights" : ctg;
//       if (searchVal) match.name = { $regex: `.*${searchVal}.*`, $options: "i" };
//       suppliersList = await SupplierModel.find(match).sort("-createAt");
//     }
//     const array = suppliersList?.filter((item) => {
//       var feedbacks = item?.feedbacks;
//       if (feedbacks?.length > 0) {
//         const arr = feedbacks?.filter((feed) => {
//           if (
//             feed?.rating >= 4 &&
//             new Date(feed?.createAt)?.getMonth() == new Date().getMonth() &&
//             new Date(feed?.createAt)?.getFullYear() == new Date().getFullYear()
//           ) {
//             return feed;
//           }
//         });
//         if (arr?.length >= 2) {
//           return item;
//         }
//       }
//     });
//     res.status(200).send({ data: array });
//   } catch (error) {
//     res.status(200).send(error);
//   }
// };
