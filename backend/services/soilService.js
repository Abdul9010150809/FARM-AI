const axios = require('axios');

class SoilService {
  constructor() {
    this.apiKey = process.env.SOIL_DATA_API_KEY;
  }

  // Get soil data for coordinates (simulated as we might not have a real API)
  async getSoilData(lat, lng) {
    try {
      // In a real implementation, you would use a soil API like:
      // const response = await axios.get(`https://api.soil.data.com?lat=${lat}&lng=${lng}&key=${this.apiKey}`);
      
      // For demo purposes, we'll return simulated data based on region
      const regionType = await this.getRegionType(lat, lng);
      
      // Default soil properties by region type
      const soilProperties = {
        coastal: {
          type: 'alluvial',
          ph: 6.5,
          nitrogen: 0.15,
          phosphorus: 0.08,
          potassium: 0.12,
          organicMatter: 2.1
        },
        western: {
          type: 'black',
          ph: 7.2,
          nitrogen: 0.12,
          phosphorus: 0.06,
          potassium: 0.09,
          organicMatter: 1.8
        },
        northern: {
          type: 'red',
          ph: 6.8,
          nitrogen: 0.13,
          phosphorus: 0.07,
          potassium: 0.10,
          organicMatter: 1.9
        },
        southern: {
          type: 'laterite',
          ph: 5.9,
          nitrogen: 0.10,
          phosphorus: 0.05,
          potassium: 0.08,
          organicMatter: 1.6
        },
        default: {
          type: 'unknown',
          ph: 6.5,
          nitrogen: 0.12,
          phosphorus: 0.06,
          potassium: 0.10,
          organicMatter: 1.8
        }
      };
      
      return soilProperties[regionType] || soilProperties.default;
    } catch (error) {
      console.error('Error fetching soil data:', error);
      return null;
    }
  }

  // Determine region type based on coordinates
  async getRegionType(lat, lng) {
    // Simplified region detection for Odisha
    if (lat >= 19.0 && lat <= 20.5 && lng >= 84.0 && lng <= 87.0) return 'coastal';
    if (lat >= 20.0 && lat <= 22.0 && lng >= 82.0 && lng <= 84.0) return 'western';
    if (lat >= 21.0 && lat <= 22.5 && lng >= 84.0 && lng <= 87.0) return 'northern';
    if (lat >= 18.5 && lat <= 20.0 && lng >= 82.0 && lng <= 85.0) return 'southern';
    return 'default';
  }
}

module.exports = new SoilService();