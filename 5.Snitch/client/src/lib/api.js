import axios from "axios";

let authTokenProvider = () => null;

export const setAuthTokenProvider = (provider) => {
  authTokenProvider = provider;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = authTokenProvider?.();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
