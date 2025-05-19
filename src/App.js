const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

// Difference in app.use vs app.all
// handle Auth Middleware for all admin routes
app.use("/admin", adminAuth);
app.use("/user", userAuth);

// Middelware is used so that we don't have to check for Authorization in each of the api call
app.get("/admin/getAllData", (req, res) => {
  res.send("All User Data");
});

app.get("/admin/DeleteUser", (req, res) => {
  res.send("Delete All User Data");
});

app.get("/user/getUserData", (req, res) => {
  res.send("User Data Fetcher");
});

app.get("/user/DeleteUser", (req, res) => {
  res.send("Delete User Data");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
