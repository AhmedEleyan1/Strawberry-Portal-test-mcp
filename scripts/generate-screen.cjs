#!/usr/bin/env node
// ============================================================
// Screen Definition Generator
// Parses React JSX components and generates screen-definition
// JSON files that the Universal Figma Builder plugin can read.
//
// Usage:
//   node scripts/generate-screen.js src/components/contract/PaymentInfoCard.jsx
//   node scripts/generate-screen.js src/components/ContractApp.jsx
//   node scripts/generate-screen.js --all
// ============================================================

const fs = require('fs');
const path = require('path');

const REGISTRY = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../figma-registry.json'), 'utf8')
);

// ============================================================
// Simple JSX Parser — extracts component structure from JSX
// ============================================================
function extractFieldsFromJSX(content) {
  const fields = [];
  
  // Match DetailsField components
  const detailsFieldRegex = /<DetailsField\s+([^>]+?)\/>/gs;
  let match;
  
  while ((match = detailsFieldRegex.exec(content)) !== null) {
    const propsStr = match[1];
    const field = {
      type: 'details-field',
      props: {}
    };

    // Extract string props
    const stringPropRegex = /(\w+)="([^"]*?)"/g;
    let propMatch;
    while ((propMatch = stringPropRegex.exec(propsStr)) !== null) {
      field.props[propMatch[1]] = propMatch[2];
    }

    // Extract boolean props (hasInfo={true})
    const boolPropRegex = /(\w+)=\{(true|false)\}/g;
    while ((propMatch = boolPropRegex.exec(propsStr)) !== null) {
      field.props[propMatch[1]] = propMatch[2] === 'true';
    }

    // Extract JSX expression values like value={fields.xyz}
    const exprPropRegex = /value=\{fields\.(\w+)\}/g;
    while ((propMatch = exprPropRegex.exec(propsStr)) !== null) {
      field.props.valueField = propMatch[1];
    }

    // Extract complex value expressions (ternary for Yes/No)
    if (propsStr.includes("? 'Yes' : 'No'")) {
      field.props.valueType = 'boolean-text';
    }

    fields.push(field);
  }

  return fields;
}

function extractColumnsFromJSX(content) {
  const columns = [];
  
  // Split by column comments or grid-column divs
  const columnRegex = /\{\/\*\s*Column\s*(\d+)[\s\S]*?\*\/\}\s*<div className="grid-column">([\s\S]*?)<\/div>\s*(?=\{\/\*|<\/div>)/g;
  let match;

  while ((match = columnRegex.exec(content)) !== null) {
    const columnContent = match[2];
    const fields = extractFieldsFromJSX(columnContent);
    
    columns.push({
      name: `Column ${match[1]}`,
      fields: fields.map(f => ({
        label: f.props.label || '',
        value: f.props.value || `{fields.${f.props.valueField || f.props.id}}`,
        fieldType: f.props.fieldType || 'text',
        editable: f.props.editable !== undefined ? f.props.editable : true,
        hasInfo: f.props.hasInfo || false,
        infoText: f.props.infoText || '',
        tooltipPosition: f.props.tooltipPosition || 'top',
        isLink: f.props.fieldType === 'link'
      }))
    });
  }

  return columns;
}

function extractSectionHeader(content) {
  const headerMatch = content.match(/<SectionHeader[^>]*title="([^"]*?)"/);
  if (headerMatch) {
    return headerMatch[1];
  }
  
  const h2Match = content.match(/<h2>([^<]*?)<\/h2>/);
  if (h2Match) {
    return h2Match[1];
  }
  
  return null;
}

function detectCardType(content) {
  if (content.includes('card-grid')) return 'grid-card';
  if (content.includes('table-card') || content.includes('<table')) return 'table-card';
  if (content.includes('teaser-card')) return 'teaser-card';
  if (content.includes('filter-inputs')) return 'filter-card';
  return 'generic-card';
}

function extractTableData(content) {
  const headers = [];
  const thRegex = /<th[^>]*>([^<]*)<\/th>/g;
  let match;
  while ((match = thRegex.exec(content)) !== null) {
    headers.push(match[1]);
  }
  return { headers };
}

function extractInlineFields(content) {
  const fields = [];
  const fieldRegex = /<div className="details-field[^"]*"[^>]*data-field-id="(\w+)"[^>]*>\s*<span className="field-label">([^<]*)<\/span>\s*<div className="field-value-container"[^>]*>\s*(?:<StatusBadge[^/]*\/?>|<span className="field-value"[^>]*>(?:<a[^>]*>)?([^<]*)|<span className="field-value"[^>]*\s*dangerouslySetInnerHTML)/gs;
  
  while ((match = fieldRegex.exec(content)) !== null) {
    const id = match[1];
    const label = match[2];
    const rawValue = match[3] || '';
    const isBadge = content.substring(match.index, match.index + match[0].length).includes('StatusBadge');
    const isLink = content.substring(match.index, match.index + match[0].length).includes('<a ');
    const hasButton = content.substring(match.index, match.index + 200).includes('brand-link-btn');

    fields.push({
      label: label.trim(),
      value: rawValue.trim() || '–',
      fieldType: isBadge ? 'badge' : (isLink ? 'link' : 'text'),
      editable: false,
      hasAction: hasButton
    });
  }
  
  return fields;
}

// ============================================================
// Screen Definition Builder
// ============================================================
function generateScreenDefinition(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.jsx');
  
  const definition = {
    meta: {
      source: filePath,
      generatedAt: new Date().toISOString(),
      component: fileName
    },
    sections: []
  };

  // Check for SectionHeader
  const sectionTitle = extractSectionHeader(content);
  if (sectionTitle) {
    definition.sections.push({
      type: 'section-header',
      title: sectionTitle
    });
  }

  // Check for card-grid layout
  const cardType = detectCardType(content);
  
  if (cardType === 'grid-card') {
    const columns = extractColumnsFromJSX(content);
    
    // If no DetailsField components found, try inline field extraction
    const allFieldsEmpty = columns.every(c => c.fields.length === 0);
    
    if (allFieldsEmpty) {
      // Parse inline div-based fields (CompanyDetailsCard pattern)
      const columnBlocks = content.split(/\{\/\*\s*Column\s*\d+/);
      let colIndex = 0;
      
      for (let i = 1; i < columnBlocks.length; i++) {
        const blockEnd = columnBlocks[i].indexOf('</div>\n\n') || columnBlocks[i].length;
        const blockContent = columnBlocks[i].substring(0, blockEnd + 500);
        const inlineFields = extractInlineFields(blockContent);
        
        if (inlineFields.length > 0) {
          colIndex++;
          columns.push({
            name: `Column ${colIndex}`,
            fields: inlineFields
          });
        }
      }
    }

    definition.sections.push({
      type: 'card',
      layout: 'grid-4col',
      columns: columns.filter(c => c.fields.length > 0)
    });
  }

  if (cardType === 'table-card') {
    const tableData = extractTableData(content);
    definition.sections.push({
      type: 'data-table',
      headers: tableData.headers,
      sampleRows: []
    });
  }

  if (cardType === 'filter-card') {
    definition.sections.push({
      type: 'filter-bar',
      filters: []
    });
  }

  // Check for collapsible "More info"
  if (content.includes('more-info-details') || content.includes('<details')) {
    definition.sections.push({
      type: 'collapsible-section',
      label: 'More info'
    });
  }

  return definition;
}

// ============================================================
// Generate for a full App component (multiple sections)
// ============================================================
function generateAppDefinition(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, '.jsx');
  
  const definition = {
    meta: {
      source: filePath,
      generatedAt: new Date().toISOString(),
      component: fileName,
      type: 'page'
    },
    page: {
      title: '',
      backLink: '',
      sections: []
    }
  };

  // Extract page title
  const titleMatch = content.match(/<h1[^>]*>([^<{]*)/);
  if (titleMatch) {
    definition.page.title = titleMatch[1].trim();
  }

  // Extract BackLink
  const backLinkMatch = content.match(/text="([^"]*?)"/);
  if (backLinkMatch) {
    definition.page.backLink = backLinkMatch[1];
  }

  // List component references
  const componentRegex = /<(\w+(?:Card|Section|Modal))\s/g;
  let match;
  while ((match = componentRegex.exec(content)) !== null) {
    definition.page.sections.push({
      component: match[1],
      type: 'reference'
    });
  }

  return definition;
}

// ============================================================
// CLI Entry Point
// ============================================================
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Strawberry Portal — Screen Definition Generator

Usage:
  node scripts/generate-screen.js <file.jsx>     Generate for a single component
  node scripts/generate-screen.js --all           Generate for all components
  node scripts/generate-screen.js --page <App>    Generate full page definition

Output is written to figma-plugin/screens/<ComponentName>.json
    `);
    return;
  }

  const outputDir = path.resolve(__dirname, '../figma-plugin/screens');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (args[0] === '--all') {
    const dirs = [
      path.resolve(__dirname, '../src/components/contract'),
      path.resolve(__dirname, '../src/components/company'),
    ];

    for (const dir of dirs) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && !f.includes('.figma.'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        const definition = generateScreenDefinition(filePath);
        const outFile = path.join(outputDir, path.basename(file, '.jsx') + '.json');
        fs.writeFileSync(outFile, JSON.stringify(definition, null, 2));
        console.log(`✅ ${file} → ${path.basename(outFile)}`);
      }
    }

    // Also generate for App components
    const appFiles = [
      path.resolve(__dirname, '../src/components/ContractApp.jsx'),
      path.resolve(__dirname, '../src/components/CompanyApp.jsx'),
    ];
    for (const filePath of appFiles) {
      if (fs.existsSync(filePath)) {
        const definition = generateAppDefinition(filePath);
        const outFile = path.join(outputDir, path.basename(filePath, '.jsx') + '.json');
        fs.writeFileSync(outFile, JSON.stringify(definition, null, 2));
        console.log(`✅ ${path.basename(filePath)} → ${path.basename(outFile)}`);
      }
    }
  } else {
    const filePath = path.resolve(args[0]);
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }

    const isApp = filePath.includes('App.jsx');
    const definition = isApp
      ? generateAppDefinition(filePath)
      : generateScreenDefinition(filePath);

    const outFile = path.join(outputDir, path.basename(filePath, '.jsx') + '.json');
    fs.writeFileSync(outFile, JSON.stringify(definition, null, 2));
    console.log(`✅ Generated: ${outFile}`);
    console.log(JSON.stringify(definition, null, 2));
  }
}

main();
