import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WeatherData } from '../types';

interface FeaturesSectionProps {
  weatherData: WeatherData;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ weatherData }) => {
  const [activeTab, setActiveTab] = useState('core');
// const FeaturesSection: React.FC<FeaturesSectionProps> = ({ weatherData }) 
  return (
    <section id="features" className="py-5">
      <div className="container">
        <h2 className="section-title text-center">How It Works</h2>
        <p className="text-center lead mb-5">Discover how our AI-powered platform transforms farming with cutting-edge technology</p>
        
        {/* Feature Navigation Tabs */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="d-flex flex-wrap justify-content-center gap-2" id="featureTabs" role="tablist">
              <button 
                className={`btn btn-outline-primary ${activeTab === 'core' ? 'active' : ''}`}
                onClick={() => setActiveTab('core')}
              >
                <i className="fas fa-star me-2"></i>Core Features
              </button>
              <button 
                className={`btn btn-outline-primary ${activeTab === 'ai' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai')}
              >
                <i className="fas fa-brain me-2"></i>AI & Data
              </button>
              <button 
                className={`btn btn-outline-primary ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="fas fa-chart-line me-2"></i>Analytics
              </button>
              <button 
                className={`btn btn-outline-primary ${activeTab === 'accessibility' ? 'active' : ''}`}
                onClick={() => setActiveTab('accessibility')}
              >
                <i className="fas fa-universal-access me-2"></i>Accessibility
              </button>
              <button 
                className={`btn btn-outline-primary ${activeTab === 'integration' ? 'active' : ''}`}
                onClick={() => setActiveTab('integration')}
              >
                <i className="fas fa-plug me-2"></i>Integration
              </button>
            </div>
          </div>
        </div>

        {/* Core Features */}
        {activeTab === 'core' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              {/* 1. Wrap the entire card in a Link pointing to the URL path */}
              <Link to="/weather-analysis" className="feature-card-link">
                <div className="feature-card card h-100">
                  <div className="card-body text-center p-4">
                    <div className="feature-icon">
                      <i className="fas fa-cloud-sun" />
                    </div>
                    <h3 className="h4">Weather Analysis</h3>
                    <p>Our system analyzes real-time weather data to predict optimal growing conditions.</p>
                    <div className="mt-3">
                      <span className="badge bg-info me-1">{weatherData.temperature}°C</span>
                      <span className="badge bg-primary me-1">{weatherData.humidity}%</span>
                      <span className="badge bg-success">{weatherData.rainfall}mm</span>
                      {/* 2. The button inside is now for visual effect only */}
                      <div className="btn btn-primary mt-3">
                         View Analysis<i className="fas fa-arrow-right ms-2"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-seedling" />
                  </div>
                  <h3 className="h4">Soil Health</h3>
                  <p>We evaluate soil quality parameters including pH levels, nitrogen content, and soil type to recommend the best crops for your land.</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark me-1">pH: 6.5-7.5</span>
                    <span className="badge bg-info">N: 0.15%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-brain" />
                  </div>
                  <h3 className="h4">AI Prediction</h3>
                  <p>Our machine learning models process historical data and current conditions to provide accurate yield predictions with confidence scores.</p>
                  <Link to="/prediction" className="btn btn-primary mt-3">
                    Get Prediction <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Additional Core Features */}
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-tint" />
                  </div>
                  <h3 className="h4">Irrigation Planning</h3>
                  <p>Smart water management recommendations based on soil moisture, weather forecasts, and crop requirements.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">Water Saving: 30%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-bug" />
                  </div>
                  <h3 className="h4">Pest Management</h3>
                  <p>Early detection and management strategies for common pests based on regional data and seasonal patterns.</p>
                  <div className="mt-3">
                    <span className="badge bg-success">Prevention Focused</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-calendar-alt" />
                  </div>
                  <h3 className="h4">Crop Calendar</h3>
                  <p>Personalized planting and harvesting schedules based on your location, soil type, and crop selection.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Seasonal Planning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI & Data Features */}
        {activeTab === 'ai' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-satellite"></i>
                  </div>
                  <h3 className="h4">Satellite Imaging</h3>
                  <p>NDVI and remote sensing for real-time crop health monitoring and early problem detection.</p>
                  <div className="mt-3">
                    <span className="badge bg-success">Live Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-camera"></i>
                  </div>
                  <h3 className="h4">Disease Detection</h3>
                  <p>AI-powered image recognition to identify plant diseases from uploaded photos of crops.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">AI Vision</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-robot"></i>
                  </div>
                  <h3 className="h4">AI Chat Assistant</h3>
                  <p>Get instant answers to your farming questions with our AI-powered chatbot available 24/7.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Always Available</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional AI Features */}
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-seedling"></i>
                  </div>
                  <h3 className="h4">Crop Recommendation</h3>
                  <p>AI algorithms suggest the most suitable crops based on your soil, climate, and market conditions.</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark">Personalized</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="h4">Yield Prediction</h3>
                  <p>Advanced machine learning models predict your crop yield with 95% accuracy.</p>
                  <Link to="/prediction" className="btn btn-primary mt-3">
                    Predict Yield <i className="fas fa-arrow-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <h3 className="h4">Real-time Alerts</h3>
                  <p>Get instant notifications about weather changes, pest risks, and crop health issues.</p>
                  <div className="mt-3">
                    <span className="badge bg-danger">Instant Updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Features */}
        {activeTab === 'analytics' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-chart-pie"></i>
                  </div>
                  <h3 className="h4">Yield Analytics</h3>
                  <p>Track and visualize your yield history with detailed analytics and performance metrics.</p>
                  <div className="progress mt-3" style={{height: '8px'}}>
                    <div className="progress-bar bg-success" style={{width: '78%'}}></div>
                  </div>
                  <small className="text-muted">Current season progress</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-calculator"></i>
                  </div>
                  <h3 className="h4">ROI Calculator</h3>
                  <p>Calculate return on investment comparing costs versus expected yield and market prices.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">+12% Avg. ROI</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h3 className="h4">Sustainability Metrics</h3>
                  <p>Monitor water savings, carbon footprint, and sustainable farming practices.</p>
                  <div className="mt-3">
                    <span className="badge bg-success">Eco-Friendly</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Analytics Features */}
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                  <h3 className="h4">Market Analysis</h3>
                  <p>Access real-time market prices and trends to maximize your profit potential.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Price Tracking</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-history"></i>
                  </div>
                  <h3 className="h4">Historical Data</h3>
                  <p>Access years of historical farming data to identify patterns and improve decisions.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">5+ Years Data</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-chart-bar"></i>
                  </div>
                  <h3 className="h4">Performance Reports</h3>
                  <p>Generate detailed reports on farm performance, productivity, and improvement areas.</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark">Exportable Reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accessibility Features */}
        {activeTab === 'accessibility' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-language"></i>
                  </div>
                  <h3 className="h4">Multi-Language Support</h3>
                  <p>Full application support in multiple regional languages for better accessibility.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary me-1">Telugu</span>
                    <span className="badge bg-primary me-1">Hindi</span>
                    <span className="badge bg-primary">Tamil</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-voice"></i>
                  </div>
                  <h3 className="h4">Voice Assistant</h3>
                  <p>Voice-based interface for farmers with text-to-speech recommendations in local languages.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">Voice Enabled</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  <h3 className="h4">Offline Support</h3>
                  <p>Access critical features even in low-connectivity areas with offline data synchronization.</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark">Offline Mode</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Accessibility Features */}
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-hand-holding-usd"></i>
                  </div>
                  <h3 className="h4">Govt. Scheme Integration</h3>
                  <p>Information about available government schemes, subsidies, and application assistance.</p>
                  <div className="mt-3">
                    <span className="badge bg-success">Subsidy Info</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3 className="h4">Community Forum</h3>
                  <p>Connect with other farmers, share experiences, and get advice from agricultural experts.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Community Support</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3 className="h4">Farmer Education</h3>
                  <p>Access tutorials, guides, and best practices for modern farming techniques.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">Learning Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integration Features */}
        {activeTab === 'integration' && (
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-plug"></i>
                  </div>
                  <h3 className="h4">IoT Device Integration</h3>
                  <p>Connect soil sensors, weather stations, and other IoT devices for real-time data collection.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">Smart Farming</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <h3 className="h4">Marketplace Access</h3>
                  <p>Direct access to buyers, suppliers, and agricultural service providers.</p>
                  <div className="mt-3">
                    <span className="badge bg-success">Market Connect</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-truck"></i>
                  </div>
                  <h3 className="h4">Supply Chain Integration</h3>
                  <p>Connect with logistics providers for efficient transportation of your produce.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">Logistics</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Integration Features */}
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-database"></i>
                  </div>
                  <h3 className="h4">API Integration</h3>
                  <p>Seamless integration with other agricultural platforms and government databases.</p>
                  <div className="mt-3">
                    <span className="badge bg-warning text-dark">Developer Friendly</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <h3 className="h4">Cloud Backup</h3>
                  <p>Automatic cloud backup of all your farm data for security and accessibility.</p>
                  <div className="mt-3">
                    <span className="badge bg-info">Data Security</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="feature-card card h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon">
                    <i className="fas fa-mobile"></i>
                  </div>
                  <h3 className="h4">Mobile App</h3>
                  <p>Full functionality available on mobile devices for access anywhere, anytime.</p>
                  <div className="mt-3">
                    <span className="badge bg-primary">iOS & Android</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Data Section */}
        <div className="mt-5">
          <h3 className="text-center mb-4">Real-time Agricultural Data</h3>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card data-card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-temperature-high fa-3x text-primary mb-3" />
                  <h4>Weather Conditions</h4>
                  <p>Live weather data from across Andhra Pradesh</p>
                  <div className="mt-3">
                    <span className="badge bg-info me-1" id="weather-temp">{weatherData.temperature}°C</span>
                    <span className="badge bg-primary me-1" id="weather-humidity">{weatherData.humidity}%</span>
                    <span className="badge bg-success" id="weather-rainfall">{weatherData.rainfall}mm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card data-card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-seedling fa-3x text-primary mb-3" />
                  <h4>Crop Health Index</h4>
                  <p>Current crop health metrics</p>
                  <div className="progress mt-3" style={{height: '20px'}}>
                    <div className="progress-bar bg-success" role="progressbar" style={{width: '78%'}} aria-valuenow={78} aria-valuemin={0} aria-valuemax={100}>
                      <span className="progress-text">78% Healthy</span>
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">Based on satellite and sensor data</small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card data-card h-100">
                <div className="card-body text-center">
                  <i className="fas fa-tint fa-3x text-primary mb-3" />
                  <h4>Soil Moisture Levels</h4>
                  <p>Regional soil moisture data</p>
                  <div className="progress mt-3" style={{height: '20px'}}>
                    <div className="progress-bar bg-info" role="progressbar" style={{width: '65%'}} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>
                      <span className="progress-text">65% Optimal</span>
                    </div>
                  </div>
                  <small className="text-muted mt-2 d-block">Ideal range: 60-80%</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-5">
          <h3>Ready to Transform Your Farming?</h3>
          <p className="lead mb-4">Join thousands of farmers who are already increasing their yields with our AI-powered platform</p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/register" className="btn btn-primary btn-lg">
              <i className="fas fa-user-plus me-2"></i>Get Started
            </Link>
            <Link to="/prediction" className="btn btn-outline-primary btn-lg">
              <i className="fas fa-calculator me-2"></i>Try Prediction
            </Link>
            <a href="#chatbot-container" className="btn btn-success btn-lg" onClick={() => { const chatbot = document.querySelector('.chatbot-btn'); if (chatbot) (chatbot as HTMLElement).click(); }}>
              <i className="fas fa-comments me-2"></i>Chat with AI
            </a>
          </div>
        </div>
      </div>

      {/* Inline CSS for additional styling */}
      <style>
        {`
          .btn-outline-primary {
            border-radius: 20px;
            padding: 10px 20px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .btn-outline-primary.active, .btn-outline-primary:hover {
            background: linear-gradient(135deg, #2e7d32 0%, #7cb342 100%);
            color: white;
            border-color: #2e7d32;
            box-shadow: 0 4px 15px rgba(46, 125, 50, 0.3);
            transform: translateY(-2px);
          }
          
          .progress-text {
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
          }
          
          .feature-icon i {
            transition: transform 0.3s ease;
          }
          
          .feature-card:hover .feature-icon i {
            transform: scale(1.1);
          }
          
          .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }
          
          @media (max-width: 768px) {
            .btn-outline-primary {
              margin-bottom: 10px;
              width: 100%;
            }
            
            .d-flex.flex-wrap.justify-content-center.gap-3 .btn {
              margin-bottom: 10px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default FeaturesSection;