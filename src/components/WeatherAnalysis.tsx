import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register all necessary Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

// --- TypeScript Interfaces ---
interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  uvi: number;
  wind_speed: number;
  wind_deg: number;
  pressure: number;
  description: string;
  icon: string;
}

interface HourlyForecast {
  time: string;
  temp: number;
  pop: number;
  wind_speed: number;
  humidity: number;
}

interface DailyForecast {
  date: string;
  temp_max: number;
  temp_min: number;
  pop: number;
  rain: number;
  humidity: number;
  icon: string;
}

interface MlInsights {
  sprayingWindow: string;
  irrigationWindow: string;
  diseaseRisk: 'Low' | 'Medium' | 'High';
  diseaseDetails: string;
  cropAdvice: string;
  soilMoisture: string;
}

// --- Mock ML Models ---
const analyzeHourlyForecast = (hourly: HourlyForecast[]): { spraying: string, irrigation: string } => {
  // Find optimal spraying time (low wind, no rain)
  const optimalSpraySlot = hourly
    .filter(h => h.pop < 0.1 && h.wind_speed < 3.5)
    .find(h => {
      const hour = parseInt(h.time.split(' ')[0]);
      return hour >= 15 && hour <= 18;
    });

  // Find optimal irrigation time (low evaporation)
  const optimalIrrigationSlot = hourly
    .find(h => {
      const hour = parseInt(h.time.split(' ')[0]);
      return hour >= 5 && hour <= 8;
    });

  return {
    spraying: optimalSpraySlot 
      ? `${optimalSpraySlot.time} - Ideal for spraying (low wind, no rain)` 
      : "Not recommended today due to wind/rain conditions",
    irrigation: optimalIrrigationSlot 
      ? `${optimalIrrigationSlot.time} - Best time to irrigate (low evaporation)` 
      : "Early morning recommended"
  };
};

const predictDiseaseRisk = (daily: DailyForecast[], current: CurrentWeather): { risk: 'Low'|'Medium'|'High', details: string } => {
  const highHumidityDays = daily.filter(day => day.humidity > 70).length;
  
  if (highHumidityDays >= 4 || current.humidity > 85) {
    return { 
      risk: 'High', 
      details: 'High humidity conditions favor fungal diseases like blast, blight, and mildew. Apply preventive fungicides.' 
    };
  }
  if (highHumidityDays >= 2 || current.humidity > 75) {
    return { 
      risk: 'Medium', 
      details: 'Moderate humidity may promote disease development. Monitor crops and ensure good air circulation.' 
    };
  }
  return { 
    risk: 'Low', 
    details: 'Dry conditions are not favorable for common disease outbreaks. Maintain normal monitoring.' 
  };
};

const getCropAdvice = (forecast: DailyForecast[], current: CurrentWeather): string => {
  const avgTemp = forecast.reduce((sum, day) => sum + (day.temp_max + day.temp_min) / 2, 0) / forecast.length;
  const totalRain = forecast.reduce((sum, day) => sum + day.rain, 0);

  if (avgTemp > 35 && totalRain < 5) {
    return "High temperatures with low rainfall. Increase irrigation frequency and consider shade nets for sensitive crops.";
  } else if (avgTemp < 15 && totalRain > 20) {
    return "Cool temperatures with significant rainfall. Delay planting and protect seedlings from waterlogging.";
  } else if (totalRain > 30) {
    return "Heavy rainfall expected. Ensure proper drainage and consider delaying fertilizer application.";
  } else {
    return "Favorable growing conditions. Continue with regular farming activities.";
  }
};

const calculateSoilMoisture = (forecast: DailyForecast[], current: CurrentWeather): string => {
  const recentRain = forecast.slice(0, 3).reduce((sum, day) => sum + day.rain, 0);
  const avgHumidity = forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length;

  if (recentRain > 15) {
    return "Soil is saturated. Avoid irrigation and ensure proper drainage.";
  } else if (recentRain > 5) {
    return "Soil moisture is adequate. Monitor before additional irrigation.";
  } else if (avgHumidity < 50 && recentRain < 2) {
    return "Soil is drying out. Consider irrigation in the recommended window.";
  } else {
    return "Soil moisture levels are optimal for most crops.";
  }
};

const WeatherAnalysis: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [precipitation, setPrecipitation] = useState<string>("No precipitation expected in the next hour.");
  const [insights, setInsights] = useState<MlInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState("Your Location");

  const fetchData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = 'e14f1c65b9b173352af37d94c4e87c0f';
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      
      const { list, city } = response.data;
      setLocation(`${city.name}, ${city.country}`);
      
      // Current weather (use first forecast as current)
      const current = list[0];
      const currentWeatherData = {
        temp: Math.round(current.main.temp),
        feels_like: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        uvi: 0, // UV index not available in free API
        wind_speed: current.wind.speed,
        wind_deg: current.wind.deg,
        pressure: current.main.pressure,
        description: current.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`,
      };
      
      setCurrentWeather(currentWeatherData);

      // Hourly forecast (next 24 hours)
      const formattedHourly = list.slice(0, 8).map((item: any): HourlyForecast => ({
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        pop: item.pop,
        wind_speed: item.wind.speed,
        humidity: item.main.humidity
      }));
      setHourlyForecast(formattedHourly);

      // Daily forecast (group by day)
      const dailyData: Record<string, any> = {};
      list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
        if (!dailyData[date]) {
          dailyData[date] = {
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
            pop: item.pop,
            rain: item.rain ? item.rain['3h'] || 0 : 0,
            humidity: item.main.humidity,
            icon: item.weather[0].icon
          };
        } else {
          dailyData[date].temp_max = Math.max(dailyData[date].temp_max, item.main.temp_max);
          dailyData[date].temp_min = Math.min(dailyData[date].temp_min, item.main.temp_min);
          dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
          dailyData[date].rain += item.rain ? item.rain['3h'] || 0 : 0;
          dailyData[date].humidity = (dailyData[date].humidity + item.main.humidity) / 2;
        }
      });

      const formattedDaily = Object.entries(dailyData).slice(0, 5).map(([date, data]): DailyForecast => ({
        date,
        temp_max: Math.round(data.temp_max),
        temp_min: Math.round(data.temp_min),
        pop: data.pop,
        rain: data.rain,
        humidity: data.humidity,
        icon: `https://openweathermap.org/img/wn/${data.icon}.png`
      }));
      setDailyForecast(formattedDaily);

      // Precipitation alert
      const nextRain = list.find((item: any) => item.pop > 0.3);
      if (nextRain) {
        const minutes = Math.round((nextRain.dt - list[0].dt) / 60);
        setPrecipitation(`Rain expected in ${minutes} minutes (${Math.round(nextRain.pop * 100)}% chance)`);
      }

      // Run ML models
      const hourlyInsights = analyzeHourlyForecast(formattedHourly);
      const diseasePrediction = predictDiseaseRisk(formattedDaily, currentWeatherData);
      const cropAdvice = getCropAdvice(formattedDaily, currentWeatherData);
      const soilMoisture = calculateSoilMoisture(formattedDaily, currentWeatherData);
      
      setInsights({
        sprayingWindow: hourlyInsights.spraying,
        irrigationWindow: hourlyInsights.irrigation,
        diseaseRisk: diseasePrediction.risk,
        diseaseDetails: diseasePrediction.details,
        cropAdvice,
        soilMoisture
      });

    } catch (err) {
      setError("Failed to fetch weather data. Please check your connection and try again.");
      console.error("Weather API error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed currentWeather dependency to prevent infinite loop

  useEffect(() => {
    // Get user's current location or use default coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Use default coordinates if location access is denied
          fetchData(13.6288, 79.4192);
        }
      );
    } else {
      // Use default coordinates if geolocation is not supported
      fetchData(13.6288, 79.4192);
    }
  }, [fetchData]); // Only run once on component mount

  const hourlyChartData = {
    labels: hourlyForecast.map(h => h.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourlyForecast.map(h => h.temp),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Rain Chance (%)',
        data: hourlyForecast.map(h => Math.round(h.pop * 100)),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        type: 'bar' as const,
        yAxisID: 'y1',
      }
    ]
  };

  const dailyChartData = {
    labels: dailyForecast.map(d => d.date),
    datasets: [
      {
        label: 'Max Temp (°C)',
        data: dailyForecast.map(d => d.temp_max),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Min Temp (°C)',
        data: dailyForecast.map(d => d.temp_min),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }
    ]
  };

  const humidityChartData = {
    labels: dailyForecast.map(d => d.date),
    datasets: [
      {
        label: 'Humidity (%)',
        data: dailyForecast.map(d => d.humidity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const getUviColor = (uvi: number) => {
    if (uvi <= 2) return 'success';
    if (uvi <= 5) return 'info';
    if (uvi <= 7) return 'warning';
    return 'danger';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  if (isLoading) return (
    <div className="text-center p-5">
      <div className="spinner-border text-success mb-3" style={{width: '3rem', height: '3rem'}} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h4>Loading Advanced Weather Analysis...</h4>
      <p className="text-muted">Fetching real-time data for your location</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger mx-4">
      <i className="fas fa-exclamation-triangle me-2"></i>
      {error}
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">
          <i className="fas fa-cloud-sun me-2"></i>
          Advanced Weather Dashboard
        </h2>
        <span className="badge bg-info fs-6">
          <i className="fas fa-map-marker-alt me-1"></i>
          {location}
        </span>
      </div>
      
      {/* --- Top Row: Current Weather & Key Metrics --- */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body text-center">
              <h5 className="card-title text-success">
                <i className="fas fa-temperature-high me-2"></i>
                Current Weather
              </h5>
              {currentWeather && (
                <>
                  <img src={currentWeather.icon} alt={currentWeather.description} className="mb-2" />
                  <h1 className="display-4 fw-bold text-primary">{currentWeather.temp}°C</h1>
                  <p className="mb-1">Feels like {currentWeather.feels_like}°C</p>
                  <p className="text-capitalize mb-2">{currentWeather.description}</p>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    <span className="badge bg-info">
                      <i className="fas fa-wind me-1"></i>
                      {currentWeather.wind_speed}m/s {getWindDirection(currentWeather.wind_deg)}
                    </span>
                    <span className="badge bg-primary">
                      <i className="fas fa-tachometer-alt me-1"></i>
                      {currentWeather.pressure}hPa
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">
                <i className="fas fa-cloud-rain me-2"></i>
                Precipitation Alert
              </h5>
              <i className="fas fa-clock fa-3x text-primary my-3"></i>
              <p className="fs-5 fw-bold">{precipitation}</p>
              {currentWeather && (
                <div className="mt-3">
                  <span className={`badge bg-${currentWeather.humidity > 75 ? 'info' : 'success'} me-2`}>
                    <i className="fas fa-tint me-1"></i>
                    Humidity: {currentWeather.humidity}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100 shadow-sm bg-light">
            <div className="card-body">
              <h5 className="card-title text-center text-success">
                <i className="fas fa-brain me-2"></i>
                AI-Powered Farming Insights
              </h5>
              {insights && (
                <div className="row">
                  <div className="col-md-6">
                    <div className={`alert alert-${getRiskColor(insights.diseaseRisk)} mb-3`}>
                      <strong>
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Disease Risk: {insights.diseaseRisk}
                      </strong>
                      <p className="mb-0 small">{insights.diseaseDetails}</p>
                    </div>
                    <div className="alert alert-info mb-3">
                      <strong>
                        <i className="fas fa-tint me-1"></i>
                        Soil Moisture
                      </strong>
                      <p className="mb-0 small">{insights.soilMoisture}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-success mb-3">
                      <strong>
                        <i className="fas fa-seedling me-1"></i>
                        Crop Advice
                      </strong>
                      <p className="mb-0 small">{insights.cropAdvice}</p>
                    </div>
                    <div className="alert alert-warning">
                      <strong>
                        <i className="fas fa-calendar-alt me-1"></i>
                        Optimal Times
                      </strong>
                      <p className="mb-1 small">{insights.irrigationWindow}</p>
                      <p className="mb-0 small">{insights.sprayingWindow}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Charts Row --- */}
      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <i className="fas fa-chart-line me-2"></i>
              24-Hour Temperature & Rain Forecast
            </div>
            <div className="card-body">
              {/* Use Bar for mixed chart types */}
              <Bar
                data={hourlyChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true },
                    title: {
                      display: true,
                      text: 'Temperature and Precipitation Probability'
                    }
                  },
                  scales: {
                    y: {
                      type: 'linear',
                      position: 'left',
                      title: { display: true, text: 'Temperature (°C)' }
                    },
                    y1: {
                      type: 'linear',
                      position: 'right',
                      title: { display: true, text: 'Rain Chance (%)' },
                      grid: { drawOnChartArea: false },
                      min: 0,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <i className="fas fa-chart-bar me-2"></i>
              5-Day Temperature Range
            </div>
            <div className="card-body">
              <Bar 
                data={dailyChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-3">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <i className="fas fa-tint me-2"></i>
              Humidity Trend
            </div>
            <div className="card-body">
              <Line 
                data={humidityChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      min: 0,
                      max: 100,
                      title: { display: true, text: 'Humidity (%)' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Detailed Forecast Table --- */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header">
              <i className="fas fa-calendar-alt me-2"></i>
              5-Day Detailed Forecast
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Day</th>
                      <th>Condition</th>
                      <th>High</th>
                      <th>Low</th>
                      <th>Rain</th>
                      <th>Humidity</th>
                      <th>Rain Chance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyForecast.map((day, index) => (
                      <tr key={index}>
                        <td><strong>{day.date}</strong></td>
                        <td><img src={day.icon} alt="Weather icon" style={{width: '30px'}} /></td>
                        <td className="text-danger">{day.temp_max}°C</td>
                        <td className="text-primary">{day.temp_min}°C</td>
                        <td>{day.rain > 0 ? `${day.rain.toFixed(1)}mm` : 'None'}</td>
                        <td>{Math.round(day.humidity)}%</td>
                        <td>
                          <span className={`badge ${day.pop > 0.5 ? 'bg-info' : 'bg-secondary'}`}>
                            {Math.round(day.pop * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAnalysis;