import express, { Response } from 'express';
import bcrypt from 'bcrypt';
import { userAuth } from '../middlewares/auth';
import UserModel from '../models/user';
import { validateEditProfileData } from '../utils/validations';
import { AuthenticatedRequest, EditProfileData, PasswordUpdateData } from '../types';

const profileRouter = express.Router();

// Profile API for logged in user
profileRouter.get("/view", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send("ERROR :" + (error as Error).message);
  }
});

// Update user data
profileRouter.patch("/edit", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const user = req.user!;

    // Type-safe way to update user properties
    const allowedFields: (keyof EditProfileData)[] = ['firstName', 'lastName', 'gender', 'age', 'about', 'photo', 'skills'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        (user as any)[field] = req.body[field];
      }
    });
    
    await user.save();

    res.status(200).send({
      message: `${user.firstName} updated the profile`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR :" + (error as Error).message);
  }
});

// Update user password
profileRouter.patch("/password", userAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword }: PasswordUpdateData = req.body;
    const user = req.user!;
    const isPasswordMatch = await user.validatePassword(oldPassword);
    if (!isPasswordMatch) {
      res.status(401).send("Invalid credentials");
      return;
    } else {
      //Encrypt the password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      await user.save();
      res.clearCookie("token", { expires: new Date(Date.now()) });
      res.status(200).send("Password updated successfully");
    }
  } catch (error) {
    res.status(400).send("ERROR :" + (error as Error).message);
  }
});

// Delete user by ID
profileRouter.delete("/deleteUser", async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.body.userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    } else {
      res.status(200).send("User deleted");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

export default profileRouter; 