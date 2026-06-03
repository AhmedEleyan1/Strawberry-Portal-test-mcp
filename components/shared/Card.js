import { html } from '../lib.js';

export function Card({ children, className = '', ...props }) {
  return html`
    <section className="card ${className}" ...${props}>
      ${children}
    </section>
  `;
}
