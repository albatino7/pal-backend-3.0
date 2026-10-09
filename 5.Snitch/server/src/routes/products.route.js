import express from "express";
import {
  createProductController,
  gettAllproductController,
  listProductController,
  unlistProductController,
  publishedProducts,
  getSingleProductController,
  updateProductController,
  deleteProductController,
  getSellerProductsController
} from "../controller/product.controller.js";
import { checkUser } from "../middleware/checkUser.middleware.js";
import {
  productvalidateResult,
  unlistProductValidator,
  listProductValidator,
} from "../validator/productValidator.js";
import upload from "../config/multer.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";

const productRouter = express.Router();

//CREATE PRODUCTS BY SELLER ONLY
productRouter.post(
  "/create",
  upload.array("images"),
  checkUser,
  checkSeller,
  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
  },
  productvalidateResult,
  createProductController,
);

//GET ALL PRODUCT INCLUDE PUBLISHED OR NOT PUBLISHED BOTH
productRouter.get("/getall", checkUser, checkSeller, gettAllproductController);

//GET ALL PUBLISHED PRODUCTS
productRouter.get("/publishedproduct", checkUser, publishedProducts);

//GET PRODUCT PUBLISH:FALSE BY PRODUCT ID
productRouter.patch(
  "/unlist/:id",
  checkUser,
  checkSeller,
  unlistProductValidator,
  unlistProductController,
);

//GET PRODUCT PUBLISH:TRUE BY PRODUCT ID
productRouter.patch(
  "/list/:id",
  checkUser,
  checkSeller,
  listProductValidator,
  listProductController,
);

// GET SINGLE PRODUCT BY ID
productRouter.get("/:id", getSingleProductController);

// UPDATE PRODUCT BY SELLER
productRouter.put(
  "/update/:id",
  upload.array("images"),
  checkUser,
  checkSeller,
  updateProductController
);

// DELETE PRODUCT BY SELLER
productRouter.delete("/delete/:id", checkUser, checkSeller, deleteProductController);

// GET ALL PRODUCTS FOR A SELLER (DASHBOARD)
productRouter.get("/seller/dashboard", checkUser, checkSeller, getSellerProductsController);

export default productRouter;
