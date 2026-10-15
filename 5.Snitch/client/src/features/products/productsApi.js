import api from "../../lib/api";

export async function fetchPublishedProducts({ page = 1, limit = 8 } = {}) {
  const response = await api.get(`/products/publishedproduct`, {
    params: { page, limit },
  });
  return response.data.data;
}

export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data.product;
}

export async function fetchSellerProducts() {
  const response = await api.get(`/products/seller/dashboard`);
  return response.data.products || [];
}

export async function fetchAllProducts() {
  const response = await api.get(`/products/getall`);
  return response.data.products || [];
}

export async function createProduct(formData) {
  const response = await api.post(`/products/create`, formData);
  return response.data.data.newProduct;
}

export async function updateProduct({ id, formData }) {
  const response = await api.put(`/products/update/${id}`, formData);
  return response.data.product;
}

export async function deleteProduct(id) {
  const response = await api.delete(`/products/delete/${id}`);
  return response.data;
}

export async function listProduct(id) {
  const response = await api.patch(`/products/list/${id}`);
  return response.data.data;
}

export async function unlistProduct(id) {
  const response = await api.patch(`/products/unlist/${id}`);
  return response.data.data;
}
