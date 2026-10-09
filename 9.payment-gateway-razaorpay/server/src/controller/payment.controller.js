import { productModel } from "../model/productSchema.model.js";
import { paymentModel } from "../model/paymentSchema.model.js";
import razorpay from "../config/razorpay.js";
import { config } from "../config/config.js";
import crypto from "node:crypto";
import mongoose from "mongoose";

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================
export const createOrderController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Step 1: Validate product ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid product ID",
      });
    }

    // Step 2: Find product
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }

    // Step 3: Validate product amount
    if (
      typeof product.amount !== "number" ||
      !Number.isFinite(product.amount) ||
      product.amount <= 0
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid product amount",
      });
    }

    // Convert rupees to paise
    const amount = Math.round(product.amount * 100);

    // Step 4: Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        productId: String(product._id),
      },
    });

    // Step 5: Save payment record in MongoDB
    await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      product: product._id,
      status: "pending",
    });

    // Step 6: Send order details to frontend
    return res.status(201).json({
      status: "success",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Failed to create Razorpay order",
    });
  }
};

// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================
export const verifyPaymentController = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Step 1: Validate Checkout response
    if (
      typeof razorpay_order_id !== "string" ||
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return res.status(400).json({
        status: "failed",
        message: "Missing or invalid payment verification fields",
      });
    }

    // Step 2: Ensure the secret is configured
    if (!config.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay key secret is not configured");

      return res.status(500).json({
        status: "failed",
        message: "Payment verification is not configured",
      });
    }

    // Step 3: Find the order created by our backend
    const payment = await paymentModel.findOne({
      orderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        status: "failed",
        message: "Order not found in database",
      });
    }

    // Step 4: Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Step 5: Compare signatures safely
    const expectedBuffer = Buffer.from(generatedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpay_signature, "hex");

    const isAuthentic =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isAuthentic) {
      return res.status(400).json({
        status: "failed",
        message: "Payment signature verification failed",
      });
    }

    // Step 6: Avoid overwriting an already successful record
    if (payment.status === "success") {
      return res.status(200).json({
        status: "success",
        message: "Payment already verified",
        orderId: payment.orderId,
        paymentId: razorpay_payment_id,
      });
    }

    // Step 7: Mark signature as verified
    // IMPORTANT:
    // Signature verification alone does not confirm that the
    // payment has been captured. Check the payment status with
    // Razorpay before fulfilling the order.
    payment.status = "success";
    await payment.save();

    return res.status(200).json({
      status: "success",
      message: "Payment signature verified",
      orderId: payment.orderId,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      status: "failed",
      message: "Internal payment verification error",
    });
  }
};
