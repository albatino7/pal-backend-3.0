import express from "express";
import {
  createProductConrtoller,
  seedProductsController,
  getAllProductController,
} from "../controller/product.controller.js";

const productRouter = express.Router();

productRouter.post("/create", createProductConrtoller);
productRouter.post("/seed", seedProductsController);
productRouter.get("/", getAllProductController);
export default productRouter;
