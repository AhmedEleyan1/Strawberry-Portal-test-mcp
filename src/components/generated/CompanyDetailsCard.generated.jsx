import React from 'react';

// Auto-generated from figma-plugin/screens/CompanyDetailsCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs CompanyDetailsCard

export function CompanyDetailsCard({ data }) {
  return (
    <div className="company-details-card">
      <div className="card">
        <div className="card-grid">
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Name</span>
              <span className="field-value">{data}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Customer ID</span>
              <span className="field-value">{data}</span>
            </div>
            <div className="details-field">
              <span className="field-label">National Reg. No.</span>
              <span className="field-value">{data}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Invoicable</span>
              <span className="field-value">Yes</span>
            </div>
            <div className="details-field">
              <span className="field-label">Synced to operational systems</span>
              <span className="field-value">Yes</span>
            </div>
            <div className="details-field">
              <span className="field-label">Covered By Central Agreement</span>
              <span className="field-value">{data}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Credit rating</span>
              <span className="field-value">Status</span>
            </div>
            <div className="details-field">
              <span className="field-label">Credit rating last checked</span>
              <span className="field-value">{data}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Invoice Conditions</span>
              <span className="field-value">Continuous invoicing allowed</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Payment terms</span>
              <span className="field-value">{data}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Estimated invoice date</span>
              <span className="field-value">{data}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Main Contract Holder</span>
              <span className="field-value">Strawberry Holding AS</span>
            </div>
            <div className="details-field">
              <span className="field-label">Main Contract Number</span>
              <span className="field-value">00018589</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Electronic invoice address</span>
              <span className="field-value">965920358</span>
            </div>
            <div className="details-field">
              <span className="field-label">Invoice email address</span>
              <span className="field-value">kjetil.furset@choice.no</span>
            </div>
            <div className="details-field">
              <span className="field-label">Billing address</span>
              <span className="field-value">–</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Invoice fee</span>
              <span className="field-value">No</span>
            </div>
            <div className="details-field">
              <span className="field-label">VAT number</span>
              <span className="field-value">NO965920358MVA</span>
            </div>
            <div className="details-field">
              <span className="field-label">Department</span>
              <span className="field-value">–</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Visiting address</span>
              <span className="field-value">–</span>
            </div>
            <div className="details-field">
              <span className="field-label">Duns number</span>
              <span className="field-value">–</span>
            </div>
            <div className="details-field">
              <span className="field-label">Status (D&B)</span>
              <span className="field-value">Active</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Owner</span>
              <span className="field-value">Migration user</span>
            </div>
            <div className="details-field">
              <span className="field-label">Description</span>
              <span className="field-value">–</span>
            </div>
          </div>
        </div>
      </div>
      <details className="more-info-details">
        <summary>More info</summary>
        {/* content */}
      </details>
    </div>
  );
}
