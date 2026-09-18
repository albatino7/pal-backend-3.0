import mongoose from "mongoose";
import { config } from "../config/config.js";

export const ConnectToDB = async () => {
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("Server is Connected to Db");
    })
    .catch((err) => {
      console.log(err);
    });
};
