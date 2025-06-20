import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Important as this will Middleware will help us use the JSON data in the request body
const app = express();

import authRouter from './Routes/authRouter';
import profileRouter from './Routes/profileRouter';
import requestsRouter from './Routes/requestsRouter';
import userRouter from './Routes/userRouter';

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  throw new Error('FRONTEND_URL environment variable is required');
}

app.use(
  cors({
    origin: frontendUrl,
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
    const port = process.env.PORT;
    if (!port) {
      throw new Error('PORT environment variable is required');
    }
    app.listen(parseInt(port), () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error: ", err);
  }); 