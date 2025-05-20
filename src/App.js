const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { connectDB } = require("./config/database");
const { validateSignupData } = require("./utils/validations");

const UserModel = require("./models/user");

// Important as this will Middleware will help us use the JSON data in the request body
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignupData(req);
    const { firstName, lastName, email, password, gender, age } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Password Hash: ", passwordHash);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
      gender,
      age,
    });
    await user.save();
    res.status(200).send("User Created");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
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

// Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send("Invalid credentials");
    }
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send("Something went wrong :" + error.message);
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
