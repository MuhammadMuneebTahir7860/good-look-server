const express = require("express");
const {
  allMessages,
  sendMessage,
  uploaded,
  upload,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.route("/:chatId").get(protect("user"), allMessages);
router.route("/").post(protect("user"), sendMessage);
router.route("/imgs").post(protect("user"), upload.array("imgs", 20), uploaded);
module.exports = router;
