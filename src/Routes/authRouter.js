const express = require("express");
const authRouter = express.Router();

const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateSignupData } = require("../utils/validations");
const UserModel = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.status(200).send({ user: user });
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

// Login user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    } else {
      // Create JWT token here
      const token = await user.getJWT();
      // Add cookie here
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true, // only for local host or without https
      });
      res.status(200).send({ user: user });
    }
  } catch (error) {
    res.status(400).send("Something went wrong :" + error.message);
  }
});

// Logout user
authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token", { expires: new Date(Date.now()) });
  res.status(200).send("Logout successful");
});

module.exports = authRouter;
