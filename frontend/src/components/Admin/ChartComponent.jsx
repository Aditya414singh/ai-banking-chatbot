// src/components/Admin/ChartComponent.jsx
import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement, // Needed for Pie/Doughnut charts
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


const ChartComponent = ({ type, data, labels, title }) => {
  // --- Line Chart Data and Options (For Resolution Trend) ---
  const lineData = {
    labels: ['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 28'],
    datasets: [
      {
        label: 'AI Resolution Rate (%)',
        data: [82.5, 85.1, 88.0, 87.5, 88.5],
        borderColor: '#007bff', // Primary Blue
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        tension: 0.4, // Smooth curve
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Title is handled in the Dashboard component
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
        y: {
            min: 80,
            max: 100,
            ticks: {
                callback: function(value) {
                    return value + '%'; // Add percentage sign to Y-axis
                }
            }
        }
    }
  };

  // --- Doughnut Chart Data and Options (For Handoff Rate) ---
  const handoffData = {
    labels: labels || ['Bot Resolved', 'Human Handoff (Failure)', 'Human Handoff (Intentional)'],
    datasets: [
      {
        data: data || [88.5, 7.5, 4.0], // Use prop data if available
        backgroundColor: [
          '#28a745', // Green for success
          '#dc3545', // Red for failure
          '#ffc107', // Yellow/Orange for intentional handoff
        ],
        hoverBackgroundColor: [
          '#1f7a37',
          '#b52c39',
          '#d39e00',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handoffOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
            boxWidth: 15
        }
      },
      tooltip: {
        callbacks: {
            label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
            }
        }
    }
    },
  };


  // --- Render Logic ---
  const style = { height: '300px' };

  if (type === 'line') {
    return (
      <div style={style}>
        <Line data={lineData} options={lineOptions} />
      </div>
    );
  }

  if (type === 'pie' || type === 'doughnut') {
    // Note: The AnalyticsDashboard passes its data to this component
    // We use the local handoffData/Options for a clean default look.
    return (
      <div style={style}>
        <Doughnut data={handoffData} options={handoffOptions} />
      </div>
    );
  }

  // Default fallback
  return <p>No chart type specified for ChartComponent.</p>;
};

export default ChartComponent;