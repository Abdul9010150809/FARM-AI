// Mock data for when backend is not available
export const mockWeatherData = {
  temperature: 32,
  humidity: 78,
  rainfall: 45,
  windSpeed: 5.2,
  pressure: 1013,
  description: 'Partly cloudy',
  icon: '02d'
};

export const mockSoilData = {
  type: 'alluvial',
  ph: 6.5,
  nitrogen: 0.15,
  phosphorus: 0.08,
  potassium: 0.12,
  organicMatter: 2.1,
  moisture: 65
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
    return {
      token: 'mock-jwt-token',
      user: {
        _id: '1',
        name: email.split('@')[0],
        email: email,
        role: 'farmer'
      }
    };
  },
  
  register: async (name: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      token: 'mock-jwt-token',
      user: {
        _id: '1',
        name: name,
        email: email,
        role: 'farmer'
      }
    };
  }
};

// Mock chatbot response
export const mockChatbotResponse = async (message: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your CropYield Assistant. How can I help you with your farming questions today?";
  } else if (lowerMessage.includes('yield') || lowerMessage.includes('prediction')) {
    return "Our AI models analyze soil quality, weather patterns, and historical data to predict crop yields with 95% accuracy.";
  } else if (lowerMessage.includes('rice')) {
    return "For rice cultivation, maintain proper water levels and use nitrogen-rich fertilizers. Optimal temperature: 20-35°C.";
  } else if (lowerMessage.includes('weather')) {
    return "I can provide weather insights and recommendations based on current conditions.";
  } else {
    return "I'm here to help with agricultural advice. You can ask me about crop yields, weather, soil health, or pest management.";
  }
};