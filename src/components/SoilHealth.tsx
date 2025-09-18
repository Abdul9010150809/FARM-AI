import React, { useState, useEffect } from 'react';

// 1. TYPE DEFINITION
interface SoilData {
  latitude: number;
  longitude: number;
  moisture: number;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  organicMatter: number;
  soilType: string;
  region: string;
  healthScore: number;
  recommendations: string[];
  cropSuitability: string[];
}

// Soil type mapping based on Indian regions
const getSoilTypeByRegion = (latitude: number, longitude: number): { type: string; region: string } => {
  // Andhra Pradesh and Telangana regions
  if (latitude > 13 && latitude < 19 && longitude > 76 && longitude < 84) {
    return { 
      type: 'Red Loamy Soil', 
      region: 'Andhra Pradesh/Telangana' 
    };
  }
  // Tamil Nadu
  if (latitude > 8 && latitude < 13 && longitude > 76 && longitude < 80) {
    return { 
      type: 'Red Sandy Soil', 
      region: 'Tamil Nadu' 
    };
  }
  // Karnataka
  if (latitude > 12 && latitude < 18 && longitude > 74 && longitude < 78) {
    return { 
      type: 'Laterite Soil', 
      region: 'Karnataka' 
    };
  }
  // Maharashtra
  if (latitude > 16 && latitude < 22 && longitude > 72 && longitude < 80) {
    return { 
      type: 'Black Cotton Soil', 
      region: 'Maharashtra' 
    };
  }
  // Punjab/Haryana
  if (latitude > 29 && latitude < 32 && longitude > 74 && longitude < 77) {
    return { 
      type: 'Alluvial Soil', 
      region: 'Punjab/Haryana' 
    };
  }
  
  return { 
    type: 'Mixed Agricultural Soil', 
    region: 'General India' 
  };
};

// Generate soil parameters based on location and soil type
const generateSoilData = (latitude: number, longitude: number): SoilData => {
  const { type: soilType, region } = getSoilTypeByRegion(latitude, longitude);
  
  // Base values for different soil types
  const soilTypeBase: Record<string, any> = {
    'Red Loamy Soil': { ph: 6.2, nitrogen: 125, phosphorus: 55, potassium: 210, organicMatter: 3.8 },
    'Red Sandy Soil': { ph: 6.8, nitrogen: 95, phosphorus: 40, potassium: 180, organicMatter: 2.5 },
    'Laterite Soil': { ph: 5.8, nitrogen: 85, phosphorus: 35, potassium: 160, organicMatter: 2.2 },
    'Black Cotton Soil': { ph: 7.5, nitrogen: 140, phosphorus: 65, potassium: 230, organicMatter: 4.2 },
    'Alluvial Soil': { ph: 7.2, nitrogen: 160, phosphorus: 75, potassium: 250, organicMatter: 4.5 },
    'Mixed Agricultural Soil': { ph: 6.5, nitrogen: 120, phosphorus: 50, potassium: 200, organicMatter: 3.0 }
  };

  const base = soilTypeBase[soilType] || soilTypeBase['Mixed Agricultural Soil'];
  
  // Add some variation based on exact location
  const variation = (base: number, range: number) => 
    base + (Math.sin(latitude * longitude) * range);

  const ph = variation(base.ph, 0.8);
  const nitrogen = Math.round(variation(base.nitrogen, 25));
  const phosphorus = Math.round(variation(base.phosphorus, 15));
  const potassium = Math.round(variation(base.potassium, 30));
  const organicMatter = variation(base.organicMatter, 0.8);
  const moisture = 35 + (Math.cos(latitude) * 15); // Seasonal variation simulation
  const temperature = 25 + (Math.sin(longitude) * 8); // Regional temperature variation

  // Calculate health score (0-100)
  const healthScore = Math.min(100, Math.max(0, Math.round(
    (nitrogen / 2) + 
    (phosphorus * 1.5) + 
    (potassium / 3) + 
    (organicMatter * 8) + 
    (Math.abs(ph - 6.8) < 1.2 ? 15 : 0) +
    (moisture > 30 && moisture < 60 ? 10 : 0)
  )));

  // Generate recommendations based on soil analysis
  const recommendations = generateRecommendations(ph, nitrogen, phosphorus, potassium, organicMatter, moisture);
  
  // Generate crop suitability
  const cropSuitability = generateCropSuitability(soilType, ph, healthScore);

  return {
    latitude,
    longitude,
    moisture: Math.round(moisture * 10) / 10,
    ph: Math.round(ph * 10) / 10,
    nitrogen,
    phosphorus,
    potassium,
    temperature: Math.round(temperature * 10) / 10,
    organicMatter: Math.round(organicMatter * 10) / 10,
    soilType,
    region,
    healthScore,
    recommendations,
    cropSuitability
  };
};

const generateRecommendations = (ph: number, nitrogen: number, phosphorus: number, potassium: number, organicMatter: number, moisture: number): string[] => {
  const recs: string[] = [];
  
  if (ph < 6.0) {
    recs.push("Apply lime to raise pH level. Recommended: 2-4 tons per hectare.");
  } else if (ph > 7.5) {
    recs.push("Apply sulfur or gypsum to lower pH level for better nutrient availability.");
  }

  if (nitrogen < 100) {
    recs.push("Nitrogen levels are low. Apply nitrogen-rich fertilizers like urea or ammonium sulfate.");
  } else if (nitrogen > 180) {
    recs.push("Nitrogen levels are high. Reduce nitrogen application to prevent leaching.");
  }

  if (phosphorus < 40) {
    recs.push("Phosphorus deficiency detected. Apply DAP or superphosphate fertilizers.");
  }

  if (potassium < 180) {
    recs.push("Potassium levels are low. Apply MOP (Muriate of Potash) or potassium sulfate.");
  }

  if (organicMatter < 3.0) {
    recs.push("Low organic matter. Add compost, farmyard manure, or green manure crops.");
  }

  if (moisture < 30) {
    recs.push("Soil moisture is low. Implement irrigation and mulching practices.");
  } else if (moisture > 60) {
    recs.push("Soil is waterlogged. Improve drainage to prevent root diseases.");
  }

  recs.push("Regular soil testing every season is recommended for optimal crop management.");

  return recs;
};

const generateCropSuitability = (soilType: string, ph: number, healthScore: number): string[] => {
  const crops: Record<string, string[]> = {
    'Red Loamy Soil': ['Rice', 'Cotton', 'Chillies', 'Maize', 'Pulses'],
    'Red Sandy Soil': ['Groundnut', 'Millets', 'Cotton', 'Pulses'],
    'Laterite Soil': ['Cashew', 'Coconut', 'Mango', 'Coffee', 'Tea'],
    'Black Cotton Soil': ['Cotton', 'Wheat', 'Soybean', 'Sorghum', 'Citrus'],
    'Alluvial Soil': ['Rice', 'Wheat', 'Sugarcane', 'Vegetables', 'Mustard'],
    'Mixed Agricultural Soil': ['Multiple crops suitable with proper management']
  };

  const suitableCrops = crops[soilType] || crops['Mixed Agricultural Soil'];
  
  if (healthScore > 80) {
    return [`Highly suitable for: ${suitableCrops.join(', ')}`];
  } else if (healthScore > 60) {
    return [`Suitable for: ${suitableCrops.slice(0, 3).join(', ')} with soil amendments`];
  } else {
    return ['Soil requires improvement before intensive cropping. Consider green manuring.'];
  }
};

const getPhInfo = (ph: number): { label: string; color: string } => {
  if (ph < 5.5) return { label: 'Highly Acidic', color: '#dc2626' };
  if (ph < 6.0) return { label: 'Acidic', color: '#ea580c' };
  if (ph < 6.5) return { label: 'Slightly Acidic', color: '#f59e0b' };
  if (ph < 7.2) return { label: 'Neutral', color: '#22c55e' };
  if (ph < 7.8) return { label: 'Slightly Alkaline', color: '#3b82f6' };
  if (ph < 8.5) return { label: 'Alkaline', color: '#6366f1' };
  return { label: 'Highly Alkaline', color: '#8b5cf6' };
};

const getHealthScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // Green
  if (score >= 60) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};

const SoilHealth: React.FC = () => {
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoilData = async (latitude: number, longitude: number) => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const soilData = generateSoilData(latitude, longitude);
        setSoilData(soilData);
      } catch (err) {
        setError("Failed to analyze soil health data for your location.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchSoilData(latitude, longitude);
      },
      (err) => {
        let errorMessage = "Unable to access your location.";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services to get accurate soil analysis.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your device settings.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Detecting your location...</p>
          <p style={styles.loadingSubText}>Analyzing regional soil characteristics</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centered}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={styles.errorHeader}>Location Access Required</h3>
          <p style={styles.errorText}>{error}</p>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!soilData) return null;

  const phInfo = getPhInfo(soilData.ph);
  const healthColor = getHealthScoreColor(soilData.healthScore);

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.header}>Soil Health Analysis 🌱</h2>
        <p style={styles.subHeader}>
          Location: {soilData.latitude.toFixed(4)}°N, {soilData.longitude.toFixed(4)}°E
          <br />
          Region: {soilData.region} | Soil Type: {soilData.soilType}
        </p>
      </div>

      {/* Health Score */}
      <div style={styles.healthScoreCard}>
        <h3 style={styles.healthScoreHeader}>Overall Soil Health</h3>
        <div style={styles.scoreContainer}>
          <div style={{...styles.scoreCircle, borderColor: healthColor}}>
            <span style={{...styles.scoreValue, color: healthColor}}>
              {soilData.healthScore}
            </span>
            <span style={styles.scoreLabel}>/100</span>
          </div>
          <div style={styles.scoreDescription}>
            {soilData.healthScore >= 80 && "Excellent soil health! Maintain current practices."}
            {soilData.healthScore >= 60 && soilData.healthScore < 80 && "Good soil condition. Some improvements needed."}
            {soilData.healthScore < 60 && "Soil requires attention. Implement recommended amendments."}
          </div>
        </div>
      </div>

      {/* Soil Parameters Grid */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h4>Moisture</h4>
          <p style={styles.value}>{soilData.moisture}<span style={styles.unit}>%</span></p>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${soilData.moisture}%`,
                backgroundColor: soilData.moisture > 60 ? '#ef4444' : soilData.moisture < 30 ? '#f59e0b' : '#22c55e'
              }}
            ></div>
          </div>
        </div>

        <div style={styles.card}>
          <h4>pH Level</h4>
          <p style={{...styles.value, color: phInfo.color }}>{soilData.ph}</p>
          <span style={{ color: phInfo.color, fontSize: '0.9rem', fontWeight: '500' }}>
            {phInfo.label}
          </span>
        </div>

        <div style={styles.card}>
          <h4>Temperature</h4>
          <p style={styles.value}>{soilData.temperature}<span style={styles.unit}>°C</span></p>
        </div>

        <div style={styles.card}>
          <h4>Nitrogen (N)</h4>
          <p style={styles.value}>{soilData.nitrogen}<span style={styles.unit}>ppm</span></p>
          <div style={styles.nutrientBar}>
            <div 
              style={{
                ...styles.nutrientFill,
                width: `${Math.min(100, (soilData.nitrogen / 200) * 100)}%`,
                backgroundColor: soilData.nitrogen < 100 ? '#ef4444' : soilData.nitrogen > 180 ? '#f59e0b' : '#22c55e'
              }}
            ></div>
          </div>
        </div>

        <div style={styles.card}>
          <h4>Phosphorus (P)</h4>
          <p style={styles.value}>{soilData.phosphorus}<span style={styles.unit}>ppm</span></p>
          <div style={styles.nutrientBar}>
            <div 
              style={{
                ...styles.nutrientFill,
                width: `${Math.min(100, (soilData.phosphorus / 100) * 100)}%`,
                backgroundColor: soilData.phosphorus < 40 ? '#ef4444' : '#22c55e'
              }}
            ></div>
          </div>
        </div>

        <div style={styles.card}>
          <h4>Potassium (K)</h4>
          <p style={styles.value}>{soilData.potassium}<span style={styles.unit}>ppm</span></p>
          <div style={styles.nutrientBar}>
            <div 
              style={{
                ...styles.nutrientFill,
                width: `${Math.min(100, (soilData.potassium / 300) * 100)}%`,
                backgroundColor: soilData.potassium < 180 ? '#ef4444' : '#22c55e'
              }}
            ></div>
          </div>
        </div>

        <div style={styles.card}>
          <h4>Organic Matter</h4>
          <p style={styles.value}>{soilData.organicMatter}<span style={styles.unit}>%</span></p>
          <div style={styles.nutrientBar}>
            <div 
              style={{
                ...styles.nutrientFill,
                width: `${Math.min(100, (soilData.organicMatter / 6) * 100)}%`,
                backgroundColor: soilData.organicMatter < 3 ? '#f59e0b' : '#22c55e'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recommendations and Crop Suitability */}
      <div style={styles.recommendationsContainer}>
        <div style={styles.recColumn}>
          <h3 style={styles.recHeader}>Actionable Recommendations</h3>
          <ul style={styles.list}>
            {soilData.recommendations.map((rec, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.bullet}>•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.recColumn}>
          <h3 style={styles.recHeader}>Crop Suitability</h3>
          <div style={styles.cropSuitability}>
            {soilData.cropSuitability.map((crop, index) => (
              <div key={index} style={styles.cropItem}>
                <span style={styles.cropIcon}>🌾</span>
                {crop}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f9fafb',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '2px solid #e5e7eb',
  },
  header: {
    color: '#1a4314',
    margin: 0,
    fontSize: '2.2rem',
    fontWeight: '700',
  },
  subHeader: {
    color: '#6b7280',
    marginTop: '0.5rem',
    fontSize: '1.1rem',
    lineHeight: '1.6',
  },
  healthScoreCard: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
  },
  healthScoreHeader: {
    color: '#374151',
    margin: '0 0 1.5rem 0',
    fontSize: '1.4rem',
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: '2.5rem',
    fontWeight: '800',
    lineHeight: '1',
  },
  scoreLabel: {
    fontSize: '1rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  scoreDescription: {
    color: '#4b5563',
    fontSize: '1.1rem',
    maxWidth: '300px',
    lineHeight: '1.5',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f3f4f6',
  },
  value: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a4314',
    margin: '0.5rem 0 0.5rem',
  },
  unit: {
    fontSize: '1rem',
    fontWeight: '400',
    color: '#6b7280',
    marginLeft: '4px',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginTop: '0.75rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  nutrientBar: {
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    marginTop: '0.5rem',
    overflow: 'hidden',
  },
  nutrientFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  recommendationsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
  },
  recColumn: {
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  recHeader: {
    color: '#374151',
    margin: '0 0 1rem 0',
    fontSize: '1.3rem',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '0.5rem',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    color: '#1a4314',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '1.5',
  },
  bullet: {
    color: '#22c55e',
    marginRight: '0.75rem',
    fontSize: '1.2rem',
  },
  cropSuitability: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  cropItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    color: '#166534',
    fontWeight: '500',
  },
  cropIcon: {
    marginRight: '0.75rem',
    fontSize: '1.2rem',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    padding: '2rem'
  },
  loadingContainer: {
    textAlign: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #22c55e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1.5rem',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#374151',
    margin: '0 0 0.5rem 0',
  },
  loadingSubText: {
    color: '#6b7280',
    margin: 0,
  },
  errorContainer: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  errorHeader: {
    color: '#dc2626',
    margin: '0 0 1rem 0',
  },
  errorText: {
    color: '#6b7280',
    margin: '0 0 1.5rem 0',
    lineHeight: '1.5',
  },
  retryButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};

// Add CSS animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default SoilHealth;