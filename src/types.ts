// src/types.ts

// --- User and Authentication Types ---
// ADDED: For user auth in AuthContext
export interface User {
  id: string;
  name: string;
  email: string;
}

// --- Notification and Chat Types ---
// ADDED: For the NotificationToast component
export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

// ADDED: For the Chatbot component
export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}


// --- Prediction Dashboard Types ---
export interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

// UPDATED: This is now the standard WeatherData object for the whole app
export interface WeatherData {
  temp: number; // FIX: Standardized to 'temp' instead of 'temperature'
  humidity: number;
  wind_speed: number;
  main: string;
  description: string;
  icon: string;
  rainfall?: number; // ADDED: Optional rainfall property
  visibility?: number; // ADDED: Optional visibility property
  daily_rainfall?: number; // ADDED: Optional daily rainfall property
}

export interface SoilData {
  type: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  moisture: number;
  organicMatter: number;
}

export interface OptimizationScenario {
  title: string;
  description: string;
  changes: Record<string, string>;
  icon: string;
}

export interface PredictionResult {
  yield: number;
  confidence: number;
  roi: number;
  sustainabilityScore: number;
  recommendations: {
    irrigation: string;
    fertilization: string;
    pestControl: string;
    market: string;
  };
  diseaseAlert: {
    risk: 'Low' | 'Medium' | 'High';
    details: string;
  };
  yieldHistory: number[];
  costBreakdown: {
    seeds: number;
    fertilizers: number;
    labor: number;
    irrigation: number;
    other: number;
  };
  optimizationScenarios: OptimizationScenario[];
}