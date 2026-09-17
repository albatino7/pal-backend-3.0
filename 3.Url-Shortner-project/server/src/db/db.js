import mongoose from "mongoose";
import config from "../config/config.js";

const connectToDB = async () => {
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("sever IS Connected to db");
    })
    .catch(() => {
      console.log("unable to connected to server ");
    });
};

export default connectToDB;
