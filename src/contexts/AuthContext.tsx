// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import NotificationToast from '../components/NotificationToast';
import { User } from '../types'; // Make sure to import your User type

// Define the shape of your context data for type safety
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  showLoginModal: () => void;
  showRegisterModal: () => void;
  showNotification: (message: string, type?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info', visible: false });

  const showNotification = useCallback((message: string, type = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
  }, []);

  // 👇 FIX: Add 'string' types to the parameters
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: userToken, user: userData } = response.data;
      localStorage.setItem('authToken', userToken);
      setToken(userToken);
      setUser(userData);
      setShowLogin(false);
      showNotification('Login successful!', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Login failed', 'error');
    }
  };
  
  const logout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      showNotification('Logged out successfully.');
  };

  // 👇 FIX: Add 'string' types to the parameters
  const register = async (name: string, email: string, password: string) => {
      try {
        const response = await axios.post('/api/auth/register', { name, email, password });
        const { token: userToken, user: userData } = response.data;
        localStorage.setItem('authToken', userToken);
        setToken(userToken);
        setUser(userData);
        setShowRegister(false);
        showNotification('Registration successful!', 'success');
      } catch (error: any) {
        showNotification(error.response?.data?.message || 'Registration failed', 'error');
      }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
    register,
    showLoginModal: () => setShowLogin(true),
    showRegisterModal: () => setShowRegister(true),
    showNotification,
  };

  return (
    <AuthContext.Provider value={value}>
      <NotificationToast
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
      />
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={login}
        onShowRegister={() => { setShowLogin(false); setShowRegister(true); }}
      />
      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        onRegister={register}
        onShowLogin={() => { setShowRegister(false); setShowLogin(true); }}
      />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};