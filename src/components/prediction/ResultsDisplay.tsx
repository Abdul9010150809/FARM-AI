// src/components/prediction/ResultsDisplay.tsx
import React from 'react';
import { PredictionResult } from '../../types';
import OptimizationScenarios from './OptimizationScenarios';
import RecommendationTabs from './RecommendationTabs';
import { ChartCard } from './ChartCard';
import { Bar, Doughnut } from 'react-chartjs-2';

interface Props {
  result: PredictionResult;
  formData: { crop: string, variety: string };
}

const ResultsDisplay: React.FC<Props> = ({ result, formData }) => {
    
  const yieldChartData = {
    labels: ['2021', '2022', '2023', '2024', '2025 (Predicted)'],
    datasets: [{
      label: 'Yield (kg/acre)',
      data: result.yieldHistory,
      backgroundColor: 'rgba(46, 125, 50, 0.6)',
      borderColor: 'rgba(46, 125, 50, 1)',
      borderWidth: 1,
    }],
  };

  const costChartData = {
    labels: ['Seeds', 'Fertilizers', 'Labor', 'Irrigation', 'Other'],
    datasets: [{
      data: Object.values(result.costBreakdown),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      borderWidth: 1,
    }],
  };

  const getRiskColor = (risk: string) => risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'success';

  return (
    <>
      {/* Main Prediction Card */}
      <div className="card text-center bg-light shadow-sm mb-4 border-success">
        <div className="card-body py-4">
          <h5 className="text-muted mb-3">Predicted Yield for {formData.crop} ({formData.variety})</h5>
          <h1 className="display-4 fw-bold text-success mb-2">{result.yield} kg/acre</h1>
          <div className="d-flex justify-content-center flex-wrap">
            <span className="badge bg-info m-1"><i className="fas fa-chart-line me-1"></i> ROI: {result.roi}%</span>
            <span className="badge bg-primary m-1"><i className="fas fa-bullseye me-1"></i> Confidence: {result.confidence}%</span>
            <span className="badge bg-warning text-dark m-1"><i className="fas fa-leaf me-1"></i> Sustainability: {result.sustainabilityScore}/100</span>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      <RecommendationTabs recommendations={result.recommendations} />

      {/* Charts */}
      <div className="row g-4 mt-0">
        <div className="col-md-7">
          <ChartCard title="Yield History & Forecast">
             <Bar data={yieldChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </ChartCard>
        </div>
        <div className="col-md-5">
          <ChartCard title="Cost Breakdown">
             <Doughnut data={costChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </ChartCard>
        </div>
      </div>
      
      {/* Optimization Scenarios */}
      <OptimizationScenarios scenarios={result.optimizationScenarios} />

      {/* Disease Alert */}
      <div className="card shadow-sm mt-4">
          <div className="card-header"><i className="fas fa-biohazard me-2"></i>Disease Alert</div>
          <div className="card-body">
              <div className={`alert alert-${getRiskColor(result.diseaseAlert.risk)} mb-0`}>
                  <h5 className="alert-heading">Risk Level: {result.diseaseAlert.risk}</h5>
                  {result.diseaseAlert.details}
              </div>
          </div>
      </div>
    </>
  );
};

export default ResultsDisplay;