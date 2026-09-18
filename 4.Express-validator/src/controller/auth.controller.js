import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExist) {
    return res.send("userExisted");
  }

  const newUser = await userModel.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
  });

  res.status(201).json({
    message: "User created",
    newUser,
  });
};
