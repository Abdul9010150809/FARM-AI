const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['farmer', 'admin', 'researcher'],
    default: 'farmer'
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number,
    region: {
      type: String,
      enum: ['coastal', 'western', 'northern', 'southern', 'unknown']
    }
  },
  farmDetails: {
    totalArea: Number, // in acres
    soilType: {
      type: String,
      enum: ['alluvial', 'black', 'red', 'laterite', 'unknown']
    },
    primaryCrops: [String],
    irrigationSystem: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'manual', 'unknown']
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    units: {
      area: { type: String, default: 'acres' },
      temperature: { type: String, default: 'celsius' },
      weight: { type: String, default: 'kg' }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ 'location.region': 1 });
UserSchema.index({ createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user profile without sensitive data
UserSchema.methods.getProfile = function() {
  return {
    _id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    location: this.location,
    farmDetails: this.farmDetails,
    preferences: this.preferences,
    isVerified: this.isVerified,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount,
    createdAt: this.createdAt
  };
};

// Static method to find users by region
UserSchema.statics.findByRegion = function(region) {
  return this.find({ 'location.region': region });
};

// Static method to get farmers growing specific crops
UserSchema.statics.findByCrop = function(cropName) {
  return this.find({ 'farmDetails.primaryCrops': new RegExp(cropName, 'i') });
};

// Virtual for user's activity level
UserSchema.virtual('activityLevel').get(function() {
  if (this.loginCount > 50) return 'very_active';
  if (this.loginCount > 20) return 'active';
  if (this.loginCount > 5) return 'occasional';
  return 'new';
});

module.exports = mongoose.model('User', UserSchema);