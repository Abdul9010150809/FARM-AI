import React, { useState, useEffect, useRef } from "react";

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
    };
  }
}

const App = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your CropYield Assistant. How can I help you with your farming questions today?", sender: 'bot' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const languageSelectRef = useRef<HTMLSelectElement>(null);

  // Function to handle chatbot messages
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage('');

    // Generate bot response after a short delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    }, 1000);
  };

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I assist you with your farming queries today?";
    } else if (lowerMessage.includes('yield') || lowerMessage.includes('prediction')) {
      return "Our yield predictions use machine learning models trained on historical data, weather patterns, and soil conditions. You can get a prediction by filling out the form in the Prediction section.";
    } else if (lowerMessage.includes('rice') || lowerMessage.includes('paddy')) {
      return "For rice cultivation, we recommend maintaining proper water levels, using nitrogen-rich fertilizers, and monitoring for common pests like stem borers. The optimal temperature for rice is between 20-35°C.";
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return "Our platform integrates real-time weather data to provide accurate predictions. You can check current weather conditions in the Features section.";
    } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer')) {
      return "Soil health is crucial for good yields. We recommend testing your soil every season and using fertilizers based on the nutrient deficiencies. Our platform can provide specific recommendations based on your soil type.";
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return "For pest control, we recommend integrated pest management approaches. Regular monitoring, biological controls, and targeted pesticide use can help manage pests effectively while minimizing environmental impact.";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else you'd like to know?";
    } else {
      return "I'm here to help with agricultural advice. You can ask me about crop yields, weather impacts, soil health, or pest management. How can I assist you?";
    }
  };

  // Function to show notification
  const showNotification = (message: string, type = 'info') => {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.style.display = 'block';
      
      // Hide after 5 seconds
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
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
    // Initialize weather data
    setTimeout(() => {
      const tempElement = document.getElementById('weather-temp');
      const humidityElement = document.getElementById('weather-humidity');
      const rainfallElement = document.getElementById('weather-rainfall');
      
      if (tempElement) tempElement.textContent = '32°C';
      if (humidityElement) humidityElement.textContent = '78%';
      if (rainfallElement) rainfallElement.textContent = '45mm';
    }, 1000);

    // Initialize form submission
    const form = document.getElementById('yieldPredictionForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultContainer = document.getElementById('resultContainer');
        
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        
        // Simulate prediction process
        setTimeout(() => {
          if (loadingSpinner) loadingSpinner.style.display = 'none';
          if (resultContainer) resultContainer.style.display = 'block';
          
          // Generate random yield value
          const yieldValue = Math.floor(Math.random() * 2000) + 1000;
          const yieldElement = document.getElementById('yieldValue');
          const yieldPerAcreElement = document.getElementById('yieldPerAcre');
          
          if (yieldElement) yieldElement.textContent = yieldValue + ' kg';
          if (yieldPerAcreElement) yieldPerAcreElement.textContent = 'Per acre: ' + Math.floor(yieldValue / 2) + ' kg';
          
          // Generate recommendations
          const cropTypeSelect = document.getElementById('cropType') as HTMLSelectElement;
          const cropType = cropTypeSelect ? cropTypeSelect.value : 'crop';
          
          const irrigationElement = document.getElementById('irrigationRecommendation');
          const fertilizerElement = document.getElementById('fertilizerRecommendation');
          const pestElement = document.getElementById('pestRecommendation');
          const harvestElement = document.getElementById('harvestRecommendation');
          
          if (irrigationElement) irrigationElement.textContent = 
            `For ${cropType}, we recommend irrigation every 3 days during dry seasons.`;
          if (fertilizerElement) fertilizerElement.textContent = 
            `Use nitrogen-rich fertilizer for ${cropType} during the growth phase.`;
          if (pestElement) pestElement.textContent = 
            `Monitor for common pests in ${cropType} and use organic pesticides when detected.`;
          if (harvestElement) harvestElement.textContent = 
            `Optimal harvest time for ${cropType} is typically 90-120 days after planting.`;
        }, 3000);
      });
    }
  }, []);

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
        }

        #hero-video {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100%;
            min-height: 100%;
            width: auto;
            height: auto;
            z-index: -1;
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
      `}} />

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
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <div className="language-selector">
                  <select 
                    id="language" 
                    onChange={(e) => applyTranslation(e.target.value)}
                    value={currentLanguage}
                    ref={languageSelectRef}
                  >
                    <option value="en">English</option>
                    <option value="te">Telugu</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="kn">Kannada</option>
                    <option value="ml">Malayalam</option>
                  </select>
                </div>
                <div id="google_translate_element" />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <video autoPlay loop muted playsInline id="hero-video">
          <source src="C:\Users\91901\Downloads\SIH\Vision\Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h1 className="display-4 fw-bold mb-4">AI-Powered Crop Yield Prediction</h1>
              <p className="lead mb-4">Maximize your agricultural productivity with our AI-driven platform that
                provides accurate yield predictions and actionable recommendations tailored to your crops and
                regional conditions in Andhra Pradesh.</p>
              <a href="#prediction" className="btn btn-lg btn-primary me-2">Get Prediction</a>
              <a href="#features" className="btn btn-lg btn-outline-light">Learn More</a>
            </div>
          </div>
        </div>
      </section>

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
        <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center section-title">How Our Platform Helps Farmers</h2>
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-brain" />
                  </div>
                  <h3 className="h4">Machine Learning Models</h3>
                  <p className="card-text">Our AI models analyze historical data, weather patterns, and soil
                    conditions to predict yields with 95% accuracy.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-cloud-sun" />
                  </div>
                  <h3 className="h4">Weather Analysis</h3>
                  <p className="card-text">Real-time weather data integration for accurate predictions and
                    recommendations based on current and forecasted conditions.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-vial" />
                  </div>
                  <h3 className="h4">Soil Health Monitoring</h3>
                  <p className="card-text">Comprehensive soil health metrics analysis to provide tailored
                    fertilization and irrigation recommendations.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-chart-line" />
                  </div>
                  <h3 className="h4">Yield Prediction</h3>
                  <p className="card-text">Advanced AI algorithms predict crop yields with high accuracy based on
                    historical data and current conditions.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-tint" />
                  </div>
                  <h3 className="h4">Irrigation Optimization</h3>
                  <p className="card-text">Smart irrigation recommendations to conserve water while maximizing
                    crop growth and health.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card feature-card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-spray-can" />
                  </div>
                  <h3 className="h4">Pest Control</h3>
                  <p className="card-text">Early detection and management strategies for pests and diseases
                    specific to your crops and region.</p>
                </div>
              </div>
            </div>
          </div>
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
                      <span className="badge bg-info" id="weather-temp">Loading...</span>
                      <span className="badge bg-primary" id="weather-humidity">Loading...</span>
                      <span className="badge bg-success" id="weather-rainfall">Loading...</span>
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
                      <div className="progress-bar bg-success" role="progressbar" id="crop-health-bar" style={{width: '78%'}} aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>78%
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
                      <div className="progress-bar bg-info" role="progressbar" id="soil-moisture-bar" style={{width: '65%'}} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>65%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="prediction" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center section-title">Crop Yield Prediction</h2>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="prediction-form">
                <form id="yieldPredictionForm">
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="cropType" className="form-label">Crop Type</label>
                      <select className="form-select" id="cropType" required>
                        <option value="" disabled>Select crop type</option>
                        <option value="rice">Rice</option>
                        <option value="wheat">Wheat</option>
                        <option value="corn">Corn</option>
                        <option value="sugarcane">Sugarcane</option>
                        <option value="cotton">Cotton</option>
                        <option value="pulses">Pulses</option>
                        <option value="chillies">Chillies</option>
                        <option value="turmeric">Turmeric</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="region" className="form-label">Region</label>
                      <select className="form-select" id="region" required>
                        <option value="" disabled>Select your region</option>
                        <option value="coastal">Coastal Andhra</option>
                        <option value="rayalaseema">Rayalaseema</option>
                        <option value="northern">Northern Andhra</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="soilType" className="form-label">Soil Type</label>
                      <select className="form-select" id="soilType" required>
                        <option value="" disabled>Select soil type</option>
                        <option value="alluvial">Alluvial</option>
                        <option value="black">Black</option>
                        <option value="red">Red</option>
                        <option value="laterite">Laterite</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="area" className="form-label">Area (acres)</label>
                      <input type="number" className="form-control" id="area" placeholder="Enter land area" min={1} required />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="rainfall" className="form-label">Rainfall (mm)</label>
                      <input type="number" className="form-control" id="rainfall" placeholder="Enter expected rainfall" min={0} required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="temperature" className="form-label">Avg. Temperature (°C)</label>
                      <input type="number" className="form-control" id="temperature" placeholder="Enter temperature" required />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="humidity" className="form-label">Avg. Humidity (%)</label>
                      <input type="number" className="form-control" id="humidity" placeholder="Enter humidity" min={0} max={100} required />
                    </div>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="fas fa-calculator me-2" />Predict Yield
                    </button>
                  </div>
                </form>
              </div>
              <div className="loading-spinner" id="loadingSpinner" style={{display: 'none'}}>
                <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Running ML prediction models...</p>
                <div className="progress training-progress w-50 mx-auto">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '0%'}} />
                </div>
              </div>
              <div className="result-container" id="resultContainer" style={{display: 'none'}}>
                <div className="text-center mb-4">
                  <h3>Yield Prediction Results</h3>
                  <div className="yield-value" id="yieldValue">0 kg</div>
                  <p className="text-muted" id="yieldPerAcre">Per acre: 0 kg</p>
                  <span className="confidence-badge" id="confidenceBadge">
                    <i className="fas fa-brain me-1" /> Confidence: 92%
                  </span>
                  <p className="prediction-interval mt-2" id="predictionInterval">Prediction interval: 0 - 0 kg
                  </p>
                </div>
                <div className="chart-container">
                  <canvas id="yieldChart" />
                </div>
                <div className="model-info">
                  <h5><i className="fas fa-info-circle me-2" />Model Insights:</h5>
                  <p id="modelInsights">Our Random Forest model analyzed 15 factors including weather
                    patterns, soil composition, and historical data to generate this prediction.</p>
                  <div className="mt-3">
                    <h6>Key Factors Influencing This Prediction:</h6>
                    <div className="mt-2" id="factorBars">
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-tint me-2" />Irrigation Recommendation
                        </h5>
                        <p className="card-text" id="irrigationRecommendation">Recommendation will appear
                          here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-seedling me-2" />Fertilization
                          Recommendation</h5>
                        <p className="card-text" id="fertilizerRecommendation">Recommendation will appear
                          here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-bug me-2" />Pest Control
                          Recommendation</h5>
                        <p className="card-text" id="pestRecommendation">Recommendation will appear here</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-calendar-alt me-2" />Harvest Timing
                        </h5>
                        <p className="card-text" id="harvestRecommendation">Recommendation will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-outline-primary" onClick={resetForm}>
                    <i className="fas fa-redo me-2" />Make Another Prediction
                  </button>
                </div>
              </div>
            </div>
            </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="text-center section-title">Regional Yield Potential</h2>
          <p className="text-center mb-4">Explore the agricultural potential across different regions of Andhra Pradesh</p>
          <div className="interactive-map">
            <div className="text-center p-4">
              <i className="fas fa-map-marked-alt fa-5x text-primary mb-3" />
              <h3>Interactive Agricultural Map</h3>
              <p className="text-muted">Visualize soil quality, water availability, and crop suitability across
                regions</p>
              <button className="btn btn-primary mt-3" onClick={() => showNotification('Map feature coming soon!', 'info')}>
                <i className="fas fa-map me-2" />Explore Map
              </button>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">Regional Analysis</h4>
                  <p>Compare different regions based on agricultural productivity potential:</p>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Coastal Andhra</span>
                      <span className="badge bg-success">High Potential</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Rayalaseema</span>
                      <span className="badge bg-warning">Medium Potential</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Northern Andhra</span>
                      <span className="badge bg-success">High Potential</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="card-title">Soil Quality Index</h4>
                  <p>Current soil quality metrics across regions:</p>
                  <div className="mt-3">
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Alluvial Soil</span>
                        <span>92%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-success" role="progressbar" style={{width: '92%'}}>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Black Soil</span>
                        <span>85%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-primary" role="progressbar" style={{width: '85%'}}>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Red Soil</span>
                        <span>78%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-warning" role="progressbar" style={{width: '78%'}}>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between">
                        <span>Laterite Soil</span>
                        <span>65%</span>
                      </div>
                      <div className="progress" style={{height: '10px'}}>
                        <div className="progress-bar bg-info" role="progressbar" style={{width: '65%'}} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Rest of the component remains the same as in the previous version */}
      {/* Only the parts with issues are fixed below */}

      <section id="crops" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center section-title">Supported Crops</h2>
          <div className="row">
           <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://www.nextechagrisolutions.com/blog/wp-content/uploads/2014/11/Rice-Parts.jpg" className="card-img-top crop-image" alt="Rice" />
                <div className="card-body">
                  <h3 className="h5">Rice</h3>
                  <p className="card-text">Get optimized irrigation and fertilization plans for higher rice yields
                    with our AI-powered platform.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-success">Neural Network</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://www.farmatma.in/wp-content/uploads/2019/05/wheat-cultivation-india.jpg" className="card-img-top crop-image" alt="Wheat" />
                <div className="card-body">
                  <h3 className="h5">Wheat</h3>
                  <p className="card-text">Maximize your wheat production with precise predictions and tailored
                    recommendations.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-info">Gradient Boosting</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://cdn.britannica.com/36/167236-050-BF90337E/Ears-corn.jpg" className="card-img-top crop-image" alt="Corn" />
                <div className="card-body">
                  <h3 className="h5">Corn</h3>
                  <p className="card-text">Optimize your corn cultivation with data-driven insights on irrigation
                    and fertilization.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-warning">XGBoost</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://a-z-animals.com/media/2022/07/shutterstock_767632852.jpg" className="card-img-top crop-image" alt="Sugarcane" />
                <div className="card-body">
                  <h3 className="h5">Sugarcane</h3>
                  <p className="card-text">Increase your sugarcane yield with precision farming recommendations.
                  </p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-success">Neural Network</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://wallpapercave.com/wp/wp8255679.jpg" className="card-img-top crop-image" alt="Chillies" />
                <div className="card-body">
                  <h3 className="h5">Chillies</h3>
                  <p className="card-text">Optimize chilli cultivation with our specialized prediction models.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-info">Gradient Boosting</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="crop-card card h-100">
                <img src="https://www.healthifyme.com/blog/wp-content/uploads/2022/01/Turmeric-1-1024x683.jpg" className="card-img-top crop-image" alt="Turmeric" onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1611088139556-5d1c4a2b5c0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHVybWVyaWN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60';
                }} />
                <div className="card-body">
                  <h3 className="h5">Turmeric</h3>
                  <p className="card-text">Maximize your turmeric yield with tailored irrigation and pest control
                    plans.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Random Forest</span>
                    <span className="badge bg-warning">XGBoost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

           
      <section id="about" className="py-5">
        <div className="container">
          <h2 className="text-center section-title">About CropYield Pro</h2>
          <div className="row">
            <div className="col-lg-6">
              <h3>Our Mission</h3>
              <p>CropYield Pro was founded with a simple mission: to empower farmers with AI-driven insights that
                maximize crop yields while minimizing environmental impact. We combine cutting-edge machine
                learning with agricultural expertise to deliver
                accurate predictions and actionable recommendations.</p>
              <p>Our platform is designed specifically for the diverse agricultural landscape of Andhra Pradesh, taking
                into account regional variations in soil, climate, and farming practices.</p>
              <h3 className="mt-4">Our Technology</h3>
              <p>We utilize multiple machine learning models including Random Forest, Neural Networks, and
                Gradient Boosting algorithms trained on thousands of data points from farms across Andhra Pradesh. Our
                models continuously learn and improve as more
                data becomes available.</p>
            </div>
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h4>Why Choose CropYield Pro?</h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" />
                      Accurate predictions with 95%+ accuracy</li>
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" />
                      Tailored to Andhra Pradesh's agricultural conditions</li>
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" />
                      Multi-language support for local farmers</li>
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" />
                      Real-time weather and soil data integration</li>
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" />
                      Actionable recommendations for improved yield</li>
                    <li className="list-group-item"><i className="fas fa-check-circle text-success me-2" /> Free
                      basic service with premium options</li>
                  </ul>
                </div>
              </div>
            </div>
            </div>
        </div>
      </section>

      <section id="contact" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center section-title">Contact Us</h2>
          <div className="row">
            <div className="col-lg-6">
              <form id="contactForm">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name</label>
                  <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input type="text" className="form-control" id="subject" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea className="form-control" id="message" rows={5} required defaultValue={""} />
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-body">
                  <h4>Get In Touch</h4>
                  <p>We'd love to hear from you. Whether you have questions about our platform, need technical
                    support, or want to partner with us, reach out to our team.</p>
                  <div className="mt-4">
                    <h5><i className="fas fa-map-marker-alt me-2" />Address</h5>
                    <p>123 Agriculture Street, Vijayawada, Andhra Pradesh 520001</p>
                    <h5 className="mt-3"><i className="fas fa-phone me-2" />Phone</h5>
                    <p>+91 98765 43210</p>
                    <h5 className="mt-3"><i className="fas fa-envelope me-2" />Email</h5>
                    <p>support@cropyieldpro.com</p>
                    <h5 className="mt-3"><i className="fas fa-clock me-2" />Business Hours</h5>
                    <p>Monday - Friday: 9AM - 5PM<br />Saturday: 10AM - 2PM</p>
                  </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4 mb-lg-0">
              <h4 className="text-uppercase mb-4">CropYield Pro</h4>
              <p>AI-powered crop yield prediction platform designed to help Andhra Pradesh farmers maximize their
                agricultural productivity through data-driven insights.</p>
              <div className="mt-3">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f" /></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter" /></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram" /></a>
                <a href="#" className="social-icon"><i className="fab fa-linkedin-in" /></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube" /></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Quick Links</h5>
              <ul className="list-unstyled footer-links">
                <li className="mb-2"><a href="#home">Home</a></li>
                <li className="mb-2"><a href="#features">Features</a></li>
                <li className="mb-2"><a href="#prediction">Prediction</a></li>
                <li className="mb-2"><a href="#crops">Crops</a></li>
                <li className="mb-2"><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
              <h5 className="text-uppercase mb-4">Resources</h5>
              <ul className="list-unstyled footer-links">
                <li className="mb-2"><a href="#">Blog</a></li>
                <li className="mb-2"><a href="#">FAQs</a></li>
                <li className="mb-2"><a href="#">Tutorials</a></li>
                <li className="mb-2"><a href="#">Research Papers</a></li>
                <li><a href="#">Case Studies</a></li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-4">
              <h5 className="text-uppercase mb-4">Newsletter</h5>
              <p>Subscribe to our newsletter for the latest updates on agricultural technology and tips.</p>
              <form className="footer-newsletter">
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Your email address" aria-label="Email" />
                  <button className="btn btn-primary" type="button">Subscribe</button>
                </div>
              </form>
              <div className="app-badges mt-3">
                <p className="mb-2">Download our mobile app:</p>
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" /></a>
                <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" /></a>
              </div>
            </div>
          </div>
          <div className="footer-bottom text-center">
            <p className="mb-0">© 2023 CropYield Pro. All rights reserved.</p>
            <div className="mt-2">
              <a href="#" className="text-white me-3">Privacy Policy</a>
              <a href="#" className="text-white me-3">Terms of Service</a>
              <a href="#" className="text-white">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="chatbot-container">
        <div className="chatbot-btn" onClick={() => setShowChatbot(!showChatbot)}>
          <i className="fas fa-robot fa-2x" />
        </div>
        {showChatbot && (
          <div className="chatbot-window flex-show">
            <div className="chatbot-header">
              <h5 className="mb-0">CropYield Assistant</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowChatbot(false)} />
            </div>
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <div className="chatbot-input">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message here..." 
              />
              <button onClick={handleSendMessage}><i className="fas fa-paper-plane" /></button>
            </div>
          </div>
        )}
      </div>

      <div className="toast notification-toast" id="notificationToast" style={{display: 'none'}}>
        <div className="toast-body" id="toastMessage">
          This is a notification message.
        </div>
      </div>
      
      <div id="google_translate_element" style={{display: 'none'}} />
    </div>
  );
};

export default App;