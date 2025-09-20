// src/components/prediction/OptimizationScenarios.tsx
import React from 'react';
import { OptimizationScenario } from '../../types';

interface Props {
  scenarios: OptimizationScenario[];
}

const OptimizationScenarios: React.FC<Props> = ({ scenarios }) => {
  const getChangeColor = (value: string) => {
    if (value.startsWith('+')) return 'text-success';
    if (value.startsWith('-')) return 'text-danger';
    return 'text-muted';
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-purple text-white">
        <i className="fas fa-magic me-2"></i>Optimization Scenarios
      </div>
      <div className="card-body">
        <p className="card-text text-muted">Consider these alternative strategies to meet different farming goals.</p>
        <div className="row g-3">
          {scenarios.map(scenario => (
            <div className="col-md-4" key={scenario.title}>
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className={`${scenario.icon} fa-2x text-purple mb-2`}></i>
                  <h6 className="card-title">{scenario.title}</h6>
                  <p className="small text-muted">{scenario.description}</p>
                  <div className="d-flex justify-content-around small">
                    {Object.entries(scenario.changes).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.replace(/([A-Z])/g, ' $1').trim()}: </strong>
                        <span className={`fw-bold ${getChangeColor(value)}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OptimizationScenarios;

// Add this to your CSS for the purple theme color
// .text-purple { color: #6f42c1; }
// .bg-purple { background-color: #6f42c1; }