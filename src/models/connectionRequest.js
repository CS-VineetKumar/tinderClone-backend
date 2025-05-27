const moongoose = require("mongoose");
const UserModel = require("../models/user");

const connectionRequestSchema = new moongoose.Schema(
  {
    fromUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User collection
      required: true,
    },
    toUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromUserName: {
      type: String,
    },
    toUserName: {
      type: String,
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

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  // Check if fromUser is same as toUser
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself");
  }
  // Add the userName to schema and DB
  if (!this.fromUserName || !this.toUserName) {
    const [fromUser, toUser] = await Promise.all([
      UserModel.findById(this.fromUserId).select("firstName"),
      UserModel.findById(this.toUserId).select("firstName"),
    ]);

    if (!fromUser || !toUser) {
      throw new Error("User not found when putting usernames.");
    }

    this.fromUserName = fromUser.firstName;
    this.toUserName = toUser.firstName;
  }
  next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = new moongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
