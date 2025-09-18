// middleware/errorMiddleware.js
import config from '../config/index.js';

// Handles 404 Not Found errors for routes that don't exist
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (errorHandler)
};

// Custom error handler to override the default Express error handler
export const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code, so we override it
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Show stack trace only in development mode for security
    stack: config.nodeEnv === 'production' ? '🥞' : err.stack,
  });
};