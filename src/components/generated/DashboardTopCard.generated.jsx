import React from 'react';

// Auto-generated from figma-plugin/screens/DashboardTopCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs DashboardTopCard

export function DashboardTopCard({ value }) {
  return (
    <div className="dashboard-top-card">
      <div className="dashboard-top-card card">
        <div className="top-card-stats-row">
          <div className="top-card-stat">
            <span className="top-card-stat-label">Arrivals</span>
            <span className="top-card-stat-count">{value}</span>
          </div>
          <div className="top-card-stat">
            <span className="top-card-stat-label">Arrivals</span>
            <span className="top-card-stat-count">{value}</span>
          </div>
          <div className="top-card-stat">
            <span className="top-card-stat-label">Departures</span>
            <span className="top-card-stat-count">{value}</span>
          </div>
          <div className="top-card-stat">
            <span className="top-card-stat-label">Stayovers</span>
            <span className="top-card-stat-count">{value}</span>
          </div>
          <div className="top-card-stat">
            <span className="top-card-stat-label">In-stay Visits</span>
            <span className="top-card-stat-count">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
