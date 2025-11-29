// src/components/Admin/AnalyticsDashboard.jsx
import React from "react";
import KpiCard from "./KpiCard"; // You will create this small component
import ChartComponent from "./ChartComponent"; // Placeholder for charts
import "./AnalyticsDashboard.css"; // Styles for the dashboard

const AnalyticsDashboard = () => {
  // --- Placeholder Data (You would fetch this from an API in a real app) ---
  const kpiData = [
    {
      title: "AI Resolution Rate",
      value: "88.5%",
      subtext: "Queries resolved without human agent",
      trend: "+2.1%", // Example trend data
      color: "green",
    },
    {
      title: "Total Branches Monitored",
      value: "124",
      subtext: "Geographically dispersed banking units",
      trend: "+1 New last month",
      color: "blue",
    },
    {
      title: "Daily Chat Sessions",
      value: "450",
      subtext: "Average interactions per day",
      trend: "-5% vs previous week",
      color: "orange",
    },
    {
      title: "Knowledge Base Docs",
      value: "3,250",
      subtext: "PDFs, policies, and FAQs indexed",
      trend: "Last update 2 hours ago",
      color: "purple",
    },
  ];

  const chatIntentsData = {
    labels: ["Check Balance", "Loan Inquiry", "Transfer Funds", "Nearest ATM", "Other"],
    data: [35, 25, 20, 10, 10],
    title: "Top 5 User Intents (%)"
  };

  const handoffRateData = {
    labels: ["Bot Resolved", "Human Handoff (Failure)", "Human Handoff (Intentional)"],
    data: [88.5, 7.5, 4.0],
    title: "Resolution vs. Handoff Rate"
  };
  // --------------------------------------------------------------------------

  return (
    <div className="analytics-dashboard">
      <h3>Key Performance Indicators (KPIs)</h3>
      <div className="kpi-card-grid">
        {kpiData.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="chart-section">
        <div className="chart-item">
          <h3 className="chart-title">AI Resolution Trend (Last 30 Days)</h3>
          {/* In a real app, this would be a Recharts LineChart component */}
          <ChartComponent type="line" data={[]} /> 
          <p className="chart-note">Monitors the AI's ability to resolve customer issues without escalation.</p>
        </div>
        <div className="chart-item">
          <h3 className="chart-title">{handoffRateData.title}</h3>
          {/* In a real app, this would be a Recharts PieChart component */}
          <ChartComponent type="pie" data={handoffRateData.data} labels={handoffRateData.labels} />
          <p className="chart-note">The breakdown of conversation outcomes.</p>
        </div>
      </div>
      
      <div className="data-table-section">
        <h3>🚨 Conversations Requiring Review (Failed NLU)</h3>
        {/* You'd replace this with a proper table component */}
        <table className="review-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Customer ID</th>
              <th>Initial Query</th>
              <th>Failure Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-11-28 10:30</td>
              <td>USR10045</td>
              <td>I need to know how my mortgage rate is calculated</td>
              <td>Low Confidence Score</td>
            </tr>
             <tr>
              <td>2025-11-28 09:15</td>
              <td>USR08912</td>
              <td>Speak to human now!</td>
              <td>Unrecognized Intent / Escalation</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;