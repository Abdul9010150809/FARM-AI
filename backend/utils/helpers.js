// Utility functions for the application

/**
 * Format a number with commas for thousands
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatDate(date) {
  if (!date) return 'Unknown date';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format a date with time
 * @param {Date} date - Date to format
 * @returns {string} Formatted date with time
 */
function formatDateTime(date) {
  if (!date) return 'Unknown date';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate percentage change between two values
 * @param {number} oldValue - Old value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
function calculatePercentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Indian)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
function isValidPhone(phone) {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

/**
 * Convert acres to hectares
 * @param {number} acres - Value in acres
 * @returns {number} Value in hectares
 */
function acresToHectares(acres) {
  return acres * 0.404686;
}

/**
 * Convert hectares to acres
 * @param {number} hectares - Value in hectares
 * @returns {number} Value in acres
 */
function hectaresToAcres(hectares) {
  return hectares * 2.47105;
}

/**
 * Convert kilograms to tons
 * @param {number} kg - Value in kilograms
 * @returns {number} Value in tons
 */
function kgToTons(kg) {
  return kg / 1000;
}

/**
 * Convert tons to kilograms
 * @param {number} tons - Value in tons
 * @returns {number} Value in kilograms
 */
function tonsToKg(tons) {
  return tons * 1000;
}

/**
 * Calculate yield per acre
 * @param {number} totalYield - Total yield
 * @param {number} area - Area in acres
 * @returns {number} Yield per acre
 */
function calculateYieldPerAcre(totalYield, area) {
  if (area <= 0) return 0;
  return totalYield / area;
}

/**
 * Calculate total yield from per acre yield
 * @param {number} yieldPerAcre - Yield per acre
 * @param {number} area - Area in acres
 * @returns {number} Total yield
 */
function calculateTotalYield(yieldPerAcre, area) {
  return yieldPerAcre * area;
}

/**
 * Get season based on month
 * @param {number} month - Month (0-11)
 * @returns {string} Season name
 */
function getSeason(month = new Date().getMonth()) {
  const seasons = [
    'Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer',
    'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter'
  ];
  return seasons[month];
}

/**
 * Get crop growing season based on crop type
 * @param {string} cropType - Type of crop
 * @returns {string} Growing season
 */
function getCropSeason(cropType) {
  const cropSeasons = {
    'rice': 'Kharif',
    'wheat': 'Rabi',
    'corn': 'Kharif',
    'sugarcane': 'Annual',
    'cotton': 'Kharif',
    'pulses': 'Rabi'
  };
  return cropSeasons[cropType.toLowerCase()] || 'Varies';
}

/**
 * Calculate days between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {number} Number of days
 */
function daysBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format duration in days to readable string
 * @param {number} days - Number of days
 * @returns {string} Formatted duration
 */
function formatDuration(days) {
  if (days < 1) return 'Less than a day';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  
  const months = Math.floor(days / 30);
  const remainingDays = days % 30;
  
  if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`;
  return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  formatNumber,
  formatDate,
  formatDateTime,
  calculatePercentageChange,
  generateRandomString,
  isValidEmail,
  isValidPhone,
  acresToHectares,
  hectaresToAcres,
  kgToTons,
  tonsToKg,
  calculateYieldPerAcre,
  calculateTotalYield,
  getSeason,
  getCropSeason,
  daysBetween,
  formatDuration,
  debounce,
  deepClone,
  generateId
};