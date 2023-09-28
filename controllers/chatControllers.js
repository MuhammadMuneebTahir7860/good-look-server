const asyncHandler = require("../middlewares/tryCatch");
const Chat = require("../models/chatModel");
const Admin = require("../models/admin-model");
const Message = require("../models/messageModel");
const User = require("../models/user-model");
const mongoose = require("mongoose");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected

const accessChat = asyncHandler(async (req, res) => {
  try {
    const { userId, content, images } = req.body;
    if (!userId) {
      return res.sendStatus({
        statusCode: 400,
        message: "UserId param not sent with request",
      });
    }

    if (content || images) {
      const userIdObject = new mongoose.Types.ObjectId(userId);
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userIdObject],
      };
      const createdChat = await Chat.create(chatData);
      // Send the message
      const newMessage = {
        sender: req.user._id,
        content: content,
        images: images,
        chat: createdChat._id,
        readBy: createdChat?.users?.filter(
          (userId) => !req.user._id.equals(userId)
        ),
      };
      const message = await Message.create(newMessage);
      // Populate the sender user
      const senderModel = getModelForUserRole(req.user.role);
      await senderModel.populate(message, {
        path: "sender",
        select: "-password",
      });

      // Populate the readBy array of users from different collections
      const readByUserIds = message.readBy.map(
        (userId) => new mongoose.Types.ObjectId(userId)
      );

      const [
        populatedUsersFromUser,
        populatedUsersFromDoctor,
        populatedUsersFromAdmin,
      ] = await Promise.all([
        User.find({ _id: { $in: readByUserIds } }).select("-password"),
        // Doctor.find({ _id: { $in: readByUserIds } }).select("-password"),
        Admin.find({ _id: { $in: readByUserIds } }).select("-password"),
      ]);

      const populatedUsers = [
        ...populatedUsersFromUser,
        // ...populatedUsersFromDoctor,
        // ...populatedUsersFromAdmin,
      ];
      message.readBy = populatedUsers;
      createdChat.users = [message.sender, ...populatedUsers];

      const chat = await Chat.findByIdAndUpdate(
        createdChat._id,
        { latestMessage: message },
        { new: true }
      );
      // const messageNoti = {
      //   data: {
      //     title: "DoctorYab Portal",
      //     body: `${message?.chat?.chatName !== 'sender' && 'Group ' + message?.chat?.chatName} \n${message?.sender?.name ? message?.sender?.name : 'Admin'}: ${message?.images?.length > 0 ? 'sent an image' : message?.content}`,
      //     messageData: JSON.stringify(newMessage),
      //     chat: JSON.stringify(chat),
      //     purpose: 'send-message',
      //   },
      // };
      // Iterate over each FCM token in message.readBy array
      message.readBy.forEach((token) => {
        if (token?.fcm) {
          admin.messaging().sendToDevice(token.fcm, messageNoti, {
            priority: "high",
            contentAvailable: true,
            timeToLive: 60 * 60 * 24,
          });
        }
      });
      res.status(200).json({ chat: createdChat, message });
      // }
    }
  } catch (error) {
    res.status(400).json(error);
    throw new Error(error.message);
  }
});

const accessExistingChat = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
    const userIdObject = new mongoose.Types.ObjectId(userId);
    const chat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userIdObject } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .limit(1);
    if (chat.length > 0) {
      const userIds = chat.reduce((userIds, chat) => {
        chat.users.forEach((userId) => userIds.add(userId));
        return userIds;
      }, new Set());
      const [populatedUsers, populatedAdmins] =
        await Promise.all([
          User.find({ _id: { $in: Array.from(userIds) } }).select("-password"),

          Admin.find({ _id: { $in: Array.from(userIds) } }).select("-password"),
        ]);

      const mergedUsers = populatedUsers.concat(
        populatedUsers,
        populatedAdmins
      );
      chat.forEach((chat) => {
        chat.users = mergedUsers.filter((user) => {
          return chat.users.some((chatUser) => user._id.equals(chatUser._id));
        });

        if (chat.latestMessage) {
          chat.latestMessage.sender = mergedUsers.find((user) =>
            user._id.equals(chat.latestMessage.sender)
          );
        }
      });

      res.status(200).json({ chat: chat[0] });
    } else {
      return res.json({ message: "Not found" });
    }
  } catch (error) {
    console.log(error, "error in creating chat");
    res.status(400);
    throw new Error(error.message);
  }
});

// const createChatAndSendMessage = asyncHandler(async (req, res) => {
//   const { content, images, reason } = req.body;
//   try {
//     // Create the chat with all admins
//     const admins = await Admin.find();
//     const adminIds = admins.map((admin) => admin._id);

//     const chatData = {
//       chatName: "chat#" + Date.now(),
//       isGroupChat: true,
//       users: [req.user._id, ...adminIds],
//       reason,
//     };

//     const createdChat = await Chat.create(chatData);
//     console.log(createdChat, "createdChat");
//     // Send the message
//     const newMessage = {
//       sender: req.user._id,
//       content: content,
//       images: images,
//       chat: createdChat._id,
//       readBy: createdChat?.users?.slice(1),
//     };
//     const message = await Message.create(newMessage);
//     // Populate the sender user
//     const senderModel = getModelForUserRole(req.user.role);
//     await senderModel.populate(message, {
//       path: "sender",
//       select: "-password",
//     });

//     // Populate the readBy array of users from different collections
//     const readByUserIds = message.readBy.map((userId) =>
//   

//     );

//     const [
//       populatedUsersFromUser,
//       populatedUsersFromDoctor,
//       populatedUsersFromAdmin,
//     ] = await Promise.all([
//       User.find({ _id: { $in: readByUserIds } }).select("-password"),
//       Doctor.find({ _id: { $in: readByUserIds } }).select("-password"),
//       Admin.find({ _id: { $in: readByUserIds } }).select("-password"),
//     ]);

//     const populatedUsers = [
//       ...populatedUsersFromUser,
//       ...populatedUsersFromDoctor,
//       ...populatedUsersFromAdmin,
//     ];
//     message.readBy = populatedUsers;
//     createdChat.users = [message.sender, ...populatedUsers];

//     await Chat.findByIdAndUpdate(createdChat._id, { latestMessage: message });

//     res.status(200).json({ chat: createdChat, message });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Helper function to get the appropriate model for the given user role
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

// //@description     Fetch all chats for a user
// //@route           GET /api/chat/
// //@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    let { limit, page } = req.query;
    if (!limit) limit = 10;
    if (!page) page = 1;
    limit = parseInt(limit);
    let skip = limit * (page - 1);

    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      // .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
    const userIds = chats.reduce((userIds, chat) => {
      chat.users.forEach((userId) => userIds.add(userId));
      return userIds;
    }, new Set());
    const [populatedUsers] = await Promise.all([
      User.find({ _id: { $in: Array.from(userIds) } }).select("-password"),
      // Admin.find({ _id: { $in: Array.from(userIds) } }).select("-password"),
    ]);
    // console.log(populatedUsers,'users');

    const mergedUsers = populatedUsers.concat(populatedUsers);

    chats.forEach((chat) => {
      // chat.users = mergedUsers.filter((user) => chat.users.includes(user._id));
      // chat.groupAdmin = mergedUsers.find((user) =>
      //   user._id.equals(chat.groupAdmin)
      // );

      if (chat.latestMessage) {
        chat.latestMessage.sender = mergedUsers.find((user) =>
          user._id.equals(chat.latestMessage.sender)
        );
      }
    });
    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// //@description     Create New Group Chat
// //@route           POST /api/chat/group
// //@access          Protected
// const createGroupChat = asyncHandler(async (req, res) => {
//   if (!req.body.users || !req.body.name) {
//     return res.status(400).send({ message: "Please Fill all the feilds" });
//   }

//   var users = JSON.parse(req.body.users);

//   if (users.length < 2) {
//     return res
//       .status(400)
//       .send("More than 2 users are required to form a group chat");
//   }

//   users.push(req.user);

//   try {
//     const groupChat = await Chat.create({
//       chatName: req.body.name,
//       users: users,
//       isGroupChat: true,
//       groupAdmin: req.user,
//     });

//     const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password");

//     res.status(200).json(fullGroupChat);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });

// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
// const renameGroup = asyncHandler(async (req, res) => {
//   const { chatId, chatName } = req.body;

//   const updatedChat = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       chatName: chatName,
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!updatedChat) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(updatedChat);
//   }
// });

// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   // check if the requester is admin

//   const removed = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removed) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(removed);
//   }
// });

// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
// const addToGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   // check if the requester is admin

//   const added = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!added) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(added);
//   }
// });
// const addDoctor = asyncHandler(async (req, res) => {
//   const { doctorId, chatId } = req.body;
//   const doctor = await Doctor.findById(doctorId);
//   const added = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: doctor?._id },
//     },
//     {
//       new: true,
//     }
//   );

//   if (!added) {
//     res.status(404);
//     throw new Error("Doctor Not Found");
//   } else {
//     res.json(doctor);
//   }
//   // console.log(added, "added ");
// });
// const removeDoctor = asyncHandler(async (req, res) => {
//   const { doctorId, chatId } = req.body;
//   const doctor = await Doctor.findById(doctorId);
//   const removed = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: doctor?._id },
//     },
//     {
//       new: true,
//     }
//   );
//   if (!removed) {
//     res.status(404);
//     throw new Error("Doctor Not Found");
//   } else {
//     res.json(removed);
//   }
//   // console.log(added, "added ");
// });
module.exports = {
  accessChat,
  fetchChats,
  //   createChatAndSendMessage,
  //   createGroupChat,
  //   renameGroup,
  //   addToGroup,
  //   removeFromGroup,
  accessExistingChat,
  //   addDoctor,
  //   removeDoctor,
};
