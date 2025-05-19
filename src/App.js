const express = require("express");

const { connectDB } = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Vineet",
    lastName: "Kumar",
    email: "vineet.kumar@crownstack.com",
    password: "vineet123",
    age: 25,
    gender: "Male",
  };
  // creating a new instance of the UserModel
  const user = new UserModel(userObj);
  await user.save();
  res.status(200).send("User Created");
});

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
