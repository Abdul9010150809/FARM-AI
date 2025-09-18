// backend/routes/userRoutes.js
import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get the logged-in user's profile
// @access  Private
router.route('/profile').get(protect, getUserProfile);

export default router;