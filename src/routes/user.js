const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

//get all pending requests for pending users
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const coonnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId._id,
      status: "intrested",
    }).populate("fromUserId", "firstName lastName");
    res.json({ message: "data fetched succesfully", coonnectionRequests });
  } catch (err) {
    res.status(500).send(`ERROR: ` + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUserId._id, status: "accepted" },
        { fromUserId: loggedInUserId._id, status: "accepted" },
      ],
    }).populate("fromUserId", "firstName lastName");
    res.send({ message: "connection found", connectionRequests });
  } catch (err) {
    res.status(500).send(`ERROR: ` + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  //all users except
  //his own
  //his connections
  //ignored people
  //already sent a connection request
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName")
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
