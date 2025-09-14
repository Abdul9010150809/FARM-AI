const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { auth } = require('../middleware/auth'); // ADD THIS LINE

const router = express.Router();

// Register new user - NO AUTH NEEDED (public)
router.post('/register', validateRegistration, async (req, res) => {
  // ... existing code
});

// Login user - NO AUTH NEEDED (public) 
router.post('/login', validateLogin, async (req, res) => {
  // ... existing code
});

// Get current user profile - PROTECTED
router.get('/profile', auth, async (req, res) => { // ADD auth MIDDLEWARE
  try {
    // Remove the manual token checking code since auth middleware handles it
    res.json({ user: req.user.getProfile() }); // Use req.user from auth middleware

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile - PROTECTED  
router.put('/profile', auth, async (req, res) => { // ADD auth MIDDLEWARE
  try {
    // Remove manual token checking - auth middleware already set req.user
    const user = req.user;
    
    // Update allowed fields
    const allowedUpdates = ['name', 'location', 'farmDetails', 'preferences'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
});

// Forgot password - NO AUTH NEEDED (public)
router.post('/forgot-password', async (req, res) => {
  // ... existing code
});

module.exports = router;