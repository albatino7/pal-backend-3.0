import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
};

export default config;
