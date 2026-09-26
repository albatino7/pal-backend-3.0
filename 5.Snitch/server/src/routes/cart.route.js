import express from "express";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { cartValidation } from "../validator/cartValidation";
import { addToCart, getCart } from "../controller/cart.controller";

const cartRoute = express.Router();

cartRoute.post("/addtocart", checkUser, cartValidation, addToCart);

cartRoute.get("/item", checkUser, getCart);

export default cartRoute;
