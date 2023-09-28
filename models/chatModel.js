const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    reason: { type: String },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: Object,
        // refPath: "userType",
        ref:'users',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      // refPath: "userType",
      ref:"users"
    },
    userType: {
      type: String,
      // required: true,
      enum: [ "users"],
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;