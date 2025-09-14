const axios = require('axios');

class WeatherAPI {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lng) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      return {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        rainfall: response.data.rain ? response.data.rain['1h'] || 0 : 0,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        cloudiness: response.data.clouds.all,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        visibility: response.data.visibility,
        sunrise: new Date(response.data.sys.sunrise * 1000),
        sunset: new Date(response.data.sys.sunset * 1000)
      };
    } catch (error) {
      console.error('Error fetching current weather:', error.response?.data || error.message);
      return null;
    }
  }

  async getWeatherForecast(lat, lng) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );
      
      // Process forecast data
      const forecast = response.data.list.map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        rainfall: item.rain ? item.rain['3h'] || 0 : 0,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        cloudiness: item.clouds.all,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        visibility: item.visibility
      }));

      return forecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error.response?.data || error.message);
      return [];
    }
  }

  async getHistoricalWeather(lat, lng, date) {
    try {
      // Note: Historical data requires a paid OpenWeatherMap plan
      // This is a placeholder implementation
      const timestamp = Math.floor(date.getTime() / 1000);
      const response = await axios.get(
        `${this.baseUrl}/onecall/timemachine?lat=${lat}&lon=${lng}&dt=${timestamp}&appid=${this.apiKey}&units=metric`
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching historical weather:', error.response?.data || error.message);
      return null;
    }
  }

  // Get UV index (requires different API endpoint)
  async getUVIndex(lat, lng) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/uvi?lat=${lat}&lon=${lng}&appid=${this.apiKey}`
      );

      return {
        value: response.data.value,
        riskLevel: this.getUVRiskLevel(response.data.value)
      };
    } catch (error) {
      console.error('Error fetching UV index:', error.response?.data || error.message);
      return null;
    }
  }

  getUVRiskLevel(uvIndex) {
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
  }

  // Get agricultural weather data summary
  async getAgriculturalWeather(lat, lng) {
    try {
      const [currentWeather, forecast, uvIndex] = await Promise.all([
        this.getCurrentWeather(lat, lng),
        this.getWeatherForecast(lat, lng),
        this.getUVIndex(lat, lng)
      ]);

      if (!currentWeather) {
        return null;
      }

      // Calculate evapotranspiration (simplified formula)
      const eto = this.calculateETO(currentWeather);

      return {
        current: currentWeather,
        forecast: forecast.slice(0, 5), // Next 5 days
        uvIndex,
        evapotranspiration: eto,
        agriculturalAdvisory: this.generateAgriculturalAdvisory(currentWeather, forecast)
      };
    } catch (error) {
      console.error('Error fetching agricultural weather:', error);
      return null;
    }
  }

  // Simplified evapotranspiration calculation
  calculateETO(weatherData) {
    // Hargreaves-Samani simplified formula
    const { temperature, humidity, windSpeed } = weatherData;
    const eto = 0.0023 * (temperature + 17.8) * Math.sqrt(temperature + 17.8) * 
                (100 - humidity) * 0.01 * windSpeed;
    return Math.max(0, eto.toFixed(2));
  }

  generateAgriculturalAdvisory(currentWeather, forecast) {
    const advisories = [];

    // Temperature-based advisories
    if (currentWeather.temperature > 35) {
      advisories.push('High temperatures may cause heat stress. Increase irrigation frequency.');
    } else if (currentWeather.temperature < 10) {
      advisories.push('Low temperatures may affect crop growth. Protect sensitive plants.');
    }

    // Rainfall-based advisories
    if (currentWeather.rainfall > 15) {
      advisories.push('Heavy rainfall. Ensure proper drainage to prevent waterlogging.');
    } else if (currentWeather.rainfall === 0) {
      const nextRain = forecast.find(day => day.rainfall > 0);
      if (!nextRain) {
        advisories.push('No rain forecast. Schedule irrigation as needed.');
      }
    }

    // Humidity-based advisories
    if (currentWeather.humidity > 80) {
      advisories.push('High humidity increases disease risk. Monitor for fungal infections.');
    }

    // Wind-based advisories
    if (currentWeather.windSpeed > 20) {
      advisories.push('Strong winds may damage crops. Secure vulnerable plants and structures.');
    }

    return advisories.length > 0 ? advisories : ['Weather conditions are favorable for most crops.'];
  }
}

module.exports = new WeatherAPI();