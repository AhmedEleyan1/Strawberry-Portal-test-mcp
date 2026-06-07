#!/usr/bin/env node
// ============================================================
// Design Proposal Workflow (Enhancement #9)
// Generates design option JSONs from a ticket description.
// These can be loaded into the Figma plugin to create
// visual proposals for review.
//
// Usage:
//   node scripts/design-proposal.cjs "Add booking status indicator"
//   node scripts/design-proposal.cjs --variants 5 "Payment method selector"
// ============================================================

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../figma-plugin/proposals');

// Design patterns library
const PATTERNS = {
  'status-indicator': [
    { name: 'Badge', desc: 'Inline badge next to label', section: { type: 'card', layout: 'grid-2col', columns: [{ name: 'Info', fields: [{ label: 'Status', value: 'Confirmed', fieldType: 'badge' }] }] } },
    { name: 'Color Strip', desc: 'Left border color indicator', section: { type: 'card-heading-with-action', title: 'Booking', accentLine: true, accentColor: '#2D8541' } },
    { name: 'Top Banner', desc: 'Full-width status banner', section: { type: 'section-header', title: '✅ Booking Confirmed — #NO827181777289' } },
  ],
  'action-button': [
    { name: 'Heading Action', desc: 'Button in card heading', section: { type: 'card-heading-with-action', title: 'Section', action: { label: 'Action', componentRef: 'buttons/primary/small' } } },
    { name: 'Standalone CTA', desc: 'Full-width primary button', section: { type: 'primary-action-button', label: 'Take Action', componentRef: 'buttons/primary/small' } },
    { name: 'Inline Link', desc: 'Text link in field', section: { type: 'card', layout: 'grid-2col', columns: [{ name: 'Actions', fields: [{ label: 'Action', value: 'Click here', isLink: true }] }] } },
  ],
  'data-display': [
    { name: 'Grid Card', desc: 'Multi-column data grid', section: { type: 'card', layout: 'grid-4col', columns: [{ name: 'Col 1', fields: [{ label: 'Field 1', value: 'Value 1' }] }] } },
    { name: 'Stats Card', desc: 'Overview with progress bars', section: { type: 'top-stats-card', stats: [{ label: 'Metric', value: '42', hasProgress: true }] } },
    { name: 'Table', desc: 'Data table with headers', section: { type: 'data-table', headers: ['Name', 'Value', 'Status'] } },
    { name: 'Teaser Card', desc: 'Clickable summary card', section: { type: 'teaser-card', title: 'Item Name', fields: [{ label: 'Type', value: 'Standard' }], hasBadge: true } },
  ],
  'navigation': [
    { name: 'Collapsible', desc: 'Expandable details section', section: { type: 'collapsible-section', label: 'More Details' } },
    { name: 'Filter Bar', desc: 'Horizontal filter controls', section: { type: 'filter-bar' } },
  ],
};

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Design Proposal Workflow

Usage:
  node scripts/design-proposal.cjs "<ticket description>"
  node scripts/design-proposal.cjs --variants <N> "<description>"
  node scripts/design-proposal.cjs --list-patterns

Generates N design option JSONs that can be loaded into the Figma plugin.
    `);
    return;
  }

  if (args[0] === '--list-patterns') {
    console.log('Available design patterns:\n');
    for (const [cat, patterns] of Object.entries(PATTERNS)) {
      console.log(`  📦 ${cat}:`);
      for (const p of patterns) {
        console.log(`     • ${p.name} — ${p.desc}`);
      }
    }
    return;
  }

  let numVariants = 3;
  let description = '';

  if (args[0] === '--variants') {
    numVariants = parseInt(args[1]) || 3;
    description = args.slice(2).join(' ');
  } else {
    description = args.join(' ');
  }

  if (!description) {
    console.error('❌ Please provide a ticket description');
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Detect relevant patterns from description
  const keywords = description.toLowerCase();
  let relevantPatterns = [];

  if (keywords.includes('status') || keywords.includes('badge') || keywords.includes('indicator')) {
    relevantPatterns.push(...PATTERNS['status-indicator']);
  }
  if (keywords.includes('button') || keywords.includes('action') || keywords.includes('cta') || keywords.includes('link')) {
    relevantPatterns.push(...PATTERNS['action-button']);
  }
  if (keywords.includes('data') || keywords.includes('card') || keywords.includes('display') || keywords.includes('info') || keywords.includes('stats')) {
    relevantPatterns.push(...PATTERNS['data-display']);
  }
  if (keywords.includes('nav') || keywords.includes('filter') || keywords.includes('collapse') || keywords.includes('expand')) {
    relevantPatterns.push(...PATTERNS['navigation']);
  }

  // Fallback: use all patterns
  if (relevantPatterns.length === 0) {
    for (const patterns of Object.values(PATTERNS)) {
      relevantPatterns.push(...patterns);
    }
  }

  // Limit to requested variants
  relevantPatterns = relevantPatterns.slice(0, numVariants);

  // Generate proposal JSONs
  const slug = description.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().substring(0, 30);
  
  console.log(`\n🎨 Design Proposals for: "${description}"\n`);

  for (let i = 0; i < relevantPatterns.length; i++) {
    const pattern = relevantPatterns[i];
    const option = {
      $schema: '../screens/screen-definition.schema.json',
      meta: {
        type: 'design-proposal',
        ticket: description,
        option: i + 1,
        optionName: pattern.name,
        generatedAt: new Date().toISOString(),
      },
      sections: [pattern.section],
    };

    const filename = `proposal-${slug}-option${i + 1}.json`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), JSON.stringify(option, null, 2));
    console.log(`  Option ${i + 1}: ${pattern.name}`);
    console.log(`  └─ ${pattern.desc}`);
    console.log(`  └─ ${filename}\n`);
  }

  console.log(`✅ Generated ${relevantPatterns.length} proposals in figma-plugin/proposals/`);
  console.log('Load them in the Figma plugin to preview each option.');
}

main();
