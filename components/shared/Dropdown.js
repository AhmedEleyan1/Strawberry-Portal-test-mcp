import { html, useState, useEffect, useRef } from '../lib.js';

export function Dropdown({ 
  selectedLabel, 
  items, 
  onSelect, 
  logoSrc = '', 
  className = '', 
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return html`
    <div ref=${dropdownRef} className="hotel-selector ${className}" ...${props}>
      <button 
        className="dropdown-trigger" 
        aria-haspopup="listbox" 
        aria-expanded=${isOpen}
        onClick=${() => setIsOpen(!isOpen)}
      >
        ${logoSrc && html`<img src=${logoSrc} alt="Logo" className="header-logo" />`}
        <span className="hotel-name">${selectedLabel}</span>
        <svg className="chevron-icon" viewBox="0 0 20 20" aria-hidden="true" style="width:20px; height:20px; fill:var(--text-secondary);">
          <path d="M9.47501 12.475L5.85001 8.85C5.80001 8.8 5.76251 8.74583 5.73751 8.6875C5.71251 8.62917 5.70001 8.56667 5.70001 8.5C5.70001 8.36667 5.74585 8.25 5.83751 8.15C5.92918 8.05 6.05001 8 6.20001 8H13.8C13.95 8 14.0708 8.05 14.1625 8.15C14.2542 8.25 14.3 8.36667 14.3 8.5C14.3 8.53333 14.25 8.65 14.15 8.85L10.525 12.475C10.4417 12.5583 10.3583 12.6167 10.275 12.65C10.1917 12.6833 10.1 12.7 10 12.7C9.90001 12.7 9.80835 12.6833 9.72501 12.65C9.64168 12.6167 9.55835 12.5583 9.47501 12.475Z"/>
        </svg>
      </button>
      <ul className="dropdown-menu ${isOpen ? 'show' : ''}" role="listbox">
        ${items.map(item => {
          const isSelected = item === selectedLabel;
          return html`
            <li 
              key=${item} 
              role="option" 
              className=${isSelected ? 'selected' : ''}
              aria-selected=${isSelected ? 'true' : 'false'}
              onClick=${() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              ${item}
            </li>
          `;
        })}
      </ul>
    </div>
  `;
}
