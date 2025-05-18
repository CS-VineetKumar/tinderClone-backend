const express = require("express");

const app = express();

//Request Handler
app.use("/test", (req, res) => {
  res.send("Hello, from the server!");
});

app.use("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.use("/", (req, res) => {
  res.send("Hey, hey, hey!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
