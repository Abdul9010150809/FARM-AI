// backend/routes/soilHealthRoutes.js
import express from 'express';
import { getSoilHealthData } from '../controllers/soilHealthController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/soil
// @desc    Fetch soil health data for a given location (lat, lon)
// @access  Private
router.route('/').get(protect, getSoilHealthData);

export default router;