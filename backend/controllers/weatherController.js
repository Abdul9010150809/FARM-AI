// controllers/weatherController.js
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import config from '../config/index.js';

/**
 * @desc    Fetch weather data for a given location
 * @route   GET /api/weather?lat=<latitude>&lon=<longitude>
 * @access  Private
 */
export const getWeatherData = asyncHandler(async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    res.status(400);
    throw new Error('Latitude and longitude are required');
  }

  // In a real app, you would call a real weather API
  // const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weatherApiKey}&units=metric`);
  // For now, we'll return mock data.
  
  const mockWeatherData = {
    temp: 31.5,
    feels_like: 36.2,
    humidity: 78,
    wind: { speed: 15.3 },
    weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
  };

  res.json(mockWeatherData);
});