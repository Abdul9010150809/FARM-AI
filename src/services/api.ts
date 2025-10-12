import axios from 'axios';

// Use environment variable for API base URL - remove /api from the end
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_BASE_URL, // Remove /api from here since your backend already has it
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls - these will now point to /api/auth
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/api/auth/register', userData),
  
  logout: () => 
    api.post('/api/auth/logout'),
};

// Prediction API calls - these will now point to /api/predict
export const predictionAPI = {
  predict: (data: any) =>
    api.post('/api/predict', data),

  getSoilData: (lat: number, lng: number) =>
    api.get('/api/soil', { params: { lat, lng } }),

  getWeatherData: (lat: number, lng: number) =>
    api.get('/api/weather', { params: { lat, lng } }),
};

// Chatbot API call
export const chatbotAPI = {
  sendMessage: (message: string, userId: string) => 
    api.post('/api/chat', {
      message,
      user_id: userId
    }),
};

// Health check
export const healthAPI = {
  check: () => api.get('/api/health')
};