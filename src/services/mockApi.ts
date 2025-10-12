// src/services/mockApi.ts

// Mock data for when backend is not available
export const mockWeatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 45,
  windSpeed: 5.2,
  pressure: 1013,
  description: 'Partly cloudy',
  icon: '02d',
  location: 'Coastal Andhra',
  forecast: [
    { day: 'Today', high: 32, low: 24, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', high: 31, low: 23, condition: 'Light Rain' },
    { day: 'Day 3', high: 30, low: 22, condition: 'Cloudy' }
  ]
};

export const mockSoilData = {
  type: 'alluvial',
  ph: 6.5,
  nitrogen: 0.15,
  phosphorus: 0.08,
  potassium: 0.12,
  organicMatter: 2.1,
  moisture: 65,
  quality: 'Good',
  recommendations: ['Add organic compost', 'Maintain current pH level']
};

export const mockPredictionResult = (cropType: string, area: number) => {
  const baseYield = cropType === 'rice' ? 2500 : 
                   cropType === 'wheat' ? 1800 :
                   cropType === 'corn' ? 2200 :
                   cropType === 'sugarcane' ? 45000 :
                   cropType === 'cotton' ? 800 :
                   cropType === 'chillies' ? 1800 : 2000;
  
  return {
    yield: Math.round(baseYield * area * (0.9 + Math.random() * 0.2)),
    perAcre: baseYield,
    confidence: 92 + Math.floor(Math.random() * 5),
    location: 'Coastal Andhra',
    weather: mockWeatherData,
    soil: mockSoilData,
    recommendations: {
      irrigation: `For ${cropType}, use drip irrigation every 3-4 days. Maintain soil moisture at 60-70% during growth phase.`,
      fertilization: `Apply balanced NPK fertilizer (80:40:40 kg/acre) for ${cropType}. Add organic compost for better soil health.`,
      pestControl: `Monitor for common pests in ${cropType}. Use neem oil as organic pesticide and chemical pesticides only when necessary.`,
      harvestTiming: `Optimal harvest time for ${cropType} is typically 90-120 days after planting. Monitor crop maturity indicators.`
    }
  };
};

// Mock login/register functions
export const mockAuth = {
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        _id: '1',
        name: email.split('@')[0],
        email: email,
        role: 'farmer',
        createdAt: new Date().toISOString()
      }
    };
  },
  
  register: async (userData: { name: string; email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const { name, email, password } = userData;
    
    // Simple validation
    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        _id: '1',
        name: name,
        email: email,
        role: 'farmer',
        createdAt: new Date().toISOString()
      }
    };
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Logged out successfully' };
  },
  
  getProfile: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      _id: '1',
      name: 'Demo Farmer',
      email: 'farmer@example.com',
      role: 'farmer',
      farmSize: 5,
      location: 'Coastal Andhra',
      createdAt: new Date().toISOString()
    };
  }
};

// Mock chatbot response
export const mockChatbotResponse = async (message: string, userId?: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return {
      response: "Hello! I'm your CropYield Assistant. How can I help you with your farming questions today?",
      suggestions: [
        "How to increase crop yield?",
        "Best crops for my soil",
        "Weather forecast help"
      ]
    };
  } else if (lowerMessage.includes('yield') || lowerMessage.includes('prediction')) {
    return {
      response: "Our AI models analyze soil quality, weather patterns, and historical data to predict crop yields with 95% accuracy. Use the prediction tool with your crop details for precise yield estimates.",
      suggestions: [
        "How accurate are predictions?",
        "What data do I need for prediction?",
        "Best crops for high yield"
      ]
    };
  } else if (lowerMessage.includes('rice')) {
    return {
      response: "For rice cultivation:\n• Maintain proper water levels (2-5cm during early growth)\n• Use nitrogen-rich fertilizers\n• Optimal temperature: 20-35°C\n• Harvest in 110-120 days\n• Watch for blast disease and brown plant hoppers",
      suggestions: [
        "Rice fertilizer schedule",
        "Rice pest control",
        "Rice irrigation methods"
      ]
    };
  } else if (lowerMessage.includes('weather')) {
    return {
      response: "I can provide weather insights and recommendations based on current conditions. For detailed forecasts, check the weather section. Generally, most crops thrive in 20-30°C with moderate rainfall.",
      suggestions: [
        "Weather impact on crops",
        "Protecting crops from bad weather",
        "Best weather for planting"
      ]
    };
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('ph')) {
    return {
      response: "Soil health is crucial for crop success. Most crops prefer pH 6.0-7.0. Test your soil regularly and add organic matter to improve fertility. Our soil analysis tool can give specific recommendations.",
      suggestions: [
        "How to test soil pH",
        "Improving soil quality",
        "Best soil for different crops"
      ]
    };
  } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return {
      response: "Use balanced NPK fertilizers based on soil test results. Organic options include compost, manure, and green manure. Avoid over-fertilization which can harm crops and environment.",
      suggestions: [
        "Organic fertilizer options",
        "When to apply fertilizer",
        "Fertilizer for specific crops"
      ]
    };
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
    return {
      response: "For pest management:\n• Use integrated pest management (IPM)\n• Regular field monitoring\n• Biological controls (neem, beneficial insects)\n• Chemical pesticides as last resort\n• Crop rotation to break pest cycles",
      suggestions: [
        "Common crop diseases",
        "Organic pest control",
        "Identifying pest damage"
      ]
    };
  } else if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
    return {
      response: "Efficient irrigation methods:\n• Drip irrigation for water conservation\n• Sprinklers for uniform coverage\n• Timing: Early morning or late evening\n• Monitor soil moisture regularly\n• Adjust based on rainfall",
      suggestions: [
        "Water requirements by crop",
        "Drip irrigation benefits",
        "Saving water in farming"
      ]
    };
  } else {
    return {
      response: "I'm here to help with agricultural advice. You can ask me about:\n• Crop yield predictions\n• Weather impacts\n• Soil health\n• Pest management\n• Irrigation methods\n• Fertilizer recommendations\n• Specific crop guidance",
      suggestions: [
        "How to use this app?",
        "Best crops for my region",
        "Seasonal farming tips"
      ]
    };
  }
};

// Mock prediction API
export const mockPredictionAPI = {
  predict: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
    
    const { cropType, area, location } = data;
    
    if (!cropType || !area) {
      throw new Error('Crop type and area are required');
    }
    
    return {
      success: true,
      data: mockPredictionResult(cropType, area),
      message: 'Prediction generated successfully'
    };
  },
  
  getSoilData: async (lat: number, lng: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        ...mockSoilData,
        coordinates: { lat, lng },
        lastUpdated: new Date().toISOString()
      }
    };
  },
  
  getWeatherData: async (lat: number, lng: number) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        ...mockWeatherData,
        coordinates: { lat, lng },
        lastUpdated: new Date().toISOString()
      }
    };
  }
};

// Mock user management
export const mockUserAPI = {
  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      _id: '1',
      name: 'Demo Farmer',
      email: 'farmer@example.com',
      role: 'farmer',
      farmSize: 5,
      location: 'Coastal Andhra',
      phone: '+91 9876543210',
      joinedDate: '2024-01-15',
      preferences: {
        notifications: true,
        language: 'en',
        units: 'metric'
      }
    };
  },
  
  updateProfile: async (updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: '1',
        name: updates.name || 'Demo Farmer',
        email: 'farmer@example.com',
        ...updates
      }
    };
  },
  
  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      predictions: [
        {
          id: '1',
          cropType: 'rice',
          area: 2.5,
          predictedYield: 6250,
          actualYield: 6100,
          date: '2024-09-15',
          confidence: 94
        },
        {
          id: '2',
          cropType: 'cotton',
          area: 3.0,
          predictedYield: 2400,
          actualYield: 2500,
          date: '2024-06-20',
          confidence: 91
        }
      ]
    };
  }
};

// Mock dashboard data
export const mockDashboardData = {
  stats: {
    totalPredictions: 12,
    averageAccuracy: 92,
    moneySaved: 15000,
    cropsAnalyzed: 5
  },
  recentActivity: [
    {
      id: '1',
      type: 'prediction',
      crop: 'Rice',
      date: '2024-10-12',
      result: '6250 kg'
    },
    {
      id: '2',
      type: 'soil_test',
      action: 'Soil analysis',
      date: '2024-10-10',
      result: 'Good condition'
    },
    {
      id: '3',
      type: 'weather',
      action: 'Weather check',
      date: '2024-10-08',
      result: 'Optimal conditions'
    }
  ],
  recommendations: [
    'Consider crop rotation for better soil health',
    'Current weather is ideal for planting rice',
    'Soil pH is optimal for most crops',
    'Monitor for pests during this season'
  ]
};

// Utility function to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  // Use mock data if:
  // 1. We're in development mode
  // 2. Or the backend is not available
  // 3. Or explicitly forced via environment variable
  return process.env.NODE_ENV === 'development' || 
         process.env.REACT_APP_USE_MOCK_API === 'true' ||
         !process.env.REACT_APP_API_BASE_URL;
};

// Main mock API object
const mockAPI = {
  auth: mockAuth,
  prediction: mockPredictionAPI,
  user: mockUserAPI,
  chatbot: mockChatbotResponse,
  dashboard: mockDashboardData,
  
  // Health check
  health: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: 'healthy', mode: 'mock', timestamp: new Date().toISOString() };
  }
};

export default mockAPI;