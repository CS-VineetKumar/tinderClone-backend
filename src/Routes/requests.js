const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUser = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatuses = ["ignore", "interested"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }

    // Check if the two user is valid
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // If there is already a connection request from the user
    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: fromUser, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUser },
      ],
    });
    if (existingRequest) {
      return res.status(400).send({
        message: "Connection request already sent",
      });
    }

    const connectionRequest = new ConnectionRequestModel.create({
      fromUserId: fromUser,
      toUserId: toUserId,
      status: status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user.name} is ${status} ${toUser.name}`,
      data,
    });
  } catch (error) {
    return res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = requestsRouter;
