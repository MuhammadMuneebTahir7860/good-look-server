const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: Object,
      // refPath: "senderType",
      required: true,
      ref:"users",
    },
    senderType: {
      type: String,
      enum: [ "users"],
    },
    content: {
      type: String,
      trim: true,
      // required: true,
    },
    images: {
      type: Array,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    readBy: [
      {
        type: Object,
        // refPath: "readerType",
        ref:'users'
      },
    ],
    readerType: {
      type: String,
      enum: ["users"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
