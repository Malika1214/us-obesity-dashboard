# US County Obesity Smart Dashboard

## Webmap URL
[https://Malika1214.github.io/us-obesity-dashboard/](https://Malika1214.github.io/us-obesity-dashboard/)

## Project Overview
This dashboard visualizes **adult obesity rates across US counties**. It includes:  

- An **interactive choropleth map** showing obesity percentages by county.  
- A **bar chart of the top 10 counties** with the highest obesity rates.  
- A **dynamic national average indicator** for quick reference.  

The dashboard is built using **Mapbox GL JS** for the map and **C3.js** for charts, allowing users to explore both spatial patterns and statistical trends in county-level obesity data.

## Data Sources
- **CDC PLACES Obesity Dataset** – Adult obesity rates by county.  
- **US Census TIGER/Line County Boundaries** – County geometries for mapping.  

Additional datasets were also reviewed to ensure data accuracy and completeness.

## Map Type Justification
A **choropleth map** was chosen because obesity rates are normalized percentages associated with counties. Choropleth maps are ideal for comparing data across defined geographic units, making it easy to identify patterns and regional differences.

## Visualization Components
1. **Choropleth Map of Obesity Rates** – Uses a color gradient to visualize obesity percentages by county.  
2. **Top 10 Counties Bar Chart** – Highlights counties with the highest obesity rates.  
3. **National Average Indicator** – Dynamically displays the current US adult obesity average.  
4. *(Optional future extension)* – Could include bottom 10 counties, trend charts, or interactive popups with more county-level info.

## Lab Requirements Addressed
- **Geospatial datasets:** US Census TIGER/Line shapefiles and CDC PLACES obesity data.  
- **Thematic map:** Choropleth map chosen for normalized percentage data.  
- **Additional visualization components:** Bar chart and dynamic national average.  
- **Repository accessibility:** Dashboard is hosted at [https://Malika1214.github.io/us-obesity-dashboard/](https://Malika1214.github.io/us-obesity-dashboard/).

## Implementation Notes
- **Map Styling:** Mapbox’s `light-v11` style is used for clarity and visual contrast.  
- **Data Binding:** Obesity data is joined to county geometries via FIPS codes.  
- **Charts:** C3.js generates the top 10 counties bar chart dynamically.  
- **Interactivity:** Future versions could include hover popups or trend charts for deeper analysis.
