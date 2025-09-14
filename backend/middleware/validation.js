const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for prediction input
const validatePredictionInput = [
  body('cropType')
    .isIn(['rice', 'wheat', 'corn', 'sugarcane', 'cotton', 'pulses'])
    .withMessage('Invalid crop type'),
  
  body('area')
    .isFloat({ min: 0.1 })
    .withMessage('Area must be a positive number'),
  
  body('location.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('location.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

module.exports = {
  validatePredictionInput,
  handleValidationErrors
};