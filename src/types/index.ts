// src/types/index.ts
export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  location?: {
    address: string;
    latitude: number;
    longitude: number;
    region: string;
  };
  farmDetails?: {
    totalArea: number;
    soilType: string;
    primaryCrops: string[];
    irrigationSystem: string;
  };
}

export interface PredictionInput {
  cropType: string;
  area: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  soilType?: string;
  rainfall?: number;
  temperature?: number;
  humidity?: number;
}

export interface PredictionResult {
  yield: number;
  perAcre: number;
  confidence: number;
  location: string;
  weather: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
  soil: {
    type: string;
    ph: number;
    nitrogen: number;
  };
  recommendations: {
    irrigation: string;
    fertilization: string;
    pestControl: string;
    harvestTiming: string;
  };
}

export interface WeatherData {
  temp: number;
  humidity: number;
  wind_speed: number;
  main: string;
  description: string;
  icon: string;
  rainfall: number;
  visibility?: number;        // Make optional
  daily_rainfall?: number;    // Make optional
  pressure?: number;
  feels_like?: number;
  sunrise?: number;
  sunset?: number;
}

export interface SoilData {
  type: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicMatter: number;
  moisture: number;
}

export interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Additional types for enhanced functionality
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  region?: string;
  country?: string;
}

export interface WeatherForecast {
  date: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  wind_speed: number;
  precipitation: number;
  pressure: number;
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  season: string;
  yieldPotential: number;
  waterRequirements: number;
  soilRequirements: string[];
  marketDemand: 'High' | 'Medium' | 'Low';
}

export interface FarmAnalytics {
  totalYield: number;
  averageYieldPerAcre: number;
  cropDistribution: {
    crop: string;
    area: number;
    yield: number;
  }[];
  seasonalPerformance: {
    season: string;
    yield: number;
    rainfall: number;
  }[];
  soilHealth: {
    ph: number;
    nitrogen: number;
    organicMatter: number;
    trend: 'improving' | 'stable' | 'declining';
  };
}

export interface Alert {
  id: string;
  type: 'weather' | 'pest' | 'disease' | 'irrigation' | 'market';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  location?: string;
  actionRequired?: boolean;
  actionUrl?: string;
}

export interface MarketPrice {
  crop: string;
  price: number;
  unit: string;
  market: string;
  timestamp: Date;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export interface IrrigationSchedule {
  crop: string;
  area: number;
  schedule: {
    time: string;
    duration: number; // in minutes
    amount: number; // in liters
  }[];
  totalWater: number;
  efficiency: number;
}

// Types for the prediction form
export interface PredictionFormData {
  cropType: string;
  area: number;
  soilType: string;
  location: {
    latitude: number;
    longitude: number;
  };
  useCurrentWeather: boolean;
  customWeather?: {
    temperature: number;
    rainfall: number;
    humidity: number;
  };
}

// Types for the dashboard
export interface DashboardStats {
  totalPredictions: number;
  accuracyRate: number;
  favoriteCrop: string;
  averageYield: number;
  weatherAlerts: number;
  soilHealth: number;
}

// Types for user preferences
export interface UserPreferences {
  language: string;
  units: 'metric' | 'imperial';
  notifications: {
    weatherAlerts: boolean;
    cropAlerts: boolean;
    marketUpdates: boolean;
    predictionReminders: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
}