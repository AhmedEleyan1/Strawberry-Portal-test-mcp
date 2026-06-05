import React from 'react';
import { Icon } from './Icon';

export function InfoBubble({ text, position = 'top', className = '', ...props }) {
  if (!text) return null;
  return (
    <span 
      className={`info-bubble ${className}`} 
      tabIndex="0" 
      data-tooltip={text}
      data-tooltip-position={position}
      aria-label={text}
      {...props}
    >
      <Icon name="info" className="info-icon" />
      <span className="tooltip" role="tooltip">{text}</span>
    </span>
  );
}
