import axios from "axios";

const api = axios.create({
  baseURL: "https://wasteapi.1dev.win/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Fungsi untuk analisis gambar
export const saveScanResult = (data) => api.post("/scans", data);
export const getScanHistory = (userId) => api.get(`/scans/${userId}`);

export default api;
