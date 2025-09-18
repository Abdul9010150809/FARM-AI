// backend/services/weatherService.js
import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches weather data from an external API.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} - A simplified weather data object.
 */
export const fetchWeatherData = async (lat, lon) => {
  try {
    const apiKey = config.weatherApiKey;
    if (!apiKey) {
      throw new Error('Weather API key is missing from configuration.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const { data } = await axios.get(url);

    // Map the complex API response to a simple object our app can use
    const simplifiedData = {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    return simplifiedData;
  } catch (error) {
    logger.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    throw new Error('Could not retrieve weather data.');
  }
};