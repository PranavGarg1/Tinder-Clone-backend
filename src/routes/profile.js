const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});

profileRouter.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("USER DELETED SUCCESSFULLY");
  } catch (err) {
    res.status(404).send("Something went wrong" + err);
  }
});

profileRouter.get("/user", userAuth, async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.find({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("NO USERS FOUND");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("USER NOT FOUND");
  }
});

profileRouter.get("/users", userAuth, async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).send("NO USERS");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("USER NOT FOUND");
  }
});

module.exports = profileRouter;
