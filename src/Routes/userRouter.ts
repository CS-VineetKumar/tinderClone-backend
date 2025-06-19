import express, { Response } from 'express';
import { userAuth } from '../middlewares/auth';
import ConnectionRequestModel from '../models/connectionRequest';
import UserModel from '../models/user';
import { AuthenticatedRequest, IConnectionRequest } from '../types';

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age photo about";

userRouter.get("/feed", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    let limit = parseInt(req.query.limit as string);
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

    for (const connectionReq of connectionRequests) {
      excludedUserIds.add((connectionReq as IConnectionRequest).fromUserId.toString());
      excludedUserIds.add((connectionReq as IConnectionRequest).toUserId.toString());
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

    res.status(200).json(users);
  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).send("Something went wrong");
  }
});

userRouter.get("/request", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.user!;

    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });
    // .populate("fromUserId",["firstName","lastName"])  string separated by space will also work
    if (!connectionRequest) {
      res.status(404).json({ message: "No connection request" });
      return;
    }
    res
      .status(201)
      .json({ message: "Incoming Request found!!", data: connectionRequest });
  } catch (error) {
    res.status(400).send("ERROR : " + (error as Error).message);
  }
});

userRouter.get("/connections", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const loggedInUser = req.user!;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    if (!connectionRequest) {
      res.status(404).json({ message: "No connections" });
      return;
    }

    const data = connectionRequest.map((row) => {
      const typedRow = row as IConnectionRequest & { fromUserId: any; toUserId: any };
      if (typedRow.fromUserId.firstName === loggedInUser.firstName) {
        return typedRow.toUserId;
      }
      return typedRow.fromUserId;
    });
    res
      .status(200)
      .json({ message: "Connection data fetched", data: data });
  } catch (error) {
    res.status(400).send("ERROR : " + (error as Error).message);
  }
});

export default userRouter; 