import { html } from '../lib.js';
import * as paths from '../icons/SvgIcons.js';

export function Icon({ name, className = '', ...props }) {
  const path = paths[name];
  if (!path) return null;
  
  // Set default viewbox based on icon name
  let viewBox = "0 0 24 24";
  if (name === 'chevronBack') viewBox = "0 0 6 10";
  else if (['caretDown', 'edit', 'info', 'search'].includes(name)) viewBox = "0 0 20 20";

  return html`
    <svg 
      className=${className} 
      viewBox=${viewBox} 
      fill="currentColor" 
      aria-hidden="true" 
      ...${props}
    >
      <path d=${path} />
    </svg>
  `;
}
