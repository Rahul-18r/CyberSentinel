import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

// Request interceptor - adds auth token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles auth errors and token expiration
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear all auth data and redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth related endpoints
const auth = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data; // This returns the actual response data
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  verify: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
  logout: async () => {
    try {
      localStorage.clear();
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  }
};

// Security scanning endpoints
const security = {
  scanUrl: async (url) => {
    try {
      const response = await api.post('/security/scan-url', { url });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
  detectDeepfake: async (formData) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const response = await api.post('/security/detect-deepfake', formData, config);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
  scanEmail: async (content) => {
    try {
      const response = await api.post('/security/scan-email', { content });
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  },
  analyzeSteganography: async (formData) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      const response = await api.post('/security/steganography', formData, config);
      return response.data;
    } catch (error) {
      throw api.handleError(error);
    }
  }
};

// Error handler helper
api.handleError = (error) => {
  const message = error.response?.data?.message || 
                 error.message || 
                 'An unexpected error occurred';
  console.error('API Error:', error);
  return {
    error: true,
    message,
    status: error.response?.status || 500
  };
};

// Success response helper
api.handleSuccess = (response) => {
  return {
    error: false,
    data: response.data,
    status: response.status
  };
};

// Attach endpoint groups to api
api.auth = auth;
api.security = security;

export default api;