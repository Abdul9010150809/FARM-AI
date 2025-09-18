// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WeatherData } from '../types';
import SoilHealth from '../components/SoilHealth';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import CropsSection from '../components/CropsSection';
import AboutSection from '../components/AboutSection';
interface HomePageProps {
  currentLanguage: string;
  // 👇 UPDATED: The function signature now includes the optional parameter
  applyTranslation: (lang: string, shouldReload?: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentLanguage, applyTranslation }) => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 31,
    humidity: 75,
    rainfall: 0,
  });

  useEffect(() => {
    const fetchInitialData = () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      // Small Fix: Add a check for the API key to improve debugging
      if (!apiKey) {
        console.error("Weather API key is missing. Please check your .env file.");
        return;
      }
      
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      const successCallback = async (position: GeolocationPosition) => {
        try {
          const { latitude, longitude } = position.coords;

          // Auto Language Logic
          const userLangPreference = localStorage.getItem('appLanguage');
          if (!userLangPreference) {
            const geoApiUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
            const geoResponse = await axios.get(geoApiUrl);
            const countryCode = geoResponse.data[0]?.country;

            const languageMap: { [key: string]: string } = { 'IN': 'te' };
            const targetLanguage = languageMap[countryCode];
            
            if (targetLanguage && targetLanguage !== currentLanguage) {
              // 👇 FAST TRANSLATION: Call with 'false' to prevent reload
              applyTranslation(targetLanguage, false); 
            }
          }

          // Weather Fetch Logic (now runs immediately after translation trigger)
          const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          const response = await axios.get(weatherApiUrl);
          
          setWeatherData({
            temperature: Math.round(response.data.main.temp),
            humidity: response.data.main.humidity,
            rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
          });

        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      };

      // Small Fix: Add a proper error callback for geolocation
      const errorCallback = (error: GeolocationPositionError) => {
        console.error(`Geolocation error: ${error.message}`);
      };

      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection weatherData={weatherData} />
      <CropsSection />
      <AboutSection />
    </>
  );
};

export default HomePage;