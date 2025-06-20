import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
import { AuthenticatedRequest, JwtPayload } from '../types';

const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token } = req.cookies;
    if (!token) {
      res.status(401).send("Please Login!");
      return;
    }

    // console.log("🔐 Token received:", token);
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    const decodedObj = await jwt.verify(token, jwtSecret) as JwtPayload;

    const { _id } = decodedObj;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR : " + (error as Error).message);
  }
};

export { userAuth }; 