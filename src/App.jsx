import React, { useState, createContext, useContext } from 'react';
import { ContractApp } from './components/ContractApp';
import { CompanyApp } from './components/CompanyApp';
import { DashboardApp } from './components/DashboardApp';
import { GuestApp } from './components/GuestApp';

export const NavigationContext = createContext(null);

export function useNavigation() {
  return useContext(NavigationContext);
}

export function App() {
  const [view, setView] = useState('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardApp />;
      case 'contract': return <ContractApp />;
      case 'company': return <CompanyApp />;
      case 'guest': return <GuestApp />;
      default: return <DashboardApp />;
    }
  };

  return (
    <NavigationContext.Provider value={{ view, setView }}>
      {renderView()}
    </NavigationContext.Provider>
  );
}
