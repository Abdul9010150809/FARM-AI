-- CropYield Pro Database Schema
-- MySQL version

CREATE DATABASE IF NOT EXISTS cropyield CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cropyield;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('farmer', 'admin', 'researcher') DEFAULT 'farmer',
    
    -- Location information
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    region ENUM('coastal', 'western', 'northern', 'southern', 'unknown') DEFAULT 'unknown',
    
    -- Farm details
    total_area DECIMAL(10, 2) DEFAULT 0,
    soil_type ENUM('alluvial', 'black', 'red', 'laterite', 'unknown') DEFAULT 'unknown',
    irrigation_system ENUM('drip', 'sprinkler', 'flood', 'manual', 'unknown') DEFAULT 'unknown',
    
    -- Preferences
    language VARCHAR(10) DEFAULT 'en',
    area_unit ENUM('acres', 'hectares') DEFAULT 'acres',
    temperature_unit ENUM('celsius', 'fahrenheit') DEFAULT 'celsius',
    weight_unit ENUM('kg', 'tons') DEFAULT 'kg',
    
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    
    last_login DATETIME,
    login_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_region (region),
    INDEX idx_created_at (created_at)
);

-- Predictions table
CREATE TABLE predictions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Location data
    location_address TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    
    -- Crop information
    crop_type ENUM('rice', 'wheat', 'corn', 'sugarcane', 'cotton', 'pulses') NOT NULL,
    area DECIMAL(10, 2) NOT NULL,
    
    -- Soil data
    soil_type ENUM('alluvial', 'black', 'red', 'laterite') NOT NULL,
    soil_ph DECIMAL(3, 1),
    nitrogen DECIMAL(5, 3),
    phosphorus DECIMAL(5, 3),
    potassium DECIMAL(5, 3),
    organic_matter DECIMAL(4, 2),
    
    -- Weather data
    temperature DECIMAL(4, 1),
    rainfall DECIMAL(6, 1),
    humidity DECIMAL(5, 1),
    
    -- Prediction results
    predicted_yield DECIMAL(10, 2) NOT NULL,
    confidence DECIMAL(5, 2),
    yield_per_acre DECIMAL(10, 2),
    
    -- Recommendations
    irrigation_recommendation TEXT,
    fertilization_recommendation TEXT,
    pest_control_recommendation TEXT,
    harvest_timing_recommendation TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_crop_type (crop_type),
    INDEX idx_created_at (created_at),
    INDEX idx_location (location_latitude, location_longitude)
);

-- Crop data table
CREATE TABLE crop_data (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    scientific_name VARCHAR(100) NOT NULL,
    
    -- Optimal conditions
    optimal_temperature_min DECIMAL(4, 1) NOT NULL,
    optimal_temperature_max DECIMAL(4, 1) NOT NULL,
    optimal_rainfall_min DECIMAL(6, 1) NOT NULL,
    optimal_rainfall_max DECIMAL(6, 1) NOT NULL,
    optimal_soil_ph_min DECIMAL(3, 1) NOT NULL,
    optimal_soil_ph_max DECIMAL(3, 1) NOT NULL,
    
    growth_duration INT NOT NULL, -- in days
    water_requirements ENUM('Low', 'Medium', 'High') NOT NULL,
    
    -- Regions and soil types (stored as JSON for flexibility)
    regions JSON NOT NULL,
    suitable_soil_types JSON NOT NULL,
    
    -- Common pests and diseases (stored as JSON)
    common_pests JSON,
    common_diseases JSON,
    
    -- Fertilization schedule (stored as JSON)
    fertilization_schedule JSON,
    
    irrigation_recommendations TEXT NOT NULL,
    harvesting_guidelines TEXT NOT NULL,
    
    yield_range_min DECIMAL(10, 2) NOT NULL,
    yield_range_max DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    FULLTEXT idx_search (name, scientific_name)
);

-- Weather data cache table
CREATE TABLE weather_cache (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    current_weather JSON NOT NULL,
    forecast JSON NOT NULL,
    
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_location (latitude, longitude),
    INDEX idx_expires_at (expires_at)
);

-- ML model metadata table
CREATE TABLE ml_model_metadata (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_path VARCHAR(255) NOT NULL,
    
    training_date TIMESTAMP NOT NULL,
    training_samples INT NOT NULL,
    accuracy DECIMAL(5, 4),
    mae DECIMAL(10, 2),
    mse DECIMAL(10, 2),
    r2 DECIMAL(5, 4),
    
    feature_importance JSON,
    
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_model_name (model_name),
    INDEX idx_is_active (is_active)
);

-- User feedback table
CREATE TABLE user_feedback (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    prediction_id VARCHAR(36),
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE SET NULL,
    
    actual_yield DECIMAL(10, 2),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_prediction_id (prediction_id)
);

-- API usage logs table
CREATE TABLE api_usage_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INT,
    response_time INT, -- in milliseconds
    user_agent TEXT,
    ip_address VARCHAR(45),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_endpoint (endpoint),
    INDEX idx_created_at (created_at)
);

-- Insert default admin user
INSERT INTO users (id, name, email, password, role, is_verified) VALUES
('admin-001', 'System Admin', 'admin@cropyieldpro.com', '$2b$12$ExampleHashedPassword123', 'admin', TRUE);