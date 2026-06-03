import React, { useState, useEffect, useRef } from 'react';

export function CustomSelect({ 
  selectedLabel, 
  items, 
  onSelect, 
  className = '', 
  ...props 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`custom-select ${isOpen ? 'active' : ''} ${className}`} {...props}>
      <button 
        className="select-trigger" 
        aria-haspopup="listbox" 
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedLabel}</span>
        <svg className="caret-icon" viewBox="0 0 20 20" aria-hidden="true" style={{ width: '20px', height: '20px', fill: 'var(--text-secondary)' }}>
          <path d="M10 13.5L5.5 9H14.5L10 13.5Z"/>
        </svg>
      </button>
      <ul className="select-options" role="listbox">
        {items.map(item => {
          const isSelected = item === selectedLabel;
          return (
            <li 
              key={item} 
              role="option" 
              className={isSelected ? 'selected' : ''}
              aria-selected={isSelected ? 'true' : 'false'}
              onClick={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
