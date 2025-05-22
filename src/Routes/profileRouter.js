const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const { validateEditProfileData } = require("../utils/validations");

// Profile API for logged in user
profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

// Update user data
profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();

    res.status(200).send({
      message: `${user.firstName} updated the profile`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

// Update user password
profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    const isPasswordMatch = await user.validatePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    } else {
      //Encrypt the password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      user.password = passwordHash;
      await user.save();
      res.clearCookie("token", { expires: new Date(Date.now()) });
      res.status(200).send("Password updated successfully");
    }
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

// Delete user by ID
profileRouter.delete("/deleteUser", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.body.userId);
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted");
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = profileRouter;
