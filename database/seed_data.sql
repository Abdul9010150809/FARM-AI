-- CropYield Pro Seed Data
-- Insert initial data for the application

USE cropyield;

-- Insert crop data
INSERT INTO crop_data (
    id, name, scientific_name,
    optimal_temperature_min, optimal_temperature_max,
    optimal_rainfall_min, optimal_rainfall_max,
    optimal_soil_ph_min, optimal_soil_ph_max,
    growth_duration, water_requirements,
    regions, suitable_soil_types,
    common_pests, common_diseases,
    fertilization_schedule,
    irrigation_recommendations, harvesting_guidelines,
    yield_range_min, yield_range_max
) VALUES
(
    UUID(), 'Rice', 'Oryza sativa',
    20, 35, 1000, 2000, 5.5, 7.0,
    120, 'High',
    '["coastal", "northern"]', '["alluvial"]',
    '[{"name": "Stem Borer", "description": "Larvae bore into stem causing dead hearts", "prevention": "Use resistant varieties", "treatment": "Apply carbofuran granules"}, {"name": "Brown Plant Hopper", "description": "Sucks sap from plants", "prevention": "Avoid excessive nitrogen", "treatment": "Apply imidacloprid"}]',
    '[{"name": "Blast", "description": "Fungal disease affecting leaves and panicles", "prevention": "Use resistant varieties", "treatment": "Apply tricyclazole"}, {"name": "Bacterial Blight", "description": "Bacterial disease causing leaf blight", "prevention": "Avoid water stagnation", "treatment": "Apply streptocycline"}]',
    '[{"stage": "Basal", "recommendation": "Apply 50% N, 100% P, 100% K", "npkRatio": "80:40:40"}, {"stage": "Tillering", "recommendation": "Apply 25% N", "npkRatio": "40:0:0"}, {"stage": "Panicle Initiation", "recommendation": "Apply 25% N", "npkRatio": "40:0:0"}]',
    'Maintain 2-5 cm water depth during vegetative stage. Practice intermittent irrigation during reproductive stage.',
    'Harvest when 80-85% of panicles turn golden yellow. Grain moisture should be around 20-25%.',
    2000, 3500
),
(
    UUID(), 'Wheat', 'Triticum aestivum',
    15, 25, 500, 1000, 6.0, 7.5,
    140, 'Medium',
    '["western", "northern"]', '["alluvial", "black"]',
    '[{"name": "Aphids", "description": "Suck sap from plants", "prevention": "Early sowing", "treatment": "Apply dimethoate"}, {"name": "Termites", "description": "Damage roots and stem", "prevention": "Deep ploughing", "treatment": "Apply chlorpyriphos"}]',
    '[{"name": "Rust", "description": "Fungal disease causing rust-colored pustules", "prevention": "Use resistant varieties", "treatment": "Apply propiconazole"}, {"name": "Karnal Bunt", "description": "Fungal disease affecting grains", "prevention": "Use certified seeds", "treatment": "Apply carbendazim"}]',
    '[{"stage": "Basal", "recommendation": "Apply full dose of P and K, 1/3 N", "npkRatio": "60:60:60"}, {"stage": "First Irrigation", "recommendation": "Apply 1/3 N", "npkRatio": "60:0:0"}, {"stage": "Second Irrigation", "recommendation": "Apply 1/3 N", "npkRatio": "60:0:0"}]',
    'Apply 4-5 irrigations at critical growth stages: crown root, tillering, jointing, flowering, and milk stage.',
    'Harvest when grains are hard and moisture content is 20-25%. Use combine harvester for large areas.',
    1800, 3000
),
(
    UUID(), 'Corn', 'Zea mays',
    18, 32, 600, 1200, 5.5, 7.0,
    100, 'Medium',
    '["coastal", "southern"]', '["alluvial", "red"]',
    '[{"name": "Stem Borer", "description": "Larvae bore into stem", "prevention": "Early planting", "treatment": "Apply carbaryl"}, {"name": "Armyworm", "description": "Feed on leaves", "prevention": "Clean cultivation", "treatment": "Apply quinalphos"}]',
    '[{"name": "Turcicum Leaf Blight", "description": "Fungal disease causing leaf spots", "prevention": "Crop rotation", "treatment": "Apply mancozeb"}, {"name": "Downy Mildew", "description": "Fungal disease", "prevention": "Use resistant varieties", "treatment": "Apply metalaxyl"}]',
    '[{"stage": "Basal", "recommendation": "Apply full dose of P and K, 1/3 N", "npkRatio": "60:60:60"}, {"stage": "Knee High", "recommendation": "Apply 1/3 N", "npkRatio": "60:0:0"}, {"stage": "Tasseling", "recommendation": "Apply 1/3 N", "npkRatio": "60:0:0"}]',
    'Apply irrigation at critical stages: knee high, tasseling, silking, and grain filling. Avoid water stress during flowering.',
    'Harvest when kernels are firm and milky fluid is visible. Moisture content should be 20-25%.',
    2200, 4000
),
(
    UUID(), 'Sugarcane', 'Saccharum officinarum',
    20, 35, 1500, 2500, 6.5, 7.5,
    365, 'High',
    '["coastal", "southern"]', '["alluvial", "black"]',
    '[{"name": "Early Shoot Borer", "description": "Bores into young shoots", "prevention": "Deep planting", "treatment": "Apply carbofuran"}, {"name": "White Grub", "description": "Feed on roots", "prevention": "Summer ploughing", "treatment": "Apply chlorpyriphos"}]',
    '[{"name": "Red Rot", "description": "Fungal disease", "prevention": "Use disease-free setts", "treatment": "Hot water treatment"}, {"name": "Smut", "description": "Fungal disease", "prevention": "Use resistant varieties", "treatment": "Rogue affected plants"}]',
    '[{"stage": "Planting", "recommendation": "Apply full P and K, 1/4 N", "npkRatio": "50:80:80"}, {"stage": "Tillering", "recommendation": "Apply 1/4 N", "npkRatio": "50:0:0"}, {"stage": "Grand Growth", "recommendation": "Apply 1/2 N", "npkRatio": "100:0:0"}]',
    'Maintain adequate soil moisture throughout growth. Requires frequent irrigation in initial stages.',
    'Harvest at 10-12 months age. Sugar content should be 18-20%. Cut close to ground level.',
    40000, 80000
),
(
    UUID(), 'Cotton', 'Gossypium hirsutum',
    20, 35, 600, 1200, 6.0, 8.0,
    180, 'Medium',
    '["western", "northern"]', '["black", "red"]',
    '[{"name": "Bollworm", "description": "Damage flowers and bolls", "prevention": "Intercropping with pulses", "treatment": "Apply emamectin benzoate"}, {"name": "Whitefly", "description": "Suck sap and transmit viruses", "prevention": "Yellow sticky traps", "treatment": "Apply acetamiprid"}]',
    '[{"name": "Fusarium Wilt", "description": "Fungal wilt disease", "prevention": "Use resistant varieties", "treatment": "Soil solarization"}, {"name": "Leaf Curl Virus", "description": "Viral disease", "prevention": "Control whiteflies", "treatment": "Rogue infected plants"}]',
    '[{"stage": "Basal", "recommendation": "Apply full P and K, 1/3 N", "npkRatio": "40:60:60"}, {"stage": "Square Formation", "recommendation": "Apply 1/3 N", "npkRatio": "40:0:0"}, {"stage": "Flowering", "recommendation": "Apply 1/3 N", "npkRatio": "40:0:0"}]',
    'Apply irrigation at square formation, flowering, and boll development stages. Avoid water stress during boll formation.',
    'Harvest when bolls burst open. Pick in 2-3 pickings at 15-day intervals.',
    800, 1500
),
(
    UUID(), 'Pulses', 'Vigna radiata',
    20, 30, 500, 800, 6.0, 7.5,
    70, 'Low',
    '["western", "southern"]', '["red", "laterite"]',
    '[{"name": "Pod Borer", "description": "Damage pods", "prevention": "Early sowing", "treatment": "Apply spinosad"}, {"name": "Aphids", "description": "Suck sap", "prevention": "Conserve natural enemies", "treatment": "Apply imidacloprid"}]',
    '[{"name": "Yellow Mosaic Virus", "description": "Viral disease", "prevention": "Use resistant varieties", "treatment": "Control whiteflies"}, {"name": "Powdery Mildew", "description": "Fungal disease", "prevention": "Proper spacing", "treatment": "Apply wettable sulfur"}]',
    '[{"stage": "Basal", "recommendation": "Apply full P and K, 1/2 N", "npkRatio": "20:50:50"}, {"stage": "Flowering", "recommendation": "Apply 1/2 N", "npkRatio": "20:0:0"}]',
    'Light irrigation at flowering and pod development. Avoid waterlogging.',
    'Harvest when 75-80% pods are mature. Harvest in morning to avoid shattering.',
    600, 1200
);

-- Insert sample predictions for demonstration
INSERT INTO predictions (
    user_id, crop_type, area, soil_type,
    temperature, rainfall, humidity,
    predicted_yield, confidence, yield_per_acre,
    irrigation_recommendation, fertilization_recommendation,
    pest_control_recommendation, harvest_timing_recommendation
) VALUES
(
    NULL, 'rice', 2.5, 'alluvial',
    28.5, 1200.0, 75.0,
    7500, 88.5, 3000,
    'Maintain 2-5 cm water depth. Provide irrigation at 3-day intervals.',
    'Apply 80:40:40 kg/acre NPK. Split application at basal, tillering, and panicle initiation.',
    'Monitor for stem borer and brown plant hopper. Apply appropriate insecticides if threshold exceeded.',
    'Harvest in 120 days when 80% panicles turn golden yellow.'
),
(
    NULL, 'wheat', 3.0, 'black',
    22.0, 800.0, 65.0,
    7200, 92.3, 2400,
    'Apply 4 irrigations at critical growth stages: crown root, tillering, jointing, and flowering.',
    'Apply 60:60:60 kg/acre NPK. Split application at basal and two top dressings.',
    'Watch for aphids and termites. Use recommended insecticides if needed.',
    'Harvest in 140 days when grains are hard and moisture is 20-25%.'
);

-- Insert ML model metadata
INSERT INTO ml_model_metadata (
    model_name, model_version, model_path,
    training_date, training_samples, accuracy, mae, mse, r2,
    feature_importance, is_active
) VALUES
(
    'yield_prediction_rf', '1.0.0', './ml_models/yield_model.pkl',
    NOW(), 2000, 0.923, 145.67, 28543.21, 0.896,
    '{"temperature": 0.18, "rainfall": 0.15, "soil_ph": 0.12, "nitrogen": 0.11, "crop_type": 0.10, "region": 0.09, "humidity": 0.08, "phosphorus": 0.07, "potassium": 0.06, "organic_matter": 0.04}',
    TRUE
);