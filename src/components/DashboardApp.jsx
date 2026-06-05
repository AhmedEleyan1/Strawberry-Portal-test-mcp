import React, { useState } from 'react';
import { MainLayout } from './layout/MainLayout';
import { DashboardTopCard } from './dashboard/DashboardTopCard';
import { Icon } from './shared/Icon';

export function DashboardApp() {
  const [selectedHotel, setSelectedHotel] = useState('Strömstad Spa & Resort');
  const [currentDate] = useState(new Date(2024, 9, 18)); // October 18, 2024

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const formattedDate = `${dayNames[currentDate.getDay()]}, ${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}`;
  const calendarDate = `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]}, ${currentDate.getFullYear()}`;

  return (
    <MainLayout selectedHotel={selectedHotel} onHotelChange={setSelectedHotel}>
      <div className="dashboard-page">
        {/* Date header row */}
        <div className="dashboard-date-row">
          <h1 className="dashboard-date-title">{formattedDate}</h1>
          <div className="dashboard-date-controls">
            <button className="dashboard-nav-btn" aria-label="Previous day">
              <Icon name="caretDown" style={{ transform: 'rotate(90deg)' }} />
            </button>
            <button className="dashboard-date-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{calendarDate}</span>
            </button>
            <button className="dashboard-nav-btn" aria-label="Next day">
              <Icon name="caretDown" style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>

        {/* Top summary card */}
        <DashboardTopCard 
          arrivals={{ count: 22, total: 44, remaining: 22 }}
          departures={{ count: 44, total: 76, remaining: 32 }}
          stayovers={{ count: 192, label: 'Enjoying their stay' }}
          instayVisits={{ count: 38, total: 52, remaining: 14 }}
          extras={{
            earlyCheckIns: 22,
            lateCheckOuts: 13,
            noShowToProcess: 4
          }}
        />

        {/* Dashboard grid */}
        <div className="dashboard-grid">
          {/* Left column */}
          <div className="dashboard-grid-col">
            {/* Restaurant card */}
            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <span className="dashboard-card-icon">🍴</span>
                  <h2 className="dashboard-card-title">Restaurant</h2>
                </div>
                <a href="#" className="brand-link dashboard-card-link">
                  See all restaurant bookings →
                </a>
              </div>
              <div className="dashboard-card-body">
                <div className="dashboard-list-category">Breakfast</div>
                <div className="dashboard-list-item">
                  <div className="dashboard-list-item-main">
                    <span>👤 189 guests / 🏨 112 reservations</span>
                  </div>
                  <span className="dashboard-list-item-sub">🕐 08:00 - 10:00</span>
                </div>
                <div className="dashboard-list-category">Restaurant Aasgard</div>
                <div className="dashboard-list-item">
                  <div className="dashboard-list-item-main">
                    <span>👤 86 guests / 🏨 102 reservations</span>
                  </div>
                  <span className="dashboard-list-item-sub">🕐 Lunch</span>
                </div>
                <div className="dashboard-list-item">
                  <div className="dashboard-list-item-main">
                    <span>👤 109 guests / 🏨 124 reservations</span>
                  </div>
                  <span className="dashboard-list-item-sub">🕐 Dinner</span>
                </div>
              </div>
            </div>

            {/* Spa card */}
            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <span className="dashboard-card-icon">💆</span>
                  <h2 className="dashboard-card-title">Spa & Fitness</h2>
                </div>
                <a href="#" className="brand-link dashboard-card-link">
                  See all spa appointments →
                </a>
              </div>
              <div className="dashboard-card-body">
                <div className="dashboard-list-category">Appointment types</div>
                <div className="dashboard-list-item dashboard-list-item-expandable">
                  <div className="dashboard-list-item-main">
                    <div>
                      <div className="dashboard-list-item-title">Diamond Well Living Scrub</div>
                      <span className="dashboard-list-item-sub">👤 3 guests &nbsp; 📋 3 reservations</span>
                    </div>
                    <Icon name="caretDown" className="dashboard-list-chevron" />
                  </div>
                </div>
                <div className="dashboard-list-item dashboard-list-item-expandable">
                  <div className="dashboard-list-item-main">
                    <div>
                      <div className="dashboard-list-item-title">Spiritual Head & Scalp</div>
                      <span className="dashboard-list-item-sub">👤 1 guests &nbsp; 📋 1 reservations</span>
                    </div>
                    <Icon name="caretDown" className="dashboard-list-chevron" />
                  </div>
                </div>
                <div className="dashboard-list-item dashboard-list-item-expandable">
                  <div className="dashboard-list-item-main">
                    <div>
                      <div className="dashboard-list-item-title">Back & Neck Massage</div>
                      <span className="dashboard-list-item-sub">👤 4 guests &nbsp; 📋 2 reservations</span>
                    </div>
                    <Icon name="caretDown" className="dashboard-list-chevron" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="dashboard-grid-col">
            {/* Occupancy card */}
            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Occupancy</h2>
              </div>
              <div className="dashboard-card-body dashboard-occupancy">
                {[
                  { date: '18 Oct', occ: 24.5, out: 37.4 },
                  { date: '19 Oct', occ: 80.2, out: 0 },
                  { date: '20 Oct', occ: 37.4, out: 54.6 },
                  { date: '21 Oct', occ: 54.6, out: 13.2 },
                  { date: '22 Oct', occ: 13.2, out: 0 },
                  { date: '23 Oct', occ: 80.7, out: 0 },
                  { date: '24 Oct', occ: 72.6, out: 0 },
                ].map((day, i) => (
                  <div key={i} className="occupancy-bar-group">
                    <span className="occupancy-bar-label">{day.occ}%</span>
                    <div className="occupancy-bar-stack">
                      <div className="occupancy-bar occupancy-bar-main" style={{ height: `${day.occ * 0.8}px` }}></div>
                      {day.out > 0 && (
                        <div className="occupancy-bar occupancy-bar-out" style={{ height: `${day.out * 0.5}px` }}></div>
                      )}
                    </div>
                    <span className="occupancy-bar-date">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups card */}
            <div className="card dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title-group">
                  <span className="dashboard-card-icon">👥</span>
                  <h2 className="dashboard-card-title">Groups</h2>
                </div>
                <a href="#" className="brand-link dashboard-card-link">
                  See all groups →
                </a>
              </div>
              <div className="dashboard-card-body">
                {[
                  { name: 'Delegation', dates: '2 - 3 Aug 2024', guests: 50 },
                  { name: 'Oslo Kommune', dates: '1 - 5 Aug 2024', guests: 35 },
                  { name: 'Sommerro Hotell', dates: '2 - 6 Aug 2024', guests: 27 },
                ].map((group, i) => (
                  <div key={i} className="dashboard-list-item dashboard-list-item-expandable">
                    <div className="dashboard-list-item-main">
                      <div>
                        <div className="dashboard-list-item-title">{group.name}</div>
                        <span className="dashboard-list-item-sub">📅 {group.dates} &nbsp; 👤 {group.guests} guests</span>
                      </div>
                      <Icon name="caretDown" className="dashboard-list-chevron" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
