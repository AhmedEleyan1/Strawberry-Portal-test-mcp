import React, { useState, createContext, useContext } from 'react';
import { ContractApp } from './components/ContractApp';
import { CompanyApp } from './components/CompanyApp';

export const NavigationContext = createContext(null);

export function useNavigation() {
  return useContext(NavigationContext);
}

export function App() {
  const [view, setView] = useState('company'); // Default view is Company Profile

  return (
    <NavigationContext.Provider value={{ view, setView }}>
      {view === 'contract' ? <ContractApp /> : <CompanyApp />}
    </NavigationContext.Provider>
  );
}
