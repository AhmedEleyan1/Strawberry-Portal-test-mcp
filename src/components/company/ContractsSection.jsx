import React from 'react';
import { SectionHeader } from '../shared/SectionHeader';
import { TeaserCard } from './TeaserCard';

export function ContractsSection({ contracts = [] }) {
  return (
    <section className="contracts-section" aria-labelledby="contracts-heading" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SectionHeader id="contracts-heading" title="Contracts" />
      {contracts.map(c => (
        <TeaserCard 
          key={c.id || c.title}
          href={c.href}
          title={c.title}
          agreementType={c.agreementType}
          duration={c.duration}
          contractedBy={c.contractedBy}
          status={c.status}
        />
      ))}
    </section>
  );
}
