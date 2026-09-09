import mongoose from "mongoose";
import config from "../config/config.js";

const connectToDB = async () => {
  await mongoose
    .connect(config.DB_URI)
    .then(() => {
      console.log("Server is Connected To DB");
    })
    .catch((err) => {
      console.log("unable to Connect To Db");
    });
};

export default connectToDB;
