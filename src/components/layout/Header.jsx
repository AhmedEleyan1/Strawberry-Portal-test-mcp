import React from 'react';
import { Dropdown } from '../shared/Dropdown';
import { Icon } from '../shared/Icon';

export function Header({ 
  selectedHotel = 'Clarion Hotel Sign', 
  onHotelChange, 
}) {
  const hotelOptions = [
    'Clarion Hotel Sign',
    'Clarion Hotel Post',
    'Strawberry Holding AS',
    'Quality Hotel 11'
  ];

  return (
    <header className="top-header">
      <div className="header-left">
        <Dropdown
          selectedLabel={selectedHotel}
          items={hotelOptions}
          onSelect={onHotelChange}
          logoSrc="/icons/logo.svg"
        />
      </div>
      <div className="header-right">
        <search className="header-search">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="search" placeholder="Search here" aria-label="Search portal" />
          </form>
        </search>
        
        <div className="header-separator"></div>
        
        <button className="icon-btn" aria-label="Notifications" id="notification-btn">
          <Icon name="notificationBell" />
          <span className="notification-badge"></span>
        </button>

        <button className="profile-btn" aria-label="User profile menu">
          <img src="/icons/avatar.png" alt="Profile Picture" className="profile-img" />
        </button>
      </div>
    </header>
  );
}
