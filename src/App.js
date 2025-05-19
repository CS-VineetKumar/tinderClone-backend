const express = require("express");

const { connectDB } = require("./config/database");
const UserModel = require("./models/user");

// Important as this will Middleware will help us use the JSON data in the request body
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of the UserModel
  const user = new UserModel(req.body);
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
