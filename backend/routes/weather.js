const express = require('express');
const weatherService = require('../services/weatherService');
const locationService = require('../services/locationService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get current weather by coordinates
router.get('/current', async (req, res) => {
  try {
    const { lat, lng, address } = req.query;

    let latitude, longitude;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else if (address) {
      const coords = await locationService.getCoordsFromAddress(address);
      if (!coords) {
        return res.status(400).json({ message: 'Could not geocode address' });
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else {
      return res.status(400).json({ message: 'Either coordinates or address is required' });
    }

    const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
    if (!weatherData) {
      return res.status(500).json({ message: 'Failed to fetch weather data' });
    }

    const location = await locationService.getAddressFromCoords(latitude, longitude);

    res.json({
      location,
      coordinates: { latitude, longitude },
      weather: weatherData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get current weather error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weather forecast by coordinates
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lng, address, days = 5 } = req.query;

    let latitude, longitude;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else if (address) {
      const coords = await locationService.getCoordsFromAddress(address);
      if (!coords) {
        return res.status(400).json({ message: 'Could not geocode address' });
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else {
      return res.status(400).json({ message: 'Either coordinates or address is required' });
    }

    const forecast = await weatherService.getWeatherForecast(latitude, longitude);
    const location = await locationService.getAddressFromCoords(latitude, longitude);

    res.json({
      location,
      coordinates: { latitude, longitude },
      forecast: forecast.slice(0, parseInt(days)),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get forecast error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get weather alerts for agriculture
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lng, address } = req.query;

    let latitude, longitude;

    if (lat && lng) {
      latitude = parseFloat(lat);
      longitude = parseFloat(lng);
    } else if (address) {
      const coords = await locationService.getCoordsFromAddress(address);
      if (!coords) {
        return res.status(400).json({ message: 'Could not geocode address' });
      }
      latitude = coords.latitude;
      longitude = coords.longitude;
    } else {
      return res.status(400).json({ message: 'Either coordinates or address is required' });
    }

    const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
    const forecast = await weatherService.getWeatherForecast(latitude, longitude);

    if (!weatherData || !forecast) {
      return res.status(500).json({ message: 'Failed to fetch weather data' });
    }

    // Generate agricultural alerts based on weather conditions
    const alerts = generateAgriculturalAlerts(weatherData, forecast);
    const location = await locationService.getAddressFromCoords(latitude, longitude);

    res.json({
      location,
      coordinates: { latitude, longitude },
      currentWeather: weatherData,
      alerts,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get weather alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate agricultural alerts based on weather conditions
function generateAgriculturalAlerts(currentWeather, forecast) {
  const alerts = [];

  // Temperature alerts
  if (currentWeather.temperature > 35) {
    alerts.push({
      type: 'high_temperature',
      severity: 'warning',
      message: 'High temperature alert: Consider providing shade and extra irrigation to prevent heat stress.',
      recommendation: 'Water crops in early morning or late evening to reduce evaporation.'
    });
  } else if (currentWeather.temperature < 10) {
    alerts.push({
      type: 'low_temperature',
      severity: 'warning',
      message: 'Low temperature alert: Protect sensitive crops from frost damage.',
      recommendation: 'Use frost covers or consider irrigation to raise temperature through latent heat.'
    });
  }

  // Rainfall alerts
  if (currentWeather.rainfall > 20) {
    alerts.push({
      type: 'heavy_rain',
      severity: 'warning',
      message: 'Heavy rainfall alert: Ensure proper drainage to prevent waterlogging.',
      recommendation: 'Check drainage systems and postpone irrigation.'
    });
  } else if (currentWeather.rainfall === 0 && forecast.some(day => day.rainfall === 0)) {
    const dryDays = forecast.filter(day => day.rainfall === 0).length;
    if (dryDays > 3) {
      alerts.push({
        type: 'drought_risk',
        severity: 'info',
        message: `Dry spell alert: No rain forecast for ${dryDays} days.`,
        recommendation: 'Schedule irrigation and consider water conservation measures.'
      });
    }
  }

  // Humidity alerts
  if (currentWeather.humidity > 85) {
    alerts.push({
      type: 'high_humidity',
      severity: 'info',
      message: 'High humidity alert: Increased risk of fungal diseases.',
      recommendation: 'Monitor crops for signs of disease and ensure good air circulation.'
    });
  } else if (currentWeather.humidity < 40) {
    alerts.push({
      type: 'low_humidity',
      severity: 'info',
      message: 'Low humidity alert: Increased evaporation rate.',
      recommendation: 'Consider more frequent irrigation and use mulch to conserve soil moisture.'
    });
  }

  // Check forecast for extreme conditions
  const extremeHeat = forecast.some(day => day.temperature > 38);
  const extremeCold = forecast.some(day => day.temperature < 5);
  const heavyRain = forecast.some(day => day.rainfall > 30);

  if (extremeHeat) {
    alerts.push({
      type: 'extreme_heat_forecast',
      severity: 'warning',
      message: 'Extreme heat forecast: Prepare for heat wave conditions.',
      recommendation: 'Increase irrigation frequency and consider temporary shading for sensitive crops.'
    });
  }

  if (extremeCold) {
    alerts.push({
      type: 'frost_forecast',
      severity: 'warning',
      message: 'Frost forecast: Protect sensitive crops from freezing temperatures.',
      recommendation: 'Use frost protection methods like covers, sprinklers, or wind machines.'
    });
  }

  if (heavyRain) {
    alerts.push({
      type: 'heavy_rain_forecast',
      severity: 'warning',
      message: 'Heavy rain forecast: Risk of flooding and waterlogging.',
      recommendation: 'Ensure drainage systems are clear and consider covering sensitive crops.'
    });
  }

  return alerts;
}

module.exports = router;