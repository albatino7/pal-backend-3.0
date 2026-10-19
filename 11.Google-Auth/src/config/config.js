import dotenv from "dotenv";

dotenv.config();

const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

  DB_URI: process.env.DB_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 3000,
};

export default config;
