import express from "express";
import {
  createOrderController,
  verifyPaymentController,
} from "../controller/payment.controller.js";

const payementRouter = express.Router();

payementRouter.post("/createorder/:id", createOrderController);
payementRouter.post("/verify", verifyPaymentController);

export default payementRouter;
