const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
      res.cookie("token", token).send("Login Successful");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, { expires: new Date(Date.now()) })
      .send("user Logged Out");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = authRouter;
