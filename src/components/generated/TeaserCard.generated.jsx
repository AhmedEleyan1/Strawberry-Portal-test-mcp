import React from 'react';

// Auto-generated from figma-plugin/screens/TeaserCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs TeaserCard

export function TeaserCard({ agreementType, duration, contractedBy, title }) {
  return (
    <div className="teaser-card">
      <a className="card teaser-card" href="#">
        <h3 className="teaser-title">{title}</h3>
        <div className="teaser-details-row">
          <div className="teaser-detail-field"><span className="teaser-detail-label">Agreement type</span><span className="teaser-detail-value">{agreementType}</span></div>
          <div className="teaser-detail-field"><span className="teaser-detail-label">Duration</span><span className="teaser-detail-value">{duration}</span></div>
          <div className="teaser-detail-field"><span className="teaser-detail-label">Contracted by</span><span className="teaser-detail-value">{contractedBy}</span></div>
        </div>
      </a>
    </div>
  );
}
