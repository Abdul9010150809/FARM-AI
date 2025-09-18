// backend/services/soilHealthService.js
import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Fetches soil health data.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} - A soil health data object.
 */
export const fetchSoilData = async (lat, lon) => {
  try {
    // In a real application, you would uncomment this and call a real soil API.
    /*
    const apiKey = config.soilApiKey;
    const url = `https://api.soildata.com/v1/query?lat=${lat}&lon=${lon}&apikey=${apiKey}`;
    const { data } = await axios.get(url);
    return data;
    */

    // For now, we return dynamic mock data to simulate an API response.
    const mockSoilData = {
        moisture: (40 + (parseFloat(lat) % 15)).toFixed(1),
        ph: (6.0 + (parseFloat(lon) % 1.5)).toFixed(1),
        nitrogen: Math.floor(120 + (parseFloat(lat) % 40)),
        phosphorus: Math.floor(60 + (parseFloat(lon) % 25)),
        potassium: Math.floor(200 + (parseFloat(lat) % 50)),
    };
    
    // Simulating a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockSoilData;
  } catch (error) {
    logger.error('Error fetching soil health data:', error.message);
    throw new Error('Could not retrieve soil health data.');
  }
};