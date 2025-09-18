// controllers/predictionController.js
import asyncHandler from 'express-async-handler';
import axios from 'axios';
import config from '../config/index.js';
import Prediction from '../models/Prediction.js';

/**
 * @desc    Get crop yield prediction from the ML model
 * @route   POST /api/predict
 * @access  Private
 */
export const getPrediction = asyncHandler(async (req, res) => {
  const { nitrogen, phosphorus, potassium, ph, rainfall, temperature, crop } = req.body;

  // 1. Validate input
  if (!nitrogen || !phosphorus || !potassium || !crop) {
    res.status(400);
    throw new Error('Please provide all required fields: nitrogen, phosphorus, potassium, crop');
  }

  // 2. Send data to the external Python ML service
  // In a real app, this URL comes from your config file.
  // const mlServiceUrl = config.mlServiceUrl || 'http://127.0.0.1:8000/predict';
  
  // For demonstration, we'll use mock logic instead of a real API call.
  // try {
  //   const { data: predictionResult } = await axios.post(mlServiceUrl, {
  //     nitrogen, phosphorus, potassium, ph, rainfall, temperature, crop
  //   });
  // } catch(error) { ... }
  
  const mockPrediction = {
      predictedYield: (parseFloat(nitrogen) * 0.2 + parseFloat(phosphorus) * 0.5 + parseFloat(potassium) * 0.3).toFixed(2), // Simple formula for mock
      unit: 'tons/hectare',
      confidenceScore: 0.88,
      recommendations: [
          'Based on soil composition, your predicted yield is strong.',
          'Ensure consistent irrigation during the flowering stage.',
          'Monitor for pests, as current weather conditions are favorable for them.'
      ]
  };

  // 3. (Optional) Save the prediction to the database for user history
  const prediction = await Prediction.create({
    user: req.user._id,
    input: req.body,
    result: mockPrediction,
  });

  // 4. Return the result
  res.status(200).json(mockPrediction);
});