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

// Register model "users" mapping to collection "usrs" so existing MongoDB data is preserved
export const userModel =
  mongoose.models.users || mongoose.model("users", userShema, "usrs");

// Also register "usrs" model alias to maintain backward compatibility
if (!mongoose.models.usrs) {
  mongoose.model("usrs", userShema, "usrs");
}
