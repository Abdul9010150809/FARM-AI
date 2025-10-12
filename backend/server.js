// backend/server.js
import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import logger from './utils/logger.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import soilHealthRoutes from './routes/soilHealthRoutes.js';

// --- Initial Setup ---
connectDB(); // Connect to MongoDB
const app = express();
const PORT = process.env.PORT || config.port || 5000;

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// --- API Routes ---
app.get('/', (req, res) => {
  res.json({
    message: '🌱 CropYield Pro Backend API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      predictions: '/api/predict',
      weather: '/api/weather',
      soil: '/api/soil'
    },
    documentation: '/api/docs'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CropYield Pro API Server is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv || 'development',
    database: 'Connected ✅',
    version: '1.0.0',
    uptime: `${process.uptime().toFixed(2)} seconds`
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    message: 'CropYield Pro API Documentation',
    endpoints: {
      'GET /api/health': 'Server health status',
      'POST /api/auth/register': 'User registration',
      'POST /api/auth/login': 'User login',
      'GET /api/users': 'Get user data (protected)',
      'POST /api/predict': 'Make crop yield prediction',
      'GET /api/weather': 'Get weather data',
      'GET /api/soil': 'Get soil health data'
    },
    examples: {
      healthCheck: 'curl http://localhost:5001/api/health',
      prediction: 'POST /api/predict with crop data'
    }
  });
});

// Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/soil', soilHealthRoutes);

// --- Error Handling Middleware (must be last) ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
  logger.info(`Health check available at: http://localhost:${PORT}/api/health`);
  logger.info(`API Documentation at: http://localhost:${PORT}/api/docs`);
});

export default app;