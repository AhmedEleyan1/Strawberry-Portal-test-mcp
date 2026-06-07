#!/usr/bin/env node
// ============================================================
// Screen Definition Generator v2 — AST-based
// Uses @babel/parser to accurately parse React JSX components
// and generate screen-definition JSON for the Figma plugin.
//
// Usage:
//   node scripts/generate-screen.cjs src/components/contract/PaymentInfoCard.jsx
//   node scripts/generate-screen.cjs --all
//   node scripts/generate-screen.cjs --page src/components/ContractApp.jsx
// ============================================================

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const REGISTRY = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../figma-registry.json'), 'utf8')
);

// ============================================================
// AST Helpers
// ============================================================

/** Extract the value of a JSX attribute (string, boolean, expression) */
function getAttrValue(attr) {
  if (!attr || !attr.value) return true; // bare attribute = true
  if (attr.value.type === 'StringLiteral') return attr.value.value;
  if (attr.value.type === 'JSXExpressionContainer') {
    const expr = attr.value.expression;
    if (expr.type === 'BooleanLiteral') return expr.value;
    if (expr.type === 'StringLiteral') return expr.value;
    if (expr.type === 'NumericLiteral') return expr.value;
    if (expr.type === 'TemplateLiteral') {
      return expr.quasis.map(q => q.value.raw).join('...');
    }
    if (expr.type === 'MemberExpression') {
      return `{${memberToString(expr)}}`;
    }
    if (expr.type === 'ConditionalExpression') {
      const cons = expr.consequent;
      const alt = expr.alternate;
      if (cons.type === 'StringLiteral' && alt.type === 'StringLiteral') {
        return cons.value; // Use the truthy value as sample
      }
      return '{conditional}';
    }
    return '{expression}';
  }
  return null;
}

/** Convert MemberExpression to dot-notation string */
function memberToString(node) {
  if (node.type === 'MemberExpression') {
    return memberToString(node.object) + '.' + (node.property.name || node.property.value);
  }
  if (node.type === 'Identifier') return node.name;
  return '?';
}

/** Get all JSX attributes as a plain object */
function getProps(jsxElement) {
  const props = {};
  const opening = jsxElement.openingElement || jsxElement;
  if (!opening.attributes) return props;
  
  for (const attr of opening.attributes) {
    if (attr.type === 'JSXAttribute' && attr.name) {
      props[attr.name.name] = getAttrValue(attr);
    }
  }
  return props;
}

/** Get JSX element name (handles JSX namespaces) */
function getJSXName(node) {
  if (!node) return '';
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') {
    return getJSXName(node.object) + '.' + getJSXName(node.property);
  }
  return '';
}

// ============================================================
// Component Extractors
// ============================================================

/** Extract DetailsField from a JSX node */
function extractDetailsField(jsxNode) {
  const props = getProps(jsxNode);
  return {
    label: props.label || '',
    value: props.value || `{${props.valueField || props.id || 'value'}}`,
    fieldType: props.fieldType || 'text',
    editable: props.editable !== undefined ? props.editable : true,
    hasInfo: props.hasInfo || false,
    infoText: props.infoText || '',
    tooltipPosition: props.tooltipPosition || 'top',
    isLink: props.fieldType === 'link',
    hasAction: props.hasAction || false,
  };
}

/** Extract StatusBadge from a JSX node */
function extractStatusBadge(jsxNode) {
  const props = getProps(jsxNode);
  return {
    type: 'status-badge',
    text: props.text || props.label || props.status || 'Status',
    variant: props.variant || props.type || 'default',
  };
}

/** Find grid-column divs and extract fields from each */
function extractGridColumns(ast, source) {
  const columns = [];
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      const props = getProps(nodePath.node);
      
      // Detect grid-column div
      if (name === 'div' && props.className && 
          typeof props.className === 'string' && 
          props.className.includes('grid-column')) {
        const column = { name: `Column ${columns.length + 1}`, fields: [] };
        
        // Find all DetailsField components or inline details-field divs
        nodePath.traverse({
          JSXElement(childPath) {
            const childName = getJSXName(childPath.node.openingElement.name);
            const childProps = getProps(childPath.node);
            
            // Pattern 1: <DetailsField ... />
            if (childName === 'DetailsField') {
              column.fields.push(extractDetailsField(childPath.node));
              childPath.skip();
              return;
            }
            
            // Pattern 2: <div className="details-field" data-field-id="xxx">
            if (childName === 'div' && childProps.className && 
                typeof childProps.className === 'string' &&
                childProps.className.includes('details-field')) {
              const field = extractInlineDetailsField(childPath.node);
              if (field) column.fields.push(field);
              childPath.skip();
              return;
            }
          }
        });
        
        if (column.fields.length > 0) {
          columns.push(column);
        }
        nodePath.skip();
      }
    }
  });
  
  return columns;
}

/** Extract field data from an inline details-field div */
function extractInlineDetailsField(jsxNode) {
  const props = getProps(jsxNode);
  let label = '';
  let value = '–';
  let fieldType = 'text';
  let hasAction = false;
  
  // Walk children to find label and value
  function walkChildren(children) {
    if (!children) return;
    for (const child of children) {
      if (child.type === 'JSXElement') {
        const cName = getJSXName(child.openingElement.name);
        const cProps = getProps(child);
        
        // <span className="field-label">
        if (cName === 'span' && cProps.className && 
            typeof cProps.className === 'string' &&
            cProps.className.includes('field-label')) {
          for (const textChild of (child.children || [])) {
            if (textChild.type === 'JSXText') label += textChild.value.trim();
          }
        }
        
        // <span className="field-value">
        if (cName === 'span' && cProps.className && 
            typeof cProps.className === 'string' &&
            cProps.className.includes('field-value')) {
          for (const textChild of (child.children || [])) {
            if (textChild.type === 'JSXText') value = textChild.value.trim() || value;
            if (textChild.type === 'JSXExpressionContainer') value = '{data}';
            if (textChild.type === 'JSXElement') {
              const innerName = getJSXName(textChild.openingElement.name);
              if (innerName === 'a') {
                fieldType = 'link';
                for (const aChild of (textChild.children || [])) {
                  if (aChild.type === 'JSXText') value = aChild.value.trim() || value;
                  if (aChild.type === 'JSXExpressionContainer') value = '{data}';
                }
              }
            }
          }
        }
        
        // StatusBadge
        if (cName === 'StatusBadge') {
          fieldType = 'badge';
          const badgeProps = getProps(child);
          value = badgeProps.text || badgeProps.label || 'Status';
        }
        
        // Action button
        if (cName === 'button' || (cProps.className && typeof cProps.className === 'string' && cProps.className.includes('brand-link-btn'))) {
          hasAction = true;
        }
        
        // Recurse into children
        if (child.children) walkChildren(child.children);
      }
    }
  }
  
  walkChildren(jsxNode.children);
  
  if (!label) return null;
  
  return {
    label,
    value,
    fieldType,
    editable: false,
    hasInfo: false,
    infoText: '',
    tooltipPosition: 'top',
    isLink: fieldType === 'link',
    hasAction,
  };
}

/** Detect what type of card/component this is from CSS classes */
function detectComponentType(ast, source) {
  const types = [];
  
  if (source.includes('card-grid')) types.push('grid-card');
  if (source.includes('dashboard-top-card')) types.push('top-stats-card');
  if (source.includes('teaser-card')) types.push('teaser-card');
  if (source.includes('<table') || source.includes('table-card')) types.push('data-table');
  if (source.includes('filter-inputs') || source.includes('filter-bar')) types.push('filter-bar');
  if (source.includes('more-info-details') || source.includes('<details')) types.push('collapsible-section');
  if (source.includes('sidebar')) types.push('sidebar-nav');
  
  // Booking card patterns (Enhancement #3)
  if (source.includes('booking-card')) types.push('booking-card');
  if (source.includes('booking-card-heading') && source.includes('btn-primary-action')) types.push('card-heading-with-action');
  if (source.includes('booking-card-accent')) types.push('accent-line');
  if (source.includes('booking-meta-row')) types.push('booking-meta');
  if (source.includes('booking-details-grid')) types.push('booking-details-grid');
  if (source.includes('btn-primary-action') && !source.includes('booking-card-heading')) types.push('primary-action-button');
  
  return types;
}

/** Extract section header */
function extractSectionHeader(ast) {
  let title = null;
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      if (name === 'SectionHeader') {
        const props = getProps(nodePath.node);
        title = props.title || '';
        nodePath.stop();
      }
      if (name === 'h2') {
        const children = nodePath.node.children;
        for (const child of children) {
          if (child.type === 'JSXText') {
            title = child.value.trim();
          }
        }
      }
    }
  });
  
  return title;
}

/** Extract table headers */
function extractTableHeaders(ast) {
  const headers = [];
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      if (name === 'th') {
        const children = nodePath.node.children;
        for (const child of children) {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text) headers.push(text);
          }
        }
      }
    }
  });
  
  return headers;
}

/** Extract all component references (for App-level pages) */
function extractComponentRefs(ast) {
  const refs = [];
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      if (name.endsWith('Card') || name.endsWith('Section') || name.endsWith('Modal') || name.endsWith('Table')) {
        refs.push({ component: name, type: 'reference' });
      }
    }
  });
  
  return refs;
}

/** Extract page title from h1 */
function extractPageTitle(ast) {
  let title = '';
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      if (name === 'h1') {
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXText') {
            title += child.value.trim();
          }
        }
        nodePath.stop();
      }
    }
  });
  
  return title;
}

/** Extract BackLink text */
function extractBackLink(ast) {
  let text = '';
  
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      if (name === 'BackLink') {
        const props = getProps(nodePath.node);
        text = props.text || '';
        nodePath.stop();
      }
    }
  });
  
  return text;
}

// ============================================================
// Booking Card Extractors (Enhancement #3)
// ============================================================

/** Extract heading-with-action from booking-card-heading + btn-primary-action */
function extractHeadingWithAction(ast, source) {
  const section = {
    type: 'card-heading-with-action',
    title: 'Accommodation',
    icon: 'accommodation',
    accentLine: source.includes('booking-card-accent'),
    accentColor: '#960014',
    action: null,
  };

  // Find heading title from h3 inside booking-card-heading
  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      const props = getProps(nodePath.node);

      // h3 with booking-card-heading-title class
      if (name === 'h3' && props.className && props.className.includes('heading-title')) {
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text) section.title = text;
          }
        }
      }

      // Find the primary action button (a or button with btn-primary-action class)
      if ((name === 'a' || name === 'button') && props.className && props.className.includes('btn-primary-action')) {
        let label = '';
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text) label = text;
          }
        }
        section.action = {
          label: label || 'Open in Mews',
          componentRef: 'buttons/primary/small',
          properties: {
            'Label': label || 'Open in Mews',
            'Icon right': true,
            'Icon left': false,
          },
          iconRef: 'icons/arrowOut',
        };
      }

      // Find icon name for heading
      if (name === 'Icon' && props.className && props.className.includes('heading-icon')) {
        if (props.name) section.icon = props.name;
      }
    }
  });

  return section;
}

/** Extract booking-meta from booking-meta-row */
function extractBookingMeta(ast) {
  const meta = {
    type: 'booking-meta',
    bookingNumber: '',
    source: '',
  };

  traverse(ast, {
    JSXElement(nodePath) {
      const props = getProps(nodePath.node);
      if (props.className && props.className.includes('booking-meta-badge')) {
        // Try to extract the booking number from children
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text.includes('Booking number')) {
              meta.bookingNumber = '{bookingNumber}';
            }
          }
          if (child.type === 'JSXExpressionContainer') {
            meta.bookingNumber = '{bookingNumber}';
          }
        }
      }
      if (props.className && props.className.includes('booking-meta-source')) {
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXExpressionContainer') {
            meta.source = '{source}';
          }
        }
      }
    }
  });

  return meta;
}

/** Extract booking details grid as a 4-column card */
function extractBookingDetailsGrid(ast) {
  const columns = [];
  let currentColumn = null;

  traverse(ast, {
    JSXElement(nodePath) {
      const props = getProps(nodePath.node);

      // Each booking-details-col is a column
      if (props.className && props.className.includes('booking-details-col')) {
        if (currentColumn) columns.push(currentColumn);
        currentColumn = {
          name: `Column ${columns.length + 1}`,
          fields: [],
        };
      }

      // Each booking-detail-item contains a label and value
      if (props.className && props.className.includes('booking-detail-item')) {
        let label = '';
        let value = '';

        for (const child of nodePath.node.children) {
          if (child.type === 'JSXElement') {
            const childProps = getProps(child);
            if (childProps.className && childProps.className.includes('booking-detail-label')) {
              for (const textChild of child.children) {
                if (textChild.type === 'JSXText') label = textChild.value.trim();
              }
            }
            if (childProps.className && childProps.className.includes('booking-detail-value')) {
              for (const textChild of child.children) {
                if (textChild.type === 'JSXText') value = textChild.value.trim();
                if (textChild.type === 'JSXExpressionContainer') {
                  const expr = textChild.expression;
                  if (expr.type === 'Identifier') value = `{${expr.name}}`;
                  if (expr.type === 'MemberExpression') value = `{${memberToString(expr)}}`;
                }
              }
            }
          }
        }

        if (label && currentColumn) {
          currentColumn.fields.push({
            label,
            value: value || `{${label.toLowerCase().replace(/\s+/g, '_')}}`,
            fieldType: 'text',
            editable: false,
            hasInfo: false,
            infoText: '',
            tooltipPosition: 'top',
            isLink: false,
            hasAction: false,
          });
        }
      }
    }
  });

  // Push last column
  if (currentColumn) columns.push(currentColumn);

  return {
    type: 'card',
    layout: `grid-${Math.min(columns.length, 4)}col`,
    columns,
  };
}

/** Extract standalone primary action button */
function extractPrimaryAction(ast) {
  let label = 'Go to booking';

  traverse(ast, {
    JSXElement(nodePath) {
      const name = getJSXName(nodePath.node.openingElement.name);
      const props = getProps(nodePath.node);

      if ((name === 'a' || name === 'button') && props.className && props.className.includes('btn-primary-action')) {
        for (const child of nodePath.node.children) {
          if (child.type === 'JSXText') {
            const text = child.value.trim();
            if (text) label = text;
          }
        }
        nodePath.stop();
      }
    }
  });

  return {
    type: 'primary-action-button',
    label,
    componentRef: 'buttons/primary/small',
    properties: {
      'Label': label,
      'Icon right': true,
      'Icon left': false,
    },
    iconRef: 'icons/arrowOut',
  };
}

// ============================================================
// Main Generator
// ============================================================

function parseFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  
  const ast = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
  });
  
  return { ast, source };
}

function generateScreenDefinition(filePath) {
  const { ast, source } = parseFile(filePath);
  const fileName = path.basename(filePath, '.jsx');
  
  const definition = {
    $schema: './screen-definition.schema.json',
    meta: {
      source: filePath,
      generatedAt: new Date().toISOString(),
      component: fileName,
    },
    sections: [],
  };
  
  // Detect types
  const types = detectComponentType(ast, source);
  
  // ─── Booking card pattern ───
  if (types.includes('booking-card')) {
    // Heading with action
    if (types.includes('card-heading-with-action')) {
      definition.sections.push(extractHeadingWithAction(ast, source));
    }
    
    // Booking meta
    if (types.includes('booking-meta')) {
      definition.sections.push(extractBookingMeta(ast));
    }
    
    // Booking details grid
    if (types.includes('booking-details-grid')) {
      definition.sections.push(extractBookingDetailsGrid(ast));
    }
    
    // Standalone primary action button (not inside heading)
    if (types.includes('primary-action-button')) {
      definition.sections.push(extractPrimaryAction(ast));
    }
    
    return definition;
  }
  
  // ─── Standard card patterns (existing) ───
  // Section header
  const sectionTitle = extractSectionHeader(ast);
  if (sectionTitle) {
    definition.sections.push({ type: 'section-header', title: sectionTitle });
  }
  
  // Grid card
  if (types.includes('grid-card')) {
    const columns = extractGridColumns(ast, source);
    if (columns.length > 0) {
      definition.sections.push({
        type: 'card',
        layout: 'grid-4col',
        columns: columns,
      });
    }
  }
  
  // Data table
  if (types.includes('data-table')) {
    const headers = extractTableHeaders(ast);
    definition.sections.push({
      type: 'data-table',
      headers: headers,
      sampleRows: [],
    });
  }
  
  // Filter bar
  if (types.includes('filter-bar')) {
    definition.sections.push({
      type: 'filter-bar',
      filters: [],
    });
  }
  
  // Collapsible section
  if (types.includes('collapsible-section')) {
    definition.sections.push({
      type: 'collapsible-section',
      label: 'More info',
    });
  }
  
  return definition;
}

function generateAppDefinition(filePath) {
  const { ast, source } = parseFile(filePath);
  const fileName = path.basename(filePath, '.jsx');
  
  const definition = {
    $schema: './screen-definition.schema.json',
    meta: {
      source: filePath,
      generatedAt: new Date().toISOString(),
      component: fileName,
      type: 'page',
    },
    page: {
      title: extractPageTitle(ast),
      backLink: extractBackLink(ast),
      sections: extractComponentRefs(ast),
    },
  };
  
  return definition;
}

// ============================================================
// Lightweight Schema Validator
// ============================================================
const VALID_SECTION_TYPES = [
  'section-header', 'card-heading-with-action', 'card', 'booking-meta',
  'primary-action-button', 'data-table', 'top-stats-card', 'filter-bar',
  'teaser-card', 'sidebar-nav', 'top-header', 'collapsible-section', 'status-badge',
];
const VALID_FIELD_TYPES = ['text', 'number', 'select', 'badge', 'link', 'date', 'email', 'phone', 'currency'];
const VALID_TOOLTIP_POSITIONS = ['top', 'right', 'bottom', 'left'];

function validateAgainstSchema(data, schema) {
  const errors = [];

  // meta check
  if (!data.meta) {
    errors.push('Missing required property: meta');
  } else {
    if (!data.meta.source) errors.push('meta.source is required');
    if (!data.meta.component) errors.push('meta.component is required');
  }

  // sections check
  if (!data.sections) {
    errors.push('Missing required property: sections');
  } else if (!Array.isArray(data.sections)) {
    errors.push('sections must be an array');
  } else if (data.sections.length === 0) {
    errors.push('sections must have at least 1 item');
  } else {
    data.sections.forEach((sec, i) => {
      if (!sec.type) {
        errors.push(`sections[${i}]: missing required property 'type'`);
      } else if (!VALID_SECTION_TYPES.includes(sec.type)) {
        errors.push(`sections[${i}]: unknown type '${sec.type}'`);
      }

      // Type-specific validation
      if (sec.type === 'section-header' && !sec.title) {
        errors.push(`sections[${i}] (section-header): missing 'title'`);
      }
      if (sec.type === 'card-heading-with-action' && !sec.title) {
        errors.push(`sections[${i}] (card-heading-with-action): missing 'title'`);
      }
      if (sec.type === 'booking-meta' && !sec.bookingNumber) {
        errors.push(`sections[${i}] (booking-meta): missing 'bookingNumber'`);
      }
      if (sec.type === 'primary-action-button' && !sec.label) {
        errors.push(`sections[${i}] (primary-action-button): missing 'label'`);
      }

      // Card columns/fields validation
      if (sec.type === 'card') {
        if (!sec.layout) errors.push(`sections[${i}] (card): missing 'layout'`);
        if (!sec.columns || !Array.isArray(sec.columns)) {
          errors.push(`sections[${i}] (card): missing or invalid 'columns'`);
        } else {
          sec.columns.forEach((col, j) => {
            if (!col.name) errors.push(`sections[${i}].columns[${j}]: missing 'name'`);
            if (!col.fields || !Array.isArray(col.fields)) {
              errors.push(`sections[${i}].columns[${j}]: missing or invalid 'fields'`);
            } else {
              col.fields.forEach((field, k) => {
                if (!field.label) errors.push(`sections[${i}].columns[${j}].fields[${k}]: missing 'label'`);
                if (field.value === undefined) errors.push(`sections[${i}].columns[${j}].fields[${k}]: missing 'value'`);
                if (field.fieldType && !VALID_FIELD_TYPES.includes(field.fieldType)) {
                  errors.push(`sections[${i}].columns[${j}].fields[${k}]: invalid fieldType '${field.fieldType}'`);
                }
                if (field.tooltipPosition && !VALID_TOOLTIP_POSITIONS.includes(field.tooltipPosition)) {
                  errors.push(`sections[${i}].columns[${j}].fields[${k}]: invalid tooltipPosition '${field.tooltipPosition}'`);
                }
              });
            }
          });
        }
      }

      // Validate action button refs
      if (sec.action) {
        if (!sec.action.label) errors.push(`sections[${i}].action: missing 'label'`);
      }
    });
  }

  return errors;
}

// ============================================================
// CLI
// ============================================================
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Strawberry Portal — Screen Definition Generator v2 (AST)

Usage:
  node scripts/generate-screen.cjs <file.jsx>     Generate for a single component
  node scripts/generate-screen.cjs --all           Generate for all components
  node scripts/generate-screen.cjs --page <App>    Generate full page definition
  node scripts/generate-screen.cjs --validate      Validate all JSONs against schema

Output is written to figma-plugin/screens/<ComponentName>.json
    `);
    return;
  }

  const outputDir = path.resolve(__dirname, '../figma-plugin/screens');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (args[0] === '--validate') {
    const screensDir = path.resolve(__dirname, '../figma-plugin/screens');
    const schemaPath = path.join(screensDir, 'screen-definition.schema.json');
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.json') && !f.includes('schema'));
    let passed = 0;
    let failed = 0;
    
    for (const file of files) {
      const filePath = path.join(screensDir, file);
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const errors = validateAgainstSchema(data, schema);
        if (errors.length === 0) {
          console.log(`✅ ${file}`);
          passed++;
        } else {
          console.log(`❌ ${file}:`);
          for (const err of errors) console.log(`   ${err}`);
          failed++;
        }
      } catch (err) {
        console.log(`❌ ${file}: Parse error — ${err.message}`);
        failed++;
      }
    }
    
    console.log(`\nValidation: ${passed} passed, ${failed} failed, ${files.length} total`);
    process.exit(failed > 0 ? 1 : 0);
  }

  if (args[0] === '--all') {
    const dirs = [
      path.resolve(__dirname, '../src/components/contract'),
      path.resolve(__dirname, '../src/components/company'),
      path.resolve(__dirname, '../src/components/dashboard'),
    ];

    let totalFiles = 0;
    let totalFields = 0;

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) continue;
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx') && !f.includes('.figma.'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          const definition = generateScreenDefinition(filePath);
          const outFile = path.join(outputDir, path.basename(file, '.jsx') + '.json');
          fs.writeFileSync(outFile, JSON.stringify(definition, null, 2));
          
          let fieldCount = 0;
          for (const sec of definition.sections) {
            if (sec.columns) {
              for (const col of sec.columns) fieldCount += col.fields.length;
            }
          }
          
          console.log(`✅ ${file} → ${path.basename(outFile)} (${fieldCount} fields, ${definition.sections.length} sections)`);
          totalFiles++;
          totalFields += fieldCount;
        } catch (err) {
          console.error(`❌ ${file}: ${err.message}`);
        }
      }
    }

    // App components
    const appFiles = [
      path.resolve(__dirname, '../src/components/ContractApp.jsx'),
      path.resolve(__dirname, '../src/components/CompanyApp.jsx'),
      path.resolve(__dirname, '../src/components/DashboardApp.jsx'),
    ];
    for (const filePath of appFiles) {
      if (fs.existsSync(filePath)) {
        try {
          const definition = generateAppDefinition(filePath);
          const outFile = path.join(outputDir, path.basename(filePath, '.jsx') + '.json');
          fs.writeFileSync(outFile, JSON.stringify(definition, null, 2));
          console.log(`✅ ${path.basename(filePath)} → ${path.basename(outFile)} (page)`);
          totalFiles++;
        } catch (err) {
          console.error(`❌ ${path.basename(filePath)}: ${err.message}`);
        }
      }
    }

    console.log(`\nDone: ${totalFiles} files, ${totalFields} fields extracted`);
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
