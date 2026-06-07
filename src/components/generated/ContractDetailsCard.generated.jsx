import React from 'react';

// Auto-generated from figma-plugin/screens/ContractDetailsCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs ContractDetailsCard

export function ContractDetailsCard({ fields }) {
  return (
    <div className="contract-details-card">
      <div className="card">
        <div className="card-grid">
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Agreement type</span>
              <span className="field-value">{fields.agreement_type}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Contract type</span>
              <span className="field-value">{fields.contract_type}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Number</span>
              <span className="field-value">{fields.contract_number}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Duration</span>
              <span className="field-value">{fields.duration}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Cancellation policy</span>
              <span className="field-value">{fields.cancellation_policy}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Status</span>
              <span className="field-value">Status</span>
            </div>
            <div className="details-field">
              <span className="field-label">Loyalty points eligible</span>
              <span className="field-value">{fields.loyalty_eligible}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Loyalty points benefit eligible</span>
              <span className="field-value">{fields.loyalty_benefit_eligible}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Owner</span>
              <span className="field-value">{fields.owner}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Commission</span>
              <span className="field-value">{fields.commission}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Account contract owner</span>
              <span className="field-value">{fields.account_owner}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
