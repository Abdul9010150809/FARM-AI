// src/pages/WeatherAnalysisPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { WeatherData } from '../types';

interface WeatherAnalysisPageProps {
  isApiHealthy: boolean;
}

const WeatherAnalysisPage: React.FC<WeatherAnalysisPageProps> = ({ isApiHealthy }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>('Your Location');
  const [isGettingLocation, setIsGettingLocation] = useState(true);
  const [locationDetails, setLocationDetails] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  // Enhanced location detection with better accuracy
  const getPreciseLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      };

      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  // Get detailed location name using reverse geocoding
  const getLocationDetails = async (lat: number, lon: number): Promise<string> => {
    try {
      const services = [
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      ];

      for (const service of services) {
        try {
          const response = await axios.get(service);
          const data = response.data;
          
          if (service.includes('bigdatacloud')) {
            return data.locality || data.principalSubdivision || 'Your Location';
          } else if (service.includes('nominatim')) {
            return data.address?.village || data.address?.town || data.address?.city || data.address?.county || 'Your Location';
          }
        } catch (err) {
          console.log(`Reverse geocoding service failed: ${service}`);
          continue;
        }
      }
      
      return 'Your Location';
    } catch (error) {
      console.error('All reverse geocoding services failed:', error);
      return 'Your Location';
    }
  };

  // Fetch weather data with precise location
  const fetchWeatherData = useCallback(async (lat: number, lon: number, locationName: string) => {
    setIsLoading(true);
    setError(null);
    
    const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
    
    try {
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
          hourly: 'precipitation,visibility',
          daily: 'precipitation_sum',
          timezone: 'auto'
        }
      });

      const data = response.data;
      
      const weatherInfo = getWeatherInfo(data.current.weather_code, data.current.is_day === 1);
      
      // Create weather data object with all required properties
      const weatherData: WeatherData = {
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        main: weatherInfo.main,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        rainfall: data.hourly.precipitation[0] || 0,
        visibility: data.hourly.visibility[0] || 0, // Now this matches the interface
        daily_rainfall: data.daily.precipitation_sum[0] || 0 // Now this matches the interface
      };
      
      setWeatherData(weatherData);
      setLocationName(locationName);
      setLocationDetails({
        latitude: lat,
        longitude: lon,
        accuracy: 0
      });
      
    } catch (err) {
      console.error('Weather API error:', err);
      setError("Unable to fetch weather data for your exact location. Please try again.");
    } finally {
      setIsLoading(false);
      setIsGettingLocation(false);
    }
  }, []);

  // Enhanced weather info with day/night support
  const getWeatherInfo = (code: number, isDay: boolean) => {
    const weatherMap: { [key: number]: { main: string; description: string; dayIcon: string; nightIcon: string } } = {
      0: { main: 'Clear', description: 'Clear sky', dayIcon: '☀️', nightIcon: '🌙' },
      1: { main: 'Clear', description: 'Mainly clear', dayIcon: '🌤️', nightIcon: '🌙' },
      2: { main: 'Clouds', description: 'Partly cloudy', dayIcon: '⛅', nightIcon: '☁️' },
      3: { main: 'Clouds', description: 'Overcast', dayIcon: '☁️', nightIcon: '☁️' },
      45: { main: 'Fog', description: 'Fog', dayIcon: '🌫️', nightIcon: '🌫️' },
      48: { main: 'Fog', description: 'Depositing rime fog', dayIcon: '🌫️', nightIcon: '🌫️' },
      51: { main: 'Drizzle', description: 'Light drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
      53: { main: 'Drizzle', description: 'Moderate drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
      55: { main: 'Drizzle', description: 'Dense drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
      61: { main: 'Rain', description: 'Slight rain', dayIcon: '🌧️', nightIcon: '🌧️' },
      63: { main: 'Rain', description: 'Moderate rain', dayIcon: '🌧️', nightIcon: '🌧️' },
      65: { main: 'Rain', description: 'Heavy rain', dayIcon: '🌧️', nightIcon: '🌧️' },
      80: { main: 'Rain', description: 'Slight rain showers', dayIcon: '🌦️', nightIcon: '🌧️' },
      81: { main: 'Rain', description: 'Moderate rain showers', dayIcon: '🌦️', nightIcon: '🌧️' },
      82: { main: 'Rain', description: 'Violent rain showers', dayIcon: '🌦️', nightIcon: '🌧️' },
      95: { main: 'Thunderstorm', description: 'Thunderstorm', dayIcon: '⛈️', nightIcon: '⛈️' },
      96: { main: 'Thunderstorm', description: 'Thunderstorm with hail', dayIcon: '⛈️', nightIcon: '⛈️' },
      99: { main: 'Thunderstorm', description: 'Heavy thunderstorm with hail', dayIcon: '⛈️', nightIcon: '⛈️' },
    };

    const info = weatherMap[code] || { main: 'Unknown', description: 'Unknown weather condition', dayIcon: '❓', nightIcon: '❓' };
    
    return {
      main: info.main,
      description: info.description,
      icon: isDay ? info.dayIcon : info.nightIcon
    };
  };

  // Initialize location and weather data
  useEffect(() => {
    const initializeExactLocation = async () => {
      try {
        setIsGettingLocation(true);
        setError(null);

        const position = await getPreciseLocation();
        const { latitude, longitude, accuracy } = position.coords;
        
        const locationName = await getLocationDetails(latitude, longitude);
        await fetchWeatherData(latitude, longitude, locationName);
        
        setLocationDetails({
          latitude,
          longitude,
          accuracy
        });

      } catch (error) {
        console.error('Location error:', error);
        
        let errorMessage = 'Unable to get your exact location. ';
        
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location access in your browser settings and refresh the page.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
        } else {
          errorMessage += 'Please ensure location services are enabled and try again.';
        }
        
        setError(errorMessage);
        setIsLoading(false);
        setIsGettingLocation(false);
      }
    };

    initializeExactLocation();
  }, [fetchWeatherData]);

  // Retry location detection
  const retryLocation = async () => {
    setError(null);
    setIsGettingLocation(true);
    
    try {
      const position = await getPreciseLocation();
      const { latitude, longitude } = position.coords;
      const locationName = await getLocationDetails(latitude, longitude);
      await fetchWeatherData(latitude, longitude, locationName);
    } catch (error) {
      setError('Failed to get location. Please check your browser permissions and try again.');
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="text-center mb-4">
            <h1 className="mb-3">Live Weather at Your Exact Location</h1>
            <p className="lead text-muted">Real-time weather data from your precise location for accurate farming decisions</p>
          </div>

          {error && (
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div className="flex-grow-1">
                  {error}
                </div>
              </div>
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-outline-primary me-2" 
                  onClick={retryLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-geo-alt me-2"></i>
                      Try Again
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError(null)}
                  aria-label="Close"
                ></button>
              </div>
            </div>
          )}

          {isGettingLocation ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h5>Detecting Your Exact Location...</h5>
              <p className="text-muted">
                <i className="bi bi-info-circle me-2"></i>
                Please allow location access for precise weather data
              </p>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}></div>
              <h5>Loading Weather Data...</h5>
              <p className="text-muted">Fetching current conditions for your location</p>
            </div>
          ) : weatherData ? (
            <div className="card shadow-lg border-0">
              <div className="card-header bg-gradient-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="card-title mb-1">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      {locationName}
                    </h3>
                    {locationDetails && (
                      <small className="opacity-75">
                        <i className="bi bi-crosshair me-1"></i>
                        Precise Location • 
                        Lat: {locationDetails.latitude.toFixed(4)}, 
                        Lon: {locationDetails.longitude.toFixed(4)}
                        {locationDetails.accuracy && (
                          <span className="ms-2">• Accuracy: ±{Math.round(locationDetails.accuracy)}m</span>
                        )}
                      </small>
                    )}
                  </div>
                  <button 
                    className="btn btn-sm btn-light"
                    onClick={retryLocation}
                    title="Refresh location and weather"
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
              </div>
              
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-6 text-center">
                    <div className="weather-icon display-1 mb-3" style={{ fontSize: '6rem' }}>
                      {weatherData.icon}
                    </div>
                    <h2 className="display-4 fw-bold text-primary mb-2">
                      {weatherData.temp}°C
                    </h2>
                    <h4 className="text-capitalize text-muted mb-4 fw-normal">
                      {weatherData.description}
                    </h4>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="weather-stat-card p-3 text-center rounded-3">
                          <i className="bi bi-droplet-fill text-info fs-1 mb-2"></i>
                          <div>
                            <div className="fw-bold fs-4">{weatherData.humidity}%</div>
                            <small className="text-muted">Humidity</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="weather-stat-card p-3 text-center rounded-3">
                          <i className="bi bi-wind text-warning fs-1 mb-2"></i>
                          <div>
                            <div className="fw-bold fs-4">{weatherData.wind_speed} m/s</div>
                            <small className="text-muted">Wind Speed</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="weather-stat-card p-3 text-center rounded-3">
                          <i className="bi bi-cloud-rain text-primary fs-1 mb-2"></i>
                          <div>
                            <div className="fw-bold fs-4">{weatherData.rainfall} mm</div>
                            <small className="text-muted">Rainfall (1h)</small>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-6">
                        <div className="weather-stat-card p-3 text-center rounded-3">
                          <i className="bi bi-eye text-success fs-1 mb-2"></i>
                          <div>
                            <div className="fw-bold fs-4">
                              {weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) + ' km' : 'N/A'}
                            </div>
                            <small className="text-muted">Visibility</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Weather Info */}
                {weatherData.daily_rainfall && weatherData.daily_rainfall > 0 && (
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="alert alert-info d-flex align-items-center">
                        <i className="bi bi-cloud-rain-heavy fs-4 me-3"></i>
                        <div>
                          <strong>Daily Rainfall:</strong> {weatherData.daily_rainfall} mm expected today
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="bi bi-clock me-1"></i>
                    Last updated: {new Date().toLocaleTimeString()}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-check-circle me-1"></i>
                    Real-time data from your exact location
                  </small>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
        }
        
        .weather-stat-card {
          background: rgba(13, 110, 253, 0.05);
          border: 1px solid rgba(13, 110, 253, 0.1);
          transition: all 0.3s ease;
        }
        
        .weather-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          background: rgba(13, 110, 253, 0.08);
          border-color: rgba(13, 110, 253, 0.2);
        }
        
        .weather-icon {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }
        
        .progress-bar {
          background: linear-gradient(90deg, #0d6efd, #20c997);
        }
      `}</style>
    </div>
  );
};

export default WeatherAnalysisPage;