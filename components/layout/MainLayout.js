import { html, Fragment } from '../lib.js';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';

export function MainLayout({ 
  children, 
  selectedHotel, 
  onHotelChange, 
  basePath = '.' 
}) {
  return html`
    <${Fragment}>
      <${Sidebar} basePath=${basePath} />
      <div className="main-layout">
        <${Header} 
          selectedHotel=${selectedHotel} 
          onHotelChange=${onHotelChange} 
          basePath=${basePath} 
        />
        <main className="content-container">
          ${children}
        </main>
      </div>
    </${Fragment}>
  `;
}
