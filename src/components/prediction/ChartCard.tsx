// src/components/prediction/ChartCard.tsx
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

const ChartCard: React.FC<Props> = ({ title, children }) => (
  <div className="card shadow-sm h-100">
    <div className="card-header"><i className="fas fa-chart-bar me-2"></i>{title}</div>
    <div className="card-body d-flex align-items-center justify-content-center">
      {children}
    </div>
  </div>
);

export { ChartCard };