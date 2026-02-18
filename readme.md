US County Obesity Smart Dashboard
Webmap URL

https://Malika1214.github.io/us-obesity-dashboard/

Project Overview

This smart dashboard visualizes adult obesity rates across US counties. The dashboard provides an interactive choropleth map, highlights the top 10 counties with the highest obesity rates, and displays the national average dynamically.

The project demonstrates the creation of a thematic smart dashboard using Mapbox GL JS for the map component and C3.js for charts. The dashboard is fully interactive, providing both spatial and statistical insights into county-level obesity trends.

Data Sources

CDC PLACES Obesity Dataset – Adult obesity rates by county

US Census TIGER/Line County Boundaries – County geometries for mapping

Additional datasets were explored for potential cross-analysis, ensuring data completeness and accuracy.

Map Type Justification

A choropleth map was chosen because obesity rates are normalized percentages tied to administrative boundaries (counties). Choropleth maps are ideal for comparing rates across defined spatial units, allowing users to quickly identify spatial patterns and clusters.

Visualization Components

Choropleth Map of Obesity Rate – Colors represent the obesity percentage in each county, allowing regional comparisons.

Bar Chart of Top 10 Counties – Shows the 10 counties with the highest obesity rates to highlight outliers.

National Average Indicator – A dynamic numeric display showing the current national average for adult obesity.

(Optional for future extension) – Could include bottom 10 counties, trend charts, or interactive popups with additional county-level data.

Lab Requirements Addressed

Geospatial datasets: US Census TIGER/Line shapefiles and CDC PLACES obesity data.

Thematic map: Choropleth map chosen for normalized percentage data.

Additional visualization components: Bar chart and dynamic national average.

Repository accessibility: Dashboard is hosted at https://Malika1214.github.io/us-obesity-dashboard/.