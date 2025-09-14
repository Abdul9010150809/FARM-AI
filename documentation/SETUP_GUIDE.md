
## 2. documentation/SETUP_GUIDE.md

# CropYield Pro Setup Guide

## Prerequisites

### Software Requirements
- Node.js 16.0 or higher
- Python 3.8 or higher
- MySQL 8.0 or MongoDB 5.0
- npm or yarn package manager
- Git

### API Keys Required
- OpenWeatherMap API key (free tier available)
- Google Maps API key (optional, for location services)
- Soil data API key (optional)

## Step-by-Step Installation

### 1. Clone the Repository
```
git clone https://github.com/your-username/cropyield-pro.git
cd cropyield-pro
```
2. Backend Setup
```
# Navigate to backend directory
cd backend

# Install Node.js dependencies
npm install

# Install Python dependencies for ML models
pip install -r ml_models/requirements.txt

# Set up environment variables
cp .env.example .env
3. Configure Environment Variables
Edit the .env file with your settings:

env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cropyield
DB_USER=cropyield_user
DB_PASSWORD=your_secure_password

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# API Keys
OPENWEATHER_API_KEY=your_openweather_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
SOIL_DATA_API_KEY=your_soil_data_api_key_here

# ML Model Configuration
ML_MODEL_PATH=./ml_models/yield_model.pkl
```
4. Database Setup
Option A: MySQL Setup
```
# Login to MySQL as root
mysql -u root -p

# Create database and user
CREATE DATABASE cropyield CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'cropyield_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cropyield.* TO 'cropyield_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u cropyield_user -p cropyield < database/schema.sql

# Import sample data
mysql -u cropyield_user -p cropyield < database/seed_data.sql
Option B: MongoDB Setup
bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongod

# The application will create collections automatically
# No need to import schema for MongoDB
```
5. Train the Machine Learning Model
```
# Navigate to ML models directory
cd backend/ml_models

# Train the model
python train_model.py

# This will create yield_model.pkl and training_data.csv
6. Start the Backend Server
bash
# Return to backend directory
cd ..

# Development mode with auto-reload
npm run dev

# Production mode
npm start
The server should now be running on http://localhost:5000
```
7. Test the Installation
```
# Test if server is running
curl http://localhost:5000/api/health

# Expected response: {"status":"OK","timestamp":"2023-09-13T10:00:00.000Z"}

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Test prediction endpoint (after getting JWT token)
curl -X POST http://localhost:5000/api/predictions/predict \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"cropType":"rice","area":2.5}'
  ```
# Frontend Setup (Optional)
## If you have a React frontend:

```
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
Frontend will be available at http://localhost:3000
```
# Mobile App Setup (Optional)
# For React Native mobile app:

```
# Navigate to mobile-app directory
cd mobile-app

# Install dependencies
npm install

# For Android development
npm run android

# For iOS development (requires macOS)
npm run ios
```
# Production Deployment
# Using PM2 (Recommended)
```
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name cropyield-backend

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```
## Using Docker
Create a Dockerfile in the backend directory:
```
dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```
## Build and run:
```
docker build -t cropyield-backend .
docker run -p 5000:5000 cropyield-backend
```
## Troubleshooting
## Common Issues
- Database Connection Errors

- Check if database service is running: sudo systemctl status mysql or sudo systemctl status mongod

- Verify database credentials in .env file

- Ensure database exists: mysql -u root -p -e "SHOW DATABASES;"

- Module Not Found Errors

- Run npm install again

- Check Node.js version: node --version (should be 16+)

- Check Python version: python --version (should be 3.8+)

- API Key Errors

- Verify all API keys are set in .env

- Check if API keys have proper permissions

- ML Model Training Issues

- Ensure all Python dependencies are installed: pip install -r ml_models/requirements.txt

- Check available memory for training

## Getting Help
## Check application logs:

```
# View console output
npm run dev

# PM2 logs
pm2 logs cropyield-backend
```
## Check database logs:

```
# MySQL logs
sudo tail -f /var/log/mysql/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
Create an issue on GitHub with:
```
## Error messages

## Steps to reproduce

## Environment details (OS, Node.js version, etc.)

- Maintenance
- Regular Tasks
- Database Backups

```
# MySQL backup
mysqldump -u username -p cropyield > backup-$(date +%Y%m%d).sql

# MongoDB backup
mongodump --db cropyield --out ./backup-$(date +%Y%m%d)
```
## Update Dependencies

```
# Update npm packages
npm update

# Update Python packages
pip install --upgrade -r ml_models/requirements.txt
```
## Retrain ML Model

```
cd backend/ml_models
python train_model.py
```
## Monitor Application Health


# Check PM2 status
pm2 status

# Monitor resources
- pm2 monit
- Security Considerations
- Change default passwords and JWT secret in production

- Set up HTTPS with SSL certificate

- Configure firewall rules

- Regular security updates

- Monitor for suspicious activity

## Support
- For additional help:

- Check the documentation: https://docs.cropyieldpro.com

- Create an issue on GitHub: https://github.com/your-username/cropyield-pro/issues

- Email support: support@cropyieldpro.com


```
These documentation files provide complete information about your API and how to set up the project. The API documentation explains all endpoints with examples, and the setup guide provides step-by-step instructions for installation and troubleshooting.
```