// ============================================================
// Strawberry Portal — Figma Screen Builder Plugin
// Builds the Payment Information section using design system
// components, variables, and proper Auto Layout.
// ============================================================

// -- Design Tokens (from index.css :root) --
const TOKENS = {
  colors: {
    varmGrey:      { r: 0.969, g: 0.961, b: 0.953 },  // #F7F5F3
    cardBg:        { r: 1,     g: 1,     b: 1     },  // #FFFFFF
    textPrimary:   { r: 0,     g: 0,     b: 0     },  // #000000
    textSecondary: { r: 0.443, g: 0.439, b: 0.435 },  // #71706F
    textLink:      { r: 0.353, g: 0,     b: 0.196 },  // #5A0032
    borderLight:   { r: 0.922, g: 0.914, b: 0.906 },  // #EBE9E7
    borderMedium:  { r: 0.847, g: 0.831, b: 0.816 },  // #D8D4D0
  },
  fonts: {
    display: "Strawberry Sans Display",
    displayFallback: "Outfit",
    body: "Strawberry Sans Text",
    bodyFallback: "Inter",
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  layout: {
    cardPadding: 32,
    cardRadius: 8,
    gridColumnWidth: 320,
    gridGap: 16,
    fieldGap: 32,
    contentWidth: 1392,
  },
};

// -- Figma Component Keys (from your Strawberry Portal file) --
const COMPONENT_KEYS = {
  infoIcon: "6914f5cb9f180144235bf1c7ab814ff3bfcee8ea",       // alert / info (96:19177)
  tooltipTop: "33d39f3d3cf15db182084dca548667fc178d46a7",      // Tooltip Position=top (3441:55732)
  tooltipRight: "464d5a616eb7ce7d5de373ca8e8e17176dadb04b",    // Tooltip Position=right (3441:55736)
  tooltipBottom: "7c6713c21b6b6a83ed18a7e1553c657d19ad6731",   // Tooltip Position=bottom (3441:55724)
  tooltipLeft: "30f9471172fc8d4cf42c4f1450d566241bd02c23",     // Tooltip Position=left (3441:55728)
};

// -- Payment Information field data --
const PAYMENT_FIELDS = {
  columns: [
    {
      name: "Column 1",
      fields: [
        { label: "Payment Type", value: "Invoice", hasInfo: true, infoText: "Determines the method by which the client will settle billing amounts. Synced from Salesforce.", tooltipPos: "right" },
        { label: "Contracted Payment Terms", value: "30", hasInfo: true, infoText: "Synced from Salesforce.", tooltipPos: "top" },
        { label: "Contracted Invoice Fee", value: "Yes", hasInfo: true, infoText: "Synced from Salesforce.", tooltipPos: "top" },
      ],
    },
    {
      name: "Column 2",
      fields: [
        { label: "Invoice Conditions", value: "Continuous invoicing allowed", hasInfo: true, infoText: "Under what conditions is the creation of invoices allowed. Synced from Salesforce.", tooltipPos: "top" },
        { label: "Invoice Frequency", value: "Continuously", hasInfo: true, infoText: "Determines how often invoice cycles are generated automatically. Synced from Salesforce.", tooltipPos: "top" },
        { label: "Invoice Reference", value: "–", hasInfo: true, infoText: "Mandatory customer PO or reference number required on invoices. Synced from Salesforce.", tooltipPos: "top" },
      ],
    },
    {
      name: "Column 3",
      fields: [
        { label: "To be Invoiced", value: "Specific Account Detail", hasInfo: true, infoText: "Determines which legal entity must receive the invoices. Synced from Salesforce.", tooltipPos: "top" },
        { label: "Account Detail to Invoice", value: "AB Volvo Penta", hasInfo: true, infoText: "The specific account entity linked for billing. Synced from Salesforce.", tooltipPos: "top", isLink: true },
        { label: "Other Payment Details", value: "–", hasInfo: true, infoText: "Specific notes regarding custom payment arrangements. Synced from Salesforce.", tooltipPos: "top" },
      ],
    },
    {
      name: "Column 4",
      fields: [
        { label: "Inherit Options", value: "–", hasInfo: true, infoText: "Defines if payment conditions should be inherited from parent account. Synced from Salesforce.", tooltipPos: "top" },
      ],
    },
  ],
};

// ============================================================
// Helper: Try to load a font, fallback if unavailable
// ============================================================
async function loadFont(family, style) {
  try {
    await figma.loadFontAsync({ family, style: style || "Regular" });
    return family;
  } catch (e) {
    return null;
  }
}

async function getBodyFont() {
  const primary = await loadFont(TOKENS.fonts.body);
  if (primary) return primary;
  const fallback = await loadFont(TOKENS.fonts.bodyFallback);
  if (fallback) return fallback;
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  return "Inter";
}

async function getDisplayFont() {
  const primary = await loadFont(TOKENS.fonts.display);
  if (primary) return primary;
  const fallback = await loadFont(TOKENS.fonts.displayFallback);
  if (fallback) return fallback;
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  return "Inter";
}

async function loadBoldFont(family) {
  try {
    await figma.loadFontAsync({ family, style: "Bold" });
    return true;
  } catch (e) {
    try {
      await figma.loadFontAsync({ family, style: "SemiBold" });
      return true;
    } catch (e) {
      return false;
    }
  }
}

// ============================================================
// Variable Discovery — find and bind to existing Figma variables
// ============================================================
let COLOR_VARS = {};  // Will be populated with { tokenName: variable } mappings
let TEXT_STYLE_MAP = {};  // { "heading_20_bold": styleId, "label_12_regular": styleId, ... }
let TEXT_STYLES = {}; // Will be populated with { styleName: textStyle } mappings

// Search terms to match variable names to our tokens
const VAR_SEARCH_MAP = {
  textPrimary:   ["text/primary", "text-primary", "primary", "black", "text / primary"],
  textSecondary: ["text/secondary", "text-secondary", "secondary", "grey", "text / secondary"],
  textLink:      ["text/link", "text-link", "link", "burgundy", "strawberry", "brand", "text / link", "accent"],
  cardBg:        ["card/bg", "card-bg", "surface", "white", "background/card", "card / bg"],
  borderLight:   ["border/light", "border-light", "divider", "separator", "border / light"],
  borderMedium:  ["border/medium", "border-medium", "border / medium"],
  varmGrey:      ["varm-grey", "varm grey", "background", "bg/page", "page-bg"],
};

// Hex values to match as fallback
const HEX_MAP = {
  "000000": "textPrimary",
  "71706f": "textSecondary",
  "5a0032": "textLink",
  "ffffff": "cardBg",
  "ebe9e7": "borderLight",
  "d8d4d0": "borderMedium",
  "f7f5f3": "varmGrey",
};

function rgbToHex(r, g, b) {
  var toHex = function(c) {
    var hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return (toHex(r) + toHex(g) + toHex(b)).toLowerCase();
}

async function discoverVariables() {
  try {
    var allColorVars = figma.variables.getLocalVariables("COLOR");
    console.log("Found " + allColorVars.length + " local color variables");

    // Try matching by name first
    for (var i = 0; i < allColorVars.length; i++) {
      var v = allColorVars[i];
      var name = v.name.toLowerCase();
      
      for (var tokenName in VAR_SEARCH_MAP) {
        var searchTerms = VAR_SEARCH_MAP[tokenName];
        for (var j = 0; j < searchTerms.length; j++) {
          if (name.indexOf(searchTerms[j].toLowerCase()) !== -1 && !COLOR_VARS[tokenName]) {
            COLOR_VARS[tokenName] = v;
            console.log("Matched variable: " + v.name + " → " + tokenName);
            break;
          }
        }
      }
    }

    // Fallback: match by hex value
    for (var i = 0; i < allColorVars.length; i++) {
      var v = allColorVars[i];
      var modeIds = Object.keys(v.valuesByMode);
      if (modeIds.length > 0) {
        var val = v.valuesByMode[modeIds[0]];
        if (val && typeof val === "object" && "r" in val) {
          var hex = rgbToHex(val.r, val.g, val.b);
          var matchedToken = HEX_MAP[hex];
          if (matchedToken && !COLOR_VARS[matchedToken]) {
            COLOR_VARS[matchedToken] = v;
            console.log("Matched variable by hex (#" + hex + "): " + v.name + " → " + matchedToken);
          }
        }
      }
    }

    var matchedCount = Object.keys(COLOR_VARS).length;
    console.log("Total matched: " + matchedCount + "/" + Object.keys(VAR_SEARCH_MAP).length + " color tokens");
  } catch (e) {
    console.log("Variable discovery failed, using raw colors:", e);
  }
}

// Discover and map text styles by size + weight
async function discoverTextStyles() {
  try {
    var allStyles = figma.getLocalTextStyles();
    console.log("Found " + allStyles.length + " local text styles");

    for (var i = 0; i < allStyles.length; i++) {
      var s = allStyles[i];
      var size = s.fontSize;
      var weight = s.fontName.style.toLowerCase();
      var name = s.name.toLowerCase();
      var key = size + "_" + weight;

      // Store by size+weight combo for matching
      if (!TEXT_STYLE_MAP[key]) {
        TEXT_STYLE_MAP[key] = s.id;
        console.log("Text style: " + s.name + " (" + size + "px " + weight + ") -> " + key);
      }

      // Also store by name patterns for more specific matching
      if (name.indexOf("heading") !== -1 || name.indexOf("title") !== -1) {
        TEXT_STYLE_MAP["heading_" + size] = s.id;
      }
      if (name.indexOf("label") !== -1 || name.indexOf("caption") !== -1) {
        TEXT_STYLE_MAP["label_" + size] = s.id;
      }
      if (name.indexOf("body") !== -1 || name.indexOf("paragraph") !== -1) {
        TEXT_STYLE_MAP["body_" + size] = s.id;
      }
      if (name.indexOf("link") !== -1) {
        TEXT_STYLE_MAP["link_" + size] = s.id;
      }
    }

    console.log("Text style keys: " + Object.keys(TEXT_STYLE_MAP).join(", "));
  } catch (e) {
    console.log("Text style discovery failed:", e);
  }
}

// Apply the best matching text style to a text node
function applyTextStyle(textNode, fontSize, fontWeight, role) {
  var weight = (fontWeight || "regular").toLowerCase();
  
  // Try role-specific match first (e.g., "heading_20", "label_12", "body_16")
  var roleKey = role + "_" + fontSize;
  if (TEXT_STYLE_MAP[roleKey]) {
    textNode.textStyleId = TEXT_STYLE_MAP[roleKey];
    return true;
  }

  // Try exact size + weight match (e.g., "20_bold", "12_regular")
  var sizeWeightKey = fontSize + "_" + weight;
  if (TEXT_STYLE_MAP[sizeWeightKey]) {
    textNode.textStyleId = TEXT_STYLE_MAP[sizeWeightKey];
    return true;
  }

  // Try just size match with common weight variants
  var variants = [weight, "regular", "medium", "book"];
  for (var i = 0; i < variants.length; i++) {
    var k = fontSize + "_" + variants[i];
    if (TEXT_STYLE_MAP[k]) {
      textNode.textStyleId = TEXT_STYLE_MAP[k];
      return true;
    }
  }

  return false;
}

// ============================================================
// Helper: Create a solid fill — bound to Figma Variable if found
// ============================================================
function solidFill(color, opacity, tokenName) {
  var paint = { type: "SOLID", color: color, opacity: opacity !== undefined ? opacity : 1 };
  
  if (tokenName && COLOR_VARS[tokenName]) {
    try {
      var boundPaint = figma.variables.setBoundVariableForPaint(paint, "color", COLOR_VARS[tokenName]);
      return [boundPaint];
    } catch (e) {
      console.log("Could not bind variable for " + tokenName + ":", e);
    }
  }
  
  return [paint];
}

// ============================================================
// Helper: Try to import a Figma component by key
// ============================================================
async function tryImportComponent(key) {
  try {
    return await figma.importComponentByKeyAsync(key);
  } catch (e) {
    console.log(`Could not import component key: ${key}`, e);
    return null;
  }
}

// ============================================================
// Build: Section Header ("Payment Information" title)
// ============================================================
async function buildSectionHeader(displayFont) {
  var text = figma.createText();
  text.fontName = { family: displayFont, style: "Bold" };
  text.characters = "Payment Information";
  text.fontSize = 20;
  text.lineHeight = { value: 28, unit: "PIXELS" };
  text.fills = solidFill(TOKENS.colors.textPrimary, undefined, "textPrimary");
  text.name = "Section Header";
  applyTextStyle(text, 20, "bold", "heading");
  return text;
}

// ============================================================
// Build: Info Icon (tries to use Figma component instance)
// ============================================================
async function buildInfoIcon() {
  const component = await tryImportComponent(COMPONENT_KEYS.infoIcon);
  if (component) {
    const instance = component.createInstance();
    instance.name = "info-icon";
    instance.resize(20, 20);
    return instance;
  }
  // Fallback: create a simple circle with "i"
  const frame = figma.createFrame();
  frame.name = "info-icon-fallback";
  frame.resize(20, 20);
  frame.cornerRadius = 10;
  frame.fills = solidFill(TOKENS.colors.textSecondary, 0.2);
  frame.strokes = solidFill(TOKENS.colors.textSecondary);
  frame.strokeWeight = 1.5;
  return frame;
}

// ============================================================
// Build: Label row (label text + optional info icon)
// ============================================================
async function buildLabelRow(labelText, hasInfo, bodyFont) {
  const row = figma.createFrame();
  row.name = "label-row";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 4;
  row.counterAxisAlignItems = "CENTER";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  var label = figma.createText();
  label.fontName = { family: bodyFont, style: "Regular" };
  label.characters = labelText;
  label.fontSize = 12;
  label.lineHeight = { value: 16, unit: "PIXELS" };
  label.fills = solidFill(TOKENS.colors.textSecondary, undefined, "textSecondary");
  label.name = "field-label";
  applyTextStyle(label, 12, "regular", "label");
  row.appendChild(label);

  if (hasInfo) {
    const icon = await buildInfoIcon();
    row.appendChild(icon);
  }

  return row;
}

// ============================================================
// Build: Field Value
// ============================================================
async function buildFieldValue(valueText, bodyFont, isLink) {
  var value = figma.createText();
  value.fontName = { family: bodyFont, style: "Regular" };
  value.characters = valueText || "–";
  value.fontSize = 16;
  value.lineHeight = { value: 24, unit: "PIXELS" };

  if (isLink) {
    value.fills = solidFill(TOKENS.colors.textLink, undefined, "textLink");
    value.textDecoration = "UNDERLINE";
    value.name = "field-value-link";
    applyTextStyle(value, 16, "regular", "link");
  } else {
    value.fills = solidFill(TOKENS.colors.textPrimary, undefined, "textPrimary");
    value.name = "field-value";
    applyTextStyle(value, 16, "regular", "body");
  }

  return value;
}

// ============================================================
// Build: Single Details Field (label + value stacked)
// ============================================================
async function buildDetailsField(fieldData, bodyFont) {
  const field = figma.createFrame();
  field.name = `field / ${fieldData.label}`;
  field.layoutMode = "VERTICAL";
  field.itemSpacing = TOKENS.spacing.sm; // 8px gap between label and value
  field.primaryAxisSizingMode = "AUTO";
  field.counterAxisSizingMode = "AUTO";
  field.fills = [];

  const labelRow = await buildLabelRow(fieldData.label, fieldData.hasInfo, bodyFont);
  field.appendChild(labelRow);

  const value = await buildFieldValue(fieldData.value, bodyFont, fieldData.isLink);
  field.appendChild(value);

  return field;
}

// ============================================================
// Build: Grid Column (vertical stack of fields)
// ============================================================
async function buildGridColumn(columnData, bodyFont) {
  const column = figma.createFrame();
  column.name = columnData.name;
  column.layoutMode = "VERTICAL";
  column.itemSpacing = TOKENS.layout.fieldGap; // 32px gap between fields
  column.primaryAxisSizingMode = "AUTO";
  column.counterAxisSizingMode = "FIXED";
  column.resize(TOKENS.layout.gridColumnWidth, 200);
  column.fills = [];

  for (const fieldData of columnData.fields) {
    const field = await buildDetailsField(fieldData, bodyFont);
    column.appendChild(field);
    field.layoutSizingHorizontal = "FILL";
    field.layoutSizingVertical = "HUG";
  }

  return column;
}

// ============================================================
// Build: Card Grid (4-column horizontal layout)
// ============================================================
async function buildCardGrid(bodyFont) {
  const grid = figma.createFrame();
  grid.name = "card-grid";
  grid.layoutMode = "HORIZONTAL";
  grid.itemSpacing = TOKENS.layout.gridGap; // 16px
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.fills = [];

  for (const columnData of PAYMENT_FIELDS.columns) {
    const column = await buildGridColumn(columnData, bodyFont);
    grid.appendChild(column);
  }

  return grid;
}

// ============================================================
// Build: Card wrapper
// ============================================================
async function buildCard(bodyFont) {
  const card = figma.createFrame();
  card.name = "Payment Information / Card";
  card.layoutMode = "VERTICAL";
  card.paddingTop = TOKENS.layout.cardPadding;
  card.paddingBottom = TOKENS.layout.cardPadding;
  card.paddingLeft = TOKENS.layout.cardPadding;
  card.paddingRight = TOKENS.layout.cardPadding;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(TOKENS.layout.contentWidth, 400);
  card.cornerRadius = TOKENS.layout.cardRadius; // 8px
  card.fills = solidFill(TOKENS.colors.cardBg, undefined, "cardBg");

  // Subtle card shadow
  card.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.04 },
    offset: { x: 0, y: 1 },
    radius: 4,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  const grid = await buildCardGrid(bodyFont);
  card.appendChild(grid);

  return card;
}

// ============================================================
// Build: Full Payment Information Section
// ============================================================
async function buildPaymentSection() {
  // Discover Figma variables and text styles
  await discoverVariables();
  await discoverTextStyles();
  
  var bodyFont = await getBodyFont();
  const displayFont = await getDisplayFont();
  await loadBoldFont(displayFont);

  // Section wrapper
  const section = figma.createFrame();
  section.name = "Payment Information Section";
  section.layoutMode = "VERTICAL";
  section.itemSpacing = TOKENS.spacing.sm; // 8px gap between title and card
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  section.fills = [];

  // Section header
  const header = await buildSectionHeader(displayFont);
  section.appendChild(header);

  // Card
  const card = await buildCard(bodyFont);
  section.appendChild(card);

  // Position in viewport
  section.x = Math.round(figma.viewport.center.x - TOKENS.layout.contentWidth / 2);
  section.y = Math.round(figma.viewport.center.y - 100);

  figma.currentPage.appendChild(section);
  figma.viewport.scrollAndZoomIntoView([section]);

  return section;
}

// ============================================================
// MAIN — Run the plugin
// ============================================================
async function main() {
  figma.notify("🏗️ Building Payment Information section...", { timeout: 2000 });

  try {
    const section = await buildPaymentSection();

    const fieldCount = PAYMENT_FIELDS.columns.reduce((sum, col) => sum + col.fields.length, 0);
    figma.notify(
      `✅ Done! Created Payment Information with ${fieldCount} fields across ${PAYMENT_FIELDS.columns.length} columns.`,
      { timeout: 5000 }
    );
  } catch (error) {
    figma.notify(`❌ Error: ${error.message}`, { error: true, timeout: 8000 });
    console.error(error);
  }

  figma.closePlugin();
}

main();
