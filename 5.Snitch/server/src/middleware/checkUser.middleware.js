import { verifyAccessToken } from "../utils/genrateToken.js";

export const checkUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    ///keep authorization in small and at postman too
    console.log(accessToken);

    if (!accessToken) {
      const error = new Error("Please send accessToken in Headers");
      error.status = 401;
      throw error;
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded) {
      const error = new Error("Your token is Expired or Invalid ");
      error.status = 401;
      throw error;
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
