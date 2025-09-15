import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
import joblib
import json
import os
from datetime import datetime

# Try to import mysql connector, but provide fallback if not available
try:
    import mysql.connector
    from mysql.connector import Error
    MYSQL_AVAILABLE = True
except ImportError:
    print("MySQL connector not available. Using synthetic data only.")
    MYSQL_AVAILABLE = False

class ModelTrainer:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.label_encoders = {}
        
    def create_synthetic_data(self):
        """Create synthetic training data when real data is not available"""
        print("Creating synthetic training data...")
        
        np.random.seed(42)
        n_samples = 2000
        
        # Base yields for different crops (kg per acre)
        base_yields = {
            'rice': 2500, 'wheat': 1800, 'corn': 2200, 
            'sugarcane': 45000, 'cotton': 800, 'pulses': 900
        }
        
        # Region modifiers
        region_factors = {
            'coastal': 1.2, 'western': 0.9, 
            'northern': 1.1, 'southern': 1.0
        }
        
        # Soil type modifiers
        soil_factors = {
            'alluvial': 1.3, 'black': 1.1, 'red': 1.0, 'laterite': 0.8
        }
        
        data = []
        
        for _ in range(n_samples):
            crop = np.random.choice(list(base_yields.keys()))
            region = np.random.choice(list(region_factors.keys()))
            soil_type = np.random.choice(list(soil_factors.keys()))
            
            # Generate realistic environmental factors
            temperature = np.random.normal(28, 5)  # Mean 28°C, std 5
            rainfall = np.random.normal(1200, 300)  # Mean 1200mm, std 300
            humidity = np.random.normal(75, 10)  # Mean 75%, std 10
            
            # Soil properties
            soil_ph = np.random.normal(6.5, 0.8)
            nitrogen = np.random.normal(0.12, 0.04)
            phosphorus = np.random.normal(0.06, 0.02)
            potassium = np.random.normal(0.10, 0.03)
            organic_matter = np.random.normal(1.8, 0.4)
            
            # Calculate yield with some noise
            base_yield = base_yields[crop]
            region_factor = region_factors[region]
            soil_factor = soil_factors[soil_type]
            
            # Environmental factors influence
            temp_factor = 1 + (temperature - 25) / 100
            rain_factor = 1 + (rainfall - 1000) / 5000
            humidity_factor = 1 + (humidity - 70) / 500
            
            # Soil factors influence
            ph_factor = 0.8 + (soil_ph - 5.5) / 10
            nutrient_factor = 0.9 + (nitrogen + phosphorus + potassium) * 3
            
            # Add some random noise
            noise = np.random.normal(1, 0.1)
            
            # Final yield calculation
            yield_value = (base_yield * region_factor * soil_factor * 
                          temp_factor * rain_factor * humidity_factor *
                          ph_factor * nutrient_factor * noise)
            
            data.append({
                'crop_type': crop,
                'region': region,
                'soil_type': soil_type,
                'temperature': max(10, min(40, temperature)),
                'rainfall': max(500, min(2000, rainfall)),
                'humidity': max(40, min(95, humidity)),
                'soil_ph': max(4.5, min(8.5, soil_ph)),
                'nitrogen': max(0.05, min(0.25, nitrogen)),
                'phosphorus': max(0.02, min(0.15, phosphorus)),
                'potassium': max(0.04, min(0.20, potassium)),
                'organic_matter': max(0.8, min(3.0, organic_matter)),
                'yield': max(500, min(10000, yield_value))
            })
        
        return pd.DataFrame(data)
    
    def fetch_real_data(self):
        """Fetch real data from database if available"""
        if not MYSQL_AVAILABLE:
            print("MySQL connector not available. Cannot fetch real data.")
            return None
            
        try:
            # Use environment variables or defaults
            db_config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'database': os.getenv('DB_NAME', 'cropyield'),
                'user': os.getenv('DB_USER', 'root'),
                'password': os.getenv('DB_PASSWORD', ''),
                'port': os.getenv('DB_PORT', 3306)
            }
            
            connection = mysql.connector.connect(**db_config)
            
            if connection.is_connected():
                query = """
                SELECT cropType as crop_type, region, soilType as soil_type, 
                       temperature, rainfall, humidity, area,
                       predictedYield as yield, createdAt
                FROM predictions 
                WHERE predictedYield IS NOT NULL
                """
                
                df = pd.read_sql(query, connection)
                connection.close()
                
                if len(df) > 100:  # Only use if we have sufficient data
                    print(f"Using {len(df)} real data samples for training")
                    return df
                else:
                    print(f"Only {len(df)} real data samples available. Using synthetic data.")
                
        except Error as e:
            print(f"Database connection failed: {e}")
        except Exception as e:
            print(f"Error fetching data: {e}")
        
        return None
    
    def load_data_from_csv(self, csv_path=None):
        """Load training data from CSV file as an alternative"""
        if csv_path is None:
            csv_path = os.path.join(os.path.dirname(__file__), 'training_data.csv')
        
        if os.path.exists(csv_path):
            try:
                df = pd.read_csv(csv_path)
                print(f"Loaded {len(df)} samples from CSV file")
                return df
            except Exception as e:
                print(f"Error loading CSV file: {e}")
        
        return None
    
    def preprocess_data(self, df):
        """Preprocess the data for training"""
        # Encode categorical variables
        categorical_cols = ['crop_type', 'region', 'soil_type']
        
        for col in categorical_cols:
            if col in df.columns:
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col])
                self.label_encoders[col] = le
        
        # Handle missing values
        numeric_cols = ['temperature', 'rainfall', 'humidity', 'soil_ph', 
                       'nitrogen', 'phosphorus', 'potassium', 'organic_matter']
        
        for col in numeric_cols:
            if col in df.columns and df[col].isnull().any():
                df[col] = df[col].fillna(df[col].median())
        
        return df
    
    def train(self, df):
        """Train the model"""
        # Preprocess data
        df_processed = self.preprocess_data(df.copy())
        
        # Features and target
        feature_cols = ['crop_type', 'region', 'soil_type', 'temperature', 
                       'rainfall', 'humidity', 'soil_ph', 'nitrogen', 
                       'phosphorus', 'potassium', 'organic_matter']
        
        # Only use columns that exist in the dataframe
        available_features = [col for col in feature_cols if col in df_processed.columns]
        
        X = df_processed[available_features]
        y = df_processed['yield']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        print("Training model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model evaluation:")
        print(f"MAE: {mae:.2f}")
        print(f"MSE: {mse:.2f}")
        print(f"R²: {r2:.4f}")
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X, y, cv=5, scoring='r2')
        print(f"Cross-validation R²: {cv_scores.mean():.4f} (±{cv_scores.std() * 2:.4f})")
        
        return mae, mse, r2
    
    def save_model(self):
        """Save the trained model and encoders"""
        model_dir = os.path.dirname(__file__)
        
        # Save model
        joblib.dump(self.model, os.path.join(model_dir, 'yield_model.pkl'))
        
        # Save label encoders
        encoders_path = os.path.join(model_dir, 'label_encoders.pkl')
        joblib.dump(self.label_encoders, encoders_path)
        
        # Save model metadata
        metadata = {
            'training_date': datetime.now().isoformat(),
            'model_type': 'RandomForestRegressor',
            'feature_importance': dict(zip(
                self.model.feature_names_in_ if hasattr(self.model, 'feature_names_in_') else [],
                self.model.feature_importances_.tolist()
            ))
        }
        
        with open(os.path.join(model_dir, 'model_metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print("Model saved successfully!")
    
    def run_training(self):
        """Main training pipeline"""
        print("Starting model training...")
        
        # Try to get real data first from database
        df = self.fetch_real_data()
        
        # If no real data from DB, try CSV file
        if df is None:
            df = self.load_data_from_csv()
        
        # If still no data, use synthetic data
        if df is None or len(df) < 100:
            print("Insufficient real data, using synthetic data for training")
            df = self.create_synthetic_data()
            
            # Save synthetic data to CSV for future use
            csv_path = os.path.join(os.path.dirname(__file__), 'training_data.csv')
            df.to_csv(csv_path, index=False)
            print(f"Synthetic data saved to {csv_path}")
        
        # Train model
        mae, mse, r2 = self.train(df)
        
        # Save model
        self.save_model()
        
        return {
            'mae': mae,
            'mse': mse,
            'r2': r2,
            'samples': len(df)
        }

# Main execution
if __name__ == "__main__":
    trainer = ModelTrainer()
    results = trainer.run_training()
    
    print(f"\nTraining completed with {results['samples']} samples")
    print(f"Final R² score: {results['r2']:.4f}")