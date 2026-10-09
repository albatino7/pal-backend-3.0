import express from "express";
import { checkUser } from "../middleware/checkUser.middleware.js";
import { checkSeller } from "../middleware/checkSeller.middleware.js";
import {
  createOrderController,
  getUserOrdersController,
  getAllOrdersController,
  updateOrderStatusController,
  verifyPaymentController
} from "../controller/order.controller.js";

const orderRouter = express.Router();

// Create order (user) - returns razorpay order details
orderRouter.post("/create", checkUser, createOrderController);

// Verify Razorpay payment
orderRouter.post("/verify-payment", checkUser, verifyPaymentController);

// Get user's own orders (user)
orderRouter.get("/myorders", checkUser, getUserOrdersController);

// Get all orders (seller dashboard)
orderRouter.get("/all", checkUser, checkSeller, getAllOrdersController);

// Update order status (seller)
orderRouter.put("/update-status/:id", checkUser, checkSeller, updateOrderStatusController);

export default orderRouter;
