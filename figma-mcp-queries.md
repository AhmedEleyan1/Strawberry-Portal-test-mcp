# Figma MCP Query Templates

File Key: `YOUR_FILE_KEY`
Generated: 2026-06-07T15:12:14.293Z

## Available Queries

### List all components
Discover all published components in the file

**MCP Tool:** `get_figma_data`
```json
{
  "fileKey": "YOUR_FILE_KEY",
  "depth": 1
}
```
**Post-process:** Filter nodes where type === "COMPONENT" or type === "COMPONENT_SET"

---

### Find button variants
Get all button component variants and their keys

**MCP Tool:** `get_figma_data`
```json
{
  "fileKey": "YOUR_FILE_KEY",
  "nodeId": "BUTTON_COMPONENT_SET_ID"
}
```
**Post-process:** Extract variant properties and component keys

---

### Get design tokens
Extract color styles and text styles

**MCP Tool:** `get_figma_data`
```json
{
  "fileKey": "YOUR_FILE_KEY"
}
```
**Post-process:** Extract styles.colors and styles.textStyles

---

### Download component thumbnails
Get preview images for component cards

**MCP Tool:** `download_figma_images`
```json
{
  "fileKey": "YOUR_FILE_KEY",
  "nodeIds": [
    "COMPONENT_ID_1",
    "COMPONENT_ID_2"
  ]
}
```
**Post-process:** Save images to figma-plugin/thumbnails/

---

## How to Use

1. Copy the query params above
2. Call the MCP tool via the Figma MCP server
3. Process the response to update `figma-registry.json`

Or run: `node scripts/figma-query.cjs --check-registry` to see what's missing.