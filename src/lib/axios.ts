import axios from 'axios';

const TOKEN_KEY = 'tiendapos_token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://tiendapos-api.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
