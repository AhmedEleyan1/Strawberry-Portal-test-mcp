const fs = require('fs');
const path = require('path');

// Read the component data
const dataPath = path.join(
  '/Users/ahmedeleyan/.gemini/antigravity-ide/brain',
  '49e8a857-7098-4c12-9e85-d0fd4fdbbba9',
  '.system_generated/steps/625/output.txt'
);
const data = fs.readFileSync(dataPath, 'utf8');

// Parse YAML-like component entries
const components = {};
const lines = data.split('\n');
let currentId = null;
let currentComp = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/^\s{4}(\d+:\d+):$/);
  if (idMatch) {
    if (currentId && currentComp.key && currentComp.name) {
      components[currentId] = { ...currentComp };
    }
    currentId = idMatch[1];
    currentComp = {};
    continue;
  }
  const kvMatch = line.match(/^\s{6}(\w+):\s*(.+)$/);
  if (kvMatch) {
    currentComp[kvMatch[1]] = kvMatch[2].trim();
  }
}
if (currentId && currentComp.key && currentComp.name) {
  components[currentId] = { ...currentComp };
}

console.log(`Parsed ${Object.keys(components).length} components`);

// Build semantic name from component name
function toKey(name) {
  return name
    .replace(/\s*\/\s*/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    .replace(/^([A-Z])/, (_, c) => c.toLowerCase());
}

// Organize components by category
const organized = {};

// Track componentSetIds to find default variants
const componentSets = {};
for (const [id, comp] of Object.entries(components)) {
  if (comp.componentSetId) {
    if (!componentSets[comp.componentSetId]) componentSets[comp.componentSetId] = [];
    componentSets[comp.componentSetId].push({ id, ...comp });
  }
}

// Pick unique components - prefer those without componentSetId (standalone)
// or default/first variant of a set
const seen = new Set();
const picked = [];

// First pass: standalone components (no componentSetId)
for (const [id, comp] of Object.entries(components)) {
  if (!comp.componentSetId) {
    picked.push({ id, ...comp });
    seen.add(id);
  }
}

// Second pass: default variants from component sets
for (const [setId, variants] of Object.entries(componentSets)) {
  // Find default variant
  const defaultVar = variants.find(v => {
    const n = v.name.toLowerCase();
    return n.includes('state=default') || n.includes('state=inactive') || n.includes('property 1=default');
  }) || variants[0]; // fallback to first
  
  if (!seen.has(defaultVar.id)) {
    picked.push(defaultVar);
    seen.add(defaultVar.id);
  }
}

// Build the COMPONENT_KEYS object with organized categories
const keys = {};
for (const comp of picked) {
  const k = toKey(comp.name);
  if (!keys[k]) {
    keys[k] = comp.key;
  }
}

// Generate the JS code
let js = 'var COMPONENT_KEYS = {\n';
const entries = Object.entries(keys).sort(([a], [b]) => a.localeCompare(b));
for (let i = 0; i < entries.length; i++) {
  const [k, v] = entries[i];
  const comma = i < entries.length - 1 ? ',' : '';
  js += `  ${k}: "${v}"${comma}\n`;
}
js += '};';

console.log(`Generated ${entries.length} COMPONENT_KEYS entries`);

// Read code.js and replace COMPONENT_KEYS
const codePath = path.join(__dirname, '..', 'figma-plugin', 'code.js');
let code = fs.readFileSync(codePath, 'utf8');

const startMarker = 'var COMPONENT_KEYS = {';
const startIdx = code.indexOf(startMarker);
if (startIdx === -1) {
  console.error('Could not find COMPONENT_KEYS in code.js');
  process.exit(1);
}

// Find the closing };
let braceCount = 0;
let endIdx = startIdx;
for (let i = startIdx; i < code.length; i++) {
  if (code[i] === '{') braceCount++;
  if (code[i] === '}') {
    braceCount--;
    if (braceCount === 0) {
      endIdx = i + 2; // include }; 
      break;
    }
  }
}

code = code.substring(0, startIdx) + js + code.substring(endIdx);
fs.writeFileSync(codePath, code, 'utf8');
console.log('Successfully patched code.js');
