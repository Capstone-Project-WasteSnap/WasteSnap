import axios from 'axios';

const api = axios.create({
  baseURL: 'https://wastesnap-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Tambahkan ini:
  withCredentials: false, // Set true hanya jika menggunakan cookies/session
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debugging: Log setiap request yang dikirim
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers
  });
  
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    // Debugging: Log response yang diterima
    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.response) {
      console.error('Server response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      
      // Handle CORS errors specifically
      if (error.response.status === 0) {
        error.message = 'CORS Error: Tidak bisa terhubung ke server';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      error.message = 'Tidak ada response dari server';
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Tambahkan fungsi khusus untuk login dengan CORS handling
export const login = (credentials) => 
  api.post('/auth/login', credentials, {
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Bantu identifikasi AJAX request
    },
    // withCredentials: true // Hanya aktifkan jika backend memerlukan
  });

// Fungsi lainnya tetap sama...
export const analyzeImage = (formData) => 
  api.post('/scans/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export default api;
