import React, { useState } from "react";
import axios from "axios";

const Normal = () => {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Step 1: Create an order in your backend
      const orderResponse = await axios.post(
        `/api/payment/createorder/${productId}`,
      );

      const order = orderResponse.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,

        name: "My Store",
        description: "Product Purchase",

        // Step 3: Razorpay returns payment details after checkout
        handler: async (paymentResponse) => {
          try {
            // Step 4: Send payment details to backend for verification
            const verifyResponse = await axios.post(
              "/api/payment/verify",
              paymentResponse,
            );

            if (verifyResponse.data.status === "success") {
              alert("Payment verified successfully!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Could not verify payment.");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
            console.log("Checkout closed by user");
          },
        },
      };

      // Step 5: Create and open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      // Step 6: Handle checkout payment failure
      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert("Payment failed.");
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Could not create payment order.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      {" "}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {" "}
        {/* Header */}{" "}
        <div className="bg-blue-600 px-6 py-7 text-white">
          {" "}
          <p className="text-sm text-blue-100 mb-2"> SECURE CHECKOUT </p>{" "}
          <h2 className="text-2xl font-bold"> Razorpay Test Payment </h2>{" "}
          <p className="text-sm text-blue-100 mt-2">
            {" "}
            Enter your product ID to start a test payment.{" "}
          </p>{" "}
        </div>{" "}
        {/* Form */}{" "}
        <div className="p-6 space-y-5">
          {" "}
          <div>
            {" "}
            <label
              htmlFor="productId"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              {" "}
              MongoDB Product ID{" "}
            </label>{" "}
            <input
              id="productId"
              type="text"
              placeholder="e.g. 66f123abc456def789012345"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />{" "}
            <p className="mt-2 text-xs text-slate-500">
              {" "}
              Copy the product's <code>_id</code> from your MongoDB
              database.{" "}
            </p>{" "}
          </div>{" "}
          {/* Payment Info */}{" "}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            {" "}
            <p className="text-sm font-semibold text-blue-900">
              {" "}
              Test Mode{" "}
            </p>{" "}
            <p className="mt-1 text-xs leading-5 text-blue-700">
              {" "}
              This form starts the Razorpay checkout process. The amount will be
              determined by your backend product data.{" "}
            </p>{" "}
          </div>{" "}
          {/* Button */}{" "}
          <button
            onClick={handlePayment}
            disabled={loading || !productId.trim()}
            className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-md shadow-blue-200 transition duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {" "}
            {loading ? "Processing Payment..." : "Continue to Payment"}{" "}
          </button>{" "}
          {/* Footer */}{" "}
          <div className="border-t border-slate-100 pt-4 text-center">
            {" "}
            <p className="text-xs text-slate-500">
              {" "}
              Payment verification is handled by your backend.{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Normal;
