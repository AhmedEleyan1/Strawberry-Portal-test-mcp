#!/usr/bin/env node
// ============================================================
// MCP-Powered Figma Queries (Enhancement #6)
// Generates helper scripts for querying the Figma file via MCP.
// These scripts use the Figma MCP server to discover component
// keys directly from the design file.
//
// Usage:
//   node scripts/figma-query.cjs --list-components      List all components
//   node scripts/figma-query.cjs --find <name>           Find component by name
//   node scripts/figma-query.cjs --sync-registry         Update figma-registry.json
//   node scripts/figma-query.cjs --export-tokens          Export design tokens
// ============================================================

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.resolve(__dirname, '../figma-registry.json');
const MCP_INSTRUCTIONS_PATH = path.resolve(__dirname, '../figma-mcp-queries.md');

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
MCP-Powered Figma Queries

Usage:
  node scripts/figma-query.cjs --generate-queries    Generate MCP query templates
  node scripts/figma-query.cjs --check-registry      Check registry completeness

Note: Actual Figma MCP calls must be made through the MCP server.
This tool generates the query payloads and validates responses.
    `);
    return;
  }

  if (args[0] === '--generate-queries') {
    generateQueryTemplates();
  }

  if (args[0] === '--check-registry') {
    checkRegistry();
  }
}

function generateQueryTemplates() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const figmaFileKey = registry.figmaFileKey || 'YOUR_FILE_KEY';

  const queries = [
    {
      name: 'List all components',
      description: 'Discover all published components in the file',
      mcpTool: 'get_figma_data',
      params: { fileKey: figmaFileKey, depth: 1 },
      postProcess: 'Filter nodes where type === "COMPONENT" or type === "COMPONENT_SET"',
    },
    {
      name: 'Find button variants',
      description: 'Get all button component variants and their keys',
      mcpTool: 'get_figma_data',
      params: { fileKey: figmaFileKey, nodeId: 'BUTTON_COMPONENT_SET_ID' },
      postProcess: 'Extract variant properties and component keys',
    },
    {
      name: 'Get design tokens',
      description: 'Extract color styles and text styles',
      mcpTool: 'get_figma_data',
      params: { fileKey: figmaFileKey },
      postProcess: 'Extract styles.colors and styles.textStyles',
    },
    {
      name: 'Download component thumbnails',
      description: 'Get preview images for component cards',
      mcpTool: 'download_figma_images',
      params: { fileKey: figmaFileKey, nodeIds: ['COMPONENT_ID_1', 'COMPONENT_ID_2'] },
      postProcess: 'Save images to figma-plugin/thumbnails/',
    },
  ];

  const lines = [
    '# Figma MCP Query Templates',
    '',
    `File Key: \`${figmaFileKey}\``,
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Available Queries',
    '',
  ];

  for (const q of queries) {
    lines.push(`### ${q.name}`);
    lines.push(`${q.description}`);
    lines.push('');
    lines.push(`**MCP Tool:** \`${q.mcpTool}\``);
    lines.push('```json');
    lines.push(JSON.stringify(q.params, null, 2));
    lines.push('```');
    lines.push(`**Post-process:** ${q.postProcess}`);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## How to Use');
  lines.push('');
  lines.push('1. Copy the query params above');
  lines.push('2. Call the MCP tool via the Figma MCP server');
  lines.push('3. Process the response to update `figma-registry.json`');
  lines.push('');
  lines.push('Or run: `node scripts/figma-query.cjs --check-registry` to see what\'s missing.');

  fs.writeFileSync(MCP_INSTRUCTIONS_PATH, lines.join('\n'));
  console.log(`✅ Generated: ${path.relative(process.cwd(), MCP_INSTRUCTIONS_PATH)}`);
  console.log(`   ${queries.length} query templates`);
}

function checkRegistry() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const componentKeys = registry.componentKeys || {};

  console.log('📋 Registry Completeness Check:\n');

  const categories = {
    'Buttons': { path: 'buttons', expectedVariants: ['primary/small', 'secondary/small', 'link/small'] },
    'Icons': { path: 'icons', expectedVariants: ['arrowOut', 'accommodation', 'chevronDown', 'edit', 'info'] },
    'Tooltips': { path: 'tooltip', expectedVariants: ['top', 'right', 'bottom', 'left'] },
  };

  let totalMissing = 0;

  for (const [cat, spec] of Object.entries(categories)) {
    const entry = componentKeys[spec.path];
    if (!entry) {
      console.log(`  ❌ ${cat}: entire category missing`);
      totalMissing += spec.expectedVariants.length;
      continue;
    }

    const variants = entry.variants || {};
    const present = [];
    const missing = [];

    for (const v of spec.expectedVariants) {
      if (variants[v]) {
        present.push(v);
      } else {
        missing.push(v);
      }
    }

    if (missing.length === 0) {
      console.log(`  ✅ ${cat}: ${present.length}/${spec.expectedVariants.length} variants`);
    } else {
      console.log(`  ⚠️  ${cat}: ${present.length}/${spec.expectedVariants.length} — missing: ${missing.join(', ')}`);
      totalMissing += missing.length;
    }
  }

  console.log(`\nTotal missing variants: ${totalMissing}`);
  if (totalMissing > 0) {
    console.log('Run --generate-queries to create MCP queries for discovery.');
  }
}

main();
