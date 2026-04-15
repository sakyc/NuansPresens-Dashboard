import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2000/api', // Default to 2000 based on backend index.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Anda dapat menambahkan interceptor untuk token auth jika diperlukan di masa mendatang
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
