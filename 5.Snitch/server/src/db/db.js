import mongoose from "mongoose";
import { config } from "../config/config.js";

export const connectToDB = async () => {
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("Server is Conncted To Database ");
    })
    .catch((error) => {
      console.log("Unable to Connect To Db", error);
    });
};
