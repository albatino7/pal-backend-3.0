import express from "express";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { cartValidation } from "../validator/cartValidation.js";
import { addToCart, getCart } from "../controller/cart.controller.js";
import upload from "../config/multer.js";

const cartRoute = express.Router();

cartRoute.post(
  "/addtocart",
  upload.none(),
  checkUser,
  cartValidation,
  addToCart,
);

cartRoute.get("/item", checkUser, getCart);

export default cartRoute;
