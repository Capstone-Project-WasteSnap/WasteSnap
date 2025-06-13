import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wastesnap-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const analyzeImage = (formData) => 
  api.post('/scans/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const saveScanResult = (data) => api.post('/scans', data);
export const getScanHistory = (userId) => api.get(`/scans/${userId}`);

export default api;
