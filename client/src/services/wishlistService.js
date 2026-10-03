import api from "./api";
export const getWishlist = async () => (await api.get("/wishlist")).data;
export const addToWishlist = async (productId) => (await api.post("/wishlist", { productId })).data;
export const removeFromWishlist = async (productId) => (await api.delete(`/wishlist/${productId}`)).data;
export const clearWishlist = async () => (await api.delete("/wishlist")).data;
