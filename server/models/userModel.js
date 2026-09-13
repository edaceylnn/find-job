import mongoose, { Schema } from "mongoose";
import validator from "validator";
import authPlugin from "./plugins/authPlugin.js";

//schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    accountType: { type: String, default: "seeker" },
    contact: { type: String },
    location: { type: String },
    profileUrl: { type: String },
    cvUrl: { type: String },
    jobTitle: { type: String },
    about: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
  },
  { timestamps: true }
);

userSchema.plugin(authPlugin);

const Users = mongoose.model("Users", userSchema);

export default Users;
