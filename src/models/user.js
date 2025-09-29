const mongoose = require("mongoose");
const valilidator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!valilidator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    age: { type: Number },
    photoUrl: {
      type: String,
      default:
        "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png",
    },
    gender: {
      type: String,
      uppercase: true,
      enum: {
        values: ["MALE", "FEMALE", "OTHER"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Pranshu@92", {
    expiresIn: "1d",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
