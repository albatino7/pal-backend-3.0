import express from "express";
import upload from "../config/multer.js";
import {
  registerController,
  loginController,
  refreshController,
  getmeControllers,
} from "../controller/authRouter.controller.js";

const authRouter = express.Router();

authRouter.post("/register", upload.none(), registerController);
authRouter.post("/login", upload.none(), loginController);
authRouter.get("/refresh", refreshController);
authRouter.get("/getme", getmeControllers);

export default authRouter;
