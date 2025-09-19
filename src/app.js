const express = require("express");
const app = express();
const connectDb = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //validating data
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    //encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);
    //saving user to db
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.send("User added Sucessfully");
  } catch (err) {
    res.status(500).send("ERROR: " + err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    } else {
      const token = await user.getJWT();
      // console.log(token);
      res.cookie("token", token);
      res.send("Login Successful");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
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

app.get("/users", userAuth, async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});

app.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("USER DELETED SUCCESSFULLY");
  } catch (err) {
    res.status(404).send("Something went wrong" + err);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " is sending the Connection request");
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
