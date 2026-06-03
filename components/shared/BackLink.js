import { html } from '../lib.js';
import { Icon } from './Icon.js';

export function BackLink({ href, text, className = '', ...props }) {
  return html`
    <a href=${href} className="back-link ${className}" ...${props}>
      <${Icon} name="chevronBack" className="back-chevron" />
      ${text}
    </a>
  `;
}
