const UserModel = require("../models/user-model");
const AdminModel = require("../models/admin-model");
const jwt = require("jsonwebtoken");
const trycatch = require("./tryCatch");

module.exports.protect = (...roles) =>
  trycatch(async (req, res, next) => {
    const jwtoken = req.headers.jwtoken;
    const { _id, role } = await jwt.verify(jwtoken, process.env.jwtKey);
    console.log(role, _id);
    if (roles.includes(role)) {
      if (role == "admin") {
        const admin = await AdminModel.findById(_id);
        if (!admin) return res.status(401).json({ authorized: false });
        req.user = admin;
        next();
      } else if (role == "user") {
        let user = await UserModel.findById(_id);
        if (!user) return res.status(401).json({ authorized: false });
        user.role = role;
        req.user = user;
        next();
      }
    } else {
      return res.status(403).json({ permission: false });
    }
  });
