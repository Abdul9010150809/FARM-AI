import React, { useState } from 'react';
 // Or import a specific chart type, e.g., 'chart.js/auto'
import Chart from "chart.js/auto";

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const CropPrediction = () => {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [yieldValue, setYieldValue] = useState(0);
  const [yieldPerAcre, setYieldPerAcre] = useState(0);
  const [cropType, setCropType] = useState('');

  const showNotification = (message: string, type = 'info') => {
    const toast = document.getElementById('notificationToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.style.display = 'block';
      
      setTimeout(() => {
        toast.style.display = 'none';
      }, 5000);
    }
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);
    
    // Get crop type from the form
    const cropSelect = document.getElementById('cropType') as HTMLSelectElement;
    setCropType(cropSelect.value);

    // Simulate prediction process
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);

      const predictedYield = Math.floor(Math.random() * 2000) + 1000;
      setYieldValue(predictedYield);
      setYieldPerAcre(Math.floor(predictedYield / 2)); // Example calculation

      // Initialize the chart
      const ctx = document.getElementById('yieldChart') as HTMLCanvasElement;
      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Predicted Yield', 'Average Yield'],
            datasets: [{
              label: 'Yield (kg)',
              data: [predictedYield, Math.floor(predictedYield * 0.8)],
              backgroundColor: ['#2e7d32', '#7cb342'],
            }]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }, 3000);
  };

  const resetForm = () => {
    const form = document.getElementById('yieldPredictionForm') as HTMLFormElement;
    if (form) form.reset();
    setShowResults(false);
    setYieldValue(0);
    setYieldPerAcre(0);
    setCropType('');
    showNotification('Form has been reset successfully.', 'success');
  };

  return (
    <section id="prediction" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center section-title">Crop Yield Prediction</h2>
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="prediction-form">
              <form id="yieldPredictionForm" onSubmit={handlePredict}>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cropType" className="form-label">Crop Type</label>
                    <select className="form-select" id="cropType" required>
                      <option value="" disabled>Select crop type</option>
                      <option value="rice">Rice</option>
                      <option value="wheat">Wheat</option>
                      <option value="corn">Corn</option>
                      <option value="sugarcane">Sugarcane</option>
                      <option value="cotton">Cotton</option>
                      <option value="pulses">Pulses</option>
                      <option value="chillies">Chillies</option>
                      <option value="turmeric">Turmeric</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="region" className="form-label">Region</label>
                    <select className="form-select" id="region" required>
                      <option value="" disabled>Select your region</option>
                      <option value="coastal">Coastal Andhra</option>
                      <option value="rayalaseema">Rayalaseema</option>
                      <option value="northern">Northern Andhra</option>
                    </select>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="soilType" className="form-label">Soil Type</label>
                    <select className="form-select" id="soilType" required>
                      <option value="" disabled>Select soil type</option>
                      <option value="alluvial">Alluvial</option>
                      <option value="black">Black</option>
                      <option value="red">Red</option>
                      <option value="laterite">Laterite</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="area" className="form-label">Area (acres)</label>
                    <input type="number" className="form-control" id="area" placeholder="Enter land area" min={1} required />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="rainfall" className="form-label">Rainfall (mm)</label>
                    <input type="number" className="form-control" id="rainfall" placeholder="Enter expected rainfall" min={0} required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="temperature" className="form-label">Avg. Temperature (°C)</label>
                    <input type="number" className="form-control" id="temperature" placeholder="Enter temperature" required />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="humidity" className="form-label">Avg. Humidity (%)</label>
                    <input type="number" className="form-control" id="humidity" placeholder="Enter humidity" min={0} max={100} required />
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <i className="fas fa-calculator me-2" />Predict Yield
                  </button>
                </div>
              </form>
            </div>
            {loading && (
              <div className="loading-spinner text-center" id="loadingSpinner">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Running ML prediction models...</p>
                <div className="progress training-progress w-50 mx-auto">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: '0%' }} />
                </div>
              </div>
            )}
            {showResults && (
              <div className="result-container fade-in" id="resultContainer">
                <div className="text-center mb-4">
                  <h3>Yield Prediction Results</h3>
                  <div className="yield-value" id="yieldValue">{yieldValue} kg</div>
                  <p className="text-muted" id="yieldPerAcre">Per acre: {yieldPerAcre} kg</p>
                  <span className="confidence-badge" id="confidenceBadge">
                    <i className="fas fa-brain me-1" /> Confidence: 92%
                  </span>
                  <p className="prediction-interval mt-2" id="predictionInterval">Prediction interval: {yieldValue - 100} - {yieldValue + 100} kg</p>
                </div>
                <div className="chart-container">
                  <canvas id="yieldChart" />
                </div>
                <div className="model-info">
                  <h5><i className="fas fa-info-circle me-2" />Model Insights:</h5>
                  <p id="modelInsights">Our Random Forest model analyzed 15 factors including weather patterns, soil composition, and historical data to generate this prediction.</p>
                  <div className="mt-3">
                    <h6>Key Factors Influencing This Prediction:</h6>
                    <div className="mt-2" id="factorBars">
                      <div className="d-flex justify-content-between"><span>Rainfall</span><span>85%</span></div>
                      <div className="factor-bar"><div className="factor-progress bg-info" style={{ width: '85%' }} /></div>
                      <div className="d-flex justify-content-between"><span>Temperature</span><span>75%</span></div>
                      <div className="factor-bar"><div className="factor-progress bg-warning" style={{ width: '75%' }} /></div>
                      <div className="d-flex justify-content-between"><span>Soil Nutrients</span><span>90%</span></div>
                      <div className="factor-bar"><div className="factor-progress bg-success" style={{ width: '90%' }} /></div>
                    </div>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-tint me-2" />Irrigation Recommendation</h5>
                        <p className="card-text" id="irrigationRecommendation">For {cropType}, we recommend irrigation every 3 days during dry seasons.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-seedling me-2" />Fertilization Recommendation</h5>
                        <p className="card-text" id="fertilizerRecommendation">Use nitrogen-rich fertilizer for {cropType} during the growth phase.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-bug me-2" />Pest Control Recommendation</h5>
                        <p className="card-text" id="pestRecommendation">Monitor for common pests in {cropType} and use organic pesticides when detected.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="card h-100 recommendation-card">
                      <div className="card-body">
                        <h5 className="card-title"><i className="fas fa-calendar-alt me-2" />Harvest Timing</h5>
                        <p className="card-text" id="harvestRecommendation">Optimal harvest time for {cropType} is typically 90-120 days after planting.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button className="btn btn-outline-primary" onClick={resetForm}>
                    <i className="fas fa-redo me-2" />Make Another Prediction
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropPrediction;