#!/usr/bin/env node
// ============================================================
// Design Token Sync (Enhancement #5)
// Generates CSS custom properties from figma-registry.json tokens.
// Run: node scripts/sync-tokens.cjs
// ============================================================

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.resolve(__dirname, '../figma-registry.json');
const CSS_OUTPUT = path.resolve(__dirname, '../src/tokens.css');

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ figma-registry.json not found');
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const tokens = registry.tokens;

  if (!tokens) {
    console.error('❌ No "tokens" section in figma-registry.json');
    process.exit(1);
  }

  const lines = [
    '/* ============================================================',
    '   Design Tokens — Auto-generated from figma-registry.json',
    `   Generated: ${new Date().toISOString()}`,
    '   DO NOT EDIT MANUALLY — run: node scripts/sync-tokens.cjs',
    '   ============================================================ */',
    '',
    ':root {',
  ];

  // Colors
  if (tokens.colors) {
    lines.push('  /* Colors */');
    for (const [name, value] of Object.entries(tokens.colors)) {
      const cssName = camelToDash(name);
      lines.push(`  --ds-${cssName}: ${value};`);
    }
    lines.push('');
  }

  // Spacing
  if (tokens.spacing) {
    lines.push('  /* Spacing */');
    for (const [name, value] of Object.entries(tokens.spacing)) {
      lines.push(`  --ds-spacing-${name}: ${value}px;`);
    }
    lines.push('');
  }

  // Layout
  if (tokens.layout) {
    lines.push('  /* Layout */');
    for (const [name, value] of Object.entries(tokens.layout)) {
      const cssName = camelToDash(name);
      lines.push(`  --ds-layout-${cssName}: ${value}px;`);
    }
    lines.push('');
  }

  // Component keys as CSS comments (for reference)
  if (registry.componentKeys && registry.componentKeys.buttons) {
    lines.push('  /* Button accent color */');
    lines.push('  --ds-button-primary-bg: #960014;');
    lines.push('  --ds-button-primary-text: #FFFFFF;');
    lines.push('  --ds-button-primary-radius: 8px;');
    lines.push('  --ds-button-primary-padding: 8px 16px;');
    lines.push('');
  }

  lines.push('}');
  lines.push('');

  // Utility classes
  lines.push('/* Utility classes */');
  if (tokens.colors) {
    for (const [name, value] of Object.entries(tokens.colors)) {
      const cssName = camelToDash(name);
      lines.push(`.ds-text-${cssName} { color: var(--ds-${cssName}); }`);
      lines.push(`.ds-bg-${cssName} { background-color: var(--ds-${cssName}); }`);
    }
  }
  lines.push('');

  fs.writeFileSync(CSS_OUTPUT, lines.join('\n'));
  
  const colorCount = tokens.colors ? Object.keys(tokens.colors).length : 0;
  const spacingCount = tokens.spacing ? Object.keys(tokens.spacing).length : 0;
  const layoutCount = tokens.layout ? Object.keys(tokens.layout).length : 0;
  
  console.log(`✅ Generated: ${CSS_OUTPUT}`);
  console.log(`   ${colorCount} colors, ${spacingCount} spacing, ${layoutCount} layout tokens`);
  console.log(`   ${colorCount * 2} utility classes`);
}

function camelToDash(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
}

main();
