import api from "./api";

export const signupUser = async (userData) => {
  const response = await api.post(
    "/auth/signup",
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post(
    "/auth/login",
    userData
  );

  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await api.put(
    "/auth/profile",
    userData
  );

  return response.data;
};