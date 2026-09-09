import jwt, { decode } from "jsonwebtoken";
import config from "../config/config.js";

export const genrateToken = ({ userID }) => {
  const accessToken = jwt.sign({ userid: userID }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userid: userID },
    config.REFESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  return { accessToken, refreshToken };
};

export const veryAccessToken = (token) => {
  const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    const error = new Error("access token is Invalid");
    error.status = 400;
    throw error;
  }
  return { decoded };
};

export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, config.REFESH_TOKEN_SECRET);

  if (!decoded) {
    const error = new Error("Your Refresh Token is Invalid");
    error.status = 400;
    throw error;
  }

  return { decoded };
};
