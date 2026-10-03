import api from "./api";

export const createOrder = async (orderData) =>
  (await api.post("/orders", orderData)).data;

export const getMyOrders = async () =>
  (await api.get("/orders/my-orders")).data;

export const getOrderById = async (id) =>
  (await api.get(`/orders/${id}`)).data;

export const cancelOrder = async (id) =>
  (await api.put(`/orders/${id}/cancel`)).data;

export const getAllOrders = async () =>
  (await api.get("/admin/orders")).data;

export const updateOrderStatus = async (id, status) =>
  (await api.put(`/admin/orders/${id}`, { status })).data;
