import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const genrateToken = ({ userId, role }) => {
  const accesToken = jwt.sign({ userId, role }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId, role }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { refreshToken, accesToken };
};

export const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    const error = new Error("Token is invalid by VerifyAccesToken");
    error.status = 404;
    throw error;
  }

  return decoded;
};

export const VerifyrefreshToken = (token) => {
  const decoded = jwt.verify(token, config.REFRESH_TOKEN_SECRET);

  if (!decoded) {
    const error = new Error("Invalid RefreshToken userside");
    error.status = 401;
    throw error;
  }
  return decoded;
};
