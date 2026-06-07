#!/usr/bin/env node
// ============================================================
// Visual Regression Testing (Enhancement #7)
// Compares screen JSONs between runs to detect structural changes.
// Generates a diff report showing what changed.
//
// Usage:
//   node scripts/visual-diff.cjs                 # Compare current vs baseline
//   node scripts/visual-diff.cjs --save-baseline  # Save current as baseline
//   node scripts/visual-diff.cjs --report          # Generate full diff report
// ============================================================

const fs = require('fs');
const path = require('path');

const SCREENS_DIR = path.resolve(__dirname, '../figma-plugin/screens');
const BASELINE_DIR = path.resolve(__dirname, '../figma-plugin/.baseline');
const REPORT_PATH = path.resolve(__dirname, '../figma-plugin/diff-report.md');

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--help') {
    console.log(`
Visual Regression Testing

Usage:
  node scripts/visual-diff.cjs --save-baseline   Save current JSONs as baseline
  node scripts/visual-diff.cjs                    Compare current vs baseline
  node scripts/visual-diff.cjs --report           Generate markdown diff report
    `);
    return;
  }

  if (args.includes('--save-baseline')) {
    saveBaseline();
    return;
  }

  if (!fs.existsSync(BASELINE_DIR)) {
    console.log('⚠️  No baseline found. Run with --save-baseline first.');
    return;
  }

  const diffs = compareAll();
  
  if (args.includes('--report')) {
    generateReport(diffs);
  }
}

function saveBaseline() {
  if (!fs.existsSync(BASELINE_DIR)) {
    fs.mkdirSync(BASELINE_DIR, { recursive: true });
  }

  const files = fs.readdirSync(SCREENS_DIR).filter(f => f.endsWith('.json') && !f.includes('schema'));
  for (const file of files) {
    fs.copyFileSync(
      path.join(SCREENS_DIR, file),
      path.join(BASELINE_DIR, file)
    );
  }
  console.log(`✅ Saved baseline: ${files.length} files to .baseline/`);
}

function compareAll() {
  const currentFiles = fs.readdirSync(SCREENS_DIR).filter(f => f.endsWith('.json') && !f.includes('schema'));
  const baselineFiles = fs.existsSync(BASELINE_DIR) 
    ? fs.readdirSync(BASELINE_DIR).filter(f => f.endsWith('.json'))
    : [];

  const allFiles = new Set([...currentFiles, ...baselineFiles]);
  const diffs = [];

  for (const file of allFiles) {
    const currentPath = path.join(SCREENS_DIR, file);
    const baselinePath = path.join(BASELINE_DIR, file);

    const hasCurrent = fs.existsSync(currentPath);
    const hasBaseline = fs.existsSync(baselinePath);

    if (hasCurrent && !hasBaseline) {
      console.log(`  🆕 ${file} (new)`);
      diffs.push({ file, status: 'added' });
      continue;
    }

    if (!hasCurrent && hasBaseline) {
      console.log(`  🗑️  ${file} (deleted)`);
      diffs.push({ file, status: 'deleted' });
      continue;
    }

    const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

    // Remove timestamps for comparison
    delete current.meta?.generatedAt;
    delete baseline.meta?.generatedAt;
    delete current.$schema;
    delete baseline.$schema;

    const changes = deepDiff(baseline, current);

    if (changes.length === 0) {
      console.log(`  ✅ ${file} (unchanged)`);
      diffs.push({ file, status: 'unchanged' });
    } else {
      console.log(`  🔄 ${file} (${changes.length} changes)`);
      diffs.push({ file, status: 'changed', changes });
    }
  }

  const changed = diffs.filter(d => d.status !== 'unchanged').length;
  console.log(`\nResult: ${diffs.length} files, ${changed} changed`);
  return diffs;
}

function deepDiff(a, b, path = '') {
  const changes = [];

  if (typeof a !== typeof b) {
    changes.push({ path: path || 'root', type: 'type-change', from: typeof a, to: typeof b });
    return changes;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      changes.push({ path, type: 'array-length', from: a.length, to: b.length });
    }
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) {
        changes.push({ path: `${path}[${i}]`, type: 'added' });
      } else if (i >= b.length) {
        changes.push({ path: `${path}[${i}]`, type: 'removed' });
      } else {
        changes.push(...deepDiff(a[i], b[i], `${path}[${i}]`));
      }
    }
    return changes;
  }

  if (typeof a === 'object' && a !== null && b !== null) {
    const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const key of allKeys) {
      const childPath = path ? `${path}.${key}` : key;
      if (!(key in a)) {
        changes.push({ path: childPath, type: 'added', value: b[key] });
      } else if (!(key in b)) {
        changes.push({ path: childPath, type: 'removed', value: a[key] });
      } else {
        changes.push(...deepDiff(a[key], b[key], childPath));
      }
    }
    return changes;
  }

  if (a !== b) {
    changes.push({ path, type: 'value-change', from: a, to: b });
  }

  return changes;
}

function generateReport(diffs) {
  const lines = [
    '# Visual Regression Report',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    `| Status | Count |`,
    `|--------|-------|`,
    `| ✅ Unchanged | ${diffs.filter(d => d.status === 'unchanged').length} |`,
    `| 🔄 Changed | ${diffs.filter(d => d.status === 'changed').length} |`,
    `| 🆕 Added | ${diffs.filter(d => d.status === 'added').length} |`,
    `| 🗑️ Deleted | ${diffs.filter(d => d.status === 'deleted').length} |`,
    '',
  ];

  const changedDiffs = diffs.filter(d => d.status === 'changed');
  if (changedDiffs.length > 0) {
    lines.push('## Changes');
    for (const diff of changedDiffs) {
      lines.push(`### ${diff.file}`);
      for (const change of (diff.changes || [])) {
        if (change.type === 'value-change') {
          lines.push(`- \`${change.path}\`: \`${change.from}\` → \`${change.to}\``);
        } else if (change.type === 'added') {
          lines.push(`- \`${change.path}\`: ✨ added`);
        } else if (change.type === 'removed') {
          lines.push(`- \`${change.path}\`: 🗑️ removed`);
        } else if (change.type === 'array-length') {
          lines.push(`- \`${change.path}\`: array ${change.from} → ${change.to} items`);
        }
      }
      lines.push('');
    }
  }

  fs.writeFileSync(REPORT_PATH, lines.join('\n'));
  console.log(`\n📄 Report saved: ${path.relative(process.cwd(), REPORT_PATH)}`);
}

main();
