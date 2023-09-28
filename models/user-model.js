var mongoose = require("mongoose");
var UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  img: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: 0,
  },
  favouriteProducts: {
    type: Array,
  },
  isVerified: {
    type: Boolean,
    defaul: false,
  },
  publish: {
    type: Boolean,
    default: false,
  },
  feedbacks: {
    type: Array,
  },
  overAllRating: {
    type: String,
    default: 0,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
var UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
