import express from "express";
import {
  registerController,
  loginController,
} from "../controller/auth.controller.js";
import { registerValidation } from "../validator/registerValidator.js";
import { loginValidation } from "../validator/loginValidator.js";

import upload from "../config/multer.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.none(),
  registerValidation,
  registerController,
);

authRouter.post("/login", loginValidation, loginController);

export default authRouter;
