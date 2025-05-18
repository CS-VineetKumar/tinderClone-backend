const express = require("express");

const app = express();

// Advanced routing example
// Express 5 and above these are not supported
// ?, +, * can be added to the route path
// ? - Matches 0 or 1 of the preceding character
// + - Matches 1 or more of the preceding character
// * - Matches 0 or more of the preceding character
// Example: /ab?c - Matches /abc and /ac

app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send({ firstname: "John", lastname: "Doe" });
});

app.use("/", (req, res) => {
  res.send("Hey, hey, hey!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
