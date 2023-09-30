var mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "users",
  //   required: true,
  // },
  // sellerId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "users",
  //   required: true,
  // },
  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "product",
  // // },
  // billingDetail: {
  //   type: Object,
  // },
  // img: {
  //   type: String,
  // },
  isApproved: {
    type: Boolean,
    default: false,
  },
  paymentApproved: {
    type: Boolean,
    default: false,
  },
  // amount: {
  //   type: Number,
  //   required: true,
  // },
  name: {
    type: String
  },
  email: {
    type: String
  }, date: {
    type: String
  }, time: {
    type: String
  },
  service: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("orders", OrderSchema);
