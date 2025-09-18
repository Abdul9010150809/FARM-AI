// backend/models/Prediction.js
import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates a relationship with the User model
    },
    input: {
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      potassium: { type: Number, required: true },
      ph: { type: Number },
      rainfall: { type: Number },
      temperature: { type: Number },
      crop: { type: String, required: true },
    },
    result: {
      predictedYield: { type: Number },
      unit: { type: String },
      confidenceScore: { type: Number },
      recommendations: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;