// Universal Strawberry Portal Screen Builder
// Reads screen definition JSON from UI and builds Figma frames

var TOKENS = {
  colors: {
    varmGrey:      { r: 0.969, g: 0.961, b: 0.953 },
    cardBg:        { r: 1, g: 1, b: 1 },
    textPrimary:   { r: 0, g: 0, b: 0 },
    textSecondary: { r: 0.443, g: 0.439, b: 0.435 },
    textLink:      { r: 0.353, g: 0, b: 0.196 },
    borderLight:   { r: 0.922, g: 0.914, b: 0.906 },
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  layout: { cardPadding: 32, cardRadius: 8, colWidth: 320, gridGap: 16, fieldGap: 32, contentWidth: 1392 }
};

var COMPONENT_KEYS = {
  infoIcon: "6914f5cb9f180144235bf1c7ab814ff3bfcee8ea"
};

var COLOR_VARS = {};
var TEXT_STYLE_MAP = {};
var bodyFont = "Inter";
var displayFont = "Inter";

// HEX matching for variable discovery
var HEX_MAP = { "000000": "textPrimary", "71706f": "textSecondary", "5a0032": "textLink", "ffffff": "cardBg", "ebe9e7": "borderLight", "f7f5f3": "varmGrey" };

function rgbToHex(r, g, b) {
  function h(c) { var s = Math.round(c * 255).toString(16); return s.length === 1 ? "0" + s : s; }
  return (h(r) + h(g) + h(b)).toLowerCase();
}

async function discoverVariables() {
  try {
    var vars = figma.variables.getLocalVariables("COLOR");
    for (var i = 0; i < vars.length; i++) {
      var v = vars[i];
      var modeIds = Object.keys(v.valuesByMode);
      if (modeIds.length > 0) {
        var val = v.valuesByMode[modeIds[0]];
        if (val && typeof val === "object" && "r" in val) {
          var hex = rgbToHex(val.r, val.g, val.b);
          if (HEX_MAP[hex] && !COLOR_VARS[HEX_MAP[hex]]) {
            COLOR_VARS[HEX_MAP[hex]] = v;
          }
        }
      }
      // Also match by name
      var n = v.name.toLowerCase();
      if (n.indexOf("primary") !== -1 && !COLOR_VARS.textPrimary) COLOR_VARS.textPrimary = v;
      if (n.indexOf("secondary") !== -1 && !COLOR_VARS.textSecondary) COLOR_VARS.textSecondary = v;
      if ((n.indexOf("link") !== -1 || n.indexOf("brand") !== -1) && !COLOR_VARS.textLink) COLOR_VARS.textLink = v;
      if ((n.indexOf("surface") !== -1 || n.indexOf("card") !== -1) && !COLOR_VARS.cardBg) COLOR_VARS.cardBg = v;
    }
    console.log("Matched " + Object.keys(COLOR_VARS).length + " color variables");
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

    // Header row (label+count left, icon right)
    var headerRow = figma.createFrame();
    headerRow.name = "stat-header";
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.primaryAxisSizingMode = "FIXED";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.resize(300, 60);
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

    // Icon circle
    var iconCircle = figma.createFrame();
    iconCircle.name = "icon-" + stat.label.toLowerCase().replace(/\s/g, "-");
    iconCircle.resize(40, 40);
    iconCircle.cornerRadius = 20;
    if (stat.iconBg) {
      // Parse rgba
      var bgMatch = stat.iconBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
      if (bgMatch) {
        iconCircle.fills = [{ type: "SOLID", color: { r: parseInt(bgMatch[1])/255, g: parseInt(bgMatch[2])/255, b: parseInt(bgMatch[3])/255 }, opacity: parseFloat(bgMatch[4] || 1) }];
      }
    }
    headerRow.appendChild(iconCircle);
    statFrame.appendChild(headerRow);

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
      progressBar.fills = [{ type: "SOLID", color: hexToRgb(stat.progressColor) }];
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
  divH.layoutSizingHorizontal = "FILL";
  card.appendChild(divH);

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
