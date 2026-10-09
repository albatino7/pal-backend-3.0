import Razorpay from "razorpay";
import { config } from "./config.js";

// console.log("Key ID:", config.RAZORPAY_KEY_ID);
// console.log("Secret loaded:", Boolean(config.RAZORPAY_KEY_SECRET));
// console.log("Secret length:", config.RAZORPAY_KEY_SECRET?.length);

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export default razorpay;
