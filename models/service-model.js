var mongoose = require("mongoose");
var ServiceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    img: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
var ServiceModel = mongoose.model("services", ServiceSchema);
module.exports = ServiceModel;
