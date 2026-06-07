import React, { useState, useEffect } from 'react';

// All available screen JSON files
const SCREEN_FILES = [
  'GuestBookingCard', 'ContractDetailsCard', 'CompanyDetailsCard', 
  'PaymentInfoCard', 'RatesSection', 'DashboardTopCard', 'TeaserCard',
  'DemoPanel', 'CalendarPopover', 'ContractsSection', 'PaymentTermsModal',
];

export function FigmaPreview() {
  const [screens, setScreens] = useState({});
  const [selected, setSelected] = useState(null);
  const [jsonText, setJsonText] = useState('');

  // Load all screen JSONs
  useEffect(() => {
    const loaded = {};
    const modules = import.meta.glob('../../figma-plugin/screens/*.json', { eager: true });
    for (const [path, mod] of Object.entries(modules)) {
      const name = path.split('/').pop().replace('.json', '');
      if (name !== 'screen-definition.schema') {
        loaded[name] = mod.default || mod;
      }
    }
    setScreens(loaded);
    const first = Object.keys(loaded)[0];
    if (first) {
      setSelected(first);
      setJsonText(JSON.stringify(loaded[first], null, 2));
    }
  }, []);

  const handleSelect = (name) => {
    setSelected(name);
    setJsonText(JSON.stringify(screens[name], null, 2));
  };

  const data = selected ? screens[selected] : null;

  return (
    <div className="figma-preview">
      <div className="figma-preview-sidebar">
        <h3 className="figma-preview-sidebar-title">Screen JSONs</h3>
        <ul className="figma-preview-list">
          {Object.keys(screens).map(name => (
            <li 
              key={name}
              className={`figma-preview-item ${name === selected ? 'active' : ''}`}
              onClick={() => handleSelect(name)}
            >
              <span className="figma-preview-item-name">{name}</span>
              <span className="figma-preview-item-badge">
                {screens[name].sections ? screens[name].sections.length : 0}s
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="figma-preview-main">
        {/* Visual Preview */}
        <div className="figma-preview-visual">
          <h3 className="figma-preview-section-title">Visual Preview</h3>
          {data && data.sections && (
            <div className="figma-preview-frame">
              {data.sections.map((sec, i) => (
                <SectionPreview key={i} section={sec} index={i} />
              ))}
            </div>
          )}
          {data && data.page && (
            <div className="figma-preview-frame">
              <div className="figma-preview-page-info">
                <strong>Page:</strong> {data.page.title || data.meta.component}
                {data.page.backLink && <span className="figma-preview-back-link">← {data.page.backLink}</span>}
              </div>
              <div className="figma-preview-page-sections">
                {(data.page.sections || []).map((ref, i) => (
                  <div key={i} className="figma-preview-component-ref">
                    <span className="figma-preview-ref-icon">📦</span>
                    {ref.component}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Raw JSON */}
        <div className="figma-preview-json">
          <h3 className="figma-preview-section-title">Raw JSON</h3>
          <pre className="figma-preview-code">{jsonText}</pre>
        </div>
      </div>
    </div>
  );
}

function SectionPreview({ section, index }) {
  const sec = section;

  if (sec.type === 'section-header') {
    return (
      <div className="fp-section fp-section-header">
        <div className="fp-type-badge">section-header</div>
        <h3 className="fp-heading">{sec.title}</h3>
      </div>
    );
  }

  if (sec.type === 'card-heading-with-action') {
    return (
      <div className="fp-section fp-heading-action">
        <div className="fp-type-badge">card-heading-with-action</div>
        <div className="fp-heading-row">
          {sec.icon && <span className="fp-icon">🏠</span>}
          <h3 className="fp-heading">{sec.title}</h3>
          {sec.action && (
            <span className="fp-action-btn">
              {sec.action.label} ↗
              <span className="fp-ref-tag">{sec.action.componentRef || sec.action.componentKey}</span>
            </span>
          )}
        </div>
        {sec.accentLine && (
          <div className="fp-accent-line" style={{ backgroundColor: sec.accentColor || '#960014' }}></div>
        )}
      </div>
    );
  }

  if (sec.type === 'booking-meta') {
    return (
      <div className="fp-section fp-booking-meta">
        <div className="fp-type-badge">booking-meta</div>
        <div className="fp-meta-row">
          <span className="fp-meta-badge">📋 {sec.bookingNumber}</span>
          <span className="fp-meta-source">Source: {sec.source}</span>
        </div>
      </div>
    );
  }

  if (sec.type === 'card' && sec.columns) {
    return (
      <div className="fp-section fp-card-grid">
        <div className="fp-type-badge">card ({sec.layout})</div>
        <div className="fp-grid" style={{ gridTemplateColumns: `repeat(${sec.columns.length}, 1fr)` }}>
          {sec.columns.map((col, j) => (
            <div key={j} className="fp-column">
              <div className="fp-col-name">{col.name}</div>
              {col.fields.map((field, k) => (
                <div key={k} className="fp-field">
                  <span className="fp-field-label">{field.label}</span>
                  <span className="fp-field-value">{field.value}</span>
                  {field.hasInfo && <span className="fp-info-icon" title={field.infoText}>ⓘ</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sec.type === 'top-stats-card') {
    return (
      <div className="fp-section fp-stats">
        <div className="fp-type-badge">top-stats-card</div>
        <div className="fp-stats-row">
          {(sec.stats || []).map((stat, j) => (
            <div key={j} className="fp-stat-item">
              <span className="fp-stat-label">{stat.label}</span>
              <span className="fp-stat-value">{stat.value}</span>
              {stat.hasProgress && <div className="fp-progress-bar"><div className="fp-progress-fill"></div></div>}
            </div>
          ))}
        </div>
        {sec.extras && (
          <div className="fp-extras-row">
            {sec.extras.map((extra, j) => (
              <span key={j} className="fp-extra">{extra.label}: {extra.value}</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (sec.type === 'teaser-card') {
    return (
      <div className="fp-section fp-teaser">
        <div className="fp-type-badge">teaser-card</div>
        <div className="fp-teaser-content">
          <span className="fp-icon">📄</span>
          <div>
            <div className="fp-heading">{sec.title}</div>
            <div className="fp-teaser-fields">
              {(sec.fields || []).map((f, j) => (
                <span key={j} className="fp-teaser-field"><strong>{f.label}:</strong> {f.value}</span>
              ))}
            </div>
          </div>
          {sec.hasBadge && <span className="fp-badge">● {sec.badgeField}</span>}
        </div>
      </div>
    );
  }

  if (sec.type === 'data-table') {
    return (
      <div className="fp-section fp-table">
        <div className="fp-type-badge">data-table</div>
        {sec.headers && sec.headers.length > 0 && (
          <div className="fp-table-headers">
            {sec.headers.map((h, j) => (
              <span key={j} className="fp-table-header">{h}</span>
            ))}
          </div>
        )}
        <div className="fp-table-body">Sample rows…</div>
      </div>
    );
  }

  if (sec.type === 'collapsible-section') {
    return (
      <div className="fp-section fp-collapsible">
        <div className="fp-type-badge">collapsible-section</div>
        <div className="fp-collapsible-header">
          <span>▸ {sec.label}</span>
          {sec.widget && <span className="fp-widget-tag">{sec.widget}</span>}
        </div>
        {sec.controls && (
          <div className="fp-controls">
            {sec.controls.map((c, j) => (
              <span key={j} className="fp-control">{c.label} [{c.controlType}]</span>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (sec.type === 'filter-bar') {
    return (
      <div className="fp-section fp-filter-bar">
        <div className="fp-type-badge">filter-bar</div>
        <div className="fp-filter-placeholder">Filter controls</div>
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="fp-section fp-generic">
      <div className="fp-type-badge">{sec.type}</div>
      <pre className="fp-generic-json">{JSON.stringify(sec, null, 2)}</pre>
    </div>
  );
}
