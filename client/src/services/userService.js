import api from "./api";
export const getMyProfile = async () => (await api.get("/auth/me")).data;
export const updateMyProfile = async (userData) => (await api.put("/auth/profile", userData)).data;
export const getAllUsers = async () => (await api.get("/users")).data;
export const getUserById = async (id) => (await api.get(`/users/${id}`)).data;
export const updateUser = async (id, userData) => (await api.put(`/users/${id}/role`, userData)).data;
export const deleteUser = async (id) => (await api.delete(`/users/${id}`)).data;
