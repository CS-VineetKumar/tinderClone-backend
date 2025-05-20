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

// Get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user by ID
app.delete("/user", async (req, res) => {
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

app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update user data
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "about",
      "photo",
      "skills",
      "password",
      "age",
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => {
      ALLOWED_UPDATES.includes(k);
    });
    if (!isUpdateAllowed) {
      throw new Error("Invalid update");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills length should be less than 10");
    }
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User updated");
    }
  } catch (error) {
    res.status(400).send("UPDATE FAILED : " + error);
  }
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
