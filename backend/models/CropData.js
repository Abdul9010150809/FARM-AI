const mongoose = require('mongoose');

const CropDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  scientificName: {
    type: String,
    required: true
  },
  optimalTemperature: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  optimalRainfall: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  optimalSoilPH: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  growthDuration: {
    type: Number, // in days
    required: true
  },
  waterRequirements: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  commonPests: [{
    name: String,
    description: String,
    prevention: String,
    treatment: String
  }],
  commonDiseases: [{
    name: String,
    description: String,
    prevention: String,
    treatment: String
  }],
  fertilizationSchedule: [{
    stage: String,
    recommendation: String,
    npkRatio: String
  }],
  irrigationRecommendations: {
    type: String,
    required: true
  },
  harvestingGuidelines: {
    type: String,
    required: true
  },
  yieldRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  regions: [{
    type: String,
    enum: ['coastal', 'western', 'northern', 'southern']
  }],
  suitableSoilTypes: [{
    type: String,
    enum: ['alluvial', 'black', 'red', 'laterite']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
CropDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to get crop by name
CropDataSchema.statics.findByName = function(name) {
  return this.findOne({ name: new RegExp(name, 'i') });
};

// Instance method to check if crop is suitable for region
CropDataSchema.methods.isSuitableForRegion = function(region) {
  return this.regions.includes(region);
};

// Instance method to check if crop is suitable for soil type
CropDataSchema.methods.isSuitableForSoil = function(soilType) {
  return this.suitableSoilTypes.includes(soilType);
};

module.exports = mongoose.model('CropData', CropDataSchema);