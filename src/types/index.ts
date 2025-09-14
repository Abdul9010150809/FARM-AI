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
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed?: number;
  pressure?: number;
  description?: string;
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