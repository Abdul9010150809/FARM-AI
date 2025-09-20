// src/pages/PredictionAndOptimizationPage.tsx
import React, { useState } from 'react';

// STEP 1: IMPORT CHART.JS AND THE REQUIRED COMPONENTS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useAuth } from '../contexts/AuthContext';
import { useRealtimeData } from '../hooks/useRealtimeData';
import { usePredictionApi } from '../hooks/usePredictionApi';
import DataPanel from '../components/prediction/DataPanel';
import InputForm from '../components/prediction/InputForm';
import ResultsDisplay from '../components/prediction/ResultsDisplay';

// STEP 2: REGISTER THE COMPONENTS RIGHT AFTER THE IMPORTS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PredictionAndOptimizationPage: React.FC = () => {
  const { user, showNotification } = useAuth();
  
  const { location, weather, soil, isLoading: isLoadingData, error: dataError } = useRealtimeData(showNotification);
  const { result, isLoading: isLoadingPrediction, getPrediction } = usePredictionApi(showNotification);

  const [formData, setFormData] = useState({
    crop: 'rice',
    area: 1.0,
    variety: '',
    plantingDate: new Date().toISOString().split('T')[0]
  });

  const handlePredict = () => {
    if (!location || !weather || !soil) {
      showNotification("Please wait for real-time data to load.", 'warning');
      return;
    }
    const payload = { formData, location, weather, soil, user };
    getPrediction(payload);
  };
  
  return (
    <div className="container my-5">
      <h1 className="text-primary mb-4">🔮 Prediction & Optimization Dashboard</h1>
      
      {dataError && <div className="alert alert-warning">{dataError}</div>}
      
      <div className="row g-4">
        <div className="col-lg-4">
          <DataPanel
            location={location}
            weather={weather}
            soil={soil}
            isLoading={isLoadingData}
          />
          <InputForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handlePredict}
            isLoading={isLoadingData || isLoadingPrediction}
          />
        </div>
        
        <div className="col-lg-8">
          {isLoadingPrediction && (
            <div className="card h-100 text-center justify-content-center p-5">
              <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="mt-3">Running AI Models & Optimizations...</h4>
            </div>
          )}

          {!result && !isLoadingPrediction && (
             <div className="card text-center p-5 h-100 justify-content-center border-dashed">
                <i className="fas fa-magic display-1 text-muted mb-4"></i>
                <h3>Your AI-Powered Farm Report Awaits</h3>
                <p className="text-muted">Enter your farm details to unlock predictions and optimization strategies.</p>
             </div>
          )}
          
          {result && <ResultsDisplay result={result} formData={formData} />}
        </div>
      </div>
    </div>
  );
};

export default PredictionAndOptimizationPage;