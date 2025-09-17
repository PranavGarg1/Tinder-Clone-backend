const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Pranav",
    lastName: "Garg",
    emailId: "Pg@gmail.com",
    password: "12345",
    age: 25,
    gender: "Male",
  });
  await user.save();
  res.send("User added Sucessfully");
});

connectDb()
  .then(() => {
    console.log("Connected to database");
    app.listen(3000, () => {
      console.log(`app is listening on port 3000`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });
