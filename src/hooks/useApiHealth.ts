import { useState, useEffect } from 'react';
import axios from 'axios';

// Use environment variable for API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increase timeout for production
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

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/api/auth/register', userData),
  
  logout: () => 
    api.post('/api/auth/logout'),
};

// Prediction API calls
export const predictionAPI = {
  predict: (data: any) =>
    api.post('/api/predict', data),

  getSoilData: (lat: number, lng: number) =>
    api.get('/api/soil', { params: { lat, lng } }),

  getWeatherData: (lat: number, lng: number) =>
    api.get('/api/weather', { params: { lat, lng } }),

  getPredictionHistory: () =>
    api.get('/api/predictions'),
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

// Fallback to mock data if API is not available
export const checkAPIHealth = async () => {
  try {
    const response = await healthAPI.check();
    return response.data.status === 'success';
  } catch (error) {
    console.warn('Backend API not available, using mock data');
    return false;
  }
};

// Custom hook for API health check
export const useApiHealth = () => {
  const [isApiHealthy, setIsApiHealthy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await checkAPIHealth();
        setIsApiHealthy(healthy);
      } catch (error) {
        setIsApiHealthy(false);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return { isApiHealthy, loading };
};