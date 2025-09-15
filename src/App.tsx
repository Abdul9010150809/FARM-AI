import React, { useState, useEffect, useRef, ReactNode, FC } from 'react';
import './App.css';

import CropPrediction from './components/CropPrediction';
// --- ICON IMPORTS ---
import { 
    FaTractor, FaLeaf, FaMobileAlt, FaSatellite, FaRobot, FaChartLine, FaSeedling, FaShieldAlt, 
    FaCloudSunRain, FaMoneyBillWave, FaUsers, FaQuoteLeft, FaRocketchat, FaTimes, FaPaperPlane,
    FaCheckCircle, FaStar, FaSun, FaMoon, FaVolumeUp
} from 'react-icons/fa';
import { 
    FiGlobe, FiCpu, FiTrendingUp, FiBarChart2, FiShield, FiCloud, FiGitBranch, FiLogIn, FiUserPlus, 
    FiMapPin, FiChevronDown, FiMessageCircle, FiX, FiArrowRight
} from 'react-icons/fi';

// --- TYPE DEFINITIONS ---
interface LoginModalProps { show: boolean; onClose: () => void; onLogin: (data: any) => void; onShowRegister: () => void; }
interface RegisterModalProps { show: boolean; onClose: () => void; onRegister: (data: any) => void; onShowLogin: () => void; }
interface Feature { icon: ReactNode; title: string; description: string; }
interface Testimonial { quote: string; name: string; location: string; image: string; }
interface FAQItem { question: string; answer: string; }
interface ChatMessage { text: string; sender: 'bot' | 'user'; quickReplies?: string[]; }
interface Crop { name: string; image: string; description: string; }
// New types for weather and location
interface WeatherInfo { temperature: number; description: string; icon: string; humidity: number; windSpeed: number; }
interface LocationInfo { city: string; state: string; country: string; language: 'en' | 'te' | 'hi'; }

// --- CUSTOM HOOK FOR LOCATION AND WEATHER ---
const useLocationAndWeather = () => {
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
    const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (sessionStorage.getItem('greetingPlayed')) {
            // If we already ran this, use a default to avoid repeated prompts/API calls
            setLocationInfo({ city: 'Tirupati', state: 'Andhra Pradesh', country: 'India', language: 'te' });
            setLoading(false);
            return;
        }

        const getWeatherData = async (latitude: number, longitude: number) => {
            try {
                const API_KEY = 'e14f1c65b9b173352af37d94c4e87c0f';
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                );
                
                if (!response.ok) throw new Error('Weather API request failed');
                
                const data = await response.json();
                
                setWeatherInfo({
                    temperature: Math.round(data.main.temp),
                    description: data.weather[0].description,
                    icon: data.weather[0].icon,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed
                });
            } catch (err) {
                 console.error("Weather API Error:", err);
                 // Mock weather data as fallback
                 setWeatherInfo({
                    temperature: Math.round(28 + Math.random() * 5),
                    description: ['Clear', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
                    icon: '01d',
                    humidity: 65 + Math.floor(Math.random() * 20),
                    windSpeed: 5 + Math.floor(Math.random() * 10)
                });
            }
        };

        const getLocationData = async (latitude: number, longitude: number) => {
            try {
                const response = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                
                if (!response.ok) throw new Error('Geocoding API request failed');
                
                const data = await response.json();
                
                let city = data.city || data.locality || 'Unknown City';
                let state = data.principalSubdivision || 'Unknown State';
                let country = data.countryName || 'Unknown Country';
                let language: 'en' | 'te' | 'hi' = 'en';
                
                // Determine language based on location
                if (state.includes('Andhra') || state.includes('Telangana')) {
                    language = 'te';
                } else if (state.includes('Uttar') || state.includes('Delhi') || state.includes('Bihar')) {
                    language = 'hi';
                }
                
                setLocationInfo({ city, state, country, language });
                playLocationGreeting(city, state, language);
            } catch (err) {
                console.error("Geolocation API Error:", err);
                setError("Could not determine your location.");
                // Fallback to default location
                setLocationInfo({ city: 'Tirupati', state: 'Andhra Pradesh', country: 'India', language: 'te' });
                playLocationGreeting('Tirupati', 'Andhra Pradesh', 'te');
            }
        };

        const playLocationGreeting = (city: string, state: string, language: 'en' | 'te' | 'hi') => {
             if (sessionStorage.getItem('greetingPlayed')) return;
             
             let greetingText = '';
             let langCode = 'en-US';
             
             if (language === 'te') {
                 greetingText = `నమస్కారం, ${city} నుండి రైతులకు స్వాగతం! CropYield-Pro కు మీరు స్వాగతం.`;
                 langCode = 'te-IN';
             } else if (language === 'hi') {
                 greetingText = `नमस्ते, ${city} के किसानों का स्वागत है! आपका CropYield-Pro में स्वागत है।`;
                 langCode = 'hi-IN';
             } else {
                 greetingText = `Hello, and welcome farmers from ${city}! Welcome to CropYield-Pro.`;
                 langCode = 'en-US';
             }
             
             // Only play greeting if speech synthesis is supported
             if ('speechSynthesis' in window) {
                 const utterance = new SpeechSynthesisUtterance(greetingText);
                 utterance.lang = langCode;
                 window.speechSynthesis.speak(utterance);
             }
             
             sessionStorage.setItem('greetingPlayed', 'true');
        };

        // Try to get real location, fallback to mock if denied
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await Promise.all([
                        getWeatherData(latitude, longitude),
                        getLocationData(latitude, longitude)
                    ]);
                    setLoading(false);
                },
                (err) => {
                    console.error("Geolocation Error:", err.message);
                    // Use mock data if geolocation is denied
                    getWeatherData(17.6868, 83.2185); // Vishakhapatnam coordinates
                    getLocationData(17.6868, 83.2185);
                    setLoading(false);
                }
            );
        } else {
            // Browser doesn't support geolocation
            setError("Geolocation is not supported by this browser.");
            setLoading(false);
        }
    }, []);

    return { locationInfo, weatherInfo, error, loading };
};

// --- MOCK/PLACEHOLDER MODAL COMPONENTS (IMPROVED) ---
const LoginModal: React.FC<LoginModalProps> = ({ show, onClose, onShowRegister }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    if (!show) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content-split" onClick={(e) => e.stopPropagation()}>
          <div className="modal-image-side" style={{backgroundImage: "url('https://images.unsplash.com/photo-1599599810606-9c28927a3dbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')"}}>
          </div>
          <div className="modal-form-side">
            <button className="modal-close-btn" onClick={onClose}><FiX /></button>
            <h2>Welcome Back!</h2>
            <p>Login to access your farmer dashboard.</p>
            <form onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email"
                placeholder="Email Address" 
                className="modal-input" 
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                className="modal-input" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="submit" className="modal-submit-btn">Log In</button>
            </form>
            <p className="modal-switch-text">
              New to CropYield-Pro? <button onClick={onShowRegister}>Register Now</button>
            </p>
          </div>
        </div>
      </div>
    );
};

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onClose, onShowLogin }) => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '',
        phone: '',
        farmSize: ''
    });
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState({ score: 0, label: 'Weak', color: '#ff4d4d' });

    if (!show) return null;

    const checkPasswordStrength = (pw: string) => {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/\d/.test(pw)) score++; // has number
        if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++; // has upper and lower
        if (/[^A-Za-z0-9]/.test(pw)) score++; // has special char
        
        const levels = [
            { label: 'Weak', color: '#ff4d4d' },
            { label: 'Fair', color: '#f4a261' },
            { label: 'Good', color: '#e9c46a' },
            { label: 'Strong', color: '#2a9d8f' }
        ];
        setStrength({ score: score, ...levels[score > 0 ? score-1 : 0] });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
        setFormData({
            ...formData,
            password: newPassword
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle registration logic here
        console.log('Registration attempt:', formData);
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content-split" onClick={(e) => e.stopPropagation()}>
                <div className="modal-image-side" style={{backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80')"}}>
                </div>
                <div className="modal-form-side">
                    <button className="modal-close-btn" onClick={onClose}><FiX /></button>
                    <h2>Create Your Account</h2>
                    <p>Join thousands of smart farmers today.</p>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Full Name" 
                            className="modal-input" 
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address" 
                            className="modal-input" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number" 
                            className="modal-input" 
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="text" 
                            name="farmSize"
                            placeholder="Farm Size (acres)" 
                            className="modal-input" 
                            value={formData.farmSize}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Create Password" 
                            className="modal-input" 
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div className="password-strength-meter">
                            <div className="strength-bar-container">
                                {Array.from({ length: 4 }).map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className="strength-bar"
                                        style={{ backgroundColor: idx < strength.score ? strength.color : '#e9ecef'}}
                                    ></div>
                                ))}
                            </div>
                            <span className="strength-label" style={{color: strength.color}}>{strength.label}</span>
                        </div>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Confirm Password" 
                            className="modal-input" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="modal-submit-btn">Register</button>
                    </form>
                    <p className="modal-switch-text">
                        Already have an account? <button onClick={onShowLogin}>Login Here</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- DATA CONSTANTS (with image URLs) ---
const coreFeatures: Feature[] = [
    { icon: <FaChartLine />, title: "AI-Powered Yield Prediction", description: "Get accurate crop yield forecasts using machine learning algorithms trained on historical data, weather patterns, and soil conditions." },
    { icon: <FaCloudSunRain />, title: "Weather Integration", description: "Real-time weather data and forecasts to help you plan irrigation, planting, and harvesting activities with precision." },
    { icon: <FaSeedling />, title: "Soil Health Monitoring", description: "Comprehensive soil analysis with tailored recommendations for fertilization and soil amendment based on nutrient deficiencies." },
    { icon: <FaTractor />, title: "Smart Irrigation Planning", description: "AI-driven irrigation recommendations that conserve water while maximizing crop growth and health." },
    { icon: <FaShieldAlt />, title: "Pest & Disease Management", description: "Early detection and management strategies for pests and diseases specific to your crops and region." },
    { icon: <FiGlobe />, title: "Multi-Language Support", description: "Full support for regional languages including Telugu, Hindi, Tamil, Kannada, and Malayalam for better accessibility." }
];

const aiFeatures: Feature[] = [
    { icon: <FaSatellite />, title: "Satellite Imaging Integration", description: "Monitor crop health from space with NDVI analysis and remote sensing technology for large-scale field assessment." },
    { icon: <FaRobot />, title: "Drone-Based Crop Monitoring", description: "High-resolution aerial imagery and analysis for precise crop health assessment and problem area identification." },
    { icon: <FiCpu />, title: "Disease Detection AI", description: "Upload photos of plant leaves to instantly identify diseases and receive treatment recommendations." },
    { icon: <FiTrendingUp />, title: "Predictive Analytics", description: "Advanced algorithms predict pest outbreaks and market trends based on historical data and weather patterns." }
];

const supportedCrops: Crop[] = [
    { name: 'Rice (Paddy)', image: 'https://images.unsplash.com/photo-1536364124953-8d6c0505f377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', description: 'Optimize water usage and get alerts for blast disease.'},
    { name: 'Cotton', image: 'https://images.unsplash.com/photo-1605658198543-854e7a83a54c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1858&q=80', description: 'Monitor for bollworm pests and get ideal harvest time.'},
    { name: 'Sugarcane', image: 'https://images.unsplash.com/photo-1595738379354-1528892f446b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', description: 'Manage nutrient requirements for maximum sucrose content.'},
    { name: 'Maize (Corn)', image: 'https://images.unsplash.com/photo-1547372332-2a7e7816f134?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', description: 'Forecasts for fall armyworm and irrigation scheduling.'},
    { name: 'Chillies', image: 'https://images.unsplash.com/photo-1526346337-293c6f059275?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', description: 'Insights on preventing fruit rot and managing thrips.'},
    { name: 'Turmeric', image: 'https://images.unsplash.com/photo-1590424564591-370220268a26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80', description: 'Guidance on rhizome rot prevention and curing methods.'}
];

const testimonials: Testimonial[] = [
    { quote: "CropYield-Pro changed the way I farm. The yield prediction was shockingly accurate, and I saved nearly 20% on water thanks to the irrigation advice. My profit has increased significantly.", name: "K. Venkatesh", location: "Chittoor, Andhra Pradesh", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
    { quote: "As a new farmer, I was overwhelmed. This app was like having an experienced guide in my pocket. The step-by-step advice in Telugu was incredibly helpful. I recommend it to everyone.", name: "Anjali Reddy", location: "Guntur, Andhra Pradesh", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80" },
    { quote: "The market price tracking is a game-changer. I used to rely on hearsay, but now I have real-time data. I held my turmeric crop for two extra weeks and earned a 15% higher price.", name: "R. Sharma", location: "Kurnool, Andhra Pradesh", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" },
    { quote: "The satellite imaging feature identified a nutrient deficiency in a corner of my field I would have missed. Saved a significant portion of my cotton crop. This technology is the future.", name: "Priya Singh", location: "Warangal, Telangana", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" }
];

const faqData: FAQItem[] = [
    { question: "How accurate are the yield predictions?", answer: "Our AI models achieve 92-95% accuracy for most major crops by analyzing historical data, weather patterns, soil conditions, and satellite imagery specific to your region." },
    { question: "Do I need special equipment to use CropYield-Pro?", answer: "No special equipment is needed. The app works on any smartphone with internet access. For enhanced features, optional IoT sensors can be integrated but are not required." },
    { question: "How does the app handle different regional languages?", answer: "CropYield-Pro supports multiple Indian languages including Telugu, Hindi, Tamil, Kannada, and Malayalam. The interface and recommendations are automatically translated, and we offer voice-based assistance in regional languages." },
    { question: "Is my farm data secure and private?", answer: "Yes, we take data privacy seriously. Your farm data is encrypted and never shared with third parties without your consent. You own your data and can delete it at any time." },
    { question: "Is CropYield-Pro completely free?", answer: "Yes! Our platform is completely free for all farmers as part of our mission to support agriculture and food security. We're funded by agricultural research grants and government partnerships." }
];

// --- HELPER & UI COMPONENTS ---
const Header: React.FC<{ 
    onLoginClick: () => void; 
    onRegisterClick: () => void; 
    language: string; 
    setLanguage: (lang: string) => void; 
    theme: string; 
    toggleTheme: () => void; 
    locationInfo: LocationInfo | null;
    weatherInfo: WeatherInfo | null;
}> = ({ onLoginClick, onRegisterClick, language, setLanguage, theme, toggleTheme, locationInfo, weatherInfo }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo">
                        <FaLeaf className="logo-icon" />
                        <span>CropYield-Pro</span>
                    </div>
                    
                    <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
                        <a href="#features">Features</a>
                        <a href="#crops">Crops</a>
                        <a href="#testimonials">Testimonials</a>
                        <a href="#faq">FAQ</a>
                    </nav>

                    <div className="header-actions">
                        {locationInfo && weatherInfo && (
                            <div className="weather-widget">
                                <img 
                                    src={`https://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`} 
                                    alt={weatherInfo.description}
                                    className="weather-icon"
                                />
                                <div className="weather-details">
                                    <span className="weather-temp">{weatherInfo.temperature}°C</span>
                                    <span className="weather-location">{locationInfo.city}</span>
                                </div>
                            </div>
                        )}

                        <div className="language-selector">
                            <FiGlobe />
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as 'en' | 'te' | 'hi')}
                            >
                                <option value="en">English</option>
                                <option value="te">Telugu</option>
                                <option value="hi">Hindi</option>
                            </select>
                        </div>

                        <button className="theme-toggle" onClick={toggleTheme}>
                            {theme === 'light' ? <FaMoon /> : <FaSun />}
                        </button>

                        <button className="btn btn-outline" onClick={onLoginClick}>
                            <FiLogIn /> Login
                        </button>
                        <button className="btn btn-primary" onClick={onRegisterClick}>
                            <FiUserPlus /> Register
                        </button>

                        <button 
                            className="mobile-menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

const HeroSection: React.FC<{ onRegisterClick: () => void; locationInfo: LocationInfo | null; }> = ({ onRegisterClick, locationInfo }) => {
    return (
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="welcome-tag">
                            <FaVolumeUp /> 
                            {locationInfo ? (
                                locationInfo.language === 'te' ? 
                                    `నమస్కారం ${locationInfo.city} నుండి రైతులకు!` : 
                                locationInfo.language === 'hi' ?
                                    `नमस्ते ${locationInfo.city} के किसानों!` :
                                    `Welcome farmers from ${locationInfo.city}!`
                            ) : "Welcome to CropYield-Pro!"}
                        </div>
                        <h1>Transform Your Farming with AI-Powered Insights</h1>
                        <p>CropYield-Pro helps farmers maximize yields, reduce costs, and make data-driven decisions using cutting-edge artificial intelligence and satellite technology.</p>
                        <div className="hero-actions">
                            <button className="btn btn-primary btn-large" onClick={onRegisterClick}>
                                Get Started Free
                            </button>
                            <button className="btn btn-outline btn-large">
                                Watch Demo
                            </button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">95%</span>
                                <span className="stat-label">Prediction Accuracy</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">8K+</span>
                                <span className="stat-label">Farmers Supported</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">18</span>
                                <span className="stat-label">Crop Types</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Free Forever</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img 
                            src="https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1772&q=80" 
                            alt="Farmer using smartphone in field" 
                        />
                        <div className="floating-card floating-card-1">
                            <FaChartLine />
                            <span>Yield increased by 27%</span>
                        </div>
                        <div className="floating-card floating-card-2">
                            <FaCloudSunRain />
                            <span>Water usage reduced by 35%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const HowItWorksSection: React.FC = () => {
    const steps = [
        { number: 1, title: "Sign Up & Set Up", description: "Create your account and input your farm details, crop types, and location." },
        { number: 2, title: "Get AI Analysis", description: "Our system analyzes your data along with weather, soil, and satellite information." },
        { number: 3, title: "Receive Recommendations", description: "Get personalized advice on irrigation, fertilization, and pest control." },
        { number: 4, title: "Monitor & Improve", description: "Track your progress and adjust practices based on real-time data and insights." }
    ];

    return (
        <section className="how-it-works">
            <div className="container">
                <h2>How It Works</h2>
                <p className="section-subtitle">Transforming agriculture through technology in four simple steps</p>
                
                <div className="steps">
                    {steps.map((step, index) => (
                        <div key={index} className="step">
                            <div className="step-number">{step.number}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CoreFeaturesSection: React.FC = () => {
    return (
        <section className="core-features" id="features">
            <div className="container">
                <h2>Core Features</h2>
                <p className="section-subtitle">Everything you need to make informed farming decisions</p>
                
                <div className="features-grid">
                    {coreFeatures.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AIFeaturesSection: FC = () => {
    const featureImages = [
        'https://images.unsplash.com/photo-1574027542828-98e35764b434?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1738&q=80',
        'https://images.unsplash.com/photo-1615598197904-a69c67990185?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        'https://images.unsplash.com/photo-1631194758628-71e45a537b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
    ];
    
    return (
        <section className="ai-features">
            <div className="container">
                <h2>Powered by Cutting-Edge AI</h2>
                <p className="section-subtitle">Go beyond traditional farming with our advanced data science and machine learning capabilities</p>
                
                <div className="ai-features-list">
                    {aiFeatures.map((feature, index) => (
                        <div key={index} className="ai-feature-item">
                            <div className="ai-feature-content">
                                <div className="ai-feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                                <button className="learn-more-btn">
                                    Learn More <FiArrowRight />
                                </button>
                            </div>
                            <div className="ai-feature-image">
                                <img src={featureImages[index]} alt={feature.title} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const SupportedCropsSection: React.FC = () => {
    return (
        <section className="supported-crops" id="crops">
            <div className="container">
                <h2>Expertise Across Your Crops</h2>
                <p className="section-subtitle">We provide specialized models and advice for all major crops in the region</p>
                
                <div className="crops-grid">
                    {supportedCrops.map((crop, index) => (
                        <div key={index} className="crop-card">
                            <div 
                                className="crop-image"
                                style={{ backgroundImage: `url(${crop.image})` }}
                            ></div>
                            <div className="crop-content">
                                <h3>{crop.name}</h3>
                                <p>{crop.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection: React.FC = () => {
    return (
        <section className="testimonials" id="testimonials">
            <div className="container">
                <h2>Trusted by Farmers Across India</h2>
                <p className="section-subtitle">Hear what real farmers have to say about their success with CropYield-Pro</p>
                
                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="testimonial-stars">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                            </div>
                            <p className="testimonial-quote">"{testimonial.quote}"</p>
                            <div className="testimonial-author">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="testimonial-avatar"
                                />
                                <div className="testimonial-info">
                                    <div className="testimonial-name">{testimonial.name}</div>
                                    <div className="testimonial-location">
                                        <FiMapPin /> {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq" id="faq">
            <div className="container">
                <h2>Frequently Asked Questions</h2>
                <p className="section-subtitle">Find answers to common questions about CropYield-Pro</p>
                
                <div className="faq-list">
                    {faqData.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <div 
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3>{faq.question}</h3>
                                <FiChevronDown className="faq-arrow" />
                            </div>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CTASection: React.FC<{onRegisterClick: () => void;}> = ({onRegisterClick}) => {
    return (
        <section className="cta">
            <div className="container">
                <div className="cta-content">
                    <h2>Ready to Transform Your Farming?</h2>
                    <p>Join thousands of farmers who are already increasing their yields and profits with CropYield-Pro - completely free!</p>
                    <button className="btn btn-primary btn-large" onClick={onRegisterClick}>
                        Start Your Free Account
                    </button>
                    <div className="cta-guarantee">
                        <FaCheckCircle /> No credit card required • Free forever • Government supported
                    </div>
                </div>
            </div>
        </section>
    );
};

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <FaLeaf /> CropYield-Pro
                        </div>
                        <p>Transforming agriculture through AI-powered insights and technology</p>
                        <div className="social-links">
                            <a href="#"><FaRocketchat /></a>
                            <a href="#"><FaUsers /></a>
                            <a href="#"><FaCloudSunRain /></a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Product</h3>
                        <a href="#features">Features</a>
                        <a href="#crops">Crops</a>
                        <a href="#testimonials">Testimonials</a>
                        <a href="#faq">FAQ</a>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Company</h3>
                        <a href="#">About Us</a>
                        <a href="#">Blog</a>
                        <a href="#">Careers</a>
                        <a href="#">Contact</a>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Legal</h3>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Policy</a>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2023 CropYield-Pro. All rights reserved. Funded by the Ministry of Agriculture & Farmers' Welfare.</p>
                </div>
            </div>
        </footer>
    );
};

const Chatbot: FC<{ location: LocationInfo | null, weather: WeatherInfo | null }> = ({ location, weather }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([{ 
        text: "Hello! I am your Agri-Assistant. How can I help you today?", 
        sender: 'bot',
        quickReplies: ["Weather Forecast", "Rice Diseases", "Market Prices"]
    }]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (inputText: string) => {
  // Explicitly type the new message object
  const userMessage: ChatMessage = {
    text: inputText,
    sender: 'user' 
  };
  
  // Now TypeScript knows userMessage is a valid ChatMessage
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);

  // Example for a bot response
  const botResponse: ChatMessage = {
    text: 'This is a reply.',
    sender: 'bot'
  };
  setMessages([...updatedMessages, botResponse]);
};

    const getBotResponse = (userInput: string): ChatMessage => {
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes("weather")) {
            if (weather && location) {
                return { 
                    text: `The current weather in ${location.city} is ${weather.temperature}°C with ${weather.description}. Humidity is ${weather.humidity}% and wind speed is ${weather.windSpeed} km/h.`, 
                    sender: 'bot', 
                    quickReplies: ["Rice Diseases", "Market Prices"] 
                };
            }
            return { 
                text: "I'm still fetching the latest weather data. Please try again in a moment!", 
                sender: 'bot' 
            };
        }
        if (lowerInput.includes("rice") && (lowerInput.includes("disease") || lowerInput.includes("diseases"))) {
            return { 
                text: "A common disease in rice is 'Blast', characterized by leaf spots. We recommend using a fungicide like Tricyclazole for treatment. Would you like to know more?", 
                sender: 'bot', 
                quickReplies: ["Tell me more about Blast", "What about other pests?"] 
            };
        }
        if (lowerInput.includes("market price") || lowerInput.includes("mandi")) {
            return { 
                text: "Today, the average market price for Grade-A Turmeric in the Guntur market is ₹7,500 per quintal.", 
                sender: 'bot', 
                quickReplies: ["Price for Cotton?", "Weather Forecast"]
            };
        }
        if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
            return { 
                text: "Hello there! How can I assist you with your farming needs today?", 
                sender: 'bot', 
                quickReplies: ["Weather Forecast", "Rice Diseases", "Market Prices"] 
            };
        }
        return { 
            text: "I'm sorry, I can only answer questions about weather, crop diseases, and market prices for now. Please try asking about one of those topics.", 
            sender: 'bot', 
            quickReplies: ["Weather Forecast", "Rice Diseases", "Market Prices"] 
        };
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>Agri-Assistant</h3>
                        <button onClick={() => setIsOpen(false)}>
                            <FiX />
                        </button>
                    </div>
                    
                    <div className="chatbot-messages">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.sender}`}>
                                <p>{message.text}</p>
                                {message.quickReplies && (
                                    <div className="quick-replies">
                                        {message.quickReplies.map((reply, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => handleSend(reply)}
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="chatbot-input">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                        />
                        <button onClick={() => handleSend(input)}>
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
            
            <button 
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiMessageCircle />
            </button>
        </div>
    );
};

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
    const [modalState, setModalState] = useState({ loginOpen: false, registerOpen: false });
    const { locationInfo, weatherInfo, error, loading } = useLocationAndWeather();
    const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Update language in state when hook provides it
    useEffect(() => {
        if (locationInfo) {
            setLanguage(locationInfo.language);
        }
    }, [locationInfo]);
    
    // Handlers for Modals
    const handleShowLogin = () => setModalState({ loginOpen: true, registerOpen: false });
    const handleShowRegister = () => setModalState({ loginOpen: false, registerOpen: true });
    const handleCloseModals = () => setModalState({ loginOpen: false, registerOpen: false });
    const handleLoginSubmit = (data: any) => { 
        console.log("Login data:", data); 
        handleCloseModals(); 
    };
    const handleRegisterSubmit = (data: any) => { 
        console.log("Register data:", data); 
        handleCloseModals(); 
    };
 
    // Theme Toggle Logic
    const toggleTheme = () => setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <div className="app">
            <LoginModal 
                show={modalState.loginOpen} 
                onClose={handleCloseModals} 
                onLogin={handleLoginSubmit} 
                onShowRegister={handleShowRegister} 
            />
            <RegisterModal 
                show={modalState.registerOpen} 
                onClose={handleCloseModals} 
                onRegister={handleRegisterSubmit} 
                onShowLogin={handleShowLogin} 
            />
            
            <Header 
                onLoginClick={handleShowLogin} 
                onRegisterClick={handleShowRegister}
                language={language}
                setLanguage={(lang: string) => setLanguage(lang as 'en' | 'te' | 'hi')}
                theme={theme}
                toggleTheme={toggleTheme}
                locationInfo={locationInfo}
                weatherInfo={weatherInfo}
            />
            
            <main>
                <HeroSection onRegisterClick={handleShowRegister} locationInfo={locationInfo} />
                <HowItWorksSection />
                <CoreFeaturesSection />
                <AIFeaturesSection />
                <SupportedCropsSection />
                <TestimonialsSection />
                <FAQSection />
                <CTASection onRegisterClick={handleShowRegister} />
            </main>
            
            <Footer />
            <Chatbot location={locationInfo} weather={weatherInfo} />
        </div>
    );
};

export default App;