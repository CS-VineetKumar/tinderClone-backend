const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age photo about";

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let genderFind = "";
    if (loggedInUser.gender == "male") {
      genderFind = "female";
    } else if (loggedInUser.gender == "female") {
      genderFind = "male";
    } else {
      genderFind = "others";
    }
    const users = await UserModel.find({ gender: genderFind })
      .limit(10)
      .select("firstName lastName age photo about");
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

userRouter.get("/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });
    // .populate("fromUserId",["firstName","lastName"])  string separated by space will also work
    if (!connectionRequest) {
      return res.status(404).json({ message: "No connection request" });
    }
    return res
      .status(201)
      .json({ message: "Incoming Request found!!", data: connectionRequest });
  } catch (error) {
    return res.status(400).send("ERROR : " + error.message);
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (!connectionRequest) {
      return res.status(404).json({ message: "No connections" });
    }

    const data = connectionRequest.map((row) => {
      if (row.fromUserId.firstName === loggedInUser.firstName) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    return res
      .status(200)
      .json({ message: "Connection data fetched", data: data });
  } catch (error) {
    return res.status(400).send("ERROR : " + error.message);
  }
});

module.exports = userRouter;
