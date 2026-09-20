import { userModel } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { genrateToken, VerifyrefreshToken } from "../utils/genrateToken.js";

export const registerController = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const userAlreadyExists = await userModel.findOne({ email: email });

    if (userAlreadyExists) {
      const error = new Error("User AlreadyExist in DB");
      error.status = 400;
      throw error;
    }

    const newUser = await userModel.create({
      email,
      name,
      passwordHash: await bcrypt.hash(password, 10),
    });
    const userId = newUser._id;
    const role = newUser.role;

    const { accesToken, refreshToken } = genrateToken({ userId, role });
    // console.log(accesToken);
    // console.log(refreshToken);

    newUser.refreshToken = refreshToken;
    newUser.save();

    res.cookie("refreshToken", refreshToken);

    res.status(201).json({
      message: "user created Successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        refreshToken: newUser.refreshToken,
        accessToken: accesToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  const userNotExisted = await userModel.findOne({ email }).select("-password");

  if (!userNotExisted) {
    const error = new Error("User not exsisted Please REGISTER");
    error.status = 401;
    throw error;
  }

  const checkPassword = await bcrypt.compare(
    password,
    userNotExisted.passwordHash,
  );

  if (!checkPassword) {
    const error = new Error("Your Password Is wrong");
    error.status = 401;
    throw error;
  }

  const userId = userNotExisted._id;
  const role = userNotExisted.role;
  const { accesToken, refreshToken } = genrateToken({ userId, role });

  // console.log("accessToken ", accesToken);
  // console.log("refreshToken", refreshToken);

  userNotExisted.refreshToken = refreshToken;
  await userNotExisted.save();

  res.cookie("refreshToken", refreshToken);

  res.status(200).json({
    message: "userlogin Sucessfull",
    data: {
      user: userNotExisted._id,
      name: userNotExisted.name,
      email: userNotExisted.email,
      role: userNotExisted.role,
      accesToken,
    },
  });
};

export const refreshController = async (req, res, next) => {
  const refreshTokenClinet = req.cookies.refreshToken;
  // console.log(refreshToken);

  const decoded = VerifyrefreshToken(refreshTokenClinet);
  const { userId, role } = decoded;

  const user = await userModel.findById(userId);
  console.log(user.refreshToken);

  if (refreshTokenClinet !== user.refreshToken) {
    user.refreshToken = null;
    await user.save();
    const error = new Error("refresh token will modified");
    error.status = 401;
    throw error;
  }
  const userRole = user.role;
  const { refreshToken, accesToken } = genrateToken({ userId, userRole });

  res.cookie("refreshToken", refreshToken);

  res.status(200).json({
    message: "RefreshToken is Created Sucessfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accesToken,
      },
    },
  });
};

export const getmeController = async (req, res, next) => {
  console.log("getMeControoler");

  const decoded = req.user;

  const { userId, role } = decoded;

  const user = await userModel.findById(userId);

  res.status(201).json({
    message: "user Details fetch SucessfUlly",

    data: {
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
        role: user.role,
      },
    },
  });
};
