console.log("Strawberry Portal script loaded successfully!");

function startApp() {
  // Page State
  const state = {
    companyName: 'Hotelldrift Quadrum AS',
    coveredByCentralAgreement: 'Yes', // 'Yes' or 'No'
    creditRating: 'Credit OK', // 'Credit OK', 'Contact Credit Team', 'Payment upfront', 'None'
    creditRatingLastChecked: '10.04.2026',
    paymentTerms: '30',
    estimatedInvoiceDate: '–',
    nextCreditOutcome: 'Credit OK',
    evaluationInProgress: false,
    creditAcceptedRisk: false
  };

  // DOM Elements
  const els = {
    // Details Card displays
    displayCentralAgreement: document.getElementById('display-central-agreement'),
    displayCreditRatingBadge: document.getElementById('display-credit-rating-badge'),
    displayCreditRatingDate: document.getElementById('display-credit-rating-date'),
    displayPaymentTerms: document.getElementById('display-payment-terms'),
    displayEstimatedInvoiceDate: document.getElementById('display-estimated-invoice-date'),
    
    // Modal Overlay and general controls
    modalOverlay: document.getElementById('payment-modal-overlay'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    changePaymentTermsBtn: document.getElementById('change-payment-terms-btn'),
    updateCreditRatingBtn: document.getElementById('update-credit-rating-btn'),
    
    // Modal Steps
    modalStep1: document.getElementById('modal-step-1'),
    modalStep2: document.getElementById('modal-step-2'),
    
    // Step 1 Credit Check
    modalCurrentRating: document.getElementById('modal-current-rating'),
    modalLastRated: document.getElementById('modal-last-rated'),
    modalRatingOutcomesContainer: document.getElementById('modal-rating-outcomes-container'),
    btnPrimaryAction: document.getElementById('btn-primary-action'),
    
    // Step 2 Selection
    modalAgreementDescription: document.getElementById('modal-agreement-description'),
    inputPaymentTerms: document.getElementById('input-payment-terms'),
    inputEstimatedDate: document.getElementById('input-estimated-date'),
    btnPrevStep: document.getElementById('btn-prev-step'),
    btnConfirmSave: document.getElementById('btn-confirm-save'),
    
    // Custom Calendar Selectors
    calendarPopover: document.getElementById('calendar-popover'),
    calendarMonthYear: document.getElementById('calendar-month-year'),
    calendarDaysGrid: document.getElementById('calendar-days-grid'),
    calendarPrevMonth: document.getElementById('calendar-prev-month'),
    calendarNextMonth: document.getElementById('calendar-next-month'),
    
    // Error elements
    paymentTermsError: document.getElementById('payment-terms-error'),
    estimatedDateError: document.getElementById('estimated-date-error'),
    
    // Demo/Testing Panel
    demoPanel: document.getElementById('demo-panel'),
    demoPanelHeader: document.getElementById('demo-panel-header'),
    demoPanelToggleIcon: document.getElementById('demo-panel-toggle-icon'),
    toggleAgreement: document.getElementById('toggle-agreement'),
    selectCreditOutcome: document.getElementById('select-credit-outcome'),
    demoBtnInvoice: document.getElementById('demo-btn-invoice'),
    demoBtnResetTimeout: document.getElementById('demo-btn-reset-timeout')
  };

  // Initialize UI values
  updateMainPageUI();
  setupHotelDropdown();

  // --- Modal Open/Close Event Handlers ---
  function openModal() {
    state.creditAcceptedRisk = false;
    // Step 1 initialize
    els.modalCurrentRating.textContent = state.creditRating;
    els.modalLastRated.textContent = state.creditRatingLastChecked;
    
    // Clear outcomes if not rated today
    if (state.creditRatingLastChecked !== 'Today') {
      els.modalRatingOutcomesContainer.innerHTML = '';
    } else {
      // Re-render outcomes if already rated today
      renderRatingOutcomes(state.creditRating);
    }
    
    updateStep1Button();
    
    // Show Step 1, Hide Step 2
    els.modalStep1.style.display = 'block';
    els.modalStep2.style.display = 'none';
    
    els.modalOverlay.classList.add('show');
  }

  function closeModal() {
    els.modalOverlay.classList.remove('show');
    closeCalendar();
  }

  els.changePaymentTermsBtn.addEventListener('click', openModal);
  els.updateCreditRatingBtn.addEventListener('click', openModal);
  els.modalCloseBtn.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', (e) => {
    if (e.target === els.modalOverlay) closeModal();
  });

  // --- Step 1 Helper Rendering & Button State Logic ---
  function renderRatingOutcomes(rating) {
    els.modalRatingOutcomesContainer.innerHTML = '';
    
    if (rating === 'Credit OK') {
      // Nothing extra needed
    } else if (rating === 'Contact Credit Team') {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'modal-info-box';
      alertDiv.innerHTML = `<div class="modal-info-text">Credit support has been notified and will update the rating shortly.</div>`;
      els.modalRatingOutcomesContainer.appendChild(alertDiv);
      
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'modal-checkbox-group';
      checkboxDiv.innerHTML = `
        <input type="checkbox" id="chk-accept-risk"${state.creditAcceptedRisk ? ' checked' : ''}>
        <label class="modal-checkbox-label" for="chk-accept-risk">I accept the risk - Continue</label>
      `;
      els.modalRatingOutcomesContainer.appendChild(checkboxDiv);
      
      const chk = document.getElementById('chk-accept-risk');
      chk.addEventListener('change', () => {
        state.creditAcceptedRisk = chk.checked;
        updateStep1Button();
      });
    } else if (rating === 'Payment upfront') {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'modal-alert-box';
      alertDiv.innerHTML = `<div class="modal-alert-text">Invoicing is not recommended. For questions, <a href="#" class="brand-link" style="color: var(--selection-accent);">contact credit team</a>.</div>`;
      els.modalRatingOutcomesContainer.appendChild(alertDiv);
      
      const checkboxDiv = document.createElement('div');
      checkboxDiv.className = 'modal-checkbox-group';
      checkboxDiv.innerHTML = `
        <input type="checkbox" id="chk-accept-risk"${state.creditAcceptedRisk ? ' checked' : ''}>
        <label class="modal-checkbox-label" for="chk-accept-risk">I accept the risk - Continue</label>
      `;
      els.modalRatingOutcomesContainer.appendChild(checkboxDiv);
      
      const chk = document.getElementById('chk-accept-risk');
      chk.addEventListener('change', () => {
        state.creditAcceptedRisk = chk.checked;
        updateStep1Button();
      });
    }
  }

  function updateStep1Button() {
    if (state.creditRating !== 'None' && state.creditRatingLastChecked === 'Today') {
      els.btnPrimaryAction.textContent = 'Next';
      if (state.creditRating === 'Credit OK') {
        els.btnPrimaryAction.disabled = false;
      } else {
        els.btnPrimaryAction.disabled = !state.creditAcceptedRisk;
      }
    } else {
      els.btnPrimaryAction.textContent = 'Evaluate Credit Rating';
      els.btnPrimaryAction.disabled = false;
    }
  }

  // --- Step 1 Action (Evaluate -> Next) ---
  els.btnPrimaryAction.addEventListener('click', () => {
    if (state.evaluationInProgress) return;
    
    if (els.btnPrimaryAction.textContent === 'Evaluate Credit Rating') {
      state.evaluationInProgress = true;
      els.btnPrimaryAction.disabled = true;
      els.btnPrimaryAction.textContent = 'Evaluating Credit Rating...';
      
      const selectedOutcome = els.selectCreditOutcome.value;
      
      setTimeout(() => {
        state.creditRating = selectedOutcome;
        state.creditRatingLastChecked = 'Today';
        
        els.modalCurrentRating.textContent = state.creditRating;
        els.modalLastRated.textContent = state.creditRatingLastChecked;
        
        state.evaluationInProgress = false;
        
        // Update badge in main UI
        updateCreditBadge(state.creditRating);
        els.displayCreditRatingDate.textContent = state.creditRatingLastChecked;
        
        // Render outcomes & update button
        renderRatingOutcomes(state.creditRating);
        updateStep1Button();
      }, 1000);
    } else {
      // Button text is 'Next'
      setupStep2UI();
      els.modalStep1.style.display = 'none';
      els.modalStep2.style.display = 'block';
    }
  });

  // --- Step 2: Terms and Estimated Date selection ---
  let calendarCurrentDate = new Date();
  let selectedDateObj = null;

  function setupStep2UI() {
    clearErrors();

    // Set description text based on agreement state
    const isCentralAgreement = (state.coveredByCentralAgreement === 'Yes');
    if (isCentralAgreement) {
      els.modalAgreementDescription.innerHTML = 'The customer is covered by a central agreement which dictates what payment terms are available. <br><span style="display:block; margin-top: 8px; font-weight: 500; color: var(--text-link);">For questions or requests for other payment terms, <a href="#" class="brand-link">contact Sales</a>.</span>';
    } else {
      els.modalAgreementDescription.textContent = 'No central agreement available. Selecting standalone payment terms.';
    }

    // Populate payment terms dropdown
    els.inputPaymentTerms.innerHTML = '';
    
    const placeholderOpt = document.createElement('option');
    placeholderOpt.value = '';
    placeholderOpt.textContent = 'Select payment terms';
    placeholderOpt.disabled = true;
    placeholderOpt.selected = true;
    els.inputPaymentTerms.appendChild(placeholderOpt);

    const allowedTerms = isCentralAgreement ? ['7', '14'] : ['7', '10', '14', '15', '20', '21', '30'];
    allowedTerms.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t;
      opt.textContent = t + ' days';
      els.inputPaymentTerms.appendChild(opt);
    });

    // Pre-select if in list
    if (allowedTerms.includes(state.paymentTerms)) {
      els.inputPaymentTerms.value = state.paymentTerms;
    } else {
      els.inputPaymentTerms.value = '';
    }

    // Set Estimated Date input value from state
    if (state.estimatedInvoiceDate && state.estimatedInvoiceDate !== '–') {
      els.inputEstimatedDate.value = state.estimatedInvoiceDate;
    } else {
      els.inputEstimatedDate.value = '';
    }

    initCalendar();
  }

  // --- Custom Design System Calendar Logic ---
  function initCalendar() {
    if (state.estimatedInvoiceDate && state.estimatedInvoiceDate !== '–') {
      const parts = state.estimatedInvoiceDate.split('.');
      if (parts.length === 3) {
        selectedDateObj = new Date(parts[2], parts[1] - 1, parts[0]);
        calendarCurrentDate = new Date(selectedDateObj);
      }
    } else {
      selectedDateObj = null;
      calendarCurrentDate = new Date();
    }
    renderCalendar();
  }

  function renderCalendar() {
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    els.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

    els.calendarDaysGrid.innerHTML = '';

    // First day of month index (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // We want Monday as index 0, so convert Sunday (0) to 6 and subtract 1 from other values:
    const firstDayIndexRaw = new Date(year, month, 1).getDay();
    const firstDayIndex = firstDayIndexRaw === 0 ? 6 : firstDayIndexRaw - 1;

    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    // Render 42 grid cells
    for (let i = 0; i < 42; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';

      if (i < firstDayIndex) {
        cell.classList.add('empty');
        cell.textContent = prevMonthTotalDays - firstDayIndex + i + 1;
      } else if (i >= firstDayIndex + totalDays) {
        cell.classList.add('empty');
        cell.textContent = i - (firstDayIndex + totalDays) + 1;
      } else {
        const dayNumber = i - firstDayIndex + 1;
        cell.textContent = dayNumber;

        const cellDate = new Date(year, month, dayNumber);
        
        // Select check
        if (selectedDateObj &&
            cellDate.getFullYear() === selectedDateObj.getFullYear() &&
            cellDate.getMonth() === selectedDateObj.getMonth() &&
            cellDate.getDate() === selectedDateObj.getDate()) {
          cell.classList.add('selected');
        }

        // Today check
        const today = new Date();
        if (cellDate.getFullYear() === today.getFullYear() &&
            cellDate.getMonth() === today.getMonth() &&
            cellDate.getDate() === today.getDate()) {
          cell.classList.add('today');
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedDateObj = cellDate;
          const dd = String(dayNumber).padStart(2, '0');
          const mm = String(month + 1).padStart(2, '0');
          const yyyy = year;
          
          els.inputEstimatedDate.value = `${dd}.${mm}.${yyyy}`;
          clearDateError();
          
          renderCalendar();
          closeCalendar();
        });
      }
      els.calendarDaysGrid.appendChild(cell);
    }
  }

  els.calendarPrevMonth.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
    renderCalendar();
  });

  els.calendarNextMonth.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
    renderCalendar();
  });

  els.inputEstimatedDate.addEventListener('click', (e) => {
    e.stopPropagation();
    initCalendar();
    els.calendarPopover.style.display = 'block';
  });

  function closeCalendar() {
    if (els.calendarPopover) els.calendarPopover.style.display = 'none';
  }

  document.addEventListener('click', (e) => {
    if (els.calendarPopover && !els.calendarPopover.contains(e.target) && e.target !== els.inputEstimatedDate) {
      closeCalendar();
    }
  });

  // --- Validation and Error Helpers ---
  function validateStep2() {
    let isValid = true;

    if (!els.inputPaymentTerms.value) {
      els.inputPaymentTerms.classList.add('input-error');
      els.paymentTermsError.style.display = 'block';
      isValid = false;
    } else {
      els.inputPaymentTerms.classList.remove('input-error');
      els.paymentTermsError.style.display = 'none';
    }

    if (!els.inputEstimatedDate.value) {
      els.inputEstimatedDate.classList.add('input-error');
      els.estimatedDateError.style.display = 'block';
      isValid = false;
    } else {
      els.inputEstimatedDate.classList.remove('input-error');
      els.estimatedDateError.style.display = 'none';
    }

    return isValid;
  }

  function clearErrors() {
    els.inputPaymentTerms.classList.remove('input-error');
    els.paymentTermsError.style.display = 'none';
    els.inputEstimatedDate.classList.remove('input-error');
    els.estimatedDateError.style.display = 'none';
  }

  function clearPaymentTermsError() {
    els.inputPaymentTerms.classList.remove('input-error');
    els.paymentTermsError.style.display = 'none';
  }

  function clearDateError() {
    els.inputEstimatedDate.classList.remove('input-error');
    els.estimatedDateError.style.display = 'none';
  }

  els.inputPaymentTerms.addEventListener('change', clearPaymentTermsError);

  els.btnPrevStep.addEventListener('click', () => {
    els.modalStep2.style.display = 'none';
    els.modalStep1.style.display = 'block';
  });

  // Confirm Save changes
  els.btnConfirmSave.addEventListener('click', () => {
    if (!validateStep2()) return;

    const selectedTerms = els.inputPaymentTerms.value;
    const formattedDate = els.inputEstimatedDate.value;
    
    state.paymentTerms = selectedTerms;
    state.estimatedInvoiceDate = formattedDate || '–';
    
    updateMainPageUI();
    closeModal();
  });

  // --- Helper Functions to Sync UI and State ---
  function updateMainPageUI() {
    els.displayCentralAgreement.textContent = state.coveredByCentralAgreement;
    els.displayPaymentTerms.textContent = state.paymentTerms;
    els.displayEstimatedInvoiceDate.textContent = state.estimatedInvoiceDate;
    els.displayCreditRatingDate.textContent = state.creditRatingLastChecked;
    
    updateCreditBadge(state.creditRating);
  }

  function updateCreditBadge(rating) {
    els.displayCreditRatingBadge.textContent = rating;
    
    // Dynamic styling classes
    els.displayCreditRatingBadge.style.backgroundColor = '';
    els.displayCreditRatingBadge.style.color = '';
    els.displayCreditRatingBadge.style.border = '';
    
    if (rating === 'Credit OK') {
      els.displayCreditRatingBadge.style.backgroundColor = 'var(--status-green-bg)';
      els.displayCreditRatingBadge.style.color = 'var(--status-green-text)';
    } else if (rating === 'Contact Credit Team') {
      els.displayCreditRatingBadge.style.backgroundColor = 'rgba(252, 94, 88, 0.15)';
      els.displayCreditRatingBadge.style.color = 'var(--selection-accent)';
    } else if (rating === 'Payment upfront') {
      els.displayCreditRatingBadge.style.backgroundColor = 'rgba(90, 0, 50, 0.1)';
      els.displayCreditRatingBadge.style.color = 'var(--text-link)';
    } else {
      els.displayCreditRatingBadge.style.backgroundColor = 'var(--border-medium)';
      els.displayCreditRatingBadge.style.color = 'var(--text-secondary)';
    }
  }

  // --- Demo & Testing Panel Interactions ---
  // Expand/Collapse panel
  els.demoPanelHeader.addEventListener('click', () => {
    els.demoPanel.classList.toggle('collapsed');
    els.demoPanelToggleIcon.textContent = els.demoPanel.classList.contains('collapsed') ? '▲' : '▼';
  });

  // Toggle Covered by Central Agreement from Demo Panel
  els.toggleAgreement.addEventListener('change', (e) => {
    state.coveredByCentralAgreement = e.target.value;
    updateMainPageUI();
  });

  // Process One-Time Invoice logic
  // Requirement 5: "reset payment terms and credit ratings to 'None' after a one-time invoice is processed"
  els.demoBtnInvoice.addEventListener('click', () => {
    alert("Invoice Processed successfully!\n\nSystem Event Triggered: Automatic reset of temporary Payment Terms and Credit Rating back to 'None' for this standalone account.");
    
    state.paymentTerms = 'None';
    state.creditRating = 'None';
    state.creditRatingLastChecked = 'Today';
    state.estimatedInvoiceDate = '–';
    
    // Sync Demo select state just for consistency
    els.selectCreditOutcome.value = 'Credit OK';
    
    updateMainPageUI();
  });

  // Simulate 14-Day Reset Timeout logic
  // (Invoicing rules: terms revert to None 14 days after estimated invoice date)
  els.demoBtnResetTimeout.addEventListener('click', () => {
    if (state.estimatedInvoiceDate === '–') {
      alert("No Estimated Invoice Date set.\n\nPlease configure payment terms and set an estimated invoice date first using the modal.");
      return;
    }
    
    alert(`Simulation Event: 14 days have passed since the estimated invoice date (${state.estimatedInvoiceDate}).\n\nResult: Payment terms have expired and reverted to 'None'. Credit rating has been reset to 'None'.`);
    
    state.paymentTerms = 'None';
    state.creditRating = 'None';
    state.estimatedInvoiceDate = '–';
    
    updateMainPageUI();
  });

  // --- Static Hotel Selector Dropdown ---
  function setupHotelDropdown() {
    const hotelBtn = document.getElementById('hotel-dropdown-btn');
    const hotelMenu = document.getElementById('hotel-dropdown-menu');

    if (hotelBtn && hotelMenu) {
      hotelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = hotelBtn.getAttribute('aria-expanded') === 'true';
        hotelBtn.setAttribute('aria-expanded', !isExpanded);
        hotelMenu.classList.toggle('show');
      });

      hotelMenu.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (e) => {
          const text = e.target.textContent;
          hotelBtn.querySelector('.hotel-name').textContent = text;
          
          hotelMenu.querySelectorAll('li').forEach(li => li.classList.remove('selected', 'aria-selected'));
          item.classList.add('selected');
          item.setAttribute('aria-selected', 'true');
          
          hotelBtn.setAttribute('aria-expanded', 'false');
          hotelMenu.classList.remove('show');
        });
      });

      document.addEventListener('click', () => {
        hotelBtn.setAttribute('aria-expanded', 'false');
        hotelMenu.classList.remove('show');
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
