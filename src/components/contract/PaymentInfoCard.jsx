import React from 'react';
import { Card } from '../shared/Card';
import { DetailsField } from '../shared/DetailsField';

export function PaymentInfoCard({ fields }) {
  return (
    <Card className="payment-card" aria-label="Payment Information">
      <div className="section-header">
        <h2>Payment Information</h2>
      </div>
      
      <div className="section-content-wrapper">
        <div className="payment-grid">
          {/* Column 1 — Payment & Terms */}
          <div className="payment-column">
            <DetailsField
              id="payment_type"
              label="Payment Type"
              value={fields.payment_type}
              fieldType="select"
              editable={false}
              hasInfo={true}
              infoText="Determines the method by which the client will settle billing amounts. Synced from Salesforce."
              tooltipPosition="right"
              className="payment-row-item"
            />
            <DetailsField
              id="contracted_payment_terms"
              label="Contracted Payment Terms"
              value={fields.contracted_payment_terms}
              fieldType="number"
              editable={false}
              hasInfo={true}
              infoText="Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="contracted_invoice_fee"
              label="Contracted Invoice Fee"
              value={fields.contracted_invoice_fee === 'true' || fields.contracted_invoice_fee === true ? 'Yes' : 'No'}
              fieldType="text"
              editable={false}
              hasInfo={true}
              infoText="Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="other_payment_details"
              label="Other Payment Details"
              value={fields.other_payment_details}
              fieldType="text"
              editable={false}
              hasInfo={true}
              infoText="Specific notes regarding custom payment arrangements. Synced from Salesforce."
              tooltipPosition="right"
              className="payment-row-item"
            />
            <DetailsField
              id="inherit_options"
              label="Inherit Options"
              value={fields.inherit_options}
              fieldType="select"
              editable={false}
              hasInfo={true}
              infoText="Defines if payment conditions should be inherited from parent account. Synced from Salesforce."
              tooltipPosition="right"
              className="payment-row-item"
            />
          </div>

          {/* Column 2 — Invoicing Details */}
          <div className="payment-column">
            <DetailsField
              id="invoice_conditions"
              label="Invoice Conditions"
              value={fields.invoice_conditions}
              fieldType="select"
              editable={false}
              hasInfo={true}
              infoText="Under what conditions is the creation of invoices allowed. Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="invoice_frequency"
              label="Invoice Frequency"
              value={fields.invoice_frequency}
              fieldType="select"
              editable={false}
              hasInfo={true}
              infoText="Determines how often invoice cycles are generated automatically. Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="invoice_reference"
              label="Invoice Reference"
              value={fields.invoice_reference}
              fieldType="text"
              editable={false}
              hasInfo={true}
              infoText="Mandatory customer PO or reference number required on invoices. Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="to_be_invoiced"
              label="To be Invoiced"
              value={fields.to_be_invoiced}
              fieldType="select"
              editable={false}
              hasInfo={true}
              infoText="Determines which legal entity must receive the invoices. Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
            <DetailsField
              id="account_detail_to_invoice"
              label="Account Detail to Invoice"
              value={fields.account_detail_to_invoice}
              fieldType="link"
              linkUrl="#account-detail"
              editable={false}
              hasInfo={true}
              infoText="The specific account entity linked for billing. Synced from Salesforce."
              tooltipPosition="top"
              className="payment-row-item"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
