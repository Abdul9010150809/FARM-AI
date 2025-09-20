// src/hooks/useRealtimeData.ts
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// **FIX**: Correctly imports all types from the central file
import { LocationData, WeatherData, SoilData } from '../types';

// Remember to replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const API_KEY = 'e14f1c65b9b173352af37d94c4e87c0f';

export const useRealtimeData = (showNotification: (msg: string, type: 'success' | 'error') => void) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const [weatherRes, geoRes] = await Promise.all([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`)
      ]);

      // **FIX**: This object now correctly matches the WeatherData interface
      setWeather({
        temp: Math.round(weatherRes.data.main.temp),
        humidity: weatherRes.data.main.humidity,
        wind_speed: weatherRes.data.wind.speed,
        main: weatherRes.data.weather[0].main,
        description: weatherRes.data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${weatherRes.data.weather[0].icon}@2x.png`
      });

      if (geoRes.data?.[0]) {
        setLocation({
          city: geoRes.data[0].name,
          state: geoRes.data[0].state,
          country: geoRes.data[0].country,
          lat, lon
        });
      }

      setSoil({
        type: 'Red Loamy Soil', ph: 6.8, nitrogen: 145,
        phosphorus: 48, potassium: 210, moisture: 35.5, organicMatter: 2.1
      });

      showNotification('Real-time data loaded!', 'success');
    } catch (err) {
      setError("Could not fetch real-time data. Enable location and refresh.");
      showNotification("Could not fetch real-time data.", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => fetchData(position.coords.latitude, position.coords.longitude),
      () => {
        setError("Location denied. Using default data for Tirupati, AP.");
        fetchData(13.6288, 79.4192); // Fallback to Tirupati
      }
    );
  }, [fetchData]);

  return { location, weather, soil, isLoading, error };
};