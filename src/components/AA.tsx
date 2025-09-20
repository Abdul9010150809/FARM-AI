import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement
);

// --- TypeScript Interfaces ---
interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  humidity: number;
  wind_speed: number;
  main: string;
  description: string;
  icon: string;
}

interface SoilData {
  type: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicMatter: number;
}

interface PredictionResult {
  yield: number;
  confidence: number;
  roi: number;
  sustainabilityScore: number;
  recommendations: {
    irrigation: string;
    fertilization: string;
    pestControl: string;
    market: string;
  };
  diseaseAlert: {
    risk: 'Low' | 'Medium' | 'High';
    details: string;
  };
  yieldHistory: number[];
  costBreakdown: {
    seeds: number;
    fertilizers: number;
    labor: number;
    irrigation: number;
    other: number;
  };
}

const AdvancedPredictionPage = () => {
  const { user, showNotification } = useAuth();

  // --- State Management ---
  const [formData, setFormData] = useState({ 
    crop: 'rice', 
    area: 1.0,
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0]
  });
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [cropVarieties, setCropVarieties] = useState<string[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [greetingPlayed, setGreetingPlayed] = useState(false);

  const [isLoading, setIsLoading] = useState({
    location: true,
    prediction: false,
    varieties: false
  });
  const [error, setError] = useState<string | null>(null);

  // Function to play greeting in local language
  const playLocalGreeting = (lang: string) => {
    if (greetingPlayed) return;
    
    const greetings: Record<string, string> = {
      te: "నమస్కారం, ఆంధ్రప్రదేశ్ రైతు సహోదరులారా! మీరు ఇప్పుడు అధునాతన పంట అంచనా డాష్‌బోర్డ్‌లో ఉన్నారు.",
      hi: "नमस्ते, आंध्र प्रदेश के किसान भाइयों! अब आप उन्नत फसल पूर्वानुमान डैशबोर्ड पर हैं।",
      ta: "வணக்கம், ஆந்திரப் பிரதேச விவசாயி சகோதரர்களே! நீங்கள் இப்போது மேம்பட்ட பயிர் முன்னறிவிப்பு டாஷ்போர்டில் இருக்கிறீர்கள்.",
      kn: "ನಮಸ್ಕಾರ, ಆಂಧ್ರಪ್ರದೇಶ ರೈತ ಸಹೋದರರೇ! ನೀವು ಈಗ ಸುಧಾರಿತ ಬೆಳೆ ಮುನ್ಸೂಚನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿದ್ದೀರಿ.",
      ml: "നമസ്കാരം, ആന്ധ്രപ്രദേശ് കർഷക സഹോദരങ്ങളേ! നിങ്ങൾ ഇപ്പോൾ നൂതന ഫസൽ പ്രവചന ഡാഷ്‌ബോർഡിലാണ്."
    };
    
    const greeting = greetings[lang] || "Welcome, farmers of Andhra Pradesh! You are now in the Advanced Crop Prediction Dashboard.";
    
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
    
    // showNotification(`Language changed to ${getLanguageName(lang)}`, 'success');
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

  // Fetch crop varieties based on selected crop
  useEffect(() => {
    const fetchCropVarieties = async () => {
      if (!formData.crop) return;
      
      setIsLoading(prev => ({ ...prev, varieties: true }));
      try {
        // In a real app, this would come from your API
        const varieties: Record<string, string[]> = {
          rice: ['Sona Masoori', 'BPT 5204', 'MTU 1010', 'Swarna'],
          wheat: ['HD 2967', 'PBW 550', 'WH 1105', 'DBW 17'],
          cotton: ['Bollgard II', 'RCH 2', 'NCS 145', 'MRC 7351'],
          chilli: ['Teja', 'Byadgi', 'Kashmiri', 'Guntur']
        };
        
        setCropVarieties(varieties[formData.crop] || []);
        setFormData(prev => ({ 
          ...prev, 
          variety: varieties[formData.crop]?.[0] || '' 
        }));
      } catch (err) {
        console.error("Error fetching crop varieties:", err);
      } finally {
        setIsLoading(prev => ({ ...prev, varieties: false }));
      }
    };

    fetchCropVarieties();
  }, [formData.crop]);

  // --- Data Fetching ---
  const fetchInitialData = useCallback(async (lat: number, lon: number) => {
    try {
      // Using your exact weather API call from the homepage
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e14f1c65b9b173352af37d94c4e87c0f&units=metric`
      );
      
      const data = response.data;
      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        main: data.weather[0].main,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      });

      // Get location name
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=e14f1c65b9b173352af37d94c4e87c0f`
      );
      
      if (geoResponse.data && geoResponse.data.length > 0) {
        setLocation({
          city: geoResponse.data[0].name,
          state: geoResponse.data[0].state,
          country: geoResponse.data[0].country,
          lat,
          lon
        });
      }
      
      // Simulate soil data (in a real app, this would come from an API)
      const mockSoilData: SoilData = {
        type: 'Red Loamy Soil',
        ph: 6.8,
        nitrogen: 145,
        phosphorus: 48,
        potassium: 210,
        moisture: 35.5,
        organicMatter: 2.1
      };
      
      setSoil(mockSoilData);
      showNotification('Real-time data loaded!', 'success');
    } catch (err) {
      console.error("Error fetching initial data:", err);
      setError("Could not fetch real-time location or weather data. Please enable location services and refresh.");
      showNotification("Could not fetch real-time data.", 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, location: false }));
    }
  }, [showNotification]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchInitialData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Location access denied. Using default location data.");
          setIsLoading(prev => ({ ...prev, location: false }));
          
          // Set default location (Andhra Pradesh)
          setLocation({
            city: "Amaravati",
            state: "Andhra Pradesh",
            country: "India",
            lat: 16.5062,
            lon: 80.6480
          });
          
          // Set default weather (using your exact values from homepage)
          setWeather({
            temp: 32,
            humidity: 78,
            wind_speed: 5.2,
            main: "Clear",
            description: "Clear sky",
            icon: "https://openweathermap.org/img/wn/01d@2x.png"
          });
          
          // Set default soil
          setSoil({
            type: 'Red Loamy Soil',
            ph: 6.8,
            nitrogen: 145,
            phosphorus: 48,
            potassium: 210,
            moisture: 35.5,
            organicMatter: 2.1
          });
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(prev => ({ ...prev, location: false }));
    }
  }, [fetchInitialData]);

  // --- Form Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location || !weather || !soil) {
      showNotification("Please wait for real-time data to load.", 'warning');
      return;
    }
    setIsLoading(prev => ({ ...prev, prediction: true }));
    setResult(null);

    try {
      // In a real app, you would send all this data to your ML backend
      const payload = { ...formData, location, weather, soil, user };
      
      // MOCKING BACKEND RESPONSE FOR DEMONSTRATION
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Different results based on crop type
      const cropResults: Record<string, PredictionResult> = {
        rice: {
          yield: 2450.5,
          confidence: 96.2,
          roi: 185,
          sustainabilityScore: 88,
          recommendations: {
            irrigation: "Apply 5cm of water every 7 days. Use drip irrigation to save 40% water.",
            fertilization: `Based on soil NPK levels, apply a 120:60:60 kg/ha NPK ratio. Top-dress Nitrogen at 30 and 50 days after sowing.`,
            pestControl: "High humidity increases risk of Blast disease. Proactively spray Tricyclazole at first sign.",
            market: `Current mandi price in ${location.city} is ₹2,100/quintal. Prices are expected to rise 5% in the next 2 weeks.`
          },
          diseaseAlert: {
            risk: 'Medium',
            details: 'Weather conditions are favorable for Brown Spot. Monitor lower leaves for symptoms.'
          },
          yieldHistory: [2200, 2350, 2100, 2400, 2450.5],
          costBreakdown: {
            seeds: 2500,
            fertilizers: 4800,
            labor: 6200,
            irrigation: 3200,
            other: 2800
          }
        },
        wheat: {
          yield: 3200,
          confidence: 92.5,
          roi: 160,
          sustainabilityScore: 82,
          recommendations: {
            irrigation: "Irrigate at crown root initiation, tillering, and flowering stages.",
            fertilization: "Apply 60:40:40 kg/ha NPK. Zinc deficiency detected - apply 25kg zinc sulfate per hectare.",
            pestControl: "Low risk of aphids. Monitor for yellow rust in current weather conditions.",
            market: `Wheat prices stable at ₹1,950/quintal. Government procurement is active in ${location.state}.`
          },
          diseaseAlert: {
            risk: 'Low',
            details: 'Low disease risk. Maintain field sanitation practices.'
          },
          yieldHistory: [3000, 3100, 2950, 3050, 3200],
          costBreakdown: {
            seeds: 1800,
            fertilizers: 4200,
            labor: 5500,
            irrigation: 2800,
            other: 2200
          }
        },
        cotton: {
          yield: 1800,
          confidence: 89.7,
          roi: 210,
          sustainabilityScore: 75,
          recommendations: {
            irrigation: "Drip irrigation recommended. Avoid water stress during flowering and boll formation.",
            fertilization: "Apply 80:40:40 kg/ha NPK. Foliar spray of 2% DAP and 1% KCl during boll development.",
            pestControl: "High alert for pink bollworm. Install pheromone traps and monitor regularly.",
            market: "Cotton prices are strong at ₹6,500/quintal. Export demand increasing."
          },
          diseaseAlert: {
            risk: 'High',
            details: 'High risk of bacterial blight due to current weather conditions.'
          },
          yieldHistory: [1600, 1700, 1650, 1750, 1800],
          costBreakdown: {
            seeds: 3500,
            fertilizers: 5200,
            labor: 7800,
            irrigation: 4500,
            other: 3200
          }
        },
        chilli: {
          yield: 2200,
          confidence: 94.3,
          roi: 240,
          sustainabilityScore: 79,
          recommendations: {
            irrigation: "Light irrigation every 5-6 days. Avoid waterlogging.",
            fertilization: "Apply 100:50:50 kg/ha NPK. Foliar spray of micronutrients during flowering.",
            pestControl: "Watch for thrips and mites. Use neem oil spray as preventive measure.",
            market: "Chilli prices at ₹15,000/quintal due to high demand from spice industry."
          },
          diseaseAlert: {
            risk: 'Medium',
            details: 'Moderate risk of fruit rot and anthracnose in current humid conditions.'
          },
          yieldHistory: [2000, 2100, 1950, 2150, 2200],
          costBreakdown: {
            seeds: 4200,
            fertilizers: 5800,
            labor: 6500,
            irrigation: 3800,
            other: 3500
          }
        }
      };

      const mockResult = cropResults[formData.crop] || cropResults.rice;
      setResult(mockResult);
      showNotification('Prediction completed successfully!', 'success');

    } catch (err) {
      console.error("Prediction error:", err);
      showNotification("Prediction request failed. Please try again.", 'error');
    } finally {
      setIsLoading(prev => ({ ...prev, prediction: false }));
    }
  };
  
  // --- Chart Data ---
  // Moved the chart data definitions inside the render logic to ensure 'result' is not null
  // when they are accessed.
  const yieldChartData = {
    labels: ['2021', '2022', '2023', '2024', '2025 (Predicted)'],
    datasets: [
      {
        label: 'Yield (kg/acre)',
        data: result?.yieldHistory || [],
        backgroundColor: 'rgba(46, 125, 50, 0.6)',
        borderColor: 'rgba(46, 125, 50, 1)',
        borderWidth: 1,
      },
    ],
  };

  const costChartData = result ? {
    labels: ['Seeds', 'Fertilizers', 'Labor', 'Irrigation', 'Other'],
    datasets: [
      {
        data: [
          result.costBreakdown.seeds,
          result.costBreakdown.fertilizers,
          result.costBreakdown.labor,
          result.costBreakdown.irrigation,
          result.costBreakdown.other
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Get risk color based on level
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary">🌱 Advanced Prediction Dashboard</h1>
          {user && <span className="badge bg-info">Welcome, {user.name}</span>}
          
          {/* Language Selector */}
          <div className="d-flex align-items-center">
            <span className="me-2">Language:</span>
            <select 
              className="form-select form-select-sm" 
              value={currentLanguage}
              onChange={(e) => applyTranslation(e.target.value)}
              style={{width: 'auto'}}
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="kn">Kannada</option>
              <option value="ml">Malayalam</option>
            </select>
          </div>
        </div>
        
        {error && (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <i className="fas fa-exclamation-triangle me-2"></i>
            <div>{error}</div>
          </div>
        )}
        
        <div className="row g-4">
            {/* --- Left Column: Data & Inputs --- */}
            <div className="col-lg-4">
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                      <i className="fas fa-location-dot me-2"></i>Real-time Data
                    </div>
                    <div className="card-body">
                        {isLoading.location ? (
                          <div className="text-center py-3">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 mb-0">Fetching your location data...</p>
                          </div>
                        ) : (
                          <>
                            {location && (
                              <div className="d-flex align-items-center mb-3">
                                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                <div>
                                  <strong>Location:</strong> {location.city}, {location.state}
                                </div> 
                              </div>
                            )}
                            {weather && (
                              <div className="d-flex align-items-center mb-3">
                                <img src={weather.icon} alt={weather.main} style={{width: '30px', marginRight: '10px'}} />
                                <div>
                                  <strong>Weather:</strong> {weather.temp}°C, {weather.description}
                                  <div>Humidity: {weather.humidity}%, Wind: {weather.wind_speed} m/s</div>
                                </div>
                              </div>
                            )}
                            {soil && (
                              <div className="d-flex align-items-center">
                                <i className="fas fa-seedling text-success me-2"></i>
                                <div>
                                  <strong>Soil:</strong> {soil.type}, pH {soil.ph}
                                  <div>N: {soil.nitrogen} kg/ha, P: {soil.phosphorus} kg/ha, K: {soil.potassium} kg/ha</div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="card-header bg-success text-white">
                      <i className="fas fa-tractor me-2"></i>Your Farm Details
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="crop" className="form-label">Select Crop</label>
                                <select 
                                  name="crop" 
                                  id="crop" 
                                  className="form-select" 
                                  value={formData.crop} 
                                  onChange={handleInputChange}
                                >
                                    <option value="rice">Rice</option>
                                    <option value="wheat">Wheat</option>
                                    <option value="cotton">Cotton</option>
                                    <option value="chilli">Chilli</option>
                                </select>
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="variety" className="form-label">Crop Variety</label>
                                {isLoading.varieties ? (
                                  <div className="form-control">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                      <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className="ms-2">Loading varieties...</span>
                                  </div>
                                ) : (
                                  <select 
                                    name="variety" 
                                    id="variety" 
                                    className="form-select" 
                                    value={formData.variety} 
                                    onChange={handleInputChange}
                                  >
                                    {cropVarieties.map(variety => (
                                      <option key={variety} value={variety}>{variety}</option>
                                    ))}
                                  </select>
                                )}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="area" className="form-label">Area (in acres)</label>
                                <input 
                                  type="number" 
                                  name="area" 
                                  id="area" 
                                  className="form-control" 
                                  value={formData.area} 
                                  onChange={handleInputChange} 
                                  step="0.1" 
                                  min="0.1" 
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="plantingDate" className="form-label">Planting Date</label>
                                <input 
                                  type="date" 
                                  name="plantingDate" 
                                  id="plantingDate" 
                                  className="form-control" 
                                  value={formData.plantingDate} 
                                  onChange={handleInputChange} 
                                />
                            </div>
                            
                            <button 
                              type="submit" 
                              className="btn btn-primary w-100 py-2 fw-bold" 
                              disabled={isLoading.location || isLoading.prediction}
                            >
                              {isLoading.prediction ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-rocket me-2"></i>
                                  Predict Yield
                                </>
                              )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* --- Right Column: Results --- */}
            <div className="col-lg-8">
                {isLoading.prediction && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4>Analyzing your farm data...</h4>
                    <p className="text-muted">This may take a few moments</p>
                  </div>
                )}
                
                {!result && !isLoading.prediction && (
                    <div className="card text-center p-5 h-100 justify-content-center border-dashed">
                        <div className="card-body">
                          <i className="fas fa-seedling display-1 text-muted mb-4"></i>
                          <h3>Your personalized farm report will appear here</h3>
                          <p className="text-muted">Fill in your farm details and click "Predict Yield" to get AI-powered insights</p>
                        </div>
                    </div>
                )}
                
                {result && (
                    <>
                        <div className="card text-center bg-light shadow-sm mb-4 border-success">
                            <div className="card-body py-4">
                                <h5 className="text-muted mb-3">Predicted Yield for {formData.crop} ({formData.variety})</h5>
                                <h1 className="display-4 fw-bold text-success mb-2">{result.yield} kg/acre</h1>
                                <div className="d-flex justify-content-center">
                                  <span className="badge bg-info me-2">
                                    <i className="fas fa-chart-line me-1"></i> ROI: {result.roi}%
                                  </span>
                                  <span className="badge bg-success me-2">
                                    <i className="fas fa-bullseye me-1"></i> Confidence: {result.confidence}%
                                  </span>
                                  <span className="badge bg-warning text-dark">
                                    <i className="fas fa-leaf me-1"></i> Sustainability: {result.sustainabilityScore}/100
                                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="card shadow-sm mb-4">
                             <div className="card-header bg-info text-white">
                               <i className="fas fa-lightbulb me-2"></i>Actionable Recommendations
                             </div>
                             <div className="card-body">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                      <button className="nav-link active" id="pills-irrigation-tab" data-bs-toggle="pill" data-bs-target="#pills-irrigation" type="button" role="tab">
                                        <i className="fas fa-tint me-1"></i>Irrigation
                                      </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                      <button className="nav-link" id="pills-fertilizer-tab" data-bs-toggle="pill" data-bs-target="#pills-fertilizer" type="button" role="tab">
                                        <i className="fas fa-flask me-1"></i>Fertilizer
                                      </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                      <button className="nav-link" id="pills-pest-tab" data-bs-toggle="pill" data-bs-target="#pills-pest" type="button" role="tab">
                                        <i className="fas fa-bug me-1"></i>Pest Control
                                      </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                      <button className="nav-link" id="pills-market-tab" data-bs-toggle="pill" data-bs-target="#pills-market" type="button" role="tab">
                                        <i className="fas fa-store me-1"></i>Market
                                      </button>
                                    </li>
                                </ul>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-irrigation">
                                      <div className="d-flex">
                                        <i className="fas fa-tint text-primary me-3 mt-1"></i>
                                        <div>{result.recommendations.irrigation}</div>
                                      </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-fertilizer">
                                      <div className="d-flex">
                                        <i className="fas fa-flask text-success me-3 mt-1"></i>
                                        <div>{result.recommendations.fertilization}</div>
                                      </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-pest">
                                      <div className="d-flex">
                                        <i className="fas fa-bug text-danger me-3 mt-1"></i>
                                        <div>{result.recommendations.pestControl}</div>
                                      </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-market">
                                      <div className="d-flex">
                                        <i className="fas fa-store text-warning me-3 mt-1"></i>
                                        <div>{result.recommendations.market}</div>
                                      </div>
                                </div>
                                </div>
                             </div>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-7">
                                <div className="card shadow-sm h-100">
                                    <div className="card-header">
                                      <i className="fas fa-chart-bar me-2"></i>Yield History & Forecast
                                    </div>
                                    <div className="card-body">
                                        <Bar 
                                          data={yieldChartData} 
                                          options={{ 
                                            responsive: true, 
                                            plugins: { 
                                              legend: { display: false },
                                              title: {
                                                display: true,
                                                text: 'Yield Trend (kg/acre)'
                                              }
                                          } 
                                        }} 
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="card shadow-sm h-100">
                                    <div className="card-header">
                                      <i className="fas fa-money-bill-wave me-2"></i>Cost Breakdown
                                    </div>
                                    <div className="card-body">
                                      {costChartData ? (
                                        <Doughnut 
                                          data={costChartData} 
                                          options={{ 
                                            responsive: true,
                                            plugins: {
                                              legend: {
                                                position: 'bottom'
                                              }
                                          }
                                        }} 
                                        />
                                      ) : (
                                        <div className="text-center py-4">No cost data available</div>
                                      )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                          <div className="col-md-12">
                            <div className="card shadow-sm">
                              <div className="card-header">
                                <i className="fas fa-exclamation-triangle me-2"></i>Disease Detection & Prevention
                              </div>
                              <div className="card-body">
                                <div className={`alert alert-${getRiskColor(result.diseaseAlert.risk)} d-flex align-items-center`}>
                                  <i className="fas fa-info-circle me-3 fs-4"></i>
                                  <div>
                                    <h5 className="alert-heading mb-1">Risk Alert: {result.diseaseAlert.risk}</h5>
                                    {result.diseaseAlert.details}
                                  </div>
                                </div>
                                <div className="text-center mt-3">
                                  <p className="mb-2">Got a sick plant? Upload a photo for instant diagnosis</p>
                                  <button className="btn btn-outline-primary me-2">
                                    <i className="fas fa-camera me-1"></i>Upload Leaf Photo
                                  </button>
                                  <button className="btn btn-outline-success">
                                    <i className="fas fa-book me-1"></i>View Disease Guide
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </>
                )}
            </div>
        </div>
        
        {/* Google Translate Element */}
        <div id="google_translate_element" style={{display: 'none'}}></div>
    </div>
  );
};

export default AdvancedPredictionPage;