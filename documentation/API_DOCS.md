# CropYield Pro API Documentation

## Overview
CropYield Pro provides RESTful APIs for crop yield prediction, weather data, and agricultural recommendations. This documentation covers all available endpoints.

## Base URL
- Production: `https://api.cropyieldpro.com/v1`
- Development: `http://localhost:5000/api`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
Authorization: Bearer <your_jwt_token>

text

## API Endpoints

### Authentication Endpoints

#### Register a New User

``` 
http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "securepassword123",
  "role": "farmer",
  "location": {
    "address": "Puri, Odisha",
    "latitude": 19.8134,
    "longitude": 85.8315,
    "region": "coastal"
  },
  "farmDetails": {
    "totalArea": 4.2,
    "soilType": "alluvial",
    "primaryCrops": ["rice", "vegetables"],
    "irrigationSystem": "drip"
  }
}

```
## Response:

```
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "farmer"
    }
  }
}

```
## Login User


```
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "rahul@example.com",
  "password": "securepassword123"
}

```
## Response:


```
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "farmer"
    }
  }
}

```
## Prediction Endpoints
 ## Get Crop Yield Prediction
 ```
http
POST /api/predictions/predict
Authorization: Bearer <token>
Content-Type: application/json

{
  "cropType": "rice",
  "area": 2.5,
  "location": {
    "latitude": 19.8134,
    "longitude": 85.8315
  }
}
```
## Response:

```
{
  "success": true,
  "message": "Prediction completed successfully",
  "data": {
    "yield": 7500,
    "perAcre": 3000,
    "confidence": 88.5,
    "location": "Puri, Odisha",
    "weather": {
      "temperature": 28.5,
      "rainfall": 1200,
      "humidity": 75
    },
    "soil": {
      "type": "alluvial",
      "ph": 6.5,
      "nitrogen": 0.15
    },
    "recommendations": {
      "irrigation": "Maintain 2-5 cm water depth during vegetative stage",
      "fertilization": "Apply 80:40:40 kg/acre NPK",
      "pestControl": "Monitor for stem borer and apply carbofuran if needed",
      "harvestTiming": "Harvest in 120 days when 80% panicles turn golden yellow"
    }
  }
}
```

## Get Prediction History
```
http
GET /api/predictions/history
```
## Authorization: Bearer <token>
## Response:

```
{
  "success": true,
  "message": "Prediction history retrieved",
  "data": [
    {
      "id": "pred-001",
      "cropType": "rice",
      "area": 2.5,
      "predictedYield": 7500,
      "confidence": 88.5,
      "createdAt": "2023-09-13T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```
## Crop Information Endpoints
## Get All Crops
```
http
GET /api/crops
```
## Response:

```
{
  "success": true,
  "message": "Crops retrieved successfully",
  "data": [
    {
      "id": "crop-001",
      "name": "Rice",
      "scientificName": "Oryza sativa",
      "optimalTemperature": {
        "min": 20,
        "max": 35
      },
      "optimalRainfall": {
        "min": 1000,
        "max": 2000
      }
    }
  ]
}
```
## Get Crop Recommendations
```
http
POST /api/crops/recommendations
Content-Type: application/json

{
  "region": "coastal",
  "soilType": "alluvial",
  "waterAvailability": "high"
}
```
## Response:

```
{
  "success": true,
  "message": "Crop recommendations generated",
  "data": [
    {
      "crop": "Rice",
      "suitability": "High",
      "reason": "Well-suited for coastal regions with alluvial soil"
    },
    {
      "crop": "Coconut",
      "suitability": "High", 
      "reason": "Thrives in coastal climates"
    }
  ]
}
```
## Weather Endpoints
## Get Current Weather
```
http
GET /api/weather/current?lat=19.8134&lng=85.8315
```
## Response:

```
{
  "success": true,
  "message": "Weather data retrieved",
  "data": {
    "location": "Puri, Odisha",
    "temperature": 28.5,
    "humidity": 75,
    "rainfall": 0,
    "windSpeed": 12.5,
    "description": "Partly cloudy"
  }
}
```
## Get Weather Forecast
```
http
GET /api/weather/forecast?lat=19.8134&lng=85.8315&days=3
```
## Response:

```
{
  "success": true,
  "message": "Weather forecast retrieved",
  "data": {
    "location": "Puri, Odisha",
    "forecast": [
      {
        "date": "2023-09-14",
        "temperature": 29.0,
        "rainfall": 5.2,
        "humidity": 78
      },
      {
        "date": "2023-09-15", 
        "temperature": 28.7,
        "rainfall": 12.8,
        "humidity": 85
      }
    ]
  }
}
```
## Error Handling
## All errors follow this format:

```
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error information"
  }
}
```
## Common error codes:

- AUTH_001 - Invalid credentials

- AUTH_002 - Token expired

- AUTH_003 - Access denied

- VALID_001 - Validation error

- DB_001 - Database error

- API_001 - External API error

- ML_001 - Prediction error

## Rate Limits

- Free tier: 100 requests per hour

- Premium tier: 1000 requests per hour

- Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1663081200
```
## Pagination
## List endpoints support pagination:

```
GET /api/endpoint?page=2&limit=20
```
## Response includes pagination info:

```
{
  "data": [],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```
## Changelog

- v1.0.0 (2023-09-13)
- Initial API release

- User authentication system

- Crop yield prediction endpoint

- Weather data integration

- Crop information endpoints

