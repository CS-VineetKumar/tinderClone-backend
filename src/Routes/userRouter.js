const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age photo about";

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit);
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // Match opposite gender or use default preference logic
    let genderFind = "";
    if (loggedInUser.gender === "male") genderFind = "female";
    else if (loggedInUser.gender === "female") genderFind = "male";
    else genderFind = "others";

    // Step 1: Get all userIds involved in connection requests with the current user
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Step 2: Extract all userIds to hide (both sender and receiver IDs)
    const excludedUserIds = new Set([loggedInUser._id.toString()]);

    for (const req of connectionRequests) {
      excludedUserIds.add(req.fromUserId.toString());
      excludedUserIds.add(req.toUserId.toString());
    }

    // Step 3: Query for visible users
    const users = await UserModel.find({
      _id: { $nin: Array.from(excludedUserIds) },
      gender: genderFind,
    })
      .select("firstName lastName age photo gender about")
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json(users);
  } catch (error) {
    console.error("Feed error:", error);
    return res.status(500).send("Something went wrong");
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
