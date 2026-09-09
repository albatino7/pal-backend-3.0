import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes
import authRouter from "../router/authRouter.routes.js";

//api

app.use("/api/auth/", authRouter);

//global error handler
import { globalError } from "../middleware/globalError.middleware.js";

app.use(globalError);

export default app;
