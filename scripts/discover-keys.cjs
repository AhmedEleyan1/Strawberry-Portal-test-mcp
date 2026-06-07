#!/usr/bin/env node
// ============================================================
// Component Key Auto-Discovery (Enhancement #13)
// Scans the Figma file via MCP and updates figma-registry.json
// with discovered component keys.
//
// Usage:
//   node scripts/discover-keys.cjs                 # Scan and report
//   node scripts/discover-keys.cjs --update        # Scan and update registry
//   node scripts/discover-keys.cjs --scan-plugin   # Scan code.js for hardcoded keys
// ============================================================

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.resolve(__dirname, '../figma-registry.json');
const CODE_JS_PATH = path.resolve(__dirname, '../figma-plugin/code.js');
const SCREENS_DIR = path.resolve(__dirname, '../figma-plugin/screens');

function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--help' || args.length === 0) {
    console.log(`
Component Key Auto-Discovery

Usage:
  node scripts/discover-keys.cjs --scan-plugin     Scan code.js for hardcoded keys not in registry
  node scripts/discover-keys.cjs --scan-screens     Scan screen JSONs for hardcoded keys
  node scripts/discover-keys.cjs --audit            Full audit: check all sources for consistency

Report shows which keys are:
  ✅ In registry (named)
  ⚠️  Hardcoded (should be migrated to registry)
  ❌ Missing (referenced but not found)
    `);
    return;
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  
  // Build a flat map of all known keys from registry
  const knownKeys = new Set();
  const registryMap = {}; // hash → name

  function collectKeys(obj, prefix = '') {
    for (const [name, entry] of Object.entries(obj)) {
      const fullName = prefix ? `${prefix}/${name}` : name;
      if (typeof entry === 'string' && entry.length === 40) {
        knownKeys.add(entry);
        registryMap[entry] = fullName;
      }
      if (entry && typeof entry === 'object') {
        if (entry.figmaKey) {
          knownKeys.add(entry.figmaKey);
          registryMap[entry.figmaKey] = fullName;
        }
        if (entry.variants) {
          collectKeys(entry.variants, fullName);
        }
      }
    }
  }
  collectKeys(registry.componentKeys || {});

  if (args.includes('--scan-plugin')) {
    scanPlugin(knownKeys, registryMap);
  }

  if (args.includes('--scan-screens')) {
    scanScreens(knownKeys, registryMap);
  }

  if (args.includes('--audit')) {
    scanPlugin(knownKeys, registryMap);
    console.log('');
    scanScreens(knownKeys, registryMap);
    console.log('');
    auditRegistry(registry);
  }
}

function scanPlugin(knownKeys, registryMap) {
  console.log('🔍 Scanning code.js for component keys...');
  const source = fs.readFileSync(CODE_JS_PATH, 'utf8');
  
  // Find all 40-char hex strings (Figma keys)
  const keyPattern = /["']([0-9a-f]{40})["']/g;
  let match;
  const found = new Map(); // key → line numbers

  const lines = source.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    while ((match = keyPattern.exec(line)) !== null) {
      const key = match[1];
      if (!found.has(key)) found.set(key, []);
      found.get(key).push(i + 1);
    }
  }

  let inRegistry = 0;
  let hardcoded = 0;

  console.log(`\nFound ${found.size} unique keys:\n`);
  for (const [key, lineNums] of found) {
    const shortKey = key.substring(0, 12) + '...';
    if (knownKeys.has(key)) {
      console.log(`  ✅ ${shortKey} → ${registryMap[key]} (L${lineNums.join(',')})`);
      inRegistry++;
    } else {
      console.log(`  ⚠️  ${shortKey} → NOT IN REGISTRY (L${lineNums.join(',')})`);
      hardcoded++;
    }
  }

  console.log(`\nSummary: ${inRegistry} in registry, ${hardcoded} hardcoded`);
}

function scanScreens(knownKeys, registryMap) {
  console.log('🔍 Scanning screen JSONs for component keys...');

  const files = fs.readdirSync(SCREENS_DIR).filter(f => f.endsWith('.json') && !f.includes('schema'));
  let totalNamed = 0;
  let totalHardcoded = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(SCREENS_DIR, file), 'utf8');
    const keyPattern = /[0-9a-f]{40}/g;
    let match;
    const hardcoded = [];

    while ((match = keyPattern.exec(content)) !== null) {
      if (!knownKeys.has(match[0])) {
        hardcoded.push(match[0].substring(0, 12) + '...');
      }
    }

    // Count named refs
    const refPattern = /"componentRef":\s*"([^"]+)"/g;
    let namedCount = 0;
    while ((match = refPattern.exec(content)) !== null) namedCount++;

    const iconRefPattern = /"iconRef":\s*"([^"]+)"/g;
    while ((match = iconRefPattern.exec(content)) !== null) namedCount++;

    if (hardcoded.length > 0) {
      console.log(`  ⚠️  ${file}: ${hardcoded.length} hardcoded keys (${hardcoded.join(', ')})`);
      totalHardcoded += hardcoded.length;
    } else if (namedCount > 0) {
      console.log(`  ✅ ${file}: ${namedCount} named refs`);
      totalNamed += namedCount;
    } else {
      console.log(`  ✅ ${file}: no component refs`);
    }
  }

  console.log(`\nSummary: ${totalNamed} named, ${totalHardcoded} hardcoded across ${files.length} files`);
}

function auditRegistry(registry) {
  console.log('📋 Registry Audit:');
  
  const componentKeys = registry.componentKeys || {};
  let totalEntries = 0;
  let totalVariants = 0;

  for (const [name, entry] of Object.entries(componentKeys)) {
    if (entry.variants) {
      const varCount = Object.keys(entry.variants).length;
      console.log(`  📦 ${name}: ${varCount} variants`);
      totalVariants += varCount;
    } else if (entry.figmaKey) {
      console.log(`  📦 ${name}: single key`);
    }
    totalEntries++;
  }

  console.log(`\nTotal: ${totalEntries} entries, ${totalVariants} variants`);
}

main();
