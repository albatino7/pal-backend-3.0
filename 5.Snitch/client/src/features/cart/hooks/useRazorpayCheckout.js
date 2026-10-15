import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../ordersApi";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpayCheckout() {
  const queryClient = useQueryClient();
  const authUser = useSelector((state) => state.auth.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const checkout = async ({
    products,
    totalAmount,
    shippingAddress,
    onSuccess,
    onFailure,
  }) => {
    setIsProcessing(true);
    setError(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // Step 1: Create Order on backend
      const orderData = await createOrder({
        products: products.map((item) => ({
          product: typeof item.product === "object" ? item.product._id : item.product,
          size: item.size,
          quantity: item.quantity,
        })),
        totalAmount,
        shippingAddress,
      });

      const { razorpayOrder, keyId, order } = orderData;

      const razorpayKey =
        keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TlkpmljRIcEReI";

      // Step 2: Configure Razorpay Checkout options
      const options = {
        key: razorpayKey,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || "INR",
        name: "Snitch Streetwear",
        description: `Order #${order._id.slice(-6).toUpperCase()}`,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=120&q=80",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // Step 3: Verify Payment Signature on backend
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Invalidate queries so cart is empty, stock is decreased, and orders are updated
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            setIsProcessing(false);
            if (onSuccess) {
              onSuccess(verification.order);
            }
          } catch (err) {
            setIsProcessing(false);
            const msg = err.response?.data?.message || err.message || "Payment verification failed.";
            setError(msg);
            if (onFailure) onFailure(msg);
          }
        },
        prefill: {
          name: authUser?.name || "",
          email: authUser?.email || "",
        },
        theme: {
          color: "#1d201a",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        setIsProcessing(false);
        const errMsg = response.error?.description || "Payment failed. Please try again.";
        setError(errMsg);
        if (onFailure) onFailure(errMsg);
      });

      paymentObject.open();
    } catch (err) {
      setIsProcessing(false);
      const msg = err.response?.data?.message || err.message || "Could not initiate payment.";
      setError(msg);
      if (onFailure) onFailure(msg);
    }
  };

  return {
    checkout,
    isProcessing,
    error,
    clearError: () => setError(null),
  };
}
