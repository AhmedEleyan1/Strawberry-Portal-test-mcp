import React from 'react';
import { StatusBadge } from '../shared/StatusBadge';
import { useNavigation } from '../../App';

export function TeaserCard({ 
  href = '../index.html', 
  title, 
  agreementType, 
  duration, 
  contractedBy, 
  status 
}) {
  const { setView } = useNavigation();

  const handleClick = (e) => {
    e.preventDefault();
    setView('contract');
  };

  return (
    <a href={href} onClick={handleClick} className="card teaser-card" aria-label={`Framework Contract ${title}`}>
      <div className="teaser-content">
        <div className="teaser-left">
          <div className="teaser-icon-container">
            <svg className="teaser-icon" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px', fill: 'currentColor' }}>
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <div>
            <h3 className="teaser-title">{title}</h3>
            <div className="teaser-details-row">
              <div className="teaser-detail-field">
                <span className="teaser-detail-label">Agreement type</span>
                <span className="teaser-detail-value">{agreementType}</span>
              </div>
              <div className="teaser-detail-field">
                <span className="teaser-detail-label">Duration</span>
                <span className="teaser-detail-value">{duration}</span>
              </div>
              <div className="teaser-detail-field">
                <span className="teaser-detail-label">Contracted by</span>
                <span className="teaser-detail-value">{contractedBy}</span>
              </div>
            </div>
          </div>
        </div>
        <StatusBadge status={status} style={{ alignSelf: 'center' }} />
      </div>
    </a>
  );
}
