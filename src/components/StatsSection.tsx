import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row text-center">
          <div className="col-md-3 col-6 mb-4 mb-md-0">
            <div className="stat-number">12%</div>
            <div className="stat-label">Average Yield Increase</div>
          </div>
          <div className="col-md-3 col-6 mb-4 mb-md-0">
            <div className="stat-number">8,000+</div>
            <div className="stat-label">Farmers Supported</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-number">18</div>
            <div className="stat-label">Crop Types</div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-number">95%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;