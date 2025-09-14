const axios = require('axios');

class LocationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  // Get address from coordinates
  async getAddressFromCoords(lat, lng) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`
      );
      
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }
      return 'Unknown location';
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Unknown location';
    }
  }

  // Get coordinates from address
  async getCoordsFromAddress(address) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  }

  // Get region type based on coordinates (for Odisha)
  getRegionType(latitude, longitude) {
    // Simplified region detection for Odisha
    // Coastal regions (approx)
    if (latitude >= 19.0 && latitude <= 20.5 && longitude >= 84.0 && longitude <= 87.0) {
      return 'coastal';
    }
    // Western regions (approx)
    else if (latitude >= 20.0 && latitude <= 22.0 && longitude >= 82.0 && longitude <= 84.0) {
      return 'western';
    }
    // Northern regions (approx)
    else if (latitude >= 21.0 && latitude <= 22.5 && longitude >= 84.0 && longitude <= 87.0) {
      return 'northern';
    }
    // Southern regions (approx)
    else if (latitude >= 18.5 && latitude <= 20.0 && longitude >= 82.0 && longitude <= 85.0) {
      return 'southern';
    }
    return 'unknown';
  }
}

module.exports = new LocationService();