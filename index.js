function startApp() {
  setupDropdowns();
  setupInlineEditing();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

/**
 * Handle custom select and navigation dropdown menus
 */
function setupDropdowns() {
  // 1. Hotel Selector Dropdown
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
        
        // Update selected class
        hotelMenu.querySelectorAll('li').forEach(li => li.classList.remove('selected', 'aria-selected'));
        item.classList.add('selected');
        item.setAttribute('aria-selected', 'true');
        
        // Close menu
        hotelBtn.setAttribute('aria-expanded', 'false');
        hotelMenu.classList.remove('show');
      });
    });
  }

  // 2. Filter Selectors (Property & Season)
  const customSelects = document.querySelectorAll('.custom-select');
  customSelects.forEach(select => {
    const trigger = select.querySelector('.select-trigger');
    const optionsList = select.querySelector('.select-options');

    if (trigger && optionsList) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close other active custom selects first
        customSelects.forEach(s => {
          if (s !== select) s.classList.remove('active');
        });
        
        select.classList.toggle('active');
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', !isExpanded);
      });

      optionsList.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = e.target.textContent;
          trigger.querySelector('span').textContent = text;

          // Update selected option in DOM
          optionsList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
          option.classList.add('selected');
          option.setAttribute('aria-selected', 'true');

          select.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');

          // If updating property, sync Property ID just for demo realism
          if (select.id === 'filter-property-select') {
            const propertyIdMap = {
              'Clarion Hotel Sign': 'SE199',
              'Clarion Hotel Post': 'SE065',
              'Quality Hotel 11': 'SE115'
            };
            const propIdContainer = document.querySelector('.rates-filters-card .filter-static-value');
            if (propIdContainer && propertyIdMap[text]) {
              propIdContainer.textContent = propertyIdMap[text];
            }
          }
        });
      });
    }
  });

  // Click outside to close all active menus
  document.addEventListener('click', () => {
    if (hotelBtn) {
      hotelBtn.setAttribute('aria-expanded', 'false');
      hotelMenu.classList.remove('show');
    }
    customSelects.forEach(select => {
      select.classList.remove('active');
      const trigger = select.querySelector('.select-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Handle inline editing for Salesforce CRM experience
 */
function setupInlineEditing() {
  // Delegate clicks on inline edit buttons
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.inline-edit-btn');
    if (!editBtn) return;

    e.stopPropagation();
    
    // Find the field container (.details-field or .payment-row-item)
    const fieldContainer = editBtn.closest('.details-field') || editBtn.closest('.payment-row-item');
    if (!fieldContainer || fieldContainer.classList.contains('no-direct-edit') || fieldContainer.classList.contains('is-editing')) {
      return;
    }

    startEditing(fieldContainer);
  });

  // Enable double-click on value container to trigger editing as well
  document.addEventListener('dblclick', (e) => {
    const valueContainer = e.target.closest('.field-value-container') || e.target.closest('.item-value-group');
    if (!valueContainer) return;

    const fieldContainer = valueContainer.closest('.details-field') || valueContainer.closest('.payment-row-item');
    if (!fieldContainer || fieldContainer.classList.contains('no-direct-edit') || fieldContainer.classList.contains('is-editing')) {
      return;
    }

    startEditing(fieldContainer);
  });
}

/**
 * Transition field container into Edit Mode
 */
function startEditing(container) {
  container.classList.add('is-editing');

  const fieldId = container.getAttribute('data-field-id');
  const fieldType = container.getAttribute('data-field-type') || 'text';
  
  // Find the exact element containing the value
  const valueEl = container.querySelector('.field-value') || container.querySelector('.item-value');
  const valueContainer = container.querySelector('.field-value-container') || container.querySelector('.item-value-group');
  const editBtn = container.querySelector('.inline-edit-btn');

  // Save current state for cancellation
  const originalHTML = valueContainer.innerHTML;
  container.setAttribute('data-original-html', originalHTML);

  // Extract raw text value
  let rawValue = '';
  if (fieldType === 'checkbox') {
    rawValue = valueEl.getAttribute('data-checked') === 'true' ? 'true' : 'false';
  } else if (fieldType === 'link') {
    const anchor = valueEl.querySelector('a');
    rawValue = anchor ? anchor.textContent : valueEl.textContent;
  } else {
    rawValue = valueEl.textContent.trim();
    if (rawValue === '–' || rawValue === '—') {
      rawValue = ''; // clear placeholder dash for editing
    }
  }

  // Hide the original value container contents and edit button temporarily
  valueContainer.style.display = 'none';

  // Create form element based on field type
  let inputEl;
  if (fieldType === 'select') {
    const optionsString = container.getAttribute('data-options') || '';
    const options = optionsString.split(',').map(opt => opt.trim());
    
    inputEl = document.createElement('select');
    inputEl.className = 'inline-edit-select';
    
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === rawValue || (rawValue === '' && opt === '–')) {
        option.selected = true;
      }
      inputEl.appendChild(option);
    });
  } else if (fieldType === 'textarea') {
    inputEl = document.createElement('textarea');
    inputEl.className = 'inline-edit-textarea';
    inputEl.value = rawValue;
  } else if (fieldType === 'checkbox') {
    const label = document.createElement('label');
    label.className = 'inline-checkbox-label';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = (rawValue === 'true');
    
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' Active'));
    
    inputEl = label; // wrapper label acts as element to insert
  } else if (fieldType === 'number') {
    inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.className = 'inline-edit-input';
    inputEl.value = rawValue;
  } else {
    inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'inline-edit-input';
    inputEl.value = rawValue;
  }

  // Insert input control after valueContainer
  valueContainer.parentNode.insertBefore(inputEl, valueContainer.nextSibling);

  // Setup focus and listener handles
  const focusTarget = fieldType === 'checkbox' ? inputEl.querySelector('input') : inputEl;
  focusTarget.focus();
  if (focusTarget.select && fieldType !== 'number') {
    focusTarget.select();
  }

  // Save changes handler
  const save = () => {
    if (!container.classList.contains('is-editing')) return;

    let newValue = '';
    if (fieldType === 'checkbox') {
      newValue = inputEl.querySelector('input').checked ? 'true' : 'false';
    } else {
      newValue = inputEl.value.trim();
    }

    finishEditing(container, inputEl, valueContainer, newValue, false);
  };

  // Revert changes handler
  const cancel = () => {
    finishEditing(container, inputEl, valueContainer, null, true);
  };

  // Add event listeners
  focusTarget.addEventListener('blur', (e) => {
    // Small delay to allow potential keyboard submit/cancel clicks to register first
    setTimeout(() => {
      save();
    }, 150);
  });

  focusTarget.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (fieldType === 'textarea' && !e.shiftKey) {
        // In textarea, Enter inserts newline unless Shift is held. 
        // We let normal Enter go through, or save if shift+Enter is pressed.
        return; 
      }
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });
}

/**
 * Remove inputs, update values and exit edit mode
 */
function finishEditing(container, inputEl, valueContainer, newValue, isCancelled) {
  if (!container.classList.contains('is-editing')) return;

  // Remove input element
  inputEl.remove();

  // Restore the value container
  valueContainer.style.display = '';
  container.classList.remove('is-editing');

  if (isCancelled) {
    // Revert to original markup
    const originalHTML = container.getAttribute('data-original-html');
    if (originalHTML) {
      valueContainer.innerHTML = originalHTML;
    }
    return;
  }

  // Otherwise, apply the new value
  const fieldType = container.getAttribute('data-field-type') || 'text';
  const valueEl = valueContainer.querySelector('.field-value') || valueContainer.querySelector('.item-value');

  if (!valueEl) return;

  if (fieldType === 'checkbox') {
    const isChecked = (newValue === 'true');
    valueEl.setAttribute('data-checked', newValue);
    
    if (isChecked) {
      valueEl.innerHTML = `
        <svg class="check-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      `;
    } else {
      valueEl.textContent = '–';
    }
  } else if (fieldType === 'link') {
    const anchor = valueEl.querySelector('a');
    const displayValue = newValue || '–';
    if (anchor) {
      anchor.textContent = displayValue;
    } else {
      valueEl.textContent = displayValue;
    }
  } else {
    valueEl.textContent = newValue || '–';
  }
}
