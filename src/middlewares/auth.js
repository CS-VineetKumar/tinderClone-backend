const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // console.log("🔐 Token received:", token);
    const decodedObj = await jwt.verify(token, "TinderClone@123");

    const { _id } = decodedObj;
    const user = await UserModel.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
};

module.exports = {
  userAuth,
};
