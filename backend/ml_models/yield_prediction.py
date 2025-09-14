import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import os

class YieldPredictor:
    def __init__(self):
        self.model = None
        self.load_model()
        
    def load_model(self):
        """Load trained model if available"""
        model_path = os.path.join(os.path.dirname(__file__), 'yield_model.pkl')
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            self.train_model()
    
    def train_model(self):
        """Train the yield prediction model"""
        # Sample training data (in real scenario, this would come from database/API)
        data = {
            'crop_type': ['rice', 'wheat', 'corn', 'sugarcane', 'cotton', 'pulses'] * 100,
            'region': ['coastal', 'western', 'northern', 'southern'] * 150,
            'soil_type': ['alluvial', 'black', 'red', 'laterite'] * 150,
            'soil_ph': np.random.uniform(5.0, 8.0, 600),
            'nitrogen': np.random.uniform(0.05, 0.2, 600),
            'phosphorus': np.random.uniform(0.03, 0.15, 600),
            'potassium': np.random.uniform(0.05, 0.2, 600),
            'temperature': np.random.uniform(15, 35, 600),
            'rainfall': np.random.uniform(500, 1500, 600),
            'humidity': np.random.uniform(40, 90, 600),
            'yield': np.random.uniform(1000, 5000, 600)
        }
        
        df = pd.DataFrame(data)
        
        # Convert categorical variables to numerical
        df = pd.get_dummies(df, columns=['crop_type', 'region', 'soil_type'])
        
        # Features and target
        X = df.drop('yield', axis=1)
        y = df['yield']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model trained successfully! MAE: {mae:.2f}, R²: {r2:.2f}")
        
        # Save model
        joblib.dump(self.model, os.path.join(os.path.dirname(__file__), 'yield_model.pkl'))
    
    def predict_yield(self, input_data):
        """Predict yield based on input parameters"""
        if self.model is None:
            self.load_model()
        
        # Convert input to DataFrame with same structure as training data
        input_df = pd.DataFrame([input_data])
        
        # Ensure all expected columns are present
        expected_columns = [
            'soil_ph', 'nitrogen', 'phosphorus', 'potassium', 
            'temperature', 'rainfall', 'humidity',
            'crop_type_corn', 'crop_type_cotton', 'crop_type_pulses',
            'crop_type_rice', 'crop_type_sugarcane', 'crop_type_wheat',
            'region_coastal', 'region_northern', 'region_southern', 'region_western',
            'soil_type_alluvial', 'soil_type_black', 'soil_type_laterite', 'soil_type_red'
        ]
        
        for col in expected_columns:
            if col not in input_df.columns:
                input_df[col] = 0
        
        # Reorder columns to match training data
        input_df = input_df[expected_columns]
        
        # Make prediction
        prediction = self.model.predict(input_df)
        
        return prediction[0]

# For testing the model directly
if __name__ == "__main__":
    predictor = YieldPredictor()
    
    # Test prediction
    test_data = {
        'soil_ph': 6.5,
        'nitrogen': 0.15,
        'phosphorus': 0.08,
        'potassium': 0.12,
        'temperature': 28,
        'rainfall': 1200,
        'humidity': 75,
        'crop_type_rice': 1,
        'crop_type_wheat': 0,
        'crop_type_corn': 0,
        'crop_type_sugarcane': 0,
        'crop_type_cotton': 0,
        'crop_type_pulses': 0,
        'region_coastal': 1,
        'region_western': 0,
        'region_northern': 0,
        'region_southern': 0,
        'soil_type_alluvial': 1,
        'soil_type_black': 0,
        'soil_type_red': 0,
        'soil_type_laterite': 0
    }
    
    result = predictor.predict_yield(test_data)
    print(f"Predicted yield: {result:.2f} kg/ha")