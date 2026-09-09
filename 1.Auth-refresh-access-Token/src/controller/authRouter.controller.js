import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import {
  genrateToken,
  verifyRefreshToken,
  veryAccessToken,
} from "../utils/auth.js";

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExisted = await userModel.findOne({ email: email });

    if (userExisted) {
      const error = new Error("User is Already ExistedInDd");
      error.status = 400;
      throw error;
    }

    const user = await userModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const userID = user._id;

    const { accessToken, refreshToken } = genrateToken({ userID });

    user.refreshToken = refreshToken;
    user.save();

    res.cookie("refreshToken", refreshToken);

    res.status(200).json({
      message: "user is created Sucessfully",
      user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExisted = await userModel.findOne({ email });
    if (!userExisted) {
      const error = new Error("user is not found In DB");
      error.status = 400;
      throw error;
    }

    const chechPassword = await bcrypt.compare(password, userExisted.password);
    if (!chechPassword) {
      const error = new Error("your Password is Wrong");
      error.status = 400;
      throw error;
    }
    const userID = userExisted._id;
    const { accessToken, refreshToken } = genrateToken({ userID });

    res.cookie("refreshToken", refreshToken);

    userExisted.refreshToken = refreshToken;
    userExisted.save();

    res.status(200).json({
      message: "User loginSucessfully",
      Data: {
        user: {
          name: userExisted.name,
          email: userExisted.email,
        },
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshController = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const { decoded } = verifyRefreshToken(refreshToken);

    const user = await userModel.findOne({ _id: decoded.userid });

    if (!user) {
      const error = new Error("user id not valid");
      error.status = 400;
      throw error;
    }
    // console.log(user.refreshToken);
    // console.log(refreshToken);

    if (refreshToken != user.refreshToken) {
      user.refreshToken = null;
      user.save();

      return res.status(409).json({
        message: "somenthing went wrong with refresh Token",
      });
    }
    const userID = user._id;
    const { refreshToken: newRefreshToken, accessToken } = genrateToken({
      userID,
    });

    res.cookie("refreshToken", newRefreshToken);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      message: "Refresh token and access Token is genrarated Sucessfully",
      newRefreshToken: newRefreshToken,
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const getmeControllers = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    const { decoded } = veryAccessToken(accessToken);

    //   const { email, password } = req.body;
    const userID = decoded.userid;
    const userExisted = await userModel.findOne({ _id: userID });

    if (!userExisted) {
      const error = new Error("User is not Found IN db");
      error.status = 400;
      throw error;
    }

    res.status(200).json({
      mesage: "user Details feteched Sucessfully",
      userExisted,
    });
  } catch (error) {
    next(error);
  }
};
