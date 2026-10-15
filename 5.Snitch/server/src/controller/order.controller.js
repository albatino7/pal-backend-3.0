import { orderModel } from "../model/order.model.js";
import { productModel } from "../model/product.model.js";
import { cartModel } from "../model/cart.model.js";
import { userModel } from "../model/user.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order & initiate Razorpay order
export const createOrderController = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress } = req.body;
    const userId = req.user.userId;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products in order" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Verify stock availability for each item before creating Razorpay order
    for (const item of products) {
      const prod = await productModel.findById(item.product);
      if (!prod) {
        return res.status(404).json({ message: "Product not found" });
      }
      const sz = prod.sizes?.find((s) => s.size === item.size);
      if (!sz || sz.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${prod.title} in size ${item.size}. Only ${sz ? sz.stock : 0} available.`,
        });
      }
    }

    // Create Razorpay Order (amount in paise)
    const options = {
      amount: Math.round(Number(totalAmount) * 100),
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newOrder = await orderModel.create({
      user: userId,
      products,
      totalAmount: Number(totalAmount),
      shippingAddress,
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "unpaid",
    });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
      razorpayOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Payment, decrease stock, and clear cart
export const verifyPaymentController = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Find existing order
      const existingOrder = await orderModel.findOne({ razorpayOrderId: razorpay_order_id });
      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // If already verified/paid, don't decrease stock twice
      if (existingOrder.paymentStatus === "paid") {
        return res.status(200).json({
          message: "Payment already verified",
          order: existingOrder,
        });
      }

      // Update Order Status to paid & processing
      const updatedOrder = await orderModel
        .findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id },
          {
            paymentStatus: "paid",
            status: "processing",
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          },
          { new: true }
        )
        .populate("products.product");

      // DECREASE STOCK IN PRODUCT MODEL FOR EACH VARIANT ORDERED
      for (const item of existingOrder.products) {
        await productModel.updateOne(
          {
            _id: item.product,
            "sizes.size": item.size,
          },
          {
            $inc: { "sizes.$.stock": -item.quantity },
          }
        );
      }

      // CLEAR USER CART UPON SUCCESSFUL PAYMENT
      await cartModel.findOneAndUpdate(
        { user: existingOrder.user },
        { $set: { products: [] } }
      );

      return res.status(200).json({
        message: "Payment verified successfully",
        order: updatedOrder,
      });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    next(error);
  }
};

// Get all orders for current user
export const getUserOrdersController = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.userId })
      .populate({
        path: "products.product",
        populate: { path: "seller", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "User orders fetched successfully",
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for admin/seller dashboard with full user details and shipping address)
export const getAllOrdersController = async (req, res, next) => {
  try {
    const orders = await orderModel
      .find()
      .populate("products.product")
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

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

    const updatedOrder = await orderModel
      .findByIdAndUpdate(
        id,
        { status },
        { new: true }
      )
      .populate("products.product")
      .populate("user", "name email");

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
