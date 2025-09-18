// backend/services/mlService.js
import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';

/**
 * Sends data to the Python ML model API and gets a prediction.
 * @param {object} inputData - The data for the prediction model.
 * @returns {Promise<object>} - The prediction result from the ML model.
 */
export const getPredictionFromModel = async (inputData) => {
  const mlServiceUrl = config.mlServiceUrl;
  
  if (!mlServiceUrl) {
    throw new Error('Machine Learning service URL is not configured.');
  }

  try {
    // Make a POST request to your Python API (e.g., a Flask or FastAPI server)
    const { data } = await axios.post(mlServiceUrl, inputData);
    
    logger.info('Successfully received prediction from ML service.');
    return data; // The JSON response from your Python API
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      logger.error('ML service responded with an error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      logger.error('No response from ML service:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      logger.error('Error setting up request to ML service:', error.message);
    }
    throw new Error('Failed to get prediction from the model.');
  }
};