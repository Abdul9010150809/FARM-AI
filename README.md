# 🌱 CropYield Pro - AI-Powered Crop Yield Prediction and Optimization

![Smart India Hackathon](https://img.shields.io/badge/SIH-2025-orange)
![Problem Statement](https://img.shields.io/badge/PS--ID-25044-blue)
![Category](https://img.shields.io/badge/Category-Software-success)
![Theme](https://img.shields.io/badge/Theme-Agriculture%20%26%20FoodTech-brightgreen)

## 🏆 Smart India Hackathon 2025 Submission

**Problem Statement ID:** `25044`  
**Problem Statement Title:** **AI-Powered Crop Yield Prediction and Optimization**  
**Organization:** Government of Odisha  
**Department:** Electronics & IT Department  
**Category:** Software  
**Theme:** Agriculture, FoodTech & Rural Development  

---

## 📋 Problem Statement

### Description
Develop an AI-based platform to predict crop yields using historical agricultural data, weather patterns, and soil health metrics. The system should provide actionable recommendations for farmers to optimize irrigation, fertilization, and pest control, tailored to specific crops and regional conditions.

### Expected Outcome
A scalable software solution (web/mobile app) that helps small-scale farmers increase productivity by at least 10% through data-driven insights, with an interface supporting regional languages for accessibility.

### Technical Feasibility
Utilizes machine learning models (e.g., regression, neural networks) trained on open-source agricultural datasets, integrated with APIs for real-time weather and soil data.

---

## 🚀 Live Deployment

- **🌐 Web Application**: [https://abdul9010150809.github.io/cropyield-pro/](https://abdul9010150809.github.io/cropyield-pro/)
- **🔗 Backend API**: [https://cropyield-pro.onrender.com/api/health](https://cropyield-pro.onrender.com/api/health)
- **📊 Database**: MongoDB Atlas Cloud

## 🎯 Solution Overview

CropYield Pro is a comprehensive AI-driven platform that empowers farmers with predictive analytics and actionable insights to optimize agricultural productivity. Our solution addresses the core requirements of the problem statement through advanced machine learning and real-time data integration.

### ✅ Key Achievements

| Requirement | Our Solution |
|-------------|--------------|
| **Crop Yield Prediction** | AI models analyzing multiple parameters for accurate yield forecasting |
| **Weather Pattern Integration** | Real-time weather API integration with historical analysis |
| **Soil Health Metrics** | Comprehensive soil analysis and nutrient monitoring |
| **Actionable Recommendations** | Personalized irrigation, fertilization, and pest control advice |
| **Regional Adaptation** | Location-specific insights for different agricultural zones |
| **Scalable Platform** | Full-stack web application with mobile-responsive design |
| **Accessibility** | Multi-language support framework (ready for regional languages) |

---

## ✨ Core Features

### 🤖 AI-Powered Prediction Engine
- **Multi-factor Analysis**: Historical data, weather patterns, soil metrics
- **Machine Learning Models**: Regression algorithms for yield prediction
- **Real-time Processing**: Instant predictions based on current conditions
- **Confidence Scoring**: Accuracy indicators for each prediction

### 🌦️ Smart Weather Integration
- **Real-time Weather Data**: Current conditions and forecasts
- **Historical Analysis**: Seasonal pattern recognition
- **Micro-climate Consideration**: Location-specific weather impacts
- **Extreme Event Alerts**: Early warnings for adverse conditions

### 🌱 Comprehensive Soil Health
- **Nutrient Analysis**: NPK (Nitrogen, Phosphorus, Potassium) monitoring
- **pH Level Tracking**: Soil acidity/alkalinity optimization
- **Moisture Management**: Irrigation recommendations based on soil type
- **Organic Matter Assessment**: Soil fertility indicators

### 💡 Actionable Recommendations
- **Irrigation Optimization**: Water usage efficiency improvements
- **Fertilization Schedule**: Nutrient application timing and quantities
- **Pest Control Strategies**: Integrated pest management solutions
- **Crop Rotation Advice**: Sustainable farming practices

### 📊 Farmer-Centric Dashboard
- **Intuitive Interface**: Designed for farmers with varying tech literacy
- **Visual Analytics**: Easy-to-understand charts and graphs
- **Multi-language Ready**: Framework prepared for regional language integration
- **Mobile Responsive**: Accessible on smartphones and tablets

---

## 🛠️ Technical Implementation

### Architecture Overview
```
🌐 Frontend (React + TypeScript)
    ↓
🔗 REST API (Node.js + Express)
    ↓
🤖 ML Services (Python + Scikit-learn)
    ↓
📊 Data Layer (MongoDB Atlas)
    ↓
🌤️ External APIs (Weather + Soil Data)
```

### Technology Stack

#### Frontend Layer
- **React 18** with TypeScript for type safety
- **React Router** for seamless navigation
- **Context API** for state management
- **Chart.js** for data visualization
- **Bootstrap 5** for responsive UI
- **Axios** for API communication

#### Backend Layer
- **Node.js** with Express.js framework
- **MongoDB Atlas** for cloud database
- **Mongoose ODM** for database operations
- **JWT** for secure authentication
- **CORS** for cross-origin requests
- **BCrypt** for password hashing

#### AI/ML Components
- **Regression Models** for yield prediction
- **Historical Data Analysis** for pattern recognition
- **Real-time Data Processing** for current conditions
- **Recommendation Engine** for actionable insights

#### External Integrations
- **Weather APIs** for real-time meteorological data
- **Soil Health APIs** for nutrient analysis
- **Agricultural Datasets** for training ML models

### 🗂️ Project Structure

```
cropyield-pro/
├── 📂 backend/                 # Node.js/Express Backend
│   ├── 📂 config/             # Database & environment configuration
│   ├── 📂 controllers/        # Business logic and API handlers
│   ├── 📂 middleware/         # Auth, validation, error handling
│   ├── 📂 models/            # MongoDB schemas (User, Prediction, etc.)
│   ├── 📂 routes/            # API endpoints (auth, prediction, weather)
│   ├── 📂 services/          # Core business services
│   │   ├── 🤖 mlService.js           # AI/ML prediction algorithms
│   │   ├️ 🌤️ weatherService.js       # Weather data processing
│   │   └️ 🌱 soilHealthService.js    # Soil analysis logic
│   ├── 📂 utils/             # Utilities, logger, helpers
│   └── 🚀 server.js          # Application entry point
│
├── 📂 src/                   # React Frontend
│   ├── 📂 components/        # Reusable UI components
│   │   ├── 🎨 AuthModals.tsx     # Login/Registration
│   │   ├── 🤖 Chatbot.tsx        # AI farming assistant
│   │   ├── 🧭 Navbar.tsx         # Navigation with multi-language support
│   │   ├── 🦶 Footer.tsx         # Application footer
│   │   ├── 🌟 HeroSection.tsx    # Landing page hero
│   │   ├── 🌾 CropsSection.tsx   # Crop selection and display
│   │   ├── ⭐ FeaturesSection.tsx # Feature showcase
│   │   ├── 📈 PredictionForm.tsx # Yield prediction interface
│   │   ├️ 🌱 SoilHealth.tsx      # Soil analysis component
│   │   ├️ 🌦️ WeatherAnalysis.tsx # Weather insights
│   │   └── 🛡️ ErrorBoundary.tsx  # Error handling
│   │
│   ├── 📂 contexts/          # React Context for state management
│   │   ├── 🔐 AuthContext.tsx    # User authentication state
│   │   └── 🌐 LanguageContext.tsx # Multi-language support
│   │
│   ├── 📂 hooks/             # Custom React hooks
│   │   └── 🔌 useApiHealth.js    # Backend connectivity monitoring
│   │
│   ├── 📂 pages/             # Application pages
│   │   ├── 🏠 HomePage.tsx                   # Landing page
│   │   ├── 📈 PredictionAndOptimizationPage.tsx # Main prediction interface
│   │   ├── 🌱 SoilHealthPage.tsx             # Soil analysis dashboard
│   │   ├── 🌦️ WeatherAnalysisPage.tsx       # Weather insights
│   │   ├── 👤 ProfilePage.tsx               # User profile & history
│   │   └── ℹ️ AboutPage.tsx                 # About & documentation
│   │
│   ├── 📂 services/          # API communication layer
│   │   ├── 🔗 api.ts              # Axios configuration & interceptors
│   │   ├── 🎭 mockApi.ts          Development mock data
│   │   └── 🌤️ weather.ts          # Weather API service
│   │
│   ├── 📂 types/             # TypeScript type definitions
│   └── 📂 utils/             # Frontend utilities
│
├── 📂 documentation/         # Project documentation
├── 📂 public/               # Static assets
│   ├── 📄 index.html
│   ├── 🎯 manifest.json
│   └── ❓ 404.html           # Client-side routing fallback
│
├── 📂 .github/workflows/    # CI/CD pipelines
│   └── ⚙️ deploy.yml         # Automated GitHub Pages deployment
│
├── 🛠️ config-overrides.js   # React app configuration
├── 📦 package.json          # Dependencies & scripts
├── 📚 README.md             # Project documentation
└── 🏷️ tsconfig.json         # TypeScript configuration
```

---

## 🎯 ML Models & Algorithms

### Yield Prediction Model
```python
# Pseudocode for our prediction algorithm
def predict_yield(crop_type, soil_metrics, weather_data, historical_yields):
    # Feature engineering
    features = extract_features(soil_metrics, weather_data, historical_yields)
    
    # Ensemble model approach
    base_predictors = [RandomForest, GradientBoosting, NeuralNetwork]
    predictions = [model.predict(features) for model in base_predictors]
    
    # Weighted average based on model confidence
    final_prediction = weighted_ensemble(predictions)
    
    return final_prediction, confidence_interval
```

### Recommendation Engine
- **Apriori Algorithm** for association rule mining
- **Collaborative Filtering** for similar farmer recommendations
- **Content-Based Filtering** for crop-specific advice

---

## 📊 Performance Metrics

### Target Outcomes
- **≥10% Productivity Increase** through optimized practices
- **≥90% Prediction Accuracy** for crop yields
- **≤5% Resource Waste** through precise recommendations
- **≥95% System Uptime** for reliable access

### Current Achievements
- ✅ **Full-stack deployment** with cloud infrastructure
- ✅ **Real-time prediction** capabilities
- ✅ **Multi-parameter analysis** (soil, weather, historical)
- ✅ **Scalable architecture** supporting multiple users
- ✅ **Mobile-responsive design** for field access

---

## 🚀 Installation & Setup

### Development Environment
```bash
# Clone repository
git clone https://github.com/Abdul9010150809/cropyield-pro.git
cd cropyield-pro

# Install dependencies
pnpm install
cd backend && pnpm install && cd ..

# Environment setup
cd backend
cp .env.example .env
# Configure MongoDB, JWT secret, and API keys

# Start development servers
pnpm run dev:backend  # Starts backend on port 5001
pnpm run dev:frontend # Starts frontend on port 3000
```

### Production Deployment
```bash
# Build and deploy
pnpm run build
pnpm run deploy
```

---

## 🔮 Future Enhancements

### Phase 2: Advanced Features
- [ ] **Regional Language Support** (Odia, Hindi, Telugu)
- [ ] **Mobile App Development** (React Native)
- [ ] **IoT Sensor Integration** for real-time field data
- [ ] **Blockchain** for supply chain transparency
- [ ] **Satellite Imagery Analysis** for large-scale monitoring

### Phase 3: Enterprise Features
- [ ] **Government Integration** for policy support
- [ ] **Marketplace** for agricultural inputs
- [ ] **Insurance Integration** for crop insurance
- [ ] **Export Market Analytics** for international trade

---

## 👥 Team Contribution

**Team Name:**  VISION IGNITERS  
**Team Leader:** SHAIK.ABDUL SAMMED 


### Team Members
- **SHAIK.ABDUL SAMMED** - Full-stack Development & AI Integration
- **ANJALI PATTURU** - Backend Development & Database
- **SHAIK.SHAFI** - Frontend Development & UI/UX
- **MANIDEEP** - ML Models & Data Analysis
- **AKHILA REKAPOKALA** - Testing & Documentation
- **CHAITAGNA** - Deployment & DevOps

---

## 📞 Contact & Support

**Project Repository:** [https://github.com/Abdul9010150809/cropyield-pro](https://github.com/Abdul9010150809/cropyield-pro)  
**Issue Tracking:** [GitHub Issues](https://github.com/Abdul9010150809/cropyield-pro/issues)  
**Documentation:** [Project Wiki](https://github.com/Abdul9010150809/cropyield-pro/wiki)

---

## 📄 License

This project is developed for **Smart India Hackathon 2023** under Problem Statement ID: 25044.  
All rights reserved by the development team and submission guidelines.

---

<div align="center">

## 🌾 Transforming Agriculture Through AI & Innovation 🌾

**Empowering Farmers • Enhancing Productivity • Building Sustainable Futures**

*Submitted for Smart India Hackathon 2025 - Problem Statement ID: 25044*

[Live Demo](https://abdul9010150809.github.io/cropyield-pro/) • 
[Report Issue](https://github.com/Abdul9010150809/cropyield-pro/issues) • 
[View Code](https://github.com/Abdul9010150809/cropyield-pro)

</div>
