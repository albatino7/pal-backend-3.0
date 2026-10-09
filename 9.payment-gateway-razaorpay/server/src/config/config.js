import dotenv from "dotenv";
dotenv.config();

export const config = {
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  DB_URI: process.env.DB_URI,
};
