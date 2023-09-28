const asyncHandler = require("../middlewares/tryCatch");
const Message = require("../models/messageModel");
const User = require("../models//user-model");
const Admin = require("../models/admin-model");
const Chat = require("../models/chatModel");
const mongoose = require("mongoose");
const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
var admin = require("firebase-admin");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    let { limit, page } = req.query;
    if (!limit) limit = 10;
    if (!page) page = 1;
    limit = parseInt(limit);
    let skip = limit * (page - 1);
    const chatId = req.params.chatId;
    // check if chatId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid chat ID" });
    }
    // check if chat with chatId exists in the database
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("chat")
      .populate({
        path: "sender",
        select: "-password",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    // Fetch details from User model
    const userIds = messages.map((message) => message.sender);
    const users = await User.find({ _id: { $in: userIds } }).select(
      "-password"
    );
    // Fetch details from Doctor model
    // const doctorIds = messages.map((message) => message.sender);
    // const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
    //   "-password"
    // );
    // Fetch details from Admin model
    // const adminIds = messages.map((message) => message.sender);
    // const admins = await Admin.find({ _id: { $in: adminIds } }).select(
    //   "-password"
    // );

    // Merge the user, doctor, and admin details into a single array
    const populatedSenders = [...users];

    // Update the sender details in each message
    messages.forEach((message) => {
      const sender = populatedSenders.find((sender) =>
        sender.equals(message.sender)
      );
      message.sender = sender;
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, images } = req.body;
  // if (!content || !chatId || images.length == 0) {
  //   console.log("Invalid data passed into request");
  //   return res.sendStatus(400);
  // }
  const findChat = await Chat.findOne({ _id: chatId });
  var newMessage = {
    sender: req.user._id,
    content: content,
    images: images,
    chat: chatId,
    readBy: findChat?.users?.slice(1),
  };
  let userType = req.user.role;
  if (userType == "doctor") {
    userType = "Doctor";
  } else if (userType == "") {
    userType = "admin";
  }
  try {
    var message = await Message.create(newMessage);
    const senderModel = getModelForUserRole(req.user.role);
    await senderModel.populate(message, {
      path: "sender",
      select: "-password",
    });
    // message = await message.populate("sender", "name photo").execPopulate();
    // message = await message.populate("Chat").execPopulate();
    // Populate the readBy array of users from different collections
    const readByUserIds = message.readBy.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );

    const [populatedUsersFromUser] = await Promise.all(
      [
        User.find({ _id: { $in: readByUserIds } }).select("-password"),
        // Admin.find({ _id: { $in: readByUserIds } }).select("-password"),
      ]
    );

    const populatedUsers = [
      ...populatedUsersFromUser,
      // ...populatedUsersFromAdmin,
    ];
    message.readBy = populatedUsers;
    message.chat.users = [message.sender, ...populatedUsers];
    
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    // const messageNoti = {
    //   data: {
    //     title: "DoctorYab Portal",
    //     body: `${
    //       message?.chat?.chatName !== "sender" &&
    //       "Group " + message?.chat?.chatName
    //     } \n${message?.sender?.name ? message?.sender?.name : "Admin"}: ${
    //       message?.images?.length > 0 ? "sent an image" : message?.content
    //     }`,
    //     messageData: JSON.stringify(newMessage),
    //     chat: JSON.stringify(chat),
    //     purpose: "send-message",
    //   },
    // };
    // // Iterate over each FCM token in message.readBy array
    message.readBy.forEach((token) => {
      if (token?.fcm) {
        admin.messaging().sendToDevice(token.fcm, messageNoti, {
          priority: "high",
          contentAvailable: true,
          timeToLive: 60 * 60 * 24,
        });
      }
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Helper function to get the appropriate model for the given user role
function getModelForUserRole(role) {
  let model;
  switch (role) {
    case "admin":
      model = Admin;
      break;
    default:
      model = User;
      break;
  }
  return model;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "./public/chat";

    // Check if the "chat" folder exists
    if (!fs.existsSync(folderPath)) {
      // Create the "chat" folder if it doesn't exist
      fs.mkdirSync(folderPath, { recursive: true });
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    req.uuid = uuid();
    if (!req.uuids) req.uuids = [];
    req.uuids.push(`${req.uuid}.${file.mimetype.split("/")[1]}`);
    cb(null, `${req.uuid}.${file.mimetype.split("/")[1]}`);
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png")
    return cb(null, true);
  req.imgIsNotOk = 1;
  cb(null, false);
};

const upload = multer({
  storage,
  limits: { fileSize: 20971520, files: 20 },
  fileFilter,
});

const uploaded = asyncHandler(async (req, res) => {
  if (req.imgIsNotOk) {
    return res.status(400).json({ msg: "please upload jpeg or png file." });
  }
  let images = [];
  req.uuids.forEach((path) => {
    images.push(`/chat/${path}`);
  });
  res.status(200).json(images);
});

module.exports = { allMessages, sendMessage, uploaded, upload };
