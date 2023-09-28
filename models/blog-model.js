var mongoose = require("mongoose");
var BlogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    required: true,
  },
  // author: {
  //   type: String,
  //   required: true,
  // },
  blogComment: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
var BlogSchema = mongoose.model("blog", BlogSchema);
module.exports = BlogSchema;
