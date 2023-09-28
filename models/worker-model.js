var mongoose = require("mongoose");
var WorkerSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    img: {
      type: String,
    },
    workTitle:{
      type: String,
    },
  },
  { timestamps: true }
);
var WorkerModel = mongoose.model("workers", WorkerSchema);
module.exports = WorkerModel;
