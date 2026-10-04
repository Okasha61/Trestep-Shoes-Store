import axios from "axios";

const apiBaseURL =
  import.meta.env.VITE_API_URL ||
  "https://trestep-shoes-store.vercel.app/api";

const api = axios.create({
  baseURL: apiBaseURL,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      "trestepToken"
    );

    if (token) {
      config.headers = config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(
        "trestepToken"
      );

      localStorage.removeItem(
        "trestepUser"
      );
    }

    return Promise.reject(error);
  }
);

export default api;