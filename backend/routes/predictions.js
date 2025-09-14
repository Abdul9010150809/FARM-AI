const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Prediction = require('../models/Prediction');
const { spawn } = require('child_process');
const weatherService = require('../services/weatherService');
const soilService = require('../services/soilService');
const locationService = require('../services/locationService');

// Get yield prediction with automatic location detection
router.post('/predict', auth, async (req, res) => {
  try {
    const { cropType, area, location } = req.body;
    
    let coordinates;
    let address;
    
    // Get coordinates from provided location or use default (Bhubaneswar)
    if (location && location.latitude && location.longitude) {
      coordinates = { latitude: location.latitude, longitude: location.longitude };
      address = await locationService.getAddressFromCoords(location.latitude, location.longitude);
    } else {
      // Default to Bhubaneswar if no location provided
      coordinates = { latitude: 20.2961, longitude: 85.8245 };
      address = "Bhubaneswar, Odisha";
    }
    
    // Get weather data
    const weatherData = await weatherService.getCurrentWeather(coordinates.latitude, coordinates.longitude);
    const weatherForecast = await weatherService.getWeatherForecast(coordinates.latitude, coordinates.longitude);
    
    // Get soil data
    const soilData = await soilService.getSoilData(coordinates.latitude, coordinates.longitude);
    
    if (!weatherData || !soilData) {
      return res.status(500).json({ message: 'Failed to fetch environmental data' });
    }
    
    // Prepare data for ML model
    const mlInput = {
      crop_type: cropType,
      region: locationService.getRegionType(coordinates.latitude, coordinates.longitude),
      soil_type: soilData.type,
      soil_ph: soilData.ph,
      nitrogen: soilData.nitrogen,
      phosphorus: soilData.phosphorus,
      potassium: soilData.potassium,
      temperature: weatherData.temperature,
      rainfall: weatherData.rainfall * 30, // Convert to monthly estimate
      humidity: weatherData.humidity,
      area: area
    };
    
    // Call Python ML model
    const pythonProcess = spawn('python', [
      './backend/ml_models/yield_prediction.py',
      JSON.stringify(mlInput)
    ]);
    
    let predictedYield = 0;
    let confidence = 85;
    
    pythonProcess.stdout.on('data', (data) => {
      const result = JSON.parse(data.toString());
      predictedYield = result.prediction;
      confidence = result.confidence;
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
      // Fallback calculation if Python script fails
      predictedYield = calculateFallbackYield(mlInput);
    });
    
    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.log(`Python process exited with code ${code}`);
        // Use fallback calculation
        predictedYield = calculateFallbackYield(mlInput);
      }
      
      // Generate recommendations
      const recommendations = generateRecommendations(mlInput, predictedYield);
      
      // Create prediction record
      const prediction = new Prediction({
        userId: req.user ? req.user.id : null,
        location: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          address: address
        },
        cropType,
        soilData: soilData,
        weatherData: {
          temperature: weatherData.temperature,
          rainfall: weatherData.rainfall,
          humidity: weatherData.humidity,
          forecast: weatherForecast
        },
        area,
        predictedYield: predictedYield * area, // Total yield
        confidence,
        recommendations
      });
      
      await prediction.save();
      
      res.json({
        yield: Math.round(predictedYield * area),
        perAcre: Math.round(predictedYield),
        confidence: Math.round(confidence),
        location: address,
        weather: weatherData,
        soil: soilData,
        recommendations
      });
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ message: 'Server error during prediction' });
  }
});

// Fallback yield calculation if ML model fails
function calculateFallbackYield(input) {
  const baseYields = {
    'rice': 2500,
    'wheat': 1800,
    'corn': 2200,
    'sugarcane': 45000,
    'cotton': 800,
    'pulses': 900
  };
  
  const regionFactors = {
    'coastal': 1.2,
    'western': 0.9,
    'northern': 1.1,
    'southern': 1.0,
    'unknown': 1.0
  };
  
  const baseYield = baseYields[input.crop_type] || 1500;
  const regionFactor = regionFactors[input.region] || 1.0;
  
  // Simple formula considering environmental factors
  return Math.round(
    baseYield * regionFactor * 
    (1 + (input.rainfall - 1000) / 5000) * 
    (1 + (input.temperature - 25) / 100) * 
    (1 + (input.humidity - 60) / 500) *
    (0.8 + (input.soil_ph - 5.5) / 10) *
    (0.9 + input.nitrogen * 5)
  );
}

// Generate recommendations based on inputs and predicted yield
function generateRecommendations(input, yieldPerAcre) {
  const crop = input.crop_type;
  const region = input.region;
  const rainfall = input.rainfall;
  const temperature = input.temperature;
  const soilPh = input.soil_ph;
  
  let irrigation = '';
  if (rainfall < 800) {
    irrigation = 'Increase irrigation frequency. Consider drip irrigation for water conservation.';
  } else if (rainfall > 1500) {
    irrigation = 'Ensure proper drainage. Reduce irrigation during rainy periods.';
  } else {
    irrigation = 'Maintain regular irrigation schedule. Monitor soil moisture weekly.';
  }
  
  let fertilization = '';
  if (soilPh < 6.0) {
    fertilization = 'Apply lime to raise soil pH. Use balanced NPK fertilizer with additional phosphorus.';
  } else if (soilPh > 7.5) {
    fertilization = 'Apply sulfur to lower soil pH. Use ammonium-based fertilizers.';
  } else {
    fertilization = 'Apply standard NPK fertilizer recommended for your crop and region.';
  }
  
  let pestControl = 'Monitor for common pests in your region. Use integrated pest management practices.';
  if (region === 'coastal') {
    pestControl += ' Pay special attention to fungal diseases in humid conditions.';
  }
  
  let harvestTiming = '';
  if (crop === 'rice') harvestTiming = 'Harvest when 80-85% of panicles turn golden yellow.';
  else if (crop === 'wheat') harvestTiming = 'Harvest when grains are hard and moisture content is around 20-25%.';
  else if (crop === 'corn') harvestTiming = 'Harvest when kernels are firm and milky fluid is visible.';
  else harvestTiming = 'Consult local agricultural extension for optimal harvest timing.';
  
  return {
    irrigation,
    fertilization,
    pestControl,
    harvestTiming
  };
}

// Get prediction history
router.get('/history', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(predictions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;