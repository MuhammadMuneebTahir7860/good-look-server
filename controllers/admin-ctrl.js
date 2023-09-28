const bcrypt = require("bcryptjs");
var AdminModel = require("../models/admin-model");

var jwt = require("jsonwebtoken");
module.exports.adminSignup = async (req, res) => {
  const { email, password } = req.body.data;
  const admin = await AdminModel.findOne({ email: email });

  if (admin) {
    res.status(400).send("admin email already exist");
  } else {
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new AdminModel({
      email,
      password: encryptedPassword,
    });
    await newUser.save();
    res.status(200).send({ msg: "Registered" });
  }
};
module.exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  const user = await AdminModel.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(400).json({ msg: "Please enter valid email" });
  } else if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: "Password incorrect." });
  } else {
    var token = await jwt.sign(
      { email: user.email, role: "admin", _id: user._id },
      process.env.jwtKey
    );

    let userRecord = {
      role: "admin",
      email: user.email,
      token,
      _id: user._id,
      contact: user.contact,
      address: user.address,
      name: user.name,
      img: user.img ? user.img : "",
      favoriteSuppliers: user?.favoriteSuppliers,
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
        const user = await AdminModel.findOne({ email: decoded?.email });
        if (!user) {
          res.status(404).json({
            status: "error",
            message: "User not found",
            statusCode: 404,
          });
          return;
        }
        let data = {
          role: "admin",
          email: user.email,
          token,
          _id: user._id,
          contact: user.contact,
          address: user.address,
          name: user.name,
          img: user.img ? user?.img : "",
          favouriteProducts: user?.favouriteProducts,
          userId: user?.userId,
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