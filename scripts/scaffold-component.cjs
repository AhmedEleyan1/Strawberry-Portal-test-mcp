#!/usr/bin/env node
// ============================================================
// Bi-directional Sync: JSON → React Scaffold (Enhancement #4)
// Generates a React component from a screen definition JSON.
//
// Usage:
//   node scripts/scaffold-component.cjs GuestBookingCard
//   node scripts/scaffold-component.cjs --from figma-plugin/screens/PaymentInfoCard.json
// ============================================================

const fs = require('fs');
const path = require('path');

const SCREENS_DIR = path.resolve(__dirname, '../figma-plugin/screens');
const OUTPUT_DIR = path.resolve(__dirname, '../src/components/generated');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Bi-directional Sync: JSON → React Scaffold

Usage:
  node scripts/scaffold-component.cjs <ScreenName>
  node scripts/scaffold-component.cjs --from <path/to/screen.json>
  node scripts/scaffold-component.cjs --all

Generates React JSX components from screen definition JSONs.
Output: src/components/generated/<ScreenName>.jsx
    `);
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let files = [];
  if (args[0] === '--all') {
    files = fs.readdirSync(SCREENS_DIR)
      .filter(f => f.endsWith('.json') && !f.includes('schema'))
      .map(f => path.join(SCREENS_DIR, f));
  } else if (args[0] === '--from') {
    files = [path.resolve(args[1])];
  } else {
    files = [path.join(SCREENS_DIR, args[0] + '.json')];
  }

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const name = data.meta?.component || path.basename(filePath, '.json');
    const jsx = generateReactComponent(name, data);
    const outFile = path.join(OUTPUT_DIR, `${name}.generated.jsx`);
    fs.writeFileSync(outFile, jsx);
    console.log(`✅ ${name} → ${path.relative(process.cwd(), outFile)}`);
  }
}

function generateReactComponent(name, data) {
  const sections = data.sections || [];
  const lines = [];

  lines.push(`import React from 'react';`);
  lines.push('');
  lines.push(`// Auto-generated from figma-plugin/screens/${name}.json`);
  lines.push(`// Edit the JSON and re-run: node scripts/scaffold-component.cjs ${name}`);
  lines.push('');

  // Collect all dynamic values for props
  const props = new Set();
  for (const sec of sections) {
    collectProps(sec, props);
  }

  const propsStr = props.size > 0 ? `{ ${[...props].join(', ')} }` : '';

  lines.push(`export function ${name}(${propsStr}) {`);
  lines.push(`  return (`);
  lines.push(`    <div className="${camelToDash(name)}">`);

  for (const sec of sections) {
    lines.push(renderSection(sec, '      '));
  }

  lines.push(`    </div>`);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push('');

  return lines.join('\n');
}

function renderSection(sec, indent) {
  if (sec.type === 'section-header') {
    return `${indent}<h2 className="section-header">${sec.title}</h2>`;
  }

  if (sec.type === 'card-heading-with-action') {
    const lines = [];
    lines.push(`${indent}<div className="booking-card-heading">`);
    lines.push(`${indent}  <h3 className="booking-card-heading-title">${sec.title}</h3>`);
    if (sec.action) {
      lines.push(`${indent}  <a className="btn-primary-action" href="#">`);
      lines.push(`${indent}    ${sec.action.label} ↗`);
      lines.push(`${indent}  </a>`);
    }
    lines.push(`${indent}</div>`);
    if (sec.accentLine) {
      lines.push(`${indent}<div className="booking-card-accent" />`);
    }
    return lines.join('\n');
  }

  if (sec.type === 'booking-meta') {
    return [
      `${indent}<div className="booking-meta-row">`,
      `${indent}  <span className="booking-meta-badge">{bookingNumber}</span>`,
      `${indent}  <span className="booking-meta-source">{source}</span>`,
      `${indent}</div>`,
    ].join('\n');
  }

  if (sec.type === 'card' && sec.columns) {
    const lines = [];
    lines.push(`${indent}<div className="card">`);
    lines.push(`${indent}  <div className="card-grid">`);
    for (const col of sec.columns) {
      lines.push(`${indent}    <div className="grid-column">`);
      for (const field of col.fields) {
        lines.push(`${indent}      <div className="details-field">`);
        lines.push(`${indent}        <span className="field-label">${field.label}</span>`);
        lines.push(`${indent}        <span className="field-value">${field.value}</span>`);
        lines.push(`${indent}      </div>`);
      }
      lines.push(`${indent}    </div>`);
    }
    lines.push(`${indent}  </div>`);
    lines.push(`${indent}</div>`);
    return lines.join('\n');
  }

  if (sec.type === 'top-stats-card') {
    const lines = [];
    lines.push(`${indent}<div className="dashboard-top-card card">`);
    lines.push(`${indent}  <div className="top-card-stats-row">`);
    for (const stat of (sec.stats || [])) {
      lines.push(`${indent}    <div className="top-card-stat">`);
      lines.push(`${indent}      <span className="top-card-stat-label">${stat.label}</span>`);
      lines.push(`${indent}      <span className="top-card-stat-count">${stat.value}</span>`);
      lines.push(`${indent}    </div>`);
    }
    lines.push(`${indent}  </div>`);
    lines.push(`${indent}</div>`);
    return lines.join('\n');
  }

  if (sec.type === 'teaser-card') {
    return [
      `${indent}<a className="card teaser-card" href="#">`,
      `${indent}  <h3 className="teaser-title">${sec.title}</h3>`,
      `${indent}  <div className="teaser-details-row">`,
      ...(sec.fields || []).map(f => `${indent}    <div className="teaser-detail-field"><span className="teaser-detail-label">${f.label}</span><span className="teaser-detail-value">${f.value}</span></div>`),
      `${indent}  </div>`,
      `${indent}</a>`,
    ].join('\n');
  }

  if (sec.type === 'data-table') {
    return [
      `${indent}<table className="data-table">`,
      `${indent}  <thead><tr>`,
      ...(sec.headers || []).map(h => `${indent}    <th>${h}</th>`),
      `${indent}  </tr></thead>`,
      `${indent}  <tbody>{/* rows */}</tbody>`,
      `${indent}</table>`,
    ].join('\n');
  }

  if (sec.type === 'collapsible-section') {
    return [
      `${indent}<details className="more-info-details">`,
      `${indent}  <summary>${sec.label}</summary>`,
      `${indent}  {/* content */}`,
      `${indent}</details>`,
    ].join('\n');
  }

  // Fallback
  return `${indent}{/* ${sec.type} */}`;
}

function collectProps(sec, props) {
  const findDynamic = (str) => {
    if (!str) return;
    const matches = str.match(/\{([^}]+)\}/g);
    if (matches) {
      for (const m of matches) {
        const name = m.replace(/[{}]/g, '').split('.')[0];
        if (name && !name.includes(' ')) props.add(name);
      }
    }
  };

  if (sec.columns) {
    for (const col of sec.columns) {
      for (const field of col.fields || []) {
        findDynamic(field.value);
      }
    }
  }
  if (sec.stats) sec.stats.forEach(s => findDynamic(s.value));
  if (sec.fields) sec.fields.forEach(f => findDynamic(f.value));
  findDynamic(sec.bookingNumber);
  findDynamic(sec.source);
  findDynamic(sec.title);
}

function camelToDash(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

main();
