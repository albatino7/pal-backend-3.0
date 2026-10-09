import express, { urlencoded } from "express";

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));

//routes
import productRouter from "../routes/product.routes.js";
import payementRouter from "../routes/payment.routes.js";

app.use("/api/product", productRouter);
app.use("/api/payment", payementRouter);

export default app;
