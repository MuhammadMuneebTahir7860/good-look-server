var mongoose = require("mongoose");
var UserSchema = mongoose.Schema({
  fullName: {
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
