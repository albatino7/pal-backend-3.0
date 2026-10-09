import { orderModel } from "../model/order.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order
export const createOrderController = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress } = req.body;
    const userId = req.user.userId;

    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = await orderModel.create({
      user: userId,
      products,
      totalAmount,
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "unpaid"
    });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      razorpayOrder
    });
  } catch (error) {
    next(error);
  }
};

// Verify Payment
export const verifyPaymentController = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const updatedOrder = await orderModel.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      );

      return res.status(200).json({ message: "Payment verified successfully", order: updatedOrder });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    next(error);
  }
};


// Get all orders for a user
export const getUserOrdersController = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ user: req.user.userId }).populate("products.product");
    
    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for admin/seller dashboard)
// Assuming single seller, so they can see all orders
export const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await orderModel.find().populate("products.product").populate("user", "name email");
    
    res.status(200).json({
      message: "All orders fetched successfully",
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (for seller)
export const updateOrderStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      const error = new Error("Order not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
