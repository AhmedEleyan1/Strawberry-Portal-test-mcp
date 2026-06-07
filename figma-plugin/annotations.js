// ============================================================
// Figma Annotation Layer (Enhancement #15)
// Adds measurement callouts, color labels, and spacing guides
// to generated Figma frames for design spec handoff.
//
// Usage in code.js:
//   Import this file and call addAnnotations(frame) after building.
// ============================================================

/**
 * Add redline annotations to a Figma frame.
 * Creates a separate annotation layer group with:
 * - Spacing callouts between elements
 * - Color hex labels on colored elements
 * - Font size labels on text nodes
 * - Dimension labels on key containers
 */
async function addAnnotationLayer(frame, options) {
  var opts = options || {};
  var showSpacing = opts.spacing !== false;
  var showColors = opts.colors !== false;
  var showFonts = opts.fonts !== false;
  var showDimensions = opts.dimensions !== false;
  var annotColor = { r: 1, g: 0.216, b: 0.216 }; // #FF3737
  var annotBg = { r: 1, g: 0.95, b: 0.95 };

  // Create annotation group
  var annoGroup = figma.createFrame();
  annoGroup.name = "📐 Annotations";
  annoGroup.layoutMode = "NONE";
  annoGroup.resize(frame.width, frame.height);
  annoGroup.fills = [];
  annoGroup.clipsContent = false;

  // Color annotations
  if (showColors) {
    var colorNodes = frame.findAll(function(node) {
      return node.fills && node.fills.length > 0 && node.fills[0].type === "SOLID" && node.visible;
    });

    for (var i = 0; i < Math.min(colorNodes.length, 20); i++) {
      var node = colorNodes[i];
      var fill = node.fills[0];
      if (!fill.color) continue;

      var hex = rgbToHex(fill.color);
      if (hex === "FFFFFF" || hex === "000000") continue; // Skip black/white

      var label = createAnnotLabel("#" + hex, node.absoluteTransform[0][2] - frame.absoluteTransform[0][2], node.absoluteTransform[1][2] - frame.absoluteTransform[1][2] - 14, annotColor, annotBg);
      annoGroup.appendChild(label);
    }
  }

  // Font size annotations
  if (showFonts) {
    var textNodes = frame.findAll(function(node) {
      return node.type === "TEXT" && node.visible;
    });

    for (var j = 0; j < Math.min(textNodes.length, 30); j++) {
      var textNode = textNodes[j];
      var fontSize = textNode.fontSize;
      if (typeof fontSize !== "number") continue;

      var fontLabel = createAnnotLabel(fontSize + "px", textNode.absoluteTransform[0][2] - frame.absoluteTransform[0][2] + textNode.width + 4, textNode.absoluteTransform[1][2] - frame.absoluteTransform[1][2], { r: 0.388, g: 0.4, b: 0.945 }, { r: 0.937, g: 0.937, b: 1 });
      annoGroup.appendChild(fontLabel);
    }
  }

  // Dimension annotations on the main frame
  if (showDimensions) {
    var dimLabel = createAnnotLabel(Math.round(frame.width) + " × " + Math.round(frame.height), 0, frame.height + 8, annotColor, annotBg);
    annoGroup.appendChild(dimLabel);
  }

  // Spacing annotations between direct children
  if (showSpacing && frame.layoutMode !== "NONE") {
    var spacing = frame.itemSpacing || 0;
    if (spacing > 0) {
      var spacingLabel = createAnnotLabel("gap: " + spacing + "px", frame.width + 8, 0, { r: 0.176, g: 0.522, b: 0.255 }, { r: 0.92, g: 0.98, b: 0.93 });
      annoGroup.appendChild(spacingLabel);
    }

    var padding = [];
    if (frame.paddingTop) padding.push("T:" + frame.paddingTop);
    if (frame.paddingRight) padding.push("R:" + frame.paddingRight);
    if (frame.paddingBottom) padding.push("B:" + frame.paddingBottom);
    if (frame.paddingLeft) padding.push("L:" + frame.paddingLeft);
    if (padding.length > 0) {
      var padLabel = createAnnotLabel("pad: " + padding.join(" "), frame.width + 8, 16, { r: 0.6, g: 0.4, b: 0 }, { r: 1, g: 0.97, b: 0.9 });
      annoGroup.appendChild(padLabel);
    }
  }

  // Position annotation group relative to frame
  annoGroup.x = frame.x;
  annoGroup.y = frame.y;

  return annoGroup;
}

/**
 * Create a small annotation label
 */
function createAnnotLabel(text, x, y, textColor, bgColor) {
  var label = figma.createFrame();
  label.name = "annot: " + text;
  label.layoutMode = "HORIZONTAL";
  label.counterAxisAlignItems = "CENTER";
  label.paddingLeft = 4;
  label.paddingRight = 4;
  label.paddingTop = 2;
  label.paddingBottom = 2;
  label.cornerRadius = 3;
  label.fills = [{ type: "SOLID", color: bgColor, opacity: 0.95 }];
  label.strokes = [{ type: "SOLID", color: textColor, opacity: 0.3 }];
  label.strokeWeight = 0.5;
  label.x = x;
  label.y = y;
  label.layoutSizingHorizontal = "HUG";
  label.layoutSizingVertical = "HUG";

  var textNode = figma.createText();
  textNode.characters = text;
  textNode.fontSize = 9;
  textNode.fills = [{ type: "SOLID", color: textColor }];
  label.appendChild(textNode);

  return label;
}

/**
 * Convert RGB to hex string
 */
function rgbToHex(color) {
  var r = Math.round(color.r * 255).toString(16).padStart(2, "0");
  var g = Math.round(color.g * 255).toString(16).padStart(2, "0");
  var b = Math.round(color.b * 255).toString(16).padStart(2, "0");
  return (r + g + b).toUpperCase();
}
