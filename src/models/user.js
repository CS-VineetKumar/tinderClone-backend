const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (["male", "females", "others"].includes(value)) {
          throw new Error("Gender data is invalid");
        }
      },
    },
    about: {
      type: String,
      default: "The default about for the user",
    },
    photo: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("ImageUrl is invalid: " + value);
        }
      },
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
