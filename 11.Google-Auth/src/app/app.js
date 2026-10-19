import express from "express";
import morgan from "morgan";
import passport from "../config/passport.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());

//

import authRoute from "../routes/auth.routes.js";

app.use("/auth", authRoute);

export default app;
