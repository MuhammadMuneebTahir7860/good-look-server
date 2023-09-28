const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
  createChatAndSendMessage,
  accessExistingChat,
  addDoctor,
  removeDoctor,
} = require("../controllers/chatControllers");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/").post(protect("user"), accessChat);
// router.route("/createChatAndSendMessage").post(protect("user"), createChatAndSendMessage);
router.route("/").get(protect("user"), fetchChats);
router
  .route("/accessExistingChat/:userId")
  .get(protect("user"), accessExistingChat);
// router.route("/group").post(createGroupChat);
// router.route("/rename").put(renameGroup);
// router.route("/groupremove").put(removeFromGroup);
// router.route("/groupadd").put(addToGroup);
// router.route("/addDoctor").put(protect("admin"), addDoctor);
// router.route("/removeDoctor").put(protect("admin"), removeDoctor);

module.exports = router;
