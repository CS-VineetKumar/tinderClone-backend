const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

// Profile API for logged in user
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});

module.exports = profileRouter;
