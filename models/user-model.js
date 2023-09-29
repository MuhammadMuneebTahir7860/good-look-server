var mongoose = require("mongoose");
var UserSchema = mongoose.Schema({
  fullName: {
<<<<<<< HEAD
=======
    type: String,
  },
  address: {
    type: String,
  },
  img: {
>>>>>>> e7778718d3c1966f317c3915cc14f885234b4ff0
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: 0,
  },
   createAt: {
    type: Date,
    default: Date.now(),
  },
});
var UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
