const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
  }

  // Get current weather data
  async getCurrentWeather(lat, lng) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
        description: response.data.weather[0].description
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  // Get weather forecast
  async getWeatherForecast(lat, lng) {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      // Process forecast data for the next 5 days
      const forecast = response.data.list
        .filter((item, index) => index % 8 === 0) // Get one reading per day
        .slice(0, 5) // Next 5 days
        .map(item => ({
          date: new Date(item.dt * 1000),
          temperature: item.main.temp,
          humidity: item.main.humidity,
          rainfall: item.rain ? item.rain['3h'] || 0 : 0,
          description: item.weather[0].description
        }));
      
      return forecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return [];
    }
  }
}

module.exports = new WeatherService();