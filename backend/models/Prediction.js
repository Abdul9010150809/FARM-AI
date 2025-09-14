const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  cropType: {
    type: String,
    required: true
  },
  soilData: {
    type: {
      type: String,
      required: true
    },
    ph: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number
  },
  weatherData: {
    temperature: Number,
    rainfall: Number,
    humidity: Number,
    forecast: [{
      date: Date,
      temperature: Number,
      rainfall: Number,
      humidity: Number
    }]
  },
  area: {
    type: Number,
    required: true
  },
  predictedYield: {
    type: Number,
    required: true
  },
  confidence: {
    type: Number,
    default: 0
  },
  recommendations: {
    irrigation: String,
    fertilization: String,
    pestControl: String,
    harvestTiming: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);