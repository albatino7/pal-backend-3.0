import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFESH_TOKEN_SECRET: process.env.REFESH_TOKEN_SECRET,
};

export default config;
