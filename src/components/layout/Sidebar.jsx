import React from 'react';
import { Icon } from '../shared/Icon';
import { useNavigation } from '../../App';

export function Sidebar() {
  const { view, setView } = useNavigation();

  const handleCompaniesClick = (e) => {
    e.preventDefault();
    setView('company');
  };

  const handleDashboardClick = (e) => {
    e.preventDefault();
    setView('dashboard');
  };

  return (
    <nav className="sidebar" aria-label="Main Navigation">
      <div className="sidebar-top">
        <ul className="nav-links">
          <li>
            <a href="#" onClick={handleDashboardClick} className={`nav-link ${view === 'dashboard' ? 'active' : ''}`} title="Dashboard" aria-current={view === 'dashboard' ? 'page' : undefined}>
              <Icon name="dashboard" className="nav-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" title="My Hotel">
              <Icon name="myHotel" className="nav-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" title="Guest">
              <Icon name="guest" className="nav-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" title="Group">
              <Icon name="group" className="nav-icon" />
            </a>
          </li>
          <li>
            <a href="#" onClick={handleCompaniesClick} className={`nav-link ${view === 'company' || view === 'contract' ? 'active' : ''}`} title="Companies" aria-current={view === 'company' ? 'page' : undefined}>
              <Icon name="companies" className="nav-icon" />
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebar-bottom">
        <ul className="nav-links">
          <li>
            <a href="#" className="nav-link" title="Settings">
              <Icon name="settings" className="nav-icon" />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link" title="Support">
              <Icon name="support" className="nav-icon" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
