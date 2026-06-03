import { html, useState } from '../lib.js';

export function DemoPanel({
  coveredByCentralAgreement,
  onToggleAgreement,
  nextCreditOutcome,
  onChangeNextCreditOutcome,
  onInvoiceProcessed,
  onTimeoutSimulated
}) {
  const [collapsed, setCollapsed] = useState(true);

  return html`
    <div className="demo-panel ${collapsed ? 'collapsed' : ''}" id="demo-panel">
      <div className="demo-panel-header" onClick=${() => setCollapsed(!collapsed)}>
        <h3>Testing & Demo Panel</h3>
        <span className="demo-panel-toggle-icon">${collapsed ? '▲' : '▼'}</span>
      </div>
      
      <div className="demo-panel-body">
        <div className="demo-form-group">
          <label>Covered By Central Agreement</label>
          <select 
            className="demo-select" 
            value=${coveredByCentralAgreement}
            onChange=${(e) => onToggleAgreement(e.target.value)}
          >
            <option value="Yes">Yes (Framework Active)</option>
            <option value="No">No (Standalone)</option>
          </select>
        </div>

        <div className="demo-form-group">
          <label>Next Credit Rating Outcome</label>
          <select 
            className="demo-select" 
            value=${nextCreditOutcome}
            onChange=${(e) => onChangeNextCreditOutcome(e.target.value)}
          >
            <option value="Credit OK">Credit OK (Standard)</option>
            <option value="Contact Credit Team">Contact Credit Team (Restricted)</option>
            <option value="Payment upfront">Payment upfront (Warning)</option>
          </select>
        </div>

        <div style="margin-top: 16px; border-top: 1px solid var(--border-light); padding-top: 12px;">
          <button className="demo-btn" onClick=${onInvoiceProcessed}>Process One-Time Invoice</button>
          <button className="demo-btn demo-btn-secondary" onClick=${onTimeoutSimulated}>Simulate 14-Day Timeout</button>
        </div>
      </div>
    </div>
  `;
}
