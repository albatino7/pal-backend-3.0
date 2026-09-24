import express from "express";
import { createProductController } from "../controller/product.controller.js";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { productvalidateResult } from "../validator/productValidator.js";
import upload from "../config/multer.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  upload.array("images"),
  checkUser,
  (req, res, next) => {
    req.body.sizes = JSON.parse(req.body.sizes);
    next();
  },
  productvalidateResult,
  createProductController,
);

export default productRouter;
