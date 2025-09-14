import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

// Extend the Window interface to include Google Translate functions
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: unknown,
          elementId: string
        ) => unknown;
      };
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
    region: string;
  };
  farmDetails?: {
    totalArea: number;
    soilType: string;
    primaryCrops: string[];
    irrigationSystem: string;
  };
}

interface PredictionInput {
  cropType: string;
  area: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  soilType?: string;
  rainfall?: number;
  temperature?: number;
  humidity?: number;
}

interface PredictionResult {
  yield: number;
  perAcre: number;
  confidence: number;
  location: string;
  weather: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
  soil: {
    type: string;
    ph: number;
    nitrogen: number;
  };
  recommendations: {
    irrigation: string;
    fertilization: string;
    pestControl: string;
    harvestTiming: string;
  };
}

const App = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your CropYield Assistant. How can I help you with your farming questions today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temperature: 32,
    humidity: 78,
    rainfall: 45
  });
  const languageSelectRef = useRef<HTMLSelectElement>(null);
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
          callback: handleGoogleSignIn
        });
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { theme: 'outline', size: 'large' }
        );
      }
    };

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initializeGoogleSignIn;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGoogleSignIn = (response: any) => {
    // Handle Google sign-in response
    console.log('Google sign-in response:', response);
    // You would typically send this to your backend for verification
    const userData = {
      name: response.name,
      email: response.email,
      role: 'farmer'
    };
    
    localStorage.setItem('authToken', response.credential);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
    showNotification('Login successful with Google!', 'success');
  };

  // API request interceptor to add auth token
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('authToken');
        if (token && config.url?.startsWith(API_BASE_URL)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Fetch weather data based on location
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Using OpenWeatherMap API - you'll need to sign up for an API key
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=metric`
              );
              
              const data = response.data;
              setWeatherData({
                temperature: Math.round(data.main.temp),
                humidity: data.main.humidity,
                rainfall: data.rain ? data.rain['1h'] || 0 : 0
              });
            } catch (error) {
              console.error('Error fetching weather data:', error);
              // Fallback to default data
              setWeatherData({
                temperature: 32,
                humidity: 78,
                rainfall: 45
              });
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
          }
        );
      }
    };

    fetchWeatherData();
  }, []);

  // Login function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: loginForm.email,
        password: loginForm.password
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      setUser(user);
      setShowLogin(false);
      showNotification('Login successful!', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Login failed', 'error');
    }
  };

  // Register function
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: 'farmer'
      });

      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsLoggedIn(true);
      setUser(user);
      setShowRegister(false);
      showNotification('Registration successful!', 'success');
    } catch (error: any) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    showNotification('Logged out successfully', 'success');
  };

  // Function to handle chatbot messages with FastAPI integration
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');

    try {
      // Send message to FastAPI chatbot backend
      const response = await axios.post('http://localhost:8000/chat', {
        message: inputMessage,
        user_id: user?._id || 'anonymous'
      });

      const botResponse = response.data.response;
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (error) {
      // Fallback to local response if API fails
      const botResponse = generateBotResponse(inputMessage);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }
  };

  // Improved bot response with more agricultural knowledge
  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm your CropYield Assistant. How can I help you with your farming questions today?";
    } else if (lowerMessage.includes('yield') || lowerMessage.includes('prediction')) {
      return "Our AI models analyze soil quality, weather patterns, and historical data to predict crop yields with 95% accuracy. You can get a personalized prediction by filling out the form in the Prediction section.";
    } else if (lowerMessage.includes('rice')) {
      return "For rice cultivation in Andhra Pradesh, I recommend: 1) Maintain 2-5cm water depth during vegetative stage, 2) Apply 80:40:40 kg/acre NPK, 3) Watch for stem borer and bacterial leaf blight. Optimal temperature: 20-35°C, rainfall: 1000-2000mm.";
    } else if (lowerMessage.includes('chilli') || lowerMessage.includes('chillies')) {
      return "For chillies: 1) Well-drained red loamy soil is best, 2) Space plants 45-60cm apart, 3) Use drip irrigation to conserve water, 4) Watch for thrips and fruit rot. Expected yield: 15-20 qtl/acre.";
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return `Current weather: Temperature ${weatherData.temperature}°C, Humidity ${weatherData.humidity}%, Rainfall ${weatherData.rainfall}mm. Our system integrates with meteorological services to give accurate forecasts.`;
    } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer')) {
      return "Based on your location in Andhra Pradesh, I recommend soil testing every season. Coastal areas typically have alluvial soil (pH 6.5-7.5), while Rayalaseema has red soil (pH 6.0-7.0). I can help you interpret soil test results!";
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return "For pest management: 1) Use integrated pest management (IPM) approaches, 2) Monitor fields weekly, 3) Use biological controls like neem oil, 4) Apply pesticides only when necessary. Tell me your specific pest issue for detailed advice.";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm here to help you maximize your farm's productivity. Is there anything else you'd like to know about crop management?";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return "I can provide current market prices for major crops in Andhra Pradesh mandis. Which crop are you interested in? Rice, chillies, turmeric, cotton, or pulses?";
    } else if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
      return "Water management tips: 1) Use drip/sprinkler irrigation to save 30-50% water, 2) Irrigate early morning or late evening to reduce evaporation, 3) Monitor soil moisture regularly, 4) Use mulch to conserve soil moisture.";
    } else {
      return "I'm here to help with agricultural advice. You can ask me about: crop yields, weather impacts, soil health, pest management, irrigation, fertilization, market prices, or government schemes. How can I assist you today?";
    }
  };

  // Function to show notification
  const showNotification = (message: string, type = 'info') => {
    // Create a toast notification if it doesn't exist
    let toast = document.getElementById('notificationToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'notificationToast';
      toast.className = `toast notification-toast ${type}`;
      toast.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1050; display: none;';
      
      const toastMessage = document.createElement('div');
      toastMessage.id = 'toastMessage';
      toastMessage.className = 'toast-body';
      toast.appendChild(toastMessage);
      
      document.body.appendChild(toast);
    }
    
    const toastMessage = document.getElementById('toastMessage');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.style.display = 'block';
      
      // Hide after 5 seconds
      setTimeout(() => {
        if (toast) {
          toast.style.display = 'none';
        }
      }, 5000);
    }
  };

  // Function to get soil data based on location
  const getSoilData = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/soil-data`, {
        params: { lat: latitude, lng: longitude }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching soil data:', error);
      // Return default soil data based on region
      return {
        type: 'alluvial',
        ph: 6.5,
        nitrogen: 0.15,
        phosphorus: 0.08,
        potassium: 0.12,
        organicMatter: 2.1
      };
    }
  };

  // Function to get weather data
  const getWeatherDataAPI = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/current`, {
        params: { lat: latitude, lng: longitude }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };

  // Improved prediction function with real API call
  const handlePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');
    
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    
    try {
      const formData = new FormData(form);
      const predictionData: PredictionInput = {
        cropType: formData.get('cropType') as string,
        area: parseFloat(formData.get('area') as string),
        rainfall: parseFloat(formData.get('rainfall') as string) || undefined,
        temperature: parseFloat(formData.get('temperature') as string) || undefined,
        humidity: parseFloat(formData.get('humidity') as string) || undefined,
        soilType: formData.get('soilType') as string || undefined
      };

      // Add location data if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          predictionData.location = { latitude, longitude };
          
          // Get soil and weather data
          const [soilData, weatherData] = await Promise.all([
            getSoilData(latitude, longitude),
            getWeatherDataAPI(latitude, longitude)
          ]);

          // Submit prediction
          const response = await axios.post(`${API_BASE_URL}/predictions/predict`, predictionData);
          displayPredictionResults(response.data, soilData, weatherData);
        });
      } else {
        // Submit without location data
        const response = await axios.post(`${API_BASE_URL}/predictions/predict`, predictionData);
        displayPredictionResults(response.data);
      }
    } catch (error: any) {
      console.error('Prediction error:', error);
      showNotification(error.response?.data?.message || 'Prediction failed. Please try again.', 'error');
      if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
  };

  // Display prediction results
  const displayPredictionResults = (prediction: PredictionResult, soilData?: any, weatherData?: any) => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');
    
    if (loadingSpinner) loadingSpinner.style.display = 'none';
    if (resultContainer) resultContainer.style.display = 'block';
    
    // Update UI with prediction results
    const yieldElement = document.getElementById('yieldValue');
    const yieldPerAcreElement = document.getElementById('yieldPerAcre');
    const confidenceElement = document.getElementById('confidenceBadge');
    const irrigationElement = document.getElementById('irrigationRecommendation');
    const fertilizerElement = document.getElementById('fertilizerRecommendation');
    const pestElement = document.getElementById('pestRecommendation');
    const harvestElement = document.getElementById('harvestRecommendation');
    
    if (yieldElement) yieldElement.textContent = `${prediction.yield} kg`;
    if (yieldPerAcreElement) yieldPerAcreElement.textContent = `Per acre: ${prediction.perAcre} kg`;
    if (confidenceElement) confidenceElement.textContent = `Confidence: ${prediction.confidence}%`;
    
    // Update recommendations
    if (irrigationElement) irrigationElement.textContent = prediction.recommendations.irrigation;
    if (fertilizerElement) fertilizerElement.textContent = prediction.recommendations.fertilization;
    if (pestElement) pestElement.textContent = prediction.recommendations.pestControl;
    if (harvestElement) harvestElement.textContent = prediction.recommendations.harvestTiming;

    // Update weather and soil info if available
    if (weatherData) {
      const tempElement = document.getElementById('weather-temp');
      const humidityElement = document.getElementById('weather-humidity');
      const rainfallElement = document.getElementById('weather-rainfall');
      
      if (tempElement) tempElement.textContent = `${weatherData.temperature}°C`;
      if (humidityElement) humidityElement.textContent = `${weatherData.humidity}%`;
      if (rainfallElement) rainfallElement.textContent = `${weatherData.rainfall}mm`;
    }

    showNotification('Yield prediction completed successfully!', 'success');
  };

  // Function to reset form
  const resetForm = () => {
    const form = document.getElementById('yieldPredictionForm') as HTMLFormElement;
    const resultContainer = document.getElementById('resultContainer');
    
    if (form) form.reset();
    if (resultContainer) resultContainer.style.display = 'none';
    
    showNotification('Form has been reset successfully.', 'success');
  };

  // Function to play greeting in local language
  const playLocalGreeting = (lang: string) => {
    if (greetingPlayed) return;
    
    const greetings: Record<string, string> = {
      te: "నమస్కారం, ఆంధ్రప్రదేశ్ రైతు సహోదరులారా! క్రాప్ యీల్డ్ ప్రో ప్లాట్ఫారమ్‌కు స్వాగతం.",
      hi: "नमस्ते, आंध्र प्रदेश के किसान भाइयों! क्रॉप यील्ड प्रो प्लेटफॉर्म में आपका स्वागत है।",
      ta: "வணக்கம், ஆந்திரப் பிரதேச விவசாயி சகோதரர்களே! கிராப் யீல்ட் ப்ரோ தளத்திற்கு வரவேற்கிறோம்.",
      kn: "ನಮಸ್ಕಾರ, ಆಂಧ್ರಪ್ರದೇಶ ರೈತ ಸಹೋದರರೇ! ಕ್ರಾಪ್ ಯೀಲ್ಡ್ ಪ್ರೋ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ಗೆ ಸ್ವಾಗತ.",
      ml: "നമസ്കാരം, ആന്ധ്രപ്രദേശ് കർഷക സഹോദരങ്ങളേ! ക്രോപ്പ് യീൽഡ് പ്രോ പ്ലാറ്റ്ഫോമിലേക്ക് സ്വാഗതം."
    };
    
    const greeting = greetings[lang] || "Welcome, farmers of Andhra Pradesh! Welcome to the CropYield Pro platform.";
    
    // Use speech synthesis for greeting
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(greeting);
      
      // Set language based on selection
      speech.lang = lang === 'te' ? 'te-IN' : 
                   lang === 'hi' ? 'hi-IN' : 
                   lang === 'ta' ? 'ta-IN' : 
                   lang === 'kn' ? 'kn-IN' : 
                   lang === 'ml' ? 'ml-IN' : 'en-US';
      
      window.speechSynthesis.speak(speech);
      setGreetingPlayed(true);
    }
    
    showNotification(greeting, 'info');
  };

  const applyTranslation = async (lang: string) => {
    setCurrentLanguage(lang);
    
    // Use Google Translate if available
    if (window.google && window.google.translate) {
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
      }
    }
    
    // Play greeting in the selected language
    playLocalGreeting(lang);
    
    showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
  };

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      'en': 'English',
      'te': 'Telugu',
      'hi': 'Hindi',
      'ta': 'Tamil',
      'kn': 'Kannada',
      'ml': 'Malayalam'
    };
    return languages[code] || code;
  };

  // Location-based language detection
  useEffect(() => {
    const detectLocationAndSetLanguage = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const state = (data.address.state || "").toLowerCase();
              
              let lang = "en";
              if (state.includes("andhra") || state.includes("telangana")) {
                lang = "te"; // Telugu
              } else if (state.includes("tamil nadu")) {
                lang = "ta"; // Tamil
              } else if (state.includes("karnataka")) {
                lang = "kn"; // Kannada
              } else if (state.includes("kerala")) {
                lang = "ml"; // Malayalam
              } else if (state.includes("hindi") || state.includes("north")) {
                lang = "hi"; // Hindi
              }
              
              await applyTranslation(lang);
            } catch (error) {
              console.error("Location detection failed:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }
    };

    detectLocationAndSetLanguage();
  }, []);

  // Google Translate script loading
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const existingScript = document.querySelector('script[src*="translate.google.com"]');
      if (existingScript) return;

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te,ta,kn,ml',
          autoDisplay: false,
          layout: window.innerWidth < 768 ? 'SIMPLE' : 'NORMAL'
        }, 'google_translate_element');
      }
    };

    addGoogleTranslateScript();
  }, []);

  useEffect(() => {
  // Initialize weather data display
  const tempElement = document.getElementById('weather-temp');
  const humidityElement = document.getElementById('weather-humidity');
  const rainfallElement = document.getElementById('weather-rainfall');
  
  if (tempElement) tempElement.textContent = `${weatherData.temperature}°C`;
  if (humidityElement) humidityElement.textContent = `${weatherData.humidity}%`;
  if (rainfallElement) rainfallElement.textContent = `${weatherData.rainfall}mm`;

  // Get the form element and add React event handler
  const form = document.getElementById('yieldPredictionForm') as HTMLFormElement;
  if (form) {
    // Remove any existing event listeners to avoid duplicates
    const newForm = form.cloneNode(true) as HTMLFormElement;
    form.parentNode?.replaceChild(newForm, form);
    
    // Add the submit handler directly to the form
    newForm.onsubmit = (e: Event) => {
      e.preventDefault();
      handlePrediction(e as unknown as React.FormEvent);
      return false;
    };
  }
}, [weatherData]);

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>FARMAI - AI-Powered Crop Yield Prediction</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{__html: `
        :root {
            --primary: #2e7d32;
            --secondary: #7cb342;
            --accent: #ffa000;
            --light: #f1f8e9;
            --dark: #1b5e20;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f8f9fa;
        }

        .navbar {
            background-color: var(--primary);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar-brand {
            font-weight: 700;
            color: white !important;
        }

        .nav-link {
            color: rgba(255, 255, 255, 0.85) !important;
            font-weight: 500;
            transition: all 0.3s;
        }

        .nav-link:hover {
            color: white !important;
            transform: translateY(-2px);
        }

        .hero-section {
            position: relative;
            color: white;
            padding: 120px 0;
            text-align: center;
            overflow: hidden;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
        }

        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 0;
        }

        .hero-section .container {
            position: relative;
            z-index: 1;
        }

        .section-title {
            position: relative;
            margin-bottom: 40px;
            font-weight: 700;
            color: var(--dark);
        }

        .section-title:after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: var(--accent);
            margin: 15px auto;
        }

        .feature-card {
            border-radius: 10px;
            overflow: hidden;
            transition: transform 0.3s, box-shadow 0.3s;
            border: none;
            margin-bottom: 20px;
            height: 100%;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
            font-size: 3rem;
            color: var(--primary);
            margin-bottom: 20px;
        }

        .btn-primary {
            background-color: var(--primary);
            border-color: var(--primary);
            padding: 10px 25px;
            font-weight: 600;
            border-radius: 30px;
        }

        .btn-primary:hover {
            background-color: var(--dark);
            border-color: var(--dark);
        }

        .btn-outline-primary {
            color: var(--primary);
            border-color: var(--primary);
            padding: 10px 25px;
            font-weight: 600;
            border-radius: 30px;
        }

        .btn-outline-primary:hover {
            background-color: var(--primary);
            color: white;
        }

        .language-selector {
            background-color: var(--secondary);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .language-selector:hover {
            background-color: var(--dark);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .language-selector select {
            background: transparent;
            border: none;
            color: white;
            padding: 5px;
            outline: none;
            cursor: pointer;
        }
        
        .language-selector option {
            background: var(--primary);
            color: white;
        }

        .crop-card {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s;
        }

        .crop-card:hover {
            transform: scale(1.03);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        footer {
            background-color: var(--dark);
            color: white;
            padding: 60px 0 30px;
        }

        .footer-links a {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 0.3s;
        }

        .footer-links a:hover {
            color: white;
            text-decoration: underline;
        }

        .social-icon {
            font-size: 1.5rem;
            color: white;
            margin-right: 15px;
            transition: color 0.3s;
        }

        .social-icon:hover {
            color: var(--accent);
        }

        .prediction-form {
            background-color: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .stat-label {
            font-size: 1.1rem;
            color: #666;
        }

        .result-container {
            background-color: var(--light);
            border-radius: 15px;
            padding: 30px;
            margin-top: 30px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .yield-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .recommendation-card {
            border-left: 4px solid var(--accent);
        }

        .crop-image {
            height: 200px;
            object-fit: cover;
            width: 100%;
        }

        .chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }

        .chatbot-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s;
        }

        .chatbot-btn:hover {
            transform: scale(1.1);
        }

        .chatbot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 350px;
            height: 450px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .chatbot-header {
            background-color: var(--primary);
            color: white;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .message {
            max-width: 80%;
            padding: 10px 15px;
            border-radius: 18px;
            margin-bottom: 10px;
        }

        .bot-message {
            background-color: #e8f5e9;
            align-self: flex-start;
            border-bottom-left-radius: 5px;
        }

        .user-message {
            background-color: var(--primary);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 5px;
        }

        .chatbot-input {
            display: flex;
            padding: 10px;
            border-top: 1px solid #eee;
        }

        .chatbot-input input {
            flex: 1;
            border: none;
            padding: 10px;
            border-radius: 20px;
            background-color: #f5f5f5;
        }

        .chatbot-input button {
            background: none;
            border: none;
            color: var(--primary);
            font-size: 1.2rem;
            margin-left: 10px;
            cursor: pointer;
        }

        .loading-spinner {
            text-align: center;
            padding: 20px;
        }

        .model-info {
            background-color: #e8f5e9;
            border-radius: 10px;
            padding: 15px;
            margin-top: 20px;
            font-size: 0.9rem;
        }

        .chart-container {
            margin-top: 30px;
            height: 300px;
        }

        .confidence-badge {
            font-size: 0.9rem;
            padding: 5px 10px;
            border-radius: 15px;
            background-color: var(--secondary);
            color: white;
        }

        .factor-bar {
            height: 8px;
            border-radius: 4px;
            background-color: #e0e0e0;
            margin-bottom: 10px;
        }

        .factor-progress {
            height: 100%;
            border-radius: 4px;
            background-color: var(--primary);
        }

        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1050;
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .interactive-map {
            border-radius: 15px;
            overflow: hidden;
            height: 400px;
            background-color: #e8f5e9;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
        }

        .data-card {
            border-radius: 10px;
            overflow: hidden;
            transition: all 0.3s;
        }

        .data-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .toggle-slider {
            background-color: var(--primary);
        }

        input:checked + .toggle-slider:before {
            transform: translateX(26px);
        }

        .translate-dropdown {
            padding: 8px 12px;
            font-size: 16px;
            border-radius: 6px;
            border: 1px solid #ccc;
            cursor: pointer;
            background-color: #fff;
        }

        .translate-dropdown:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }

        .show {
            display: block !important;
        }

        .flex-show {
            display: flex !important;
        }

        /* Fix for Google Translate element */
        .goog-te-banner-frame {
            display: none !important;
        }
        
        .goog-te-menu-value {
            display: none !important;
        }
        
        #google_translate_element {
            display: none;
        }

        .skiptranslate {
            display: none !important;
        }

        body {
            top: auto !important;
        }

        .google-login-btn {
            margin-top: 15px;
        }
      `}} />
      
      {/* Notification Toast */}
      <div id="notificationToast" className="notification-toast" style={{display: 'none'}}>
        <div id="toastMessage"></div>
      </div>

      {/* Add login/register modals */}
      {showLogin && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
                <button type="button" className="btn-close" onClick={() => setShowLogin(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <div className="text-center mt-3">
                  <div ref={googleButtonRef} className="google-login-btn"></div>
                  <p className="mt-3">Don't have an account? <a href="#" onClick={() => { setShowLogin(false); setShowRegister(true); }}>Register</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal show d-block" tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register</h5>
                <button type="button" className="btn-close" onClick={() => setShowRegister(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
                <div className="text-center mt-3">
                  <p>Already have an account? <a href="#" onClick={() => { setShowRegister(false); setShowLogin(true); }}>Login</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="fas fa-seedling me-2" />CropYield Pro
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#features">Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#prediction">Prediction</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#crops">Crops</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About</a>
              </li>
              <li className="nav-item">
                {isLoggedIn ? (
                  <div className="dropdown">
                    <button className="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      <i className="fas fa-user me-2"></i>
                      {user?.name}
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Profile</a></li>
                      <li><a className="dropdown-item" href="#">My Predictions</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                ) : (
                  <button className="btn btn-outline-light" onClick={() => setShowLogin(true)}>
                    <i className="fas fa-sign-in-alt me-2"></i>Login
                  </button>
                )}
              </li>
              <li className="nav-item ms-2">
                <div className="language-selector">
                  <i className="fas fa-globe me-2"></i>
                  <select 
                    ref={languageSelectRef}
                    value={currentLanguage}
                    onChange={(e) => applyTranslation(e.target.value)}
                    className="form-select"
                  >
                    <option value="en">English</option>
                    <option value="te">Telugu</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">AI-Powered Crop Yield Prediction</h1>
              <p className="lead mb-5">Maximize your harvest with our advanced machine learning models that predict crop yields with 95% accuracy</p>
              <a href="#prediction" className="btn btn-primary btn-lg me-3">Get Prediction</a>
              <a href="#features" className="btn btn-outline-light btn-lg">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">12%</div>
              <div className="stat-label">Average Yield Increase</div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">8,000+</div>
              <div className="stat-label">Farmers Supported</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-number">18</div>
              <div className="stat-label">Crop Types</div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-number">95%</div>
              <div className="stat-label">Prediction Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-cloud-sun" />
                  </div>
                  <h3 className="h4">Weather Analysis</h3>
                  <p>Our system analyzes real-time weather data including temperature, rainfall, and humidity to predict optimal growing conditions.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-seedling" />
                  </div>
                  <h3 className="h4">Soil Health</h3>
                  <p>We evaluate soil quality parameters including pH levels, nitrogen content, and soil type to recommend the best crops for your land.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-brain" />
                  </div>
                  <h3 className="h4">AI Prediction</h3>
                  <p>Our machine learning models process historical data and current conditions to provide accurate yield predictions with confidence scores.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Data Section */}
          <div className="mt-5">
            <h3 className="text-center mb-4">Real-time Agricultural Data</h3>
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="card data-card h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-temperature-high fa-3x text-primary mb-3" />
                    <h4>Weather Conditions</h4>
                    <p>Live weather data from across Andhra Pradesh</p>
                    <div className="mt-3">
                      <span className="badge bg-info" id="weather-temp">{weatherData.temperature}°C</span>
                      <span className="badge bg-primary" id="weather-humidity">{weatherData.humidity}%</span>
                      <span className="badge bg-success" id="weather-rainfall">{weatherData.rainfall}mm</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card data-card h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-seedling fa-3x text-primary mb-3" />
                    <h4>Crop Health Index</h4>
                    <p>Current crop health metrics</p>
                    <div className="progress mt-3" style={{height: '20px'}}>
                      <div className="progress-bar bg-success" role="progressbar" style={{width: '78%'}} aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>78%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="card data-card h-100">
                  <div className="card-body text-center">
                    <i className="fas fa-tint fa-3x text-primary mb-3" />
                    <h4>Soil Moisture Levels</h4>
                    <p>Regional soil moisture data</p>
                    <div className="progress mt-3" style={{height: '20px'}}>
                      <div className="progress-bar bg-info" role="progressbar" style={{width: '65%'}} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>65%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prediction Section */}
      <section id="prediction" className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center">Crop Yield Prediction</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <form id="yieldPredictionForm" onSubmit={handlePrediction} className="prediction-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cropType" className="form-label">Crop Type</label>
                    <select className="form-select" id="cropType" name="cropType" required>
                      <option value="">Select Crop</option>
                      <option value="rice">Rice</option>
                      <option value="wheat">Wheat</option>
                      <option value="corn">Corn</option>
                      <option value="sugarcane">Sugarcane</option>
                      <option value="cotton">Cotton</option>
                      <option value="chillies">Chillies</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="area" className="form-label">Area (acres)</label>
                    <input type="number" className="form-control" id="area" name="area" min="1" required />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="soilType" className="form-label">Soil Type</label>
                    <select className="form-select" id="soilType" name="soilType">
                      <option value="">Select Soil Type</option>
                      <option value="alluvial">Alluvial</option>
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="laterite">Laterite</option>
                      <option value="mountain">Mountain</option>
                      <option value="desert">Desert</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="rainfall" className="form-label">Rainfall (mm)</label>
                    <input type="number" className="form-control" id="rainfall" name="rainfall" step="0.1" value={weatherData.rainfall} readOnly />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="temperature" className="form-label">Temperature (°C)</label>
                    <input type="number" className="form-control" id="temperature" name="temperature" step="0.1" value={weatherData.temperature} readOnly />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="humidity" className="form-label">Humidity (%)</label>
                    <input type="number" className="form-control" id="humidity" name="humidity" step="0.1" value={weatherData.humidity} readOnly />
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                  <button type="submit" className="btn btn-primary me-md-2">
                    <i className="fas fa-calculator me-2"></i>Predict Yield
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    <i className="fas fa-redo me-2"></i>Reset
                  </button>
                </div>
                
                <div id="loadingSpinner" className="loading-spinner" style={{display: 'none'}}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Analyzing data and predicting yield...</p>
                </div>
              </form>
              
              <div id="resultContainer" className="result-container" style={{display: 'none'}}>
                <div className="text-center mb-4">
                  <h3>Prediction Results</h3>
                  <div className="yield-value" id="yieldValue">0 kg</div>
                  <div className="text-muted mb-3" id="yieldPerAcre">Per acre: 0 kg</div>
                  <span className="confidence-badge" id="confidenceBadge">Confidence: 95%</span>
                </div>
                
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h4>Weather Conditions</h4>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Temperature
                        <span id="weather-temp-result">{weatherData.temperature}°C</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Humidity
                        <span id="weather-humidity-result">{weatherData.humidity}%</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Rainfall
                        <span id="weather-rainfall-result">{weatherData.rainfall}mm</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h4>Recommendations</h4>
                    <div className="card recommendation-card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Irrigation</h5>
                        <p className="card-text" id="irrigationRecommendation">Based on your soil and crop type</p>
                      </div>
                    </div>
                    <div className="card recommendation-card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Fertilization</h5>
                        <p className="card-text" id="fertilizerRecommendation">Based on your soil and crop type</p>
                      </div>
                    </div>
                    <div className="card recommendation-card mb-3">
                      <div className="card-body">
                        <h5 className="card-title">Pest Control</h5>
                        <p className="card-text" id="pestRecommendation">Based on your soil and crop type</p>
                      </div>
                    </div>
                    <div className="card recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title">Harvest Timing</h5>
                        <p className="card-text" id="harvestRecommendation">Based on your soil and crop type</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="model-info mt-4">
                  <h5>About Our Prediction Model</h5>
                  <p>Our AI model analyzes historical yield data, weather patterns, soil conditions, and satellite imagery to provide accurate predictions with 95% confidence based on similar conditions in your region.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crops Section */}
      <section id="crops" className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Major Crops in Andhra Pradesh</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://images.unsplash.com/photo-1563227815-4dd1652edb0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmljZSUyMGZpZWxkJTIwaW5kaWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" className="crop-image card-img-top" alt="Rice" />
                <div className="card-body">
                  <h3 className="h5">Rice</h3>
                  <p className="card-text">Andhra Pradesh is a major producer of rice, with optimal growing conditions in the coastal regions.</p>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Season: Kharif & Rabi</small>
                    <small className="text-muted">Yield: 2500-3000 kg/acre</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://images.unsplash.com/photo-1612333973670-7402fd5d0a5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbGxpZXMlMjBjcm9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60" className="crop-image card-img-top" alt="Chillies" />
                <div className="card-body">
                  <h3 className="h5">Chillies</h3>
                  <p className="card-text">Known for the famous Guntur chillies, Andhra Pradesh is India's largest producer and exporter of red chillies.</p>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Season: Kharif</small>
                    <small className="text-muted">Yield: 15-20 qtl/acre</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://images.unsplash.com/photo-1611088139556-5d1c4a2b5c0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVybWVyaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60" className="crop-image card-img-top" alt="Turmeric" />
                <div className="card-body">
                  <h3 className="h5">Turmeric</h3>
                  <p className="card-text">Andhra Pradesh produces high-quality turmeric with excellent medicinal properties.</p>
                  <div className="d-flex justify-content-between">
                    <small className="text-muted">Season: Throughout year</small>
                    <small className="text-muted">Yield: 40-50 tons/acre</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center">About CropYield Pro</h2>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h3>Revolutionizing Agriculture with AI</h3>
              <p>CropYield Pro leverages cutting-edge machine learning algorithms to help farmers in Andhra Pradesh maximize their crop yields and profitability.</p>
              <p>Our system analyzes multiple data points including soil health, weather patterns, historical yield data, and satellite imagery to provide accurate predictions and actionable recommendations.</p>
              <div className="d-flex">
                <div className="me-4 text-center">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Prediction Accuracy</div>
                </div>
                <div className="me-4 text-center">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Farmers Served</div>
                </div>
                <div className="text-center">
                  <div className="stat-number">15</div>
                  <div className="stat-label">Crop Types</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="interactive-map">
                <i className="fas fa-map-marked-alt fa-5x text-muted"></i>
                <p className="mt-3">Interactive map of Andhra Pradesh showing crop distribution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4">
              <h5>CropYield Pro</h5>
              <p>AI-powered crop yield prediction platform for farmers in Andhra Pradesh.</p>
              <div>
                <a href="#" className="social-icon"><i className="fab fa-facebook-f" /></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter" /></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram" /></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in" /></a>
              </div>
            </div>
            <div className="col-md-2 mb-4">
              <h5>Quick Links</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#prediction">Prediction</a></li>
                <li><a href="#crops">Crops</a></li>
                <li><a href="#about">About</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h5>Resources</h5>
              <ul className="list-unstyled footer-links">
                <li><a href="#">Weather Forecast</a></li>
                <li><a href="#">Soil Health</a></li>
                <li><a href="#">Crop Calendar</a></li>
                <li><a href="#">Market Prices</a></li>
                <li><a href="#">Government Schemes</a></li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h5>Contact Us</h5>
              <ul className="list-unstyled">
                <li><i className="fas fa-map-marker-alt me-2" /> Vijayawada, Andhra Pradesh</li>
                <li><i className="fas fa-phone me-2" /> +91 9876543210</li>
                <li><i className="fas fa-envelope me-2" /> info@cropyieldpro.com</li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row">
            <div className="col-md-6">
              <p className="mb-0">&copy; 2023 CropYield Pro. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <a href="#" className="text-light me-3">Privacy Policy</a>
              <a href="#" className="text-light">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <div className="chatbot-container">
        {showChatbot && (
          <div className="chatbot-window">
            <div className="chatbot-header">
              <h6 className="mb-0">CropYield Assistant</h6>
              <button className="btn btn-sm btn-light" onClick={() => setShowChatbot(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        )}
        <div className="chatbot-btn" onClick={() => setShowChatbot(!showChatbot)}>
          <i className={`fas ${showChatbot ? 'fa-times' : 'fa-comments'}`} />
        </div>
      </div>

      {/* Google Translate Element */}
      <div id="google_translate_element" style={{display: 'none'}}></div>
    </div>
  );
};

export default App;