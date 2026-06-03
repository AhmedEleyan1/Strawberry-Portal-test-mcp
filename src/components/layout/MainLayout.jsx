import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout({ 
  children, 
  selectedHotel, 
  onHotelChange, 
}) {
  return (
    <React.Fragment>
      <Sidebar />
      <div className="main-layout">
        <Header 
          selectedHotel={selectedHotel} 
          onHotelChange={onHotelChange} 
        />
        <main className="content-container">
          {children}
        </main>
      </div>
    </React.Fragment>
  );
}
