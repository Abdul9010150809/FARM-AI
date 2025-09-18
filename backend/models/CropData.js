// backend/models/CropData.js
import mongoose from 'mongoose';

const cropDataSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
      index: true, // Indexing for faster queries by region
    },
    year: {
      type: Number,
      required: true,
    },
    season: {
      type: String,
      required: true,
      enum: ['Kharif', 'Rabi', 'Zaid'], // Pre-defined seasons
    },
    soilMetrics: {
      ph: { type: Number },
      nitrogen: { type: Number },
      phosphorus: { type: Number },
      potassium: { type: Number },
    },
    weatherMetrics: {
      avgTemperature: { type: Number },
      totalRainfall: { type: Number }, // in mm
    },
    yield: {
      type: Number, // The actual recorded yield (e.g., in tons/hectare)
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CropData = mongoose.model('CropData', cropDataSchema);

export default CropData;