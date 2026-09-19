import express from "express";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "../middleware/globalErrorHandler.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Routes
import authRouter from "../routes/auth.route.js";

app.use("/api/auth", authRouter);

//Global Error Handler
app.use(globalErrorHandler);

export default app;
