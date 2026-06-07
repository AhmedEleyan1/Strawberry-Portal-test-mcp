#!/usr/bin/env node
// ============================================================
// Multi-Screen Page Builder (Enhancement #14)
// Combines multiple screen JSONs into a single page-level JSON
// that the Figma plugin can render as a full page layout.
//
// Usage:
//   node scripts/build-page.cjs dashboard     # Build dashboard page
//   node scripts/build-page.cjs contract      # Build contract page  
//   node scripts/build-page.cjs company       # Build company page
//   node scripts/build-page.cjs --list        # List available pages
// ============================================================

const fs = require('fs');
const path = require('path');

const SCREENS_DIR = path.resolve(__dirname, '../figma-plugin/screens');
const OUTPUT_DIR = path.resolve(__dirname, '../figma-plugin/pages');

// Page definitions: which screen JSONs compose each page
const PAGE_DEFINITIONS = {
  dashboard: {
    title: 'Dashboard',
    backLink: null,
    screens: ['DashboardTopCard', 'GuestBookingCard'],
    layout: {
      type: 'vertical',
      gap: 24,
      padding: { top: 24, right: 48, bottom: 48, left: 48 },
    },
  },
  contract: {
    title: 'Framework Contract — Clarion Malmö Live',
    backLink: '← Back to Company',
    screens: ['ContractDetailsCard', 'PaymentInfoCard', 'RatesSection'],
    layout: {
      type: 'vertical',
      gap: 24,
      padding: { top: 24, right: 48, bottom: 48, left: 48 },
    },
  },
  company: {
    title: 'Company — Clarion Malmö Live',
    backLink: '← Back to Dashboard',
    screens: ['CompanyDetailsCard', 'ContractsSection'],
    layout: {
      type: 'vertical',
      gap: 24,
      padding: { top: 24, right: 48, bottom: 48, left: 48 },
    },
  },
};

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Multi-Screen Page Builder

Usage:
  node scripts/build-page.cjs <page>     Build a full page from screen JSONs
  node scripts/build-page.cjs --list     List available pages
  node scripts/build-page.cjs --all      Build all pages

Pages: ${Object.keys(PAGE_DEFINITIONS).join(', ')}
    `);
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  if (args[0] === '--list') {
    console.log('Available pages:\n');
    for (const [name, def] of Object.entries(PAGE_DEFINITIONS)) {
      console.log(`  ${name}: ${def.screens.join(' → ')}`);
    }
    return;
  }

  const pagesToBuild = args[0] === '--all' 
    ? Object.keys(PAGE_DEFINITIONS) 
    : [args[0]];

  for (const pageName of pagesToBuild) {
    const def = PAGE_DEFINITIONS[pageName];
    if (!def) {
      console.error(`❌ Unknown page: ${pageName}`);
      console.log(`Available: ${Object.keys(PAGE_DEFINITIONS).join(', ')}`);
      continue;
    }

    // Load all screen JSONs for this page
    const allSections = [];
    const screensMeta = [];

    for (const screenName of def.screens) {
      const screenPath = path.join(SCREENS_DIR, `${screenName}.json`);
      if (!fs.existsSync(screenPath)) {
        console.warn(`  ⚠️  Screen not found: ${screenName}.json — skipping`);
        continue;
      }

      const screenData = JSON.parse(fs.readFileSync(screenPath, 'utf8'));
      allSections.push(...(screenData.sections || []));
      screensMeta.push({
        name: screenName,
        sectionCount: (screenData.sections || []).length,
        source: screenData.meta?.source || '',
      });
    }

    // Build the combined page JSON
    const pageJson = {
      $schema: '../screens/screen-definition.schema.json',
      meta: {
        type: 'full-page',
        pageName: pageName,
        title: def.title,
        generatedAt: new Date().toISOString(),
        screens: screensMeta,
      },
      page: {
        title: def.title,
        backLink: def.backLink || '',
        layout: def.layout,
      },
      sections: allSections,
    };

    const outFile = path.join(OUTPUT_DIR, `${pageName}.page.json`);
    fs.writeFileSync(outFile, JSON.stringify(pageJson, null, 2));

    const totalFields = allSections.reduce((sum, sec) => {
      if (sec.columns) {
        return sum + sec.columns.reduce((s, col) => s + (col.fields?.length || 0), 0);
      }
      return sum;
    }, 0);

    console.log(`✅ ${pageName}.page.json: ${def.screens.length} screens, ${allSections.length} sections, ${totalFields} fields`);
  }
}

main();
