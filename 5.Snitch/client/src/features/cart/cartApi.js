import api from "../../lib/api";

export async function fetchCart() {
  const response = await api.get("/cart/item");
  return response.data.data.cart;
}

export async function addToCart({ productId, size, quantity = 1 }) {
  const response = await api.post("/cart/addtocart", {
    productId,
    size,
    quantity,
  });
  return response.data;
}

export async function updateCartQuantity({ productId, size, quantity }) {
  const response = await api.put("/cart/update-quantity", {
    productId,
    size,
    quantity,
  });
  return response.data;
}

export async function removeFromCart({ productId, size }) {
  const response = await api.delete("/cart/remove", {
    data: { productId, size },
  });
  return response.data;
}

export async function clearCart() {
  const response = await api.delete("/cart/clear");
  return response.data;
}
