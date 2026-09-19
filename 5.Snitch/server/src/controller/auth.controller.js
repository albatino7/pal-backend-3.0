import { userModel } from "../model/user.model.js";
import bcrypt from "bcrypt";
import { genrateToken } from "../utils/genrateToken.js";

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

    res.cookie("accesToken", accesToken);

    res.status(201).json({
      message: "user created Successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
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
  userNotExisted.save();

  res.cookie("accesToken", accesToken);

  res.status(200).json({
    message: "userlogin Sucessfull",
    userNotExisted,
    accesToken,
  });
};
