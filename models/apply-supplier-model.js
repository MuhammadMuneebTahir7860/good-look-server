var mongoose = require("mongoose");
var ApplySupplierSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
  business: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});
var ApplySupplierSchema = mongoose.model("apply-supplier", ApplySupplierSchema);
module.exports = ApplySupplierSchema;
