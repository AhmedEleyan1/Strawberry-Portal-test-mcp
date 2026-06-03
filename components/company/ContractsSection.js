import { html } from '../lib.js';
import { SectionHeader } from '../shared/SectionHeader.js';
import { TeaserCard } from './TeaserCard.js';

export function ContractsSection({ contracts = [] }) {
  return html`
    <section className="contracts-section" aria-labelledby="contracts-heading" style="display: flex; flex-direction: column; gap: 16px;">
      <${SectionHeader} id="contracts-heading" title="Contracts" />
      ${contracts.map(c => html`
        <${TeaserCard} 
          key=${c.id || c.title}
          href=${c.href}
          title=${c.title}
          agreementType=${c.agreementType}
          duration=${c.duration}
          contractedBy=${c.contractedBy}
          status=${c.status}
        />
      `)}
    </section>
  `;
}
