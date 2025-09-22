const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

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

module.exports = userRouter;
