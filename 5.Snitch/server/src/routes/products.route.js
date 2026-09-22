import express from "express";
import { createProductController } from "../controller/product.controller.js";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { productvalidateResult } from "../validator/productValidator.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  productvalidateResult,
  checkUser,
  createProductController,
);

export default productRouter;
