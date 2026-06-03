import { html } from '../lib.js';

export function SectionHeader({ title, id, className = '', children, ...props }) {
  return html`
    <h2 id=${id} className="section-title ${className}" ...${props}>
      ${title}
      ${children}
    </h2>
  `;
}
