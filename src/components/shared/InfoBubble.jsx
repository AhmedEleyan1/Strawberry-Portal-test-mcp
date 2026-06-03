import React from 'react';

export function InfoBubble({ text, className = '', ...props }) {
  if (!text) return null;
  return (
    <span 
      className={`info-bubble ${className}`} 
      tabIndex="0" 
      aria-label={text}
      {...props}
    ></span>
  );
}
