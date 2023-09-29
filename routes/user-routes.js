const express = require("express");
const { protect } = require("../middlewares/auth");

const User = require("../controllers/user-ctrl");

const router = express.Router();

router.post("/signup", User.userSignup);
router.post("/login", User.login);
router.post("/getLoggedInUser", User.getLoggedInUser);
router.put("/addFavourite", User.addFavourite);
router.put("/removeFavourite", User.removeFavourite);
router.get("/getAllUsers", User.getAllUsers);
router.put("/updateUser", User.updateUser);
router.delete("/deleteUser/:id", protect("admin"), User.deleteUser);
router.put("/giveFeebback", User.giveFeedback);
router.get("/getFeedbacks/:id", User.getFeedbacks);
router.put("/deleteFeedback", User.deleteFeedback);
router.put("/updateFeedback", User.updateFeedback);

module.exports = router;
