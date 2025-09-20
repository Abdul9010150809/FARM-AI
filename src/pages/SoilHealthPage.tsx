// src/pages/SoilHealthPage.tsx
import React from 'react';
import SoilHealth from '../components/SoilHealth'; // Import the component

const SoilHealthPage: React.FC = () => {
  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Soil Health Analysis</h1>
      <SoilHealth />
    </div>
  );
};

export default SoilHealthPage;