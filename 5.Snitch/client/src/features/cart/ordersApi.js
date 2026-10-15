import api from "../../lib/api";

export async function createOrder({ products, totalAmount, shippingAddress }) {
  const response = await api.post("/orders/create", {
    products,
    totalAmount,
    shippingAddress,
  });
  return response.data; // { order, razorpayOrder, keyId }
}

export async function verifyPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const response = await api.post("/orders/verify-payment", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  return response.data; // { message, order }
}

export async function fetchMyOrders() {
  const response = await api.get("/orders/myorders");
  return response.data.orders || [];
}

export async function fetchAllOrders() {
  const response = await api.get("/orders/all");
  return response.data.orders || [];
}

export async function updateOrderStatus({ orderId, status }) {
  const response = await api.put(`/orders/update-status/${orderId}`, { status });
  return response.data.order;
}
