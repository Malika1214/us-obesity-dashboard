# 🗺️ US County Obesity Smart Dashboard

**Live Dashboard:** [https://Malika1214.github.io/us-obesity-dashboard/](https://Malika1214.github.io/us-obesity-dashboard/)

---

## Project Overview

This interactive web dashboard visualizes **adult obesity rates across all US counties**, enabling users to explore spatial patterns and statistical trends through a combination of a choropleth map and dynamic charts.

Built with **Mapbox GL JS**, **D3.js v7**, and **C3.js**, the dashboard joins CDC PLACES county-level obesity data to US Census county geometries via 5-digit FIPS codes, and renders them as a fully interactive thematic map with supporting statistical panels.

---

## Features

| Component | Description |
|---|---|
| **Choropleth Map** | County-level obesity rates rendered using a 5-class sequential color scheme |
| **Hover Popups** | County name and obesity rate displayed on mouse hover |
| **Click Panel** | Clicking a county updates the sidebar with detailed county info |
| **Top 10 Bar Chart** | Highlights the 10 US counties with the highest adult obesity rates |
| **Top 15 States Chart** | Shows average county obesity rate by state (top 15) |
| **National Average Indicator** | Dynamic stat card showing the US-wide average obesity rate |
| **Highest County Indicator** | Stat card showing the single county with the highest rate |
| **Color Legend** | Explains the 5-class choropleth color scale |

---

## Data Sources

| Dataset | Source | Use |
|---|---|---|
| **CDC PLACES – Local Data for Better Health (County, 2024)** | [data.cdc.gov](https://data.cdc.gov/500-Cities-Places/PLACES-Local-Data-for-Better-Health-County-Data-20/swc5-untb) | Adult obesity prevalence (%) by county; filtered on `MeasureId = "OBESITY"` |
| **US Census TIGER/Line County Boundaries** | US Census Bureau | County polygon geometries (GeoJSON) for spatial rendering |

**Data join method:** CDC `LocationID` (5-digit county FIPS) is matched to GeoJSON `GEOID` property. Counties with no matching obesity record are rendered in grey (`#cccccc`).

---

## Map Type Justification

A **choropleth map** was selected because:

- Obesity rates are **normalized percentage values** (not raw counts), making them appropriate for area-based color encoding.
- Counties are the unit of analysis — choropleth maps are ideal for comparing values across **discrete, bounded geographic units**.
- The **sequential 5-class color scheme** (light teal → dark green) intuitively communicates increasing obesity prevalence, making regional clusters immediately identifiable.

A proportional symbol or dot density map would be less appropriate here because the data is already aggregated at the county level with no sub-county spatial variation.

---

## Technical Implementation

### Stack

- **Mapbox GL JS v2.15** — WebGL-powered interactive base map and choropleth layer
- **D3.js v7** — Data loading (`d3.csv`, `d3.json`), aggregation (`d3.rollups`, `d3.mean`), and DOM manipulation
- **C3.js v0.7** — Bar chart generation (depends on D3 v5, loaded separately before D3 v7)

### Architecture

```
project/
├── index.html          # Dashboard layout and script loading
├── css/
│   └── style.css       # Dark theme dashboard styling
├── js/
│   └── main.js         # All data loading, joining, map layers, and charts
└── data/
    ├── counties.geojson        # US Census county boundaries
    └── PLACES_county.csv       # CDC PLACES obesity dataset
```

### Key Implementation Details

- **Race condition fix:** `map.on("load")` is wrapped in a `Promise` and included in `Promise.all()` alongside data fetches, ensuring layers are only added after both the map style and data are fully ready.
- **Data join:** Obesity values are stored in a `{FIPS: value}` lookup object and merged into GeoJSON feature properties before the source is added to Mapbox.
- **NaN protection:** All display values guard against null/undefined/NaN with explicit coercion (`+raw`) and fallback to `"N/A"`.
- **Sort safety:** The filtered data array is never mutated — `.slice().sort()` is used to produce independent sorted copies for stats and charts.

### Choropleth Color Scale

| Color | Range |
|---|---|
| `#cccccc` | No data |
| `#edf8fb` | < 20% |
| `#b2e2e2` | 20 – 25% |
| `#66c2a4` | 25 – 30% |
| `#2ca25f` | 30 – 35% |
| `#006d2c` | > 35% |

---

## Lab Requirements Addressed

- ✅ **Geospatial datasets:** US Census TIGER/Line county shapefiles + CDC PLACES county obesity data
- ✅ **Thematic map type justified:** Choropleth chosen for normalized percentage data across defined geographic units
- ✅ **Additional visualization components:** Top 10 counties bar chart, top 15 states bar chart, national average and highest county stat cards
- ✅ **Interactivity:** Hover popups, click-to-inspect panel, color legend
- ✅ **Data join documented:** FIPS-based join between CDC `LocationID` and Census `GEOID`
- ✅ **Hosted and accessible:** [https://Malika1214.github.io/us-obesity-dashboard/](https://Malika1214.github.io/us-obesity-dashboard/)

---

## Known Limitations & Future Work

- PLACES is a **single-year snapshot** — no year-over-year trend chart is possible with this dataset alone. A future version could integrate CDC BRFSS state-level trend data alongside the county map.
- Some counties (~few dozen) may have **suppressed values** in the PLACES dataset due to small population sizes; these render as grey "No data" counties.
- Could be extended with a **search/filter** by state, a **bottom 10 counties** view, or a **bivariate map** correlating obesity with income or food access data.