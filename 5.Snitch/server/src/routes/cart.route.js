import express from "express";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { cartValidation } from "../validator/cartValidation.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controller/cart.controller.js";
import upload from "../config/multer.js";

const cartRoute = express.Router();

cartRoute.post(
  "/addtocart",
  upload.none(),
  checkUser,
  cartValidation,
  addToCart
);

cartRoute.get("/item", checkUser, getCart);

cartRoute.put("/update-quantity", checkUser, updateCartQuantity);

cartRoute.delete("/remove", checkUser, removeFromCart);
cartRoute.delete("/remove/:productId/:size", checkUser, removeFromCart);

cartRoute.delete("/clear", checkUser, clearCart);

export default cartRoute;
