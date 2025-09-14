import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
};

// Prediction API calls
export const predictionAPI = {
  predict: (data: any) => 
    api.post('/predictions/predict', data),
  
  getHistory: () => 
    api.get('/predictions/history'),
  
  getSoilData: (lat: number, lng: number) => 
    api.get('/soil-data', { params: { lat, lng } }),
  
  getWeatherData: (lat: number, lng: number) => 
    api.get('/weather/current', { params: { lat, lng } }),
};

// Chatbot API call
export const chatbotAPI = {
  sendMessage: (message: string, userId: string) => 
    axios.post(process.env.REACT_APP_CHATBOT_URL || 'http://localhost:8000/chat', {
      message,
      user_id: userId
    }),
};