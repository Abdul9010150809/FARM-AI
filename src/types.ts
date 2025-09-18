export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  region: string;
}

export interface FarmDetails {
  totalArea: number;
  soilType: string;
  primaryCrops: string[];
  irrigationSystem: string;
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  location?: Location;
  farmDetails?: FarmDetails;
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
  temperature: number;
  humidity: number;
  rainfall: number;
}

export interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  visible: boolean;
}