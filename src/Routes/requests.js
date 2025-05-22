const express = require("express");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestsRouter.post("/sendRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Send request");

  res.status(200).send(user.firstName + " sent the request");
});

module.exports = requestsRouter;
