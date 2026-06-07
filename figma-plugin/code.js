// Universal Strawberry Portal Screen Builder
// Reads screen definition JSON from UI and builds Figma frames

var TOKENS = {
  colors: {
    varmGrey:        { r: 0.969, g: 0.961, b: 0.953 },
    pageBg:          { r: 0.969, g: 0.961, b: 0.953 },
    cardBg:          { r: 1, g: 1, b: 1 },
    textPrimary:     { r: 0, g: 0, b: 0 },
    textSecondary:   { r: 0.443, g: 0.439, b: 0.435 },
    textLink:        { r: 0.353, g: 0, b: 0.196 },
    borderLight:     { r: 0.922, g: 0.914, b: 0.906 },
    borderMedium:    { r: 0.847, g: 0.831, b: 0.816 },
    selectionBg:     { r: 0.992, g: 0.941, b: 0.937 },
    selectionAccent: { r: 0.988, g: 0.369, b: 0.345 },
    statusGreen:     { r: 0.176, g: 0.522, b: 0.255 },
    statusGreenBg:   { r: 0.176, g: 0.522, b: 0.255 },
    statusGreenText: { r: 0.176, g: 0.522, b: 0.255 },
    statusRed:       { r: 0.773, g: 0.161, b: 0.141 },
    statusRedBg:     { r: 0.773, g: 0.161, b: 0.141 },
    statusRedText:   { r: 0.773, g: 0.161, b: 0.141 },
    statusBlue:      { r: 0.231, g: 0.510, b: 0.965 },
    statusYellow:    { r: 0.898, g: 0.631, b: 0 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  layout: { cardPadding: 32, cardRadius: 8, colWidth: 320, gridGap: 16, fieldGap: 32, contentWidth: 1392, sidebarWidth: 80, headerHeight: 80 }
};

var COMPONENT_KEYS = {
  infoIcon: "6914f5cb9f180144235bf1c7ab814ff3bfcee8ea"
};

var COLOR_VARS = {};
var TEXT_STYLE_MAP = {};
var bodyFont = "Inter";
var displayFont = "Inter";

// HEX matching for variable discovery
var HEX_MAP = { "000000": "textPrimary", "71706f": "textSecondary", "5a0032": "textLink", "ffffff": "cardBg", "ebe9e7": "borderLight", "f7f5f3": "varmGrey", "d8d4d0": "borderMedium", "fdf0ef": "selectionBg", "fc5e58": "selectionAccent", "2d8541": "statusGreen", "c52924": "statusRed", "3b82f6": "statusBlue", "e5a100": "statusYellow" };

// Helper: append child and set fill width (avoids the "must be auto-layout child" error)
function appendFill(parent, child) {
  parent.appendChild(child);
  child.layoutSizingHorizontal = "FILL";
  return child;
}

function rgbToHex(r, g, b) {
  function h(c) { var s = Math.round(c * 255).toString(16); return s.length === 1 ? "0" + s : s; }
  return (h(r) + h(g) + h(b)).toLowerCase();
}

async function discoverVariables() {
  var VAR_SEARCH_MAP = {
    textPrimary:   ["text/primary", "text-primary", "text/default", "foreground/default", "foreground/primary", "content/primary"],
    textSecondary: ["text/secondary", "text-secondary", "foreground/secondary", "content/secondary", "text/muted"],
    textLink:      ["text/link", "text/brand", "text/accent", "brand/primary", "accent", "link"],
    cardBg:        ["surface/primary", "surface/default", "bg/card", "background/card", "surface/card", "bg/primary", "background/primary", "surface", "background/default"],
    borderLight:   ["border/default", "border/light", "border/primary", "stroke/default", "border", "divider", "separator"],
    varmGrey:        ["surface/secondary", "bg/secondary", "background/secondary", "surface/muted", "bg/muted"],
    pageBg:          ["surface/page", "bg/page", "background/page", "page"],
    borderMedium:    ["border/medium", "border/active", "border/strong", "stroke/medium"],
    selectionBg:     ["selection/bg", "selection/background", "selected/bg", "highlight/bg"],
    selectionAccent: ["selection/accent", "selection/indicator", "active/indicator", "accent/red"],
    statusGreen:     ["status/green", "status/success", "success", "success/default", "positive", "green", "check-in", "arrival"],
    statusGreenBg:   ["status/green/bg", "success/bg", "success/background"],
    statusGreenText: ["status/green/text", "success/text", "success/foreground"],
    statusRed:       ["status/red", "status/error", "error", "error/default", "negative", "red", "danger", "check-out", "departure"],
    statusRedBg:     ["status/red/bg", "error/bg", "error/background"],
    statusRedText:   ["status/red/text", "error/text", "error/foreground"],
    statusBlue:      ["status/blue", "status/info", "info", "info/default", "blue", "accent/blue", "in-stay"],
    statusYellow:    ["status/yellow", "status/warning", "warning", "warning/default", "caution"]
  };

  try {
    var vars = figma.variables.getLocalVariables("COLOR");
    console.log("Found " + vars.length + " color variables total");

    // Pass 1: Exact name match (most reliable)
    for (var token in VAR_SEARCH_MAP) {
      var searches = VAR_SEARCH_MAP[token];
      for (var s = 0; s < searches.length; s++) {
        if (COLOR_VARS[token]) break;
        for (var i = 0; i < vars.length; i++) {
          var n = vars[i].name.toLowerCase().replace(/\s+/g, "");
          if (n === searches[s] || n.endsWith("/" + searches[s]) || n.endsWith("/" + searches[s].split("/").pop())) {
            COLOR_VARS[token] = vars[i];
            console.log("✓ " + token + " → " + vars[i].name + " (name match: " + searches[s] + ")");
            break;
          }
        }
      }
    }

    // Pass 2: Partial name match (substring)
    for (var token2 in VAR_SEARCH_MAP) {
      if (COLOR_VARS[token2]) continue;
      var searches2 = VAR_SEARCH_MAP[token2];
      for (var s2 = 0; s2 < searches2.length; s2++) {
        if (COLOR_VARS[token2]) break;
        for (var j = 0; j < vars.length; j++) {
          var n2 = vars[j].name.toLowerCase();
          if (n2.indexOf(searches2[s2]) !== -1) {
            COLOR_VARS[token2] = vars[j];
            console.log("✓ " + token2 + " → " + vars[j].name + " (partial: " + searches2[s2] + ")");
            break;
          }
        }
      }
    }

    // Pass 3: Hex fallback for anything still missing
    for (var k = 0; k < vars.length; k++) {
      var v = vars[k];
      var modeIds = Object.keys(v.valuesByMode);
      if (modeIds.length > 0) {
        var val = v.valuesByMode[modeIds[0]];
        if (val && typeof val === "object" && "r" in val) {
          var hex = rgbToHex(val.r, val.g, val.b);
          if (HEX_MAP[hex] && !COLOR_VARS[HEX_MAP[hex]]) {
            COLOR_VARS[HEX_MAP[hex]] = v;
            console.log("✓ " + HEX_MAP[hex] + " → " + v.name + " (hex: #" + hex + ")");
          }
        }
      }
    }

    // Log results
    var matched = Object.keys(COLOR_VARS);
    console.log("Matched " + matched.length + "/6 color tokens: " + matched.join(", "));
    var missing = [];
    for (var t in VAR_SEARCH_MAP) { if (!COLOR_VARS[t]) missing.push(t); }
    if (missing.length > 0) console.log("✗ Missing: " + missing.join(", "));
  } catch (e) { console.log("Variable discovery failed:", e); }
}

async function discoverTextStyles() {
  try {
    var styles = figma.getLocalTextStyles();
    for (var i = 0; i < styles.length; i++) {
      var s = styles[i];
      var key = s.fontSize + "_" + s.fontName.style.toLowerCase();
      if (!TEXT_STYLE_MAP[key]) TEXT_STYLE_MAP[key] = s.id;
      var nm = s.name.toLowerCase();
      if (nm.indexOf("heading") !== -1) TEXT_STYLE_MAP["heading_" + s.fontSize] = s.id;
      if (nm.indexOf("label") !== -1 || nm.indexOf("caption") !== -1) TEXT_STYLE_MAP["label_" + s.fontSize] = s.id;
      if (nm.indexOf("body") !== -1 || nm.indexOf("paragraph") !== -1) TEXT_STYLE_MAP["body_" + s.fontSize] = s.id;
    }
    console.log("Matched " + Object.keys(TEXT_STYLE_MAP).length + " text style keys");
  } catch (e) { console.log("Text style discovery failed:", e); }
}

function solidFill(color, tokenName) {
  var paint = { type: "SOLID", color: color, opacity: 1 };
  if (tokenName && COLOR_VARS[tokenName]) {
    try { return [figma.variables.setBoundVariableForPaint(paint, "color", COLOR_VARS[tokenName])]; }
    catch (e) { /* fallback */ }
  }
  return [paint];
}

function applyTextStyle(node, size, weight, role) {
  var keys = [role + "_" + size, size + "_" + (weight || "regular"), size + "_regular", size + "_medium"];
  for (var i = 0; i < keys.length; i++) {
    if (TEXT_STYLE_MAP[keys[i]]) { node.textStyleId = TEXT_STYLE_MAP[keys[i]]; return; }
  }
}

async function loadFonts() {
  var families = ["Strawberry Sans Display", "Strawberry Sans Text", "Outfit", "Inter"];
  for (var i = 0; i < families.length; i++) {
    try { await figma.loadFontAsync({ family: families[i], style: "Regular" }); if (i <= 1) { if (i === 0) displayFont = families[i]; else bodyFont = families[i]; } }
    catch (e) { /* skip */ }
  }
  try { await figma.loadFontAsync({ family: displayFont, style: "Bold" }); } catch (e) {
    try { await figma.loadFontAsync({ family: displayFont, style: "SemiBold" }); } catch (e2) { /* skip */ }
  }
  if (bodyFont === "Inter") { try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); } catch (e) { /* skip */ } }
  if (displayFont === "Inter") { try { await figma.loadFontAsync({ family: "Inter", style: "Bold" }); } catch (e) { /* skip */ } }
}

async function importInfoIcon() {
  try {
    var comp = await figma.importComponentByKeyAsync(COMPONENT_KEYS.infoIcon);
    var inst = comp.createInstance();
    inst.name = "info-icon";
    inst.resize(20, 20);
    return inst;
  } catch (e) {
    var f = figma.createFrame(); f.name = "info-icon"; f.resize(16, 16); f.cornerRadius = 8;
    f.fills = solidFill(TOKENS.colors.textSecondary); return f;
  }
}

// === BUILD FUNCTIONS ===

async function buildText(text, size, weight, color, tokenName, role) {
  var t = figma.createText();
  var w = weight || "Regular";
  try { t.fontName = { family: w === "Bold" ? displayFont : bodyFont, style: w }; }
  catch (e) { t.fontName = { family: "Inter", style: "Regular" }; }
  t.characters = text || "–";
  t.fontSize = size;
  t.fills = solidFill(color || TOKENS.colors.textPrimary, tokenName || "textPrimary");
  applyTextStyle(t, size, w.toLowerCase(), role || "body");
  return t;
}

async function buildLabelRow(label, hasInfo) {
  var row = figma.createFrame();
  row.name = "label-row";
  row.layoutMode = "HORIZONTAL";
  row.itemSpacing = 4;
  row.counterAxisAlignItems = "CENTER";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.fills = [];

  var labelNode = await buildText(label, 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
  labelNode.name = "field-label";
  row.appendChild(labelNode);

  if (hasInfo) {
    var icon = await importInfoIcon();
    row.appendChild(icon);
  }
  return row;
}

async function buildField(fieldDef) {
  var field = figma.createFrame();
  field.name = "field / " + (fieldDef.label || "field");
  field.layoutMode = "VERTICAL";
  field.itemSpacing = TOKENS.spacing.sm;
  field.primaryAxisSizingMode = "AUTO";
  field.counterAxisSizingMode = "AUTO";
  field.fills = [];

  var labelRow = await buildLabelRow(fieldDef.label, fieldDef.hasInfo);
  field.appendChild(labelRow);

  var isLink = fieldDef.isLink || fieldDef.fieldType === "link";
  var valueNode = await buildText(
    fieldDef.value, 16, "Regular",
    isLink ? TOKENS.colors.textLink : TOKENS.colors.textPrimary,
    isLink ? "textLink" : "textPrimary",
    isLink ? "link" : "body"
  );
  if (isLink) valueNode.textDecoration = "UNDERLINE";
  valueNode.name = isLink ? "field-value-link" : "field-value";
  field.appendChild(valueNode);

  return field;
}

async function buildGridCard(section) {
  var card = figma.createFrame();
  card.name = "Card";
  card.layoutMode = "VERTICAL";
  card.paddingTop = card.paddingBottom = card.paddingLeft = card.paddingRight = TOKENS.layout.cardPadding;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(TOKENS.layout.contentWidth, 400);
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  var grid = figma.createFrame();
  grid.name = "card-grid";
  grid.layoutMode = "HORIZONTAL";
  grid.itemSpacing = TOKENS.layout.gridGap;
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.fills = [];

  var columns = section.columns || [];
  for (var c = 0; c < columns.length; c++) {
    var col = figma.createFrame();
    col.name = columns[c].name || ("Column " + (c + 1));
    col.layoutMode = "VERTICAL";
    col.itemSpacing = TOKENS.layout.fieldGap;
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "FIXED";
    col.resize(TOKENS.layout.colWidth, 200);
    col.fills = [];

    var fields = columns[c].fields || [];
    for (var f = 0; f < fields.length; f++) {
      var fieldFrame = await buildField(fields[f]);
      col.appendChild(fieldFrame);
      fieldFrame.layoutSizingHorizontal = "FILL";
      fieldFrame.layoutSizingVertical = "HUG";
    }
    grid.appendChild(col);
  }

  card.appendChild(grid);
  return card;
}

async function buildDataTable(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Data Table";
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "FIXED";
  wrapper.resize(TOKENS.layout.contentWidth, 200);
  wrapper.cornerRadius = TOKENS.layout.cardRadius;
  wrapper.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  wrapper.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Header row
  if (section.headers && section.headers.length > 0) {
    var headerRow = figma.createFrame();
    headerRow.name = "table-header";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisSizingMode = "FIXED";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.resize(TOKENS.layout.contentWidth, 40);
    headerRow.paddingLeft = headerRow.paddingRight = 24;
    headerRow.paddingTop = headerRow.paddingBottom = 12;
    headerRow.fills = solidFill(TOKENS.colors.varmGrey, "varmGrey");

    for (var h = 0; h < section.headers.length; h++) {
      var th = await buildText(section.headers[h], 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
      th.layoutSizingHorizontal = "FILL";
      headerRow.appendChild(th);
    }
    wrapper.appendChild(headerRow);
  }

  return wrapper;
}

// Build: Top Stats Card (Arrivals, Departures, Stayovers, In-stay Visits)
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255
  };
}

async function buildTopStatsCard(section) {
  var card = figma.createFrame();
  card.name = "Dashboard Top Card";
  card.layoutMode = "VERTICAL";
  card.paddingTop = card.paddingBottom = 16;
  card.paddingLeft = card.paddingRight = 24;
  card.itemSpacing = 16;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(TOKENS.layout.contentWidth, 300);
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Stats row
  var statsRow = figma.createFrame();
  statsRow.name = "stats-row";
  statsRow.layoutMode = "HORIZONTAL";
  statsRow.itemSpacing = 40;
  statsRow.counterAxisAlignItems = "CENTER";
  statsRow.primaryAxisSizingMode = "AUTO";
  statsRow.counterAxisSizingMode = "AUTO";
  statsRow.fills = [];

  var stats = section.stats || [];
  for (var i = 0; i < stats.length; i++) {
    // Add divider between stats
    if (i > 0) {
      var divV = figma.createFrame();
      divV.name = "divider-v";
      divV.resize(1, 88);
      divV.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
      statsRow.appendChild(divV);
    }

    var stat = stats[i];
    var statFrame = figma.createFrame();
    statFrame.name = "stat / " + stat.label;
    statFrame.layoutMode = "VERTICAL";
    statFrame.itemSpacing = 16;
    statFrame.paddingTop = statFrame.paddingBottom = 16;
    statFrame.paddingLeft = statFrame.paddingRight = 16;
    statFrame.primaryAxisSizingMode = "AUTO";
    statFrame.counterAxisSizingMode = "AUTO";
    statFrame.fills = [];

    // Header row (label+count left, icon right) - FILL width
    var headerRow = figma.createFrame();
    headerRow.name = "stat-header";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.primaryAxisSizingMode = "AUTO";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.fills = [];

    // Info column (label + count)
    var infoCol = figma.createFrame();
    infoCol.name = "stat-info";
    infoCol.layoutMode = "VERTICAL";
    infoCol.itemSpacing = 8;
    infoCol.primaryAxisSizingMode = "AUTO";
    infoCol.counterAxisSizingMode = "AUTO";
    infoCol.fills = [];

    var labelText = await buildText(stat.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
    infoCol.appendChild(labelText);

    var countText = await buildText(stat.count, 32, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
    infoCol.appendChild(countText);

    headerRow.appendChild(infoCol);

    // Icon circle with design system component instance
    var ICON_COMPONENT_KEYS = {
      "check-in":    "726e70919d416c59b6b36526443535307822a0db",
      "check-out":   "78a0c83c19997f766c4f2d006a22af95ecfbe366",
      "stayover":    "d65b005c4140b52437e89834895ee04c9bc35eed",
      "in-stay":     "d65b005c4140b52437e89834895ee04c9bc35eed"
    };

    var iconCircle = figma.createFrame();
    iconCircle.name = "icon-" + stat.label.toLowerCase().replace(/\s/g, "-");
    iconCircle.resize(40, 40);
    iconCircle.cornerRadius = 20;
    iconCircle.clipsContent = false;

    if (stat.iconBgToken && COLOR_VARS[stat.iconBgToken]) {
      var bgPaint = { type: "SOLID", color: TOKENS.colors[stat.iconBgToken] || { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.1 };
      try {
        iconCircle.fills = [figma.variables.setBoundVariableForPaint(bgPaint, "color", COLOR_VARS[stat.iconBgToken])];
        iconCircle.fills[0].opacity = 0.1;
      } catch (e) { iconCircle.fills = [bgPaint]; }
    } else if (stat.iconBg) {
      var bgMatch = stat.iconBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
      if (bgMatch) {
        iconCircle.fills = [{ type: "SOLID", color: { r: parseInt(bgMatch[1])/255, g: parseInt(bgMatch[2])/255, b: parseInt(bgMatch[3])/255 }, opacity: parseFloat(bgMatch[4] || 1) }];
      }
    }

    // Place icon component instance inside circle
    var iconKey = stat.iconComponentKey || (ICON_COMPONENT_KEYS[stat.icon] || "");
    if (iconKey) {
      try {
        var iconComp = await figma.importComponentByKeyAsync(iconKey);
        var iconInstance = iconComp.createInstance();
        iconInstance.resize(20, 20);
        iconInstance.x = 9.67;
        iconInstance.y = 10;
        iconCircle.appendChild(iconInstance);
        console.log("✓ Icon instance placed: " + stat.icon + " → " + iconComp.name);
      } catch (e) { console.log("✗ Icon import error for " + stat.icon + ": " + e.message); }
    }

    headerRow.appendChild(iconCircle);
    statFrame.appendChild(headerRow);
    headerRow.layoutSizingHorizontal = "FILL";

    // Progress bar (if present)
    if (stat.progressPercent !== undefined && stat.progressColor) {
      var progressTrack = figma.createFrame();
      progressTrack.name = "progress-track";
      progressTrack.resize(300, 4);
      progressTrack.cornerRadius = 2;
      progressTrack.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
      progressTrack.layoutMode = "HORIZONTAL";
      progressTrack.primaryAxisSizingMode = "FIXED";
      progressTrack.counterAxisSizingMode = "FIXED";

      var progressBar = figma.createFrame();
      progressBar.name = "progress-bar";
      var barWidth = Math.round(300 * stat.progressPercent / 100);
      progressBar.resize(barWidth, 4);
      progressBar.cornerRadius = 2;
      if (stat.progressToken && COLOR_VARS[stat.progressToken]) {
        progressBar.fills = solidFill(hexToRgb(stat.progressColor), stat.progressToken);
      } else {
        progressBar.fills = [{ type: "SOLID", color: hexToRgb(stat.progressColor) }];
      }
      progressTrack.appendChild(progressBar);

      statFrame.appendChild(progressTrack);
    }

    // Subtitle
    var subText = await buildText(stat.subtitle, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
    statFrame.appendChild(subText);

    statsRow.appendChild(statFrame);
    statFrame.layoutSizingHorizontal = "FILL";
  }

  card.appendChild(statsRow);
  statsRow.layoutSizingHorizontal = "FILL";

  // Horizontal divider
  var divH = figma.createFrame();
  divH.name = "divider-h";
  divH.resize(TOKENS.layout.contentWidth - 48, 1);
  divH.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
  card.appendChild(divH);
  divH.layoutSizingHorizontal = "FILL";

  // Extras row
  var extras = section.extras || [];
  if (extras.length > 0) {
    var extrasRow = figma.createFrame();
    extrasRow.name = "extras-row";
    extrasRow.layoutMode = "HORIZONTAL";
    extrasRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    extrasRow.counterAxisAlignItems = "CENTER";
    extrasRow.primaryAxisSizingMode = "FIXED";
    extrasRow.counterAxisSizingMode = "AUTO";
    extrasRow.resize(TOKENS.layout.contentWidth - 48, 32);
    extrasRow.paddingLeft = extrasRow.paddingRight = 8;
    extrasRow.fills = [];

    // Left group
    var leftGroup = figma.createFrame();
    leftGroup.name = "extras-left";
    leftGroup.layoutMode = "HORIZONTAL";
    leftGroup.itemSpacing = 8;
    leftGroup.counterAxisAlignItems = "CENTER";
    leftGroup.primaryAxisSizingMode = "AUTO";
    leftGroup.counterAxisSizingMode = "AUTO";
    leftGroup.fills = [];

    for (var e = 0; e < extras.length; e++) {
      var ex = extras[e];
      if (ex.position === "right") continue;

      var extraItem = figma.createFrame();
      extraItem.name = "extra-" + ex.label;
      extraItem.layoutMode = "HORIZONTAL";
      extraItem.itemSpacing = 8;
      extraItem.counterAxisAlignItems = "CENTER";
      extraItem.paddingTop = extraItem.paddingBottom = 6;
      extraItem.paddingLeft = extraItem.paddingRight = 8;
      extraItem.primaryAxisSizingMode = "AUTO";
      extraItem.counterAxisSizingMode = "AUTO";
      extraItem.fills = [];

      var exLabel = await buildText(ex.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      extraItem.appendChild(exLabel);

      var exValue = await buildText(ex.value, 16, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
      extraItem.appendChild(exValue);

      leftGroup.appendChild(extraItem);
    }
    extrasRow.appendChild(leftGroup);

    // Right items
    for (var e2 = 0; e2 < extras.length; e2++) {
      var ex2 = extras[e2];
      if (ex2.position !== "right") continue;

      var rightItem = figma.createFrame();
      rightItem.name = "extra-" + ex2.label;
      rightItem.layoutMode = "HORIZONTAL";
      rightItem.itemSpacing = 8;
      rightItem.counterAxisAlignItems = "CENTER";
      rightItem.paddingTop = rightItem.paddingBottom = 6;
      rightItem.paddingLeft = rightItem.paddingRight = 8;
      rightItem.primaryAxisSizingMode = "AUTO";
      rightItem.counterAxisSizingMode = "AUTO";
      rightItem.fills = [];

      var rLabel = await buildText(ex2.label, 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      rightItem.appendChild(rLabel);

      if (ex2.type === "badge") {
        var badge = figma.createFrame();
        badge.name = "badge";
        badge.resize(24, 24);
        badge.cornerRadius = 12;
        badge.fills = [{ type: "SOLID", color: { r: 0.976, g: 0.851, b: 0.847 } }];
        badge.counterAxisAlignItems = "CENTER";
        badge.primaryAxisAlignItems = "CENTER";
        badge.layoutMode = "HORIZONTAL";

        var badgeNum = await buildText(ex2.value, 16, "Bold", { r: 0.588, g: 0, b: 0.078 }, undefined, "label");
        badge.appendChild(badgeNum);
        rightItem.appendChild(badge);
      } else {
        var rValue = await buildText(ex2.value, 16, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
        rightItem.appendChild(rValue);
      }

      extrasRow.appendChild(rightItem);
    }

    card.appendChild(extrasRow);
    extrasRow.layoutSizingHorizontal = "FILL";
  }

  return card;
}

// ============================================================
// Build: Status Badge (colored pill)
// ============================================================
async function buildStatusBadge(section) {
  var badge = figma.createFrame();
  badge.name = "Status Badge";
  badge.layoutMode = "HORIZONTAL";
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";
  badge.paddingLeft = badge.paddingRight = 12;
  badge.paddingTop = badge.paddingBottom = 4;
  badge.cornerRadius = 24;

  var variant = section.variant || "default";
  var colorMap = {
    green:   { bg: TOKENS.colors.statusGreen, bgToken: "statusGreen", textToken: "statusGreenText" },
    red:     { bg: TOKENS.colors.statusRed,   bgToken: "statusRed",   textToken: "statusRedText" },
    blue:    { bg: TOKENS.colors.statusBlue,  bgToken: "statusBlue",  textToken: "statusBlue" },
    yellow:  { bg: TOKENS.colors.statusYellow,bgToken: "statusYellow", textToken: "statusYellow" },
    default: { bg: TOKENS.colors.textSecondary, bgToken: "textSecondary", textToken: "textSecondary" }
  };
  var c = colorMap[variant] || colorMap["default"];

  var bgPaint = { type: "SOLID", color: c.bg, opacity: 0.15 };
  if (COLOR_VARS[c.bgToken]) {
    try { bgPaint = figma.variables.setBoundVariableForPaint(bgPaint, "color", COLOR_VARS[c.bgToken]); bgPaint.opacity = 0.15; } catch(e) {}
  }
  badge.fills = [bgPaint];

  var textColor = c.bg;
  var text = await buildText(section.text || "Status", 12, "Medium", textColor, c.textToken, "label");
  badge.appendChild(text);
  return badge;
}

// ============================================================
// Build: Filter Bar
// ============================================================
async function buildFilterBar(section) {
  var bar = figma.createFrame();
  bar.name = "Filter Bar";
  bar.layoutMode = "HORIZONTAL";
  bar.itemSpacing = 24;
  bar.primaryAxisSizingMode = "AUTO";
  bar.counterAxisSizingMode = "AUTO";
  bar.paddingLeft = bar.paddingRight = 24;
  bar.paddingTop = bar.paddingBottom = 16;
  bar.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  bar.cornerRadius = TOKENS.layout.cardRadius;
  bar.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  var filters = section.filters || [];
  for (var f = 0; f < filters.length; f++) {
    var col = figma.createFrame();
    col.name = "filter-" + (filters[f].label || "filter");
    col.layoutMode = "VERTICAL";
    col.itemSpacing = 4;
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "AUTO";
    col.fills = [];
    var lbl = await buildText(filters[f].label || "", 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
    col.appendChild(lbl);
    var val = await buildText(filters[f].value || "–", 14, "Regular", TOKENS.colors.textPrimary, "textPrimary", "body");
    col.appendChild(val);
    if (filters[f].inputType === "select") {
      var ind = figma.createFrame(); ind.name = "select-line"; ind.resize(120, 1);
      ind.fills = solidFill(TOKENS.colors.borderMedium, "borderMedium");
      col.appendChild(ind);
    }
    bar.appendChild(col);
  }
  return bar;
}

// ============================================================
// Build: Teaser Card
// ============================================================
async function buildTeaserCard(section) {
  var card = figma.createFrame();
  card.name = "Teaser Card";
  card.layoutMode = "VERTICAL";
  card.itemSpacing = 12;
  card.primaryAxisSizingMode = "AUTO";
  card.counterAxisSizingMode = "FIXED";
  card.resize(320, 100);
  card.paddingTop = card.paddingBottom = 16;
  card.paddingLeft = card.paddingRight = 20;
  card.cornerRadius = TOKENS.layout.cardRadius;
  card.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 1 }, radius: 4, spread: 0, visible: true, blendMode: "NORMAL" }];

  // Top row: icon + title
  var topRow = figma.createFrame();
  topRow.name = "teaser-top";
  topRow.layoutMode = "HORIZONTAL";
  topRow.itemSpacing = 12;
  topRow.primaryAxisSizingMode = "AUTO";
  topRow.counterAxisSizingMode = "AUTO";
  topRow.counterAxisAlignItems = "CENTER";
  topRow.fills = [];

  if (section.iconComponentKey) {
    try {
      var ic = await figma.importComponentByKeyAsync(section.iconComponentKey);
      var inst = ic.createInstance(); inst.resize(20, 20);
      topRow.appendChild(inst);
    } catch(e) {}
  }

  var title = await buildText(section.title || "Item", 16, "Medium", TOKENS.colors.textPrimary, "textPrimary", "heading");
  topRow.appendChild(title);
  card.appendChild(topRow);
  topRow.layoutSizingHorizontal = "FILL";

  // Details row
  if (section.details && section.details.length > 0) {
    var detRow = figma.createFrame();
    detRow.name = "teaser-details";
    detRow.layoutMode = "HORIZONTAL";
    detRow.itemSpacing = 24;
    detRow.primaryAxisSizingMode = "AUTO";
    detRow.counterAxisSizingMode = "AUTO";
    detRow.fills = [];
    for (var d = 0; d < section.details.length; d++) {
      var dc = figma.createFrame();
      dc.name = "detail-" + d; dc.layoutMode = "VERTICAL"; dc.itemSpacing = 2;
      dc.primaryAxisSizingMode = "AUTO"; dc.counterAxisSizingMode = "AUTO"; dc.fills = [];
      var dl = await buildText(section.details[d].label || "", 12, "Regular", TOKENS.colors.textSecondary, "textSecondary", "label");
      dc.appendChild(dl);
      var dv = await buildText(section.details[d].value || "–", 14, "Regular", TOKENS.colors.textPrimary, "textPrimary", "body");
      dc.appendChild(dv);
      detRow.appendChild(dc);
    }
    card.appendChild(detRow);
    detRow.layoutSizingHorizontal = "FILL";
  }

  if (section.badge) {
    var bdg = await buildStatusBadge(section.badge);
    card.appendChild(bdg);
  }
  return card;
}

// ============================================================
// Build: Sidebar Nav
// ============================================================
async function buildSidebarNav(section) {
  var sidebar = figma.createFrame();
  sidebar.name = "Sidebar Nav";
  sidebar.layoutMode = "VERTICAL";
  sidebar.primaryAxisSizingMode = "FIXED";
  sidebar.counterAxisSizingMode = "FIXED";
  sidebar.resize(TOKENS.layout.sidebarWidth, 900);
  sidebar.paddingTop = 16;
  sidebar.itemSpacing = 4;
  sidebar.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  sidebar.strokes = solidFill(TOKENS.colors.borderLight, "borderLight");
  sidebar.strokeWeight = 1; sidebar.strokeAlign = "INSIDE";

  var items = section.items || [];
  for (var n = 0; n < items.length; n++) {
    var ni = figma.createFrame();
    ni.name = "nav-" + (items[n].label || "item");
    ni.layoutMode = "VERTICAL";
    ni.primaryAxisAlignItems = "CENTER";
    ni.counterAxisAlignItems = "CENTER";
    ni.primaryAxisSizingMode = "AUTO";
    ni.counterAxisSizingMode = "FIXED";
    ni.resize(TOKENS.layout.sidebarWidth, 64);
    ni.itemSpacing = 4;
    ni.fills = items[n].active ? solidFill(TOKENS.colors.selectionBg, "selectionBg") : [];

    if (items[n].iconComponentKey) {
      try {
        var navIc = await figma.importComponentByKeyAsync(items[n].iconComponentKey);
        var navInst = navIc.createInstance(); navInst.resize(24, 24);
        ni.appendChild(navInst);
      } catch(e) {}
    } else {
      var ph = figma.createFrame(); ph.name = "icon"; ph.resize(24, 24);
      ph.cornerRadius = 4; ph.fills = solidFill(TOKENS.colors.textSecondary, "textSecondary"); ph.opacity = 0.3;
      ni.appendChild(ph);
    }

    var navLbl = await buildText(items[n].label || "", 10, "Regular",
      items[n].active ? TOKENS.colors.textLink : TOKENS.colors.textSecondary,
      items[n].active ? "textLink" : "textSecondary", "label");
    ni.appendChild(navLbl);
    sidebar.appendChild(ni);
  }
  return sidebar;
}

// ============================================================
// Build: Top Header
// ============================================================
async function buildTopHeader(section) {
  var header = figma.createFrame();
  header.name = "Top Header";
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "FIXED";
  header.resize(TOKENS.layout.contentWidth, TOKENS.layout.headerHeight);
  header.paddingLeft = header.paddingRight = 24;
  header.fills = solidFill(TOKENS.colors.cardBg, "cardBg");
  header.strokes = solidFill(TOKENS.colors.borderLight, "borderLight");
  header.strokeWeight = 1; header.strokeAlign = "INSIDE";

  var logo = await buildText(section.logoText || "Strawberry Portal", 18, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
  header.appendChild(logo);

  if (section.navItems && section.navItems.length > 0) {
    var nav = figma.createFrame();
    nav.name = "nav-items"; nav.layoutMode = "HORIZONTAL"; nav.itemSpacing = 24;
    nav.counterAxisAlignItems = "CENTER";
    nav.primaryAxisSizingMode = "AUTO"; nav.counterAxisSizingMode = "AUTO"; nav.fills = [];
    for (var ni = 0; ni < section.navItems.length; ni++) {
      var nt = await buildText(section.navItems[ni].label || "", 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
      nav.appendChild(nt);
    }
    header.appendChild(nav);
  }
  return header;
}

// ============================================================
// Build: Collapsible Section
// ============================================================
async function buildCollapsibleSection(section) {
  var wrapper = figma.createFrame();
  wrapper.name = "Collapsible Section";
  wrapper.layoutMode = "VERTICAL";
  wrapper.primaryAxisSizingMode = "AUTO";
  wrapper.counterAxisSizingMode = "AUTO";
  wrapper.fills = [];

  var divider = figma.createFrame();
  divider.name = "divider"; divider.resize(TOKENS.layout.contentWidth, 1);
  divider.fills = solidFill(TOKENS.colors.borderLight, "borderLight");
  wrapper.appendChild(divider);
  divider.layoutSizingHorizontal = "FILL";

  var toggleRow = figma.createFrame();
  toggleRow.name = "collapse-toggle";
  toggleRow.layoutMode = "HORIZONTAL";
  toggleRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  toggleRow.counterAxisAlignItems = "CENTER";
  toggleRow.primaryAxisSizingMode = "AUTO";
  toggleRow.counterAxisSizingMode = "AUTO";
  toggleRow.paddingTop = toggleRow.paddingBottom = 12;
  toggleRow.fills = [];

  var lbl = await buildText(section.label || "More info", 14, "Medium", TOKENS.colors.textPrimary, "textPrimary", "body");
  toggleRow.appendChild(lbl);
  var chevron = await buildText("▾", 14, "Regular", TOKENS.colors.textSecondary, "textSecondary", "body");
  chevron.name = "chevron";
  toggleRow.appendChild(chevron);

  wrapper.appendChild(toggleRow);
  toggleRow.layoutSizingHorizontal = "FILL";
  return wrapper;
}

async function buildScreen(definition) {
  await loadFonts();
  await discoverVariables();
  await discoverTextStyles();

  var root = figma.createFrame();
  root.name = (definition.meta && definition.meta.component) || "Screen";
  root.layoutMode = "VERTICAL";
  root.itemSpacing = TOKENS.spacing.sm;
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.fills = [];

  var sections = definition.sections || [];
  for (var i = 0; i < sections.length; i++) {
    var sec = sections[i];

    if (sec.type === "section-header") {
      var header = await buildText(sec.title, 20, "Bold", TOKENS.colors.textPrimary, "textPrimary", "heading");
      header.name = "Section Header";
      root.appendChild(header);
    }

    if (sec.type === "card" && sec.layout === "grid-4col") {
      var card = await buildGridCard(sec);
      root.appendChild(card);
    }

    if (sec.type === "data-table") {
      var table = await buildDataTable(sec);
      root.appendChild(table);
    }

    if (sec.type === "top-stats-card") {
      var topCard = await buildTopStatsCard(sec);
      root.appendChild(topCard);
    }

    if (sec.type === "status-badge") {
      var badge = await buildStatusBadge(sec);
      root.appendChild(badge);
    }

    if (sec.type === "filter-bar") {
      var filterBar = await buildFilterBar(sec);
      root.appendChild(filterBar);
    }

    if (sec.type === "teaser-card") {
      var teaser = await buildTeaserCard(sec);
      root.appendChild(teaser);
    }

    if (sec.type === "sidebar-nav") {
      var sidebarNav = await buildSidebarNav(sec);
      root.appendChild(sidebarNav);
    }

    if (sec.type === "top-header") {
      var topHeader = await buildTopHeader(sec);
      root.appendChild(topHeader);
    }

    if (sec.type === "collapsible-section") {
      var collapsible = await buildCollapsibleSection(sec);
      root.appendChild(collapsible);
    }
  }

  root.x = Math.round(figma.viewport.center.x - TOKENS.layout.contentWidth / 2);
  root.y = Math.round(figma.viewport.center.y - 100);
  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);

  return root;
}

// === MAIN: Show UI and listen for messages ===
figma.showUI(__html__, { width: 420, height: 380 });

figma.ui.onmessage = function(msg) {
  if (msg.type === "build") {
    buildScreen(msg.definition).then(function() {
      var count = 0;
      var sections = msg.definition.sections || [];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].columns) {
          for (var c = 0; c < sections[i].columns.length; c++) {
            count += (sections[i].columns[c].fields || []).length;
          }
        }
      }
      figma.ui.postMessage({ type: "status", text: "Done! Built " + count + " fields.", level: "success" });
    }).catch(function(err) {
      figma.ui.postMessage({ type: "status", text: "Error: " + err.message, level: "error" });
    });
  }
};
