const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("User added Sucessfully");
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.find({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("NO USERS FOUND");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(500).send("USER NOT FOUND");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).send("NO USERS");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(500).send("USER NOT FOUND");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("USER DELETED SUCCESSFULLY");
  } catch (err) {
    res.status(404).send("Something went wrong" + err);
  }
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
