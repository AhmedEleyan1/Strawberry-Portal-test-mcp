import React from 'react';

export function DashboardTopCard({ 
  arrivals = { count: 22, total: 44, remaining: 22 },
  departures = { count: 44, total: 76, remaining: 32 },
  stayovers = { count: 192, label: 'Enjoying their stay' },
  instayVisits = { count: 38, total: 52, remaining: 14 },
  extras = {
    earlyCheckIns: 22,
    lateCheckOuts: 13,
    noShowToProcess: 4
  }
}) {
  const arrivalProgress = arrivals.total > 0 ? ((arrivals.total - arrivals.remaining) / arrivals.total) * 100 : 0;
  const departureProgress = departures.total > 0 ? ((departures.total - departures.remaining) / departures.total) * 100 : 0;
  const instayProgress = instayVisits.total > 0 ? ((instayVisits.total - instayVisits.remaining) / instayVisits.total) * 100 : 0;

  return (
    <div className="dashboard-top-card card">
      {/* Main stats row */}
      <div className="top-card-stats-row">
        {/* Arrivals */}
        <div className="top-card-stat">
          <div className="top-card-stat-header">
            <div className="top-card-stat-info">
              <span className="top-card-stat-label">Arrivals</span>
              <span className="top-card-stat-count">{arrivals.count}</span>
            </div>
            <div className="top-card-stat-icon top-card-icon-arrival" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 16H3V18H11V21L15 17L11 13V16Z" fill="currentColor"/>
                <path d="M20 3H4C2.9 3 2 3.9 2 5V12H4V5H20V19H4V18H2V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div className="top-card-progress">
            <div className="top-card-progress-bar top-card-progress-arrival" style={{ width: `${arrivalProgress}%` }}></div>
          </div>
          <span className="top-card-remaining">{arrivals.remaining} of {arrivals.total} remaining</span>
        </div>

        <div className="top-card-divider-v" aria-hidden="true"></div>

        {/* Departures */}
        <div className="top-card-stat">
          <div className="top-card-stat-header">
            <div className="top-card-stat-info">
              <span className="top-card-stat-label">Departures</span>
              <span className="top-card-stat-count">{departures.count}</span>
            </div>
            <div className="top-card-stat-icon top-card-icon-departure" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 16H13V13L9 17L13 21V18H21V16Z" fill="currentColor"/>
                <path d="M20 3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H8V19H4V5H20V19H16V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div className="top-card-progress">
            <div className="top-card-progress-bar top-card-progress-departure" style={{ width: `${departureProgress}%` }}></div>
          </div>
          <span className="top-card-remaining">{departures.remaining} of {departures.total} remaining</span>
        </div>

        <div className="top-card-divider-v" aria-hidden="true"></div>

        {/* Stayovers */}
        <div className="top-card-stat">
          <div className="top-card-stat-header">
            <div className="top-card-stat-info">
              <span className="top-card-stat-label">Stayovers</span>
              <span className="top-card-stat-count">{stayovers.count}</span>
            </div>
            <div className="top-card-stat-icon top-card-icon-stayover" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 13C8.66 13 10 11.66 10 10C10 8.34 8.66 7 7 7C5.34 7 4 8.34 4 10C4 11.66 5.34 13 7 13ZM19 7H11V14H3V5H1V19H3V17H21V19H23V11C23 8.79 21.21 7 19 7Z" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <span className="top-card-remaining">{stayovers.label}</span>
        </div>

        <div className="top-card-divider-v" aria-hidden="true"></div>

        {/* In-stay Visits — NEW */}
        <div className="top-card-stat">
          <div className="top-card-stat-header">
            <div className="top-card-stat-info">
              <span className="top-card-stat-label">In-stay Visits</span>
              <span className="top-card-stat-count">{instayVisits.count}</span>
            </div>
            <div className="top-card-stat-icon top-card-icon-instay" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                <circle cx="18" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17 8H19M18 7V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="top-card-progress">
            <div className="top-card-progress-bar top-card-progress-instay" style={{ width: `${instayProgress}%` }}></div>
          </div>
          <span className="top-card-remaining">{instayVisits.remaining} of {instayVisits.total} remaining</span>
        </div>
      </div>

      {/* Divider */}
      <div className="top-card-divider-h" aria-hidden="true"></div>

      {/* Extras row */}
      <div className="top-card-extras-row">
        <div className="top-card-extras-left">
          <div className="top-card-extra-item">
            <span className="top-card-extra-label">Early check ins</span>
            <span className="top-card-extra-value">{extras.earlyCheckIns}</span>
          </div>
          <div className="top-card-extra-item">
            <span className="top-card-extra-label">Late check outs</span>
            <span className="top-card-extra-value">{extras.lateCheckOuts}</span>
          </div>
        </div>
        <div className="top-card-extra-item top-card-extra-noshow">
          <span className="top-card-extra-label">No Show to process</span>
          <span className="top-card-extra-badge">{extras.noShowToProcess}</span>
        </div>
      </div>
    </div>
  );
}
