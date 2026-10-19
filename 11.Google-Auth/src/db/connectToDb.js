import mongoose from "mongoose";
import config from "../config/config.js";

export const connectToDb = async () => {
  mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("connected TO dB ");
    })
    .catch((err) => {
      console.log("unable to connect", err);
    });
};
