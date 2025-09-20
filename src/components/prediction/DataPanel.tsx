// src/components/prediction/DataPanel.tsx
import React from 'react';
import { LocationData, WeatherData, SoilData } from '../../types';

interface Props {
  location: LocationData | null;
  weather: WeatherData | null;
  soil: SoilData | null;
  isLoading: boolean;
}

const DataPanel: React.FC<Props> = ({ location, weather, soil, isLoading }) => {
  if (isLoading) {
    return (
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          <i className="fas fa-satellite-dish me-2"></i>Fetching Real-time Data...
        </div>
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0 text-muted">Acquiring satellite and sensor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-primary text-white">
        <i className="fas fa-location-dot me-2"></i>Real-time Field Data
      </div>
      <div className="card-body">
        {location && (
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-map-marker-alt fa-lg text-primary me-3"></i>
            <div>
              <strong>Location:</strong> {location.city}, {location.state}
            </div>
          </div>
        )}
        {weather && (
          <div className="d-flex align-items-center mb-3">
            <img src={weather.icon} alt={weather.main} style={{ width: '40px', marginRight: '10px' }} />
            <div>
              <strong>Weather:</strong> {weather.temp}°C, {weather.description}
              <div className="small text-muted">Humidity: {weather.humidity}%, Wind: {weather.wind_speed} m/s</div>
            </div>
          </div>
        )}
        {soil && (
          <div className="d-flex align-items-center">
            <i className="fas fa-seedling fa-lg text-success me-3"></i>
            <div>
              <strong>Soil:</strong> {soil.type}, pH {soil.ph}
              <div className="small text-muted">N: {soil.nitrogen}, P: {soil.phosphorus}, K: {soil.potassium} kg/ha</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPanel;