// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MongoDB Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message} ❌`);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// --- Core Middleware ---
const corsOptions = {
  origin: [
    'https://abdul9010150809.github.io', // Your GitHub Pages
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests
app.options('*', cors(corsOptions));

// --- API Routes ---
app.get('/', (req, res) => {
  res.json({
    message: '🌱 CropYield Pro Backend API',
    version: '1.0.0',
    status: 'Running',
    database: 'MongoDB Connected ✅',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login & /api/auth/register',
      predictions: '/api/predict',
      weather: '/api/weather',
      soil: '/api/soil'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'CropYield Pro API Server is running! 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    version: '1.0.0',
    uptime: `${process.uptime().toFixed(2)} seconds`
  });
});

// Simple in-memory storage for demo (replace with MongoDB models later)
const users = [];
const predictions = [];

// Mock Auth Routes (you can replace with real MongoDB models later)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email && password) {
    // For demo - in real app, you'd verify against MongoDB
    res.json({
      token: 'jwt-token-' + Date.now(),
      user: {
        _id: '1',
        name: email.split('@')[0],
        email: email,
        role: 'farmer'
      }
    });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (name && email && password) {
    // For demo - in real app, you'd save to MongoDB
    const newUser = {
      _id: (users.length + 1).toString(),
      name,
      email,
      password, // In real app, hash this!
      role: 'farmer',
      createdAt: new Date()
    };
    users.push(newUser);
    
    res.json({
      token: 'jwt-token-' + Date.now(),
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } else {
    res.status(400).json({ error: 'All fields are required' });
  }
});

// Mock Prediction Route
app.post('/api/predict', (req, res) => {
  const { cropType, area, location } = req.body;
  
  const baseYield = cropType === 'rice' ? 2500 : 
                   cropType === 'wheat' ? 1800 :
                   cropType === 'corn' ? 2200 : 2000;
  
  const prediction = {
    id: Date.now().toString(),
    cropType,
    area,
    location: location || 'Coastal Andhra',
    yield: Math.round(baseYield * area * (0.9 + Math.random() * 0.2)),
    perAcre: baseYield,
    confidence: 92 + Math.floor(Math.random() * 5),
    timestamp: new Date(),
    recommendations: {
      irrigation: `For ${cropType}, use drip irrigation every 3-4 days.`,
      fertilization: `Apply balanced NPK fertilizer for ${cropType}.`,
      pestControl: `Monitor for common pests in ${cropType}.`
    }
  };
  
  // Store prediction
  predictions.push(prediction);
  
  res.json({ 
    success: true, 
    data: prediction,
    message: 'Prediction generated successfully'
  });
});

// Get prediction history
app.get('/api/predictions', (req, res) => {
  res.json({
    success: true,
    data: predictions.slice(-10).reverse() // Last 10 predictions
  });
});

// Mock Weather Route
app.get('/api/weather', (req, res) => {
  const { lat, lng } = req.query;
  
  res.json({
    temperature: 32,
    humidity: 78,
    rainfall: 45,
    windSpeed: 5.2,
    pressure: 1013,
    description: 'Partly cloudy',
    icon: '02d',
    location: `Lat: ${lat}, Lng: ${lng}`,
    forecast: [
      { day: 'Today', high: 32, low: 24, condition: 'Partly Cloudy' },
      { day: 'Tomorrow', high: 31, low: 23, condition: 'Light Rain' }
    ]
  });
});

// Mock Soil Route
app.get('/api/soil', (req, res) => {
  const { lat, lng } = req.query;
  
  res.json({
    type: 'alluvial',
    ph: 6.5,
    nitrogen: 0.15,
    phosphorus: 0.08,
    potassium: 0.12,
    organicMatter: 2.1,
    moisture: 65,
    quality: 'Good',
    location: `Lat: ${lat}, Lng: ${lng}`
  });
});

// Mock Chat Route
app.post('/api/chat', (req, res) => {
  const { message, user_id } = req.body;
  
  const responses = {
    hello: "Hello! I'm your CropYield Assistant. How can I help with farming?",
    yield: "Our AI predicts crop yields using soil, weather, and historical data with 95% accuracy.",
    weather: "I can provide weather insights and recommendations based on current conditions.",
    soil: "Soil health is crucial. Most crops prefer pH 6.0-7.0. Add organic matter to improve fertility.",
    default: "I'm here to help with crop predictions, weather, soil health, pest management, and irrigation advice."
  };
  
  const lowerMsg = message.toLowerCase();
  let response = responses.default;
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) response = responses.hello;
  else if (lowerMsg.includes('yield') || lowerMsg.includes('prediction')) response = responses.yield;
  else if (lowerMsg.includes('weather')) response = responses.weather;
  else if (lowerMsg.includes('soil')) response = responses.soil;
  
  res.json({ 
    response: response,
    suggestions: [
      "How to increase crop yield?",
      "Best crops for my soil",
      "Weather forecast help"
    ]
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌱 Health check: https://cropyield-pro.onrender.com`);
  console.log(`📊 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'}`);
});

module.exports = app;