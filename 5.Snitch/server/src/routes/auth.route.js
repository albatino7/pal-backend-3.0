import express from "express";
import {
  registerController,
  loginController,
  refreshController,
  getmeController,
} from "../controller/auth.controller.js";
import { registerValidation } from "../validator/registerValidator.js";
import { loginValidation } from "../validator/loginValidator.js";
import { checkUser } from "../middleware/checkUser.middleware.js";

import upload from "../config/multer.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.none(),
  registerValidation,
  registerController,
);

authRouter.post("/login", loginValidation, loginController);

authRouter.get("/refresh", refreshController);

authRouter.get("/getme", checkUser, getmeController);

export default authRouter;
