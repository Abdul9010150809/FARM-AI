// src/components/prediction/RecommendationTabs.tsx
import React from 'react';
import { PredictionResult } from '../../types';

interface Props {
  recommendations: PredictionResult['recommendations'];
}

const RecommendationTabs: React.FC<Props> = ({ recommendations }) => {
  // Simple implementation without interactive tabs for brevity.
  // For interactive tabs, you would need to add state to manage the active tab.
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-info text-white"><i className="fas fa-lightbulb me-2"></i>Actionable Recommendations</div>
      <div className="card-body">
        <div className="mb-2"><strong><i className="fas fa-tint text-primary me-2"></i>Irrigation:</strong> {recommendations.irrigation}</div>
        <div className="mb-2"><strong><i className="fas fa-flask text-success me-2"></i>Fertilization:</strong> {recommendations.fertilization}</div>
        <div className="mb-2"><strong><i className="fas fa-bug text-danger me-2"></i>Pest Control:</strong> {recommendations.pestControl}</div>
        <div><strong><i className="fas fa-store text-warning me-2"></i>Market:</strong> {recommendations.market}</div>
      </div>
    </div>
  );
};

export default RecommendationTabs;