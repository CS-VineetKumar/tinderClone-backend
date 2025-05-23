const moongoose = require("mongoose");

const connectionRequestSchema = new moongoose.Schema(
  {
    fromUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "accepted", "rejected", "interested"],
      },
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  // Check if fromUser is same as toUser
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
  next();
  // Check if the connection request already exists
  // const existingRequest = await ConnectionRequestModel.findOne({
  //     $or: [
  //         { fromUserId: connectionRequest.fromUserId, toUserId: connectionRequest.toUserId },
  //         { fromUserId: connectionRequest.toUserId, toUserId: connectionRequest.fromUserId },
  //     ],
  // });
  // if (existingRequest) {
  //     throw new Error("Connection request already exists");
  // }
  // // Check if the status is valid
  // const allowedStatuses = ["ignore", "accepted", "rejected", "interested"];
  // if (!allowedStatuses.includes(connectionRequest.status)) {
  //     throw new Error("Invalid status");
  // }
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = new moongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
