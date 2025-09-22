const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      if (fromUserId.equals(toUserId)) {
        return res
          .status(470)
          .send({ message: `Connot send connection request to yourself` });
      }

      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        return res.status(500).json(`invalid status type : ${status}`);
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(500).send({ message: `request already present` });
      }
      const data = await connectionRequest.save();

      res.json({
        message: "connection Request send",
        data,
      });
    } catch (err) {
      res.status(400).send("error:" + err.message);
      console.log(err);
    }
  }
);

module.exports = requestRouter;
