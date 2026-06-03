import { html } from '../lib.js';

export function StatusBadge({ status, className = '', style = {}, ...props }) {
  let statusStyle = {};
  
  if (status === 'Credit OK' || status === 'Active') {
    statusStyle = {
      backgroundColor: 'var(--status-green-bg)',
      color: 'var(--status-green-text)'
    };
  } else if (status === 'Contact Credit Team') {
    statusStyle = {
      backgroundColor: 'var(--credit-warning-bg)',
      color: 'var(--selection-accent)'
    };
  } else if (status === 'Payment upfront') {
    statusStyle = {
      backgroundColor: 'var(--credit-info-bg)',
      color: 'var(--text-link)'
    };
  } else {
    statusStyle = {
      backgroundColor: 'var(--border-medium)',
      color: 'var(--text-secondary)'
    };
  }

  const combinedStyle = { ...statusStyle, ...style };

  return html`
    <span 
      className="status-badge active-status ${className}" 
      style=${combinedStyle} 
      ...${props}
    >
      ${status}
    </span>
  `;
}
