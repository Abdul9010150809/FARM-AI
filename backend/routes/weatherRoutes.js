// backend/routes/weatherRoutes.js
import express from 'express';
import { getWeatherData } from '../controllers/weatherController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/weather
// @desc    Fetch weather data for a given location (lat, lon)
// @access  Private
router.route('/').get(protect, getWeatherData);

export default router;