var mongoose = require("mongoose");
var AdminSchema = mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: 0,
  },
  images: {
    type: Array,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
var AdminModel = mongoose.model("admins", AdminSchema);
module.exports = AdminModel;
