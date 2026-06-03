import { html, useState, useEffect } from '../lib.js';
import { CalendarPopover } from './CalendarPopover.js';

export function PaymentTermsModal({ 
  isOpen, 
  onClose, 
  state, 
  onSave 
}) {
  const [step, setStep] = useState(1);
  const [evaluationInProgress, setEvaluationInProgress] = useState(false);
  const [creditRating, setCreditRating] = useState(state.creditRating);
  const [creditRatingLastChecked, setCreditRatingLastChecked] = useState(state.creditRatingLastChecked);
  const [creditAcceptedRisk, setCreditAcceptedRisk] = useState(false);
  
  const [paymentTerms, setPaymentTerms] = useState(state.paymentTerms);
  const [estimatedDate, setEstimatedDate] = useState(state.estimatedInvoiceDate);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [paymentTermsError, setPaymentTermsError] = useState(false);
  const [estimatedDateError, setEstimatedDateError] = useState(false);

  // Sync state values when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEvaluationInProgress(false);
      setCreditRating(state.creditRating);
      setCreditRatingLastChecked(state.creditRatingLastChecked);
      setCreditAcceptedRisk(false);
      setPaymentTerms(state.paymentTerms);
      setEstimatedDate(state.estimatedInvoiceDate);
      setIsCalendarOpen(false);
      setPaymentTermsError(false);
      setEstimatedDateError(false);
    }
  }, [isOpen, state]);

  if (!isOpen) return null;

  const handleEvaluateCredit = () => {
    setEvaluationInProgress(true);
    setTimeout(() => {
      setCreditRating(state.nextCreditOutcome);
      setCreditRatingLastChecked('Today');
      setEvaluationInProgress(false);
    }, 1000);
  };

  const handleStep1Next = () => {
    setStep(2);
  };

  const handleConfirm = () => {
    let valid = true;
    if (!paymentTerms || paymentTerms === 'None' || paymentTerms === '') {
      setPaymentTermsError(true);
      valid = false;
    } else {
      setPaymentTermsError(false);
    }

    if (!estimatedDate || estimatedDate === '–' || estimatedDate === '') {
      setEstimatedDateError(true);
      valid = false;
    } else {
      setEstimatedDateError(false);
    }

    if (valid) {
      onSave({
        creditRating,
        creditRatingLastChecked,
        paymentTerms,
        estimatedInvoiceDate: estimatedDate
      });
      onClose();
    }
  };

  const isCentralAgreement = state.coveredByCentralAgreement === 'Yes';
  const allowedTerms = isCentralAgreement ? ['7', '14'] : ['7', '10', '14', '15', '20', '21', '30'];

  const isRatedToday = creditRatingLastChecked === 'Today';

  // Determine button state for Step 1
  let btnText = 'Evaluate Credit Rating';
  let btnDisabled = false;
  if (evaluationInProgress) {
    btnText = 'Evaluating Credit Rating...';
    btnDisabled = true;
  } else if (isRatedToday) {
    btnText = 'Next';
    if (creditRating !== 'Credit OK') {
      btnDisabled = !creditAcceptedRisk;
    }
  }

  return html`
    <div className="modal-overlay show" onClick=${onClose}>
      <div className="modal-card" onClick=${(e) => e.stopPropagation()}>
        <button className="modal-close-btn" aria-label="Close dialog" onClick=${onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        ${step === 1 ? html`
          <!-- Step 1: Credit rating check -->
          <div className="modal-step">
            <h2 className="modal-title">Change payment terms</h2>
            <div className="modal-subtitle">Strawberry Credit Rating</div>
            <p className="modal-body-text">Changing payment terms requires credit rating to be updated first.</p>
            
            <div className="modal-step-section">
              <div className="rating-row">
                <span className="rating-label">Current rating:</span>
                <span className="rating-value">${creditRating}</span>
              </div>
              <div className="rating-row">
                <span className="rating-label">Last rated:</span>
                <span className="rating-value">${creditRatingLastChecked}</span>
              </div>
            </div>

            <div id="modal-rating-outcomes-container">
              ${creditRating === 'Contact Credit Team' && isRatedToday && html`
                <div className="modal-info-box">
                  <div className="modal-info-text">Credit support has been notified and will update the rating shortly.</div>
                </div>
                <div className="modal-checkbox-group" onClick=${() => setCreditAcceptedRisk(!creditAcceptedRisk)}>
                  <input type="checkbox" checked=${creditAcceptedRisk} readOnly />
                  <label className="modal-checkbox-label">I accept the risk - Continue</label>
                </div>
              `}

              ${creditRating === 'Payment upfront' && isRatedToday && html`
                <div className="modal-alert-box">
                  <div className="modal-alert-text">Invoicing is not recommended. For questions, <a href="#" className="brand-link" style="color: var(--selection-accent);">contact credit team</a>.</div>
                </div>
                <div className="modal-checkbox-group" onClick=${() => setCreditAcceptedRisk(!creditAcceptedRisk)}>
                  <input type="checkbox" checked=${creditAcceptedRisk} readOnly />
                  <label className="modal-checkbox-label">I accept the risk - Continue</label>
                </div>
              `}
            </div>

            <div className="modal-footer" style="display: block;">
              <button 
                className="modal-btn modal-btn-primary" 
                disabled=${btnDisabled}
                onClick=${isRatedToday ? handleStep1Next : handleEvaluateCredit}
                style="width: 100%;"
              >
                ${btnText}
              </button>
            </div>
          </div>
        ` : html`
          <!-- Step 2: Selection -->
          <div className="modal-step">
            <h2 className="modal-title">Change payment terms</h2>
            <div className="modal-subtitle">Central agreement</div>
            <div className="modal-body-text">
              ${isCentralAgreement 
                ? html`The customer is covered by a central agreement which dictates what payment terms are available. <br/><span style="display:block; margin-top: 8px; font-weight: 500; color: var(--text-link);">For questions or requests for other payment terms, <a href="#" class="brand-link">contact Sales</a>.</span>`
                : 'No central agreement available. Selecting standalone payment terms.'
              }
            </div>

            <div className="modal-form-group">
              <label>Payment terms*</label>
              <select 
                className="modal-input-select ${paymentTermsError ? 'input-error' : ''}" 
                value=${paymentTerms === 'None' ? '' : paymentTerms}
                onChange=${(e) => {
                  setPaymentTerms(e.target.value);
                  setPaymentTermsError(false);
                }}
              >
                <option value="" disabled>Select payment terms</option>
                ${allowedTerms.map(t => html`
                  <option key=${t} value=${t}>${t} days</option>
                `)}
              </select>
              ${paymentTermsError && html`<div className="error-message" style="display: block;">Please select payment terms.</div>`}
            </div>

            <div className="modal-form-group" style="position: relative;">
              <label>Estimated invoice date*</label>
              <div style="position: relative; display: flex; align-items: center;">
                <input 
                  type="text" 
                  className="modal-input-date ${estimatedDateError ? 'input-error' : ''}" 
                  placeholder="Select date" 
                  readOnly 
                  value=${estimatedDate === '–' ? '' : estimatedDate}
                  onClick=${(e) => {
                    e.stopPropagation();
                    setIsCalendarOpen(!isCalendarOpen);
                  }}
                  style="cursor: pointer; padding-right: 36px;"
                />
                <svg className="calendar-input-icon" viewBox="0 0 24 24" style="position: absolute; right: 12px; width: 20px; height: 20px; fill: var(--text-secondary); pointer-events: none;">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
              </div>
              ${estimatedDateError && html`<div className="error-message" style="display: block;">Please select an estimated invoice date.</div>`}

              ${isCalendarOpen && html`
                <${CalendarPopover} 
                  selectedDate=${estimatedDate} 
                  onSelect=${(dateStr) => {
                    setEstimatedDate(dateStr);
                    setEstimatedDateError(false);
                    setIsCalendarOpen(false);
                  }} 
                />
              `}
            </div>

            <div className="modal-info-box">
              <div className="modal-info-text">
                Payment terms will be reverted to "None" 14 days after estimated invoice date. The date can be modified here later if needed.
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-secondary" onClick=${() => setStep(1)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick=${handleConfirm}>Confirm</button>
            </div>
          </div>
        `}
      </div>
    </div>
  `;
}
