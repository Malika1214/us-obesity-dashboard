# 🗺️ US County Obesity Smart Dashboard  

**Live Site:**  
https://Malika1214.github.io/us-obesity-dashboard/

---

## 📌 Project Overview  

This project is an interactive dashboard that shows **adult obesity rates across U.S. counties**.  

It uses a choropleth map to visualize obesity percentages — darker colors mean higher obesity rates. Users can hover and click on counties to see detailed information, along with supporting charts and summary statistics.

---

## 🚀 Features  

- Interactive county-level choropleth map  
- Hover popup (county name + obesity rate)  
- Click panel with detailed info  
- Top 10 counties with highest obesity rates  
- Top 15 states by average county rate  
- National average indicator  
- Highest county indicator  

Counties with missing data are shown in gray.

---

## 📊 Data Sources  

- **:contentReference[oaicite:0]{index=0} (CDC PLACES dataset)** – County-level obesity data  
- **:contentReference[oaicite:1]{index=1}** – County boundary GeoJSON  

Data is joined using 5-digit FIPS county codes.

---

## 🛠️ Built With  

- Mapbox GL JS  
- D3.js  
- C3.js  

---

## ⚠️ Limitations  

- Single-year data (no trend over time)  
- Some counties have suppressed/missing values  
- Could be improved with search, filters, or additional health/socioeconomic data  

---

This project helped me practice data joining, GeoJSON handling, and building a full interactive web dashboard from scratch.