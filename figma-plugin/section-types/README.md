# Section Types Reference

> Auto-reference for all supported section types in the PortalMCP Figma plugin system.

---

## `section-header`

**Purpose:** Standalone section title (h2 equivalent)

**Required:** `title`

```json
{
  "type": "section-header",
  "title": "Payment Information"
}
```

**React mapping:** `<SectionHeader title="..." />`  
**CSS class:** None (built from h2/SectionHeader)  
**Figma builder:** `buildText()` with fontSize 20, Bold

---

## `card-heading-with-action`

**Purpose:** Card heading row with title on left, action button on right, optional accent line

**Required:** `title`  
**Optional:** `icon`, `accentLine`, `accentColor`, `action`

```json
{
  "type": "card-heading-with-action",
  "title": "Accommodation",
  "icon": "accommodation",
  "accentLine": true,
  "accentColor": "#960014",
  "action": {
    "label": "Open in Mews",
    "componentRef": "buttons/primary/small",
    "properties": { "Label": "Open in Mews", "Icon right": true },
    "iconRef": "icons/arrowOut"
  }
}
```

**React mapping:** `<div className="booking-card-heading">` + `<a className="btn-primary-action">`  
**CSS class:** `.booking-card-heading`, `.btn-primary-action`, `.booking-card-accent`  
**Figma builder:** `buildCardHeadingWithAction()`

---

## `card`

**Purpose:** White card container with N-column grid of fields

**Required:** `type`, `layout`, `columns`

```json
{
  "type": "card",
  "layout": "grid-4col",
  "columns": [
    {
      "name": "Column 1",
      "fields": [
        {
          "label": "Payment Type",
          "value": "{fields.payment_type}",
          "fieldType": "select",
          "editable": false,
          "hasInfo": true,
          "infoText": "Tooltip text",
          "tooltipPosition": "right"
        }
      ]
    }
  ]
}
```

**Layout options:** `grid-4col`, `grid-3col`, `grid-2col`  
**Field types:** `text`, `number`, `select`, `badge`, `link`, `date`, `email`, `phone`, `currency`  
**React mapping:** `<div className="card-grid">` with `<DetailsField>` components  
**Figma builder:** `buildGridCard()`

---

## `booking-meta`

**Purpose:** Booking metadata row (booking number + source badge)

**Required:** `bookingNumber`  
**Optional:** `source`

```json
{
  "type": "booking-meta",
  "bookingNumber": "NO827181777289",
  "source": "App"
}
```

**React mapping:** `<div className="booking-meta-row">`  
**Figma builder:** `buildBookingMeta()` (if implemented)

---

## `primary-action-button`

**Purpose:** Standalone CTA button (not embedded in heading)

**Required:** `label`  
**Optional:** `componentRef`, `iconRef`, `properties`

```json
{
  "type": "primary-action-button",
  "label": "Go to booking",
  "componentRef": "buttons/primary/small",
  "iconRef": "icons/arrowOut"
}
```

**React mapping:** `<a className="btn-primary-action">`  
**Figma builder:** `buildPrimaryActionButton()`

---

## `top-stats-card`

**Purpose:** Dashboard overview card with stats, progress bars, and extras

**Required:** `stats` array

```json
{
  "type": "top-stats-card",
  "stats": [
    { "label": "Arrivals", "value": "{arrivals.count}", "hasProgress": true },
    { "label": "Stayovers", "value": "{stayovers.count}", "hasProgress": false }
  ],
  "extras": [
    { "label": "Early check ins", "value": "{extras.earlyCheckIns}" }
  ]
}
```

**React mapping:** `<DashboardTopCard />`  
**CSS class:** `.dashboard-top-card`, `.top-card-stat`

---

## `teaser-card`

**Purpose:** Clickable contract teaser with icon, title, fields, and status badge

```json
{
  "type": "teaser-card",
  "title": "{title}",
  "icon": "contract",
  "fields": [
    { "label": "Agreement type", "value": "{agreementType}" },
    { "label": "Duration", "value": "{duration}" }
  ],
  "hasBadge": true,
  "badgeField": "status"
}
```

**React mapping:** `<TeaserCard />`  
**CSS class:** `.teaser-card`, `.teaser-detail-field`

---

## `data-table`

**Purpose:** Table with header row and body rows

```json
{
  "type": "data-table",
  "headers": ["Rate Name", "Room Category", "Price", "Status"],
  "sampleRows": []
}
```

**React mapping:** `<table>` inside RatesSection  
**Figma builder:** `buildDataTable()`

---

## `filter-bar`

**Purpose:** Horizontal row of filter controls

```json
{
  "type": "filter-bar",
  "filters": []
}
```

**React mapping:** `<div className="filter-inputs">`

---

## `collapsible-section`

**Purpose:** Expandable section (details/summary or toggle panel)

```json
{
  "type": "collapsible-section",
  "label": "More info",
  "controls": [
    { "label": "Option Name", "controlType": "select" }
  ]
}
```

**React mapping:** `<details>`, `<DemoPanel />`  
**CSS class:** `.more-info-details`, `.demo-panel`

---

## Component Registry

Use named refs instead of raw hashes:

| Ref path | Hash |
|----------|------|
| `buttons/primary/small` | `310bcca2...` |
| `buttons/secondary/small` | `094db23d...` |
| `buttons/link/small` | `c2c80910...` |
| `icons/arrowOut` | `6a8b0863...` |
| `icons/accommodation` | `2a05cf3b...` |
| `icons/chevronDown` | `1724cada...` |

Full registry: [`figma-registry.json`](../figma-registry.json)
