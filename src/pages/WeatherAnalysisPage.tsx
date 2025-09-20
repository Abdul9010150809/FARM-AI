// src/pages/WeatherAnalysisPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WeatherData } from '../types';

const WeatherAnalysisPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      setIsLoading(true);
      setError(null);
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

      if (!apiKey) {
        setError("Weather API key is not configured.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        setWeatherData({
          temp: Math.round(response.data.main.temp),
          humidity: response.data.main.humidity,
          wind_speed: response.data.wind.speed,
          main: response.data.weather[0].main,
          description: response.data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
          rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
        });
      } catch (err) {
        setError("Failed to fetch weather data for your location.");
      } finally {
        setIsLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherData(position.coords.latitude, position.coords.longitude);
      },
      () => {
        // Fallback to Tirupati if location is denied
        fetchWeatherData(13.6288, 79.4192);
        setError("Location access denied. Showing weather for Tirupati, AP.");
      }
    );
  }, []);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1 className="mb-4">Live Weather Analysis</h1>
          {error && <div className="alert alert-warning">{error}</div>}
          
          {isLoading ? (
            <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
          ) : weatherData ? (
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title">Current Conditions</h3>
                <img src={weatherData.icon} alt={weatherData.description} style={{width: '100px', height: '100px'}} />
                <p className="display-4">{weatherData.temp}°C</p>
                <p className="lead text-capitalize">{weatherData.description}</p>
                <div className="row mt-4">
                  <div className="col">
                    <strong>Humidity:</strong> {weatherData.humidity}%
                  </div>
                  <div className="col">
                    <strong>Wind:</strong> {weatherData.wind_speed} m/s
                  </div>
                  <div className="col">
                    <strong>Rainfall (1h):</strong> {weatherData.rainfall} mm
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default WeatherAnalysisPage;