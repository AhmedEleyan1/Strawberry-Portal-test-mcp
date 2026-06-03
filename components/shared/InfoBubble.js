import { html } from '../lib.js';

export function InfoBubble({ text, className = '', ...props }) {
  if (!text) return null;
  return html`
    <span 
      className="info-bubble ${className}" 
      tabIndex="0" 
      aria-label=${text}
      ...${props}
    ></span>
  `;
}
