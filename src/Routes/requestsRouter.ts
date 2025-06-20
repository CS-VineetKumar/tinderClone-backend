import express, { Response } from 'express';
import { userAuth } from '../middlewares/auth';
import ConnectionRequestModel from '../models/connectionRequest';
import UserModel from '../models/userSQL';
import { AuthenticatedRequest } from '../types';

const requestsRouter = express.Router();

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const fromUser = req.user!.id;
    const toUserId = parseInt(req.params.toUserId);
    const status = req.params.status;

    const allowedStatuses = ["ignore", "interested"];
    if (!allowedStatuses.includes(status)) {
      res.status(400).send({ message: "Invalid status" });
      return;
    }

    // Check if the two user is valid
    const toUser = await UserModel.findById(toUserId);
    if (!toUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If there is already a connection request from the user
    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId: fromUser, toUserId: toUserId },
        { fromUserId: toUserId, toUserId: fromUser },
      ],
    });
    if (existingRequest) {
      res.status(400).send({
        message: "Connection request already sent",
      });
      return;
    }

    const connectionRequest = await ConnectionRequestModel.create({
      fromUserId: fromUser,
      toUserId: toUserId,
      status: status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: `${req.user!.firstName} is ${status} ${toUser.firstName}`,
      data,
    });
  } catch (error) {
    res.status(400).send("ERROR : " + (error as Error).message);
  }
});

requestsRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const loggedInUser = req.user!;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        res.status(400).json({ message: "Status not allowed!" });
        return;
      }
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser.id,
        status: "interested",
      });
      if (!connectionRequest) {
        res.status(404).json({ message: "No connection request" });
        return;
      }
      connectionRequest.status = status as 'accepted' | 'rejected';
      const data = await connectionRequest.save();
      res.status(201).json({ message: "Connection Request " + status, data });
    } catch (error) {
      res.status(400).send("ERROR : " + (error as Error).message);
    }
  }
);

export default requestsRouter; 