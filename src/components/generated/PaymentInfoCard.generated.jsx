import React from 'react';

// Auto-generated from figma-plugin/screens/PaymentInfoCard.json
// Edit the JSON and re-run: node scripts/scaffold-component.cjs PaymentInfoCard

export function PaymentInfoCard({ fields }) {
  return (
    <div className="payment-info-card">
      <h2 className="section-header">Payment Information</h2>
      <div className="card">
        <div className="card-grid">
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Payment Type</span>
              <span className="field-value">{fields.payment_type}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Contracted Payment Terms</span>
              <span className="field-value">{fields.contracted_payment_terms}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Contracted Invoice Fee</span>
              <span className="field-value">Yes</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Invoice Conditions</span>
              <span className="field-value">{fields.invoice_conditions}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Invoice Frequency</span>
              <span className="field-value">{fields.invoice_frequency}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Invoice Reference</span>
              <span className="field-value">{fields.invoice_reference}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">To be Invoiced</span>
              <span className="field-value">{fields.to_be_invoiced}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Account Detail to Invoice</span>
              <span className="field-value">{fields.account_detail_to_invoice}</span>
            </div>
            <div className="details-field">
              <span className="field-label">Other Payment Details</span>
              <span className="field-value">{fields.other_payment_details}</span>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field">
              <span className="field-label">Inherit Options</span>
              <span className="field-value">{fields.inherit_options}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
