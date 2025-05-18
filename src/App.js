const express = require("express");

const app = express();

//Request Handler
app.use("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.get("/user", (req, res) => {
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  res.send("User created");
});

app.delete("/user", (req, res) => {
  res.send("User deleted");
});

app.use("/", (req, res) => {
  res.send("Hey, hey, hey!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
