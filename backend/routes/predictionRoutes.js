// backend/routes/predictionRoutes.js
import express from 'express';
import { getPrediction } from '../controllers/predictionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/predict
// @desc    Get a crop yield prediction
// @access  Private
router.route('/').post(protect, getPrediction);

export default router;