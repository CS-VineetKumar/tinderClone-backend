const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");

const UserModel = require("./models/user");

// Important as this will Middleware will help us use the JSON data in the request body
const app = express();

const authRouter = require("./Routes/authRouter");
const profileRouter = require("./Routes/profileRouter");
const requestsRouter = require("./Routes/requestsRouter");
const userRouter = require("./Routes/userRouter");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestsRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
  });
