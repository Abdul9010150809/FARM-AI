import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

export const getCurrentWeather = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      rainfall: data.rain ? data.rain['1h'] || 0 : 0,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return fallback data
    return {
      temperature: 32,
      humidity: 78,
      rainfall: 45,
      windSpeed: 5.2,
      pressure: 1013,
      description: 'Partly cloudy',
      icon: '02d'
    };
  }
};

export const getWeatherForecast = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    
    return response.data.list.slice(0, 5); // Next 5 forecasts
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return [];
  }
};