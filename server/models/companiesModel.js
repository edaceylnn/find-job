import mongoose, { Schema } from "mongoose";
import validator from "validator";
import authPlugin from "./plugins/authPlugin.js";

const companySchema = new Schema({
  name: {
    type: String,
    required: [true, "Company Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least"],
    select: true,
  },
  contact: { type: String },
  location: { type: String },
  about: { type: String },
  profileUrl: { type: String },
  jobPosts: [{ type: Schema.Types.ObjectId, ref: "Jobs" }],
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
});

companySchema.plugin(authPlugin);

companySchema.index({ name: 1 });
companySchema.index({ location: 1 });

const Companies = mongoose.model("Companies", companySchema);

export default Companies;
