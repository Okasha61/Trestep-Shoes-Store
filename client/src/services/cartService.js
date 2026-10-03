import api from "./api";
export const getCart = async () => (await api.get("/cart")).data;
export const addCartItem = async (cartData) => (await api.post("/cart", cartData)).data;
export const updateCartItem = async (itemId, quantity) => (await api.put(`/cart/${itemId}`, { quantity })).data;
export const removeCartItem = async (itemId) => (await api.delete(`/cart/${itemId}`)).data;
export const clearCart = async () => (await api.delete("/cart")).data;
