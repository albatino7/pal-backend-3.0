import mongoose from "mongoose";

const userShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
  },
  passwordHash: {
    type: String,
    required: [true, "Password is Required"],
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
    enum: ["seller", "user"],
  },
});

export const userModel = mongoose.model("usrs", userShema);
