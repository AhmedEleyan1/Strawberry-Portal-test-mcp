import { html } from '../lib.js';
import { Card } from '../shared/Card.js';
import { StatusBadge } from '../shared/StatusBadge.js';
import { Icon } from '../shared/Icon.js';

export function CompanyDetailsCard({ 
  state, 
  onUpdateCreditClick, 
  onChangePaymentTermsClick 
}) {
  return html`
    <${Card} className="details-card" aria-label="Company Details">
      <div className="card-grid">
        <!-- Column 1 -->
        <div className="grid-column">
          <div className="details-field no-direct-edit" data-field-id="company_name">
            <span className="field-label">Name</span>
            <div className="field-value-container">
              <span className="field-value" style="font-weight: 500;">${state.companyName}</span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="customer_id">
            <span className="field-label">Customer ID</span>
            <div className="field-value-container">
              <span className="field-value">${state.customerId || '70194837'}</span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="national_reg_no">
            <span className="field-label">National Reg. No.</span>
            <div className="field-value-container">
              <span className="field-value">${state.nationalRegNo || '996340333'}</span>
            </div>
          </div>
        </div>

        <!-- Column 2 -->
        <div className="grid-column">
          <div className="details-field no-direct-edit" data-field-id="invoicable">
            <span className="field-label">Invoicable</span>
            <div className="field-value-container">
              <span className="field-value">Yes</span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="synced_operational_systems">
            <span className="field-label">Synced to operational systems</span>
            <div className="field-value-container">
              <span className="field-value">Yes</span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="covered_by_central_agreement">
            <span className="field-label">Covered By Central Agreement</span>
            <div className="field-value-container">
              <span className="field-value" id="display-central-agreement">${state.coveredByCentralAgreement}</span>
            </div>
          </div>
        </div>

        <!-- Column 3 -->
        <div className="grid-column">
          <div className="details-field no-direct-edit" data-field-id="credit_rating">
            <span className="field-label">Credit rating</span>
            <div className="field-value-container" style="justify-content: flex-start;">
              <${StatusBadge} status=${state.creditRating} id="display-credit-rating-badge" />
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="credit_rating_last_checked">
            <span className="field-label">Credit rating last checked</span>
            <div className="field-value-container" style="justify-content: flex-start; gap: 12px;">
              <span className="field-value" id="display-credit-rating-date">${state.creditRatingLastChecked}</span>
              <button 
                className="brand-link-btn" 
                onClick=${onUpdateCreditClick}
                style="background: none; border: none; font-family: var(--font-family-body); font-size: 14px; color: var(--text-link); text-decoration: underline; cursor: pointer; padding: 0;"
              >
                Update
              </button>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="invoice_conditions">
            <span className="field-label">Invoice Conditions</span>
            <div className="field-value-container">
              <span className="field-value">Continuous invoicing allowed</span>
            </div>
          </div>
        </div>

        <!-- Column 4 -->
        <div className="grid-column">
          <div className="details-field no-direct-edit" data-field-id="company_payment_terms">
            <span className="field-label">Payment terms</span>
            <div className="field-value-container" style="justify-content: flex-start; gap: 12px;">
              <span className="field-value" id="display-payment-terms" style="font-weight: 600;">
                ${state.paymentTerms === 'None' ? 'None' : state.paymentTerms}
              </span>
              <button 
                className="brand-link-btn" 
                onClick=${onChangePaymentTermsClick}
                style="background: none; border: none; font-family: var(--font-family-body); font-size: 14px; color: var(--text-link); text-decoration: underline; cursor: pointer; padding: 0;"
              >
                Change payment terms
              </button>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="estimated_invoice_date">
            <span className="field-label">Estimated invoice date</span>
            <div className="field-value-container" style="justify-content: flex-start;">
              <span className="field-value" id="display-estimated-invoice-date">${state.estimatedInvoiceDate}</span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="main_contract_holder">
            <span className="field-label">Main Contract Holder</span>
            <div className="field-value-container" style="justify-content: flex-start;">
              <span className="field-value"><a href="../index.html" className="brand-link">Strawberry Holding AS</a></span>
            </div>
          </div>
          <div className="details-field no-direct-edit" data-field-id="main_contract_number">
            <span className="field-label">Main Contract Number</span>
            <div className="field-value-container">
              <span className="field-value">00018589</span>
            </div>
          </div>
        </div>
      </div>

      <!-- More Info Collapsible Section -->
      <details className="more-info-details">
        <summary className="more-info-summary">
          <span className="more-info-text">More info</span>
          <${Icon} name="caretDown" className="more-info-chevron" />
        </summary>
        <div className="card-divider" style="margin-top: 0;"></div>
        <div className="card-grid">
          <div className="grid-column">
            <div className="details-field no-direct-edit" data-field-id="electronic_invoice_address">
              <span className="field-label">Electronic invoice address</span>
              <div className="field-value-container">
                <span className="field-value">965920358</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="invoice_email">
              <span className="field-label">Invoice email address</span>
              <div className="field-value-container">
                <span className="field-value">kjetil.furset@choice.no</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="billing_address">
              <span className="field-label">Billing address</span>
              <div className="field-value-container">
                <span className="field-value" dangerouslySetInnerHTML=${{ __html: 'Postboks 2454 Solli<br>0201, Oslo, Norway' }} />
              </div>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field no-direct-edit" data-field-id="invoice_fee">
              <span className="field-label">Invoice fee</span>
              <div className="field-value-container">
                <span className="field-value">No</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="vat_number">
              <span className="field-label">VAT number</span>
              <div className="field-value-container">
                <span className="field-value">NO965920358MVA</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="department">
              <span className="field-label">Department</span>
              <div className="field-value-container">
                <span className="field-value">–</span>
              </div>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field no-direct-edit" data-field-id="visiting_address">
              <span className="field-label">Visiting address</span>
              <div className="field-value-container">
                <span className="field-value" dangerouslySetInnerHTML=${{ __html: 'Frederik Stangs gate 22<br>264, Oslo, Norway' }} />
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="duns_number">
              <span className="field-label">Duns number</span>
              <div className="field-value-container">
                <span className="field-value">–</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="status_dnb">
              <span className="field-label">Status (D&B)</span>
              <div className="field-value-container">
                <span className="field-value">Active</span>
              </div>
            </div>
          </div>
          <div className="grid-column">
            <div className="details-field no-direct-edit" data-field-id="owner">
              <span className="field-label">Owner</span>
              <div className="field-value-container">
                <span className="field-value">Migration user</span>
              </div>
            </div>
            <div className="details-field no-direct-edit" data-field-id="description">
              <span className="field-label">Description</span>
              <div className="field-value-container">
                <span className="field-value">–</span>
              </div>
            </div>
          </div>
        </div>
      </details>
    </${Card}>
  `;
}
