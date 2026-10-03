import api from "./api";

export const getProducts = async (params = {}) => (await api.get("/products", { params })).data;
export const getProduct = async (id) => (await api.get(`/products/${id}`)).data;
export const getProductById = getProduct;

export const createProduct = async (formData) =>
  (await api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const updateProduct = async (id, formData) =>
  (await api.put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data;

export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;
