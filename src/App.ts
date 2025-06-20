import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';
import cors from 'cors';
import config from './config/environment';

// Important as this will Middleware will help us use the JSON data in the request body
const app = express();

import authRouter from './Routes/authRouter';
import profileRouter from './Routes/profileRouter';
import requestsRouter from './Routes/requestsRouter';
import userRouter from './Routes/userRouter';

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestsRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("MongoDB connected...");
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
  }); 