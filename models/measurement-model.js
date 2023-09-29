var mongoose = require("mongoose");
var MeasurementSchema = mongoose.Schema(
  {
    userData: { type: Object },
    kameezLength: String,
    arms: String,
    teera: String,
    Kalar: String,
    gheera: String,
    chest: String,
    waist: String,
  },
  { timestamps: true }
);
var MeasurementSchema = mongoose.model("measurements", MeasurementSchema);
module.exports = MeasurementSchema;
