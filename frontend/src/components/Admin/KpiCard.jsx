// src/components/Admin/KpiCard.jsx
import React from 'react';
import './KpiCard.css'; // Add styling here

const KpiCard = ({ title, value, subtext, trend, color }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-trend trend-${color}`}>
        {trend}
      </div>
      <div className="kpi-subtext">{subtext}</div>
    </div>
  );
};

export default KpiCard;