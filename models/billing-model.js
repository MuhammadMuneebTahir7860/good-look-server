var mongoose = require("mongoose");
var BillingsSchema = mongoose.Schema(
  {
    billings: {
      type: Array,
      required: true,
    },
    userData: { type: Object },
  },
  { timestamps: true }
);
var BillingsSchema = mongoose.model("billings", BillingsSchema);
module.exports = BillingsSchema;
