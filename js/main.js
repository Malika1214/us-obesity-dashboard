mapboxgl.accessToken =
  "pk.eyJ1Ijoidmlwc2hlaGJheiIsImEiOiJjbWt1eDYzcWQwMGtzM2NxeDN1Z2NuMzZrIn0.UtNx0noYlyAJPAkP1g6x1g";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 38],
  zoom: 3,
});

Promise.all([
  d3.json("data/counties.json"),
  d3.csv("data/U.S._Chronic_Disease_Indicators.csv"),
]).then(([geoData, obesityData]) => {
  // Filter relevant obesity data
  const obesityDataFiltered = obesityData.filter(
    (d) =>
      d.Topic === "Nutrition, Physical Activity, and Weight Status" &&
      d.Question === "Obesity among adults" &&
      !isNaN(+d.DataValue)
  );

  // Map obesity by county
  const obesityByCounty = {};
  obesityDataFiltered.forEach((d) => {
    obesityByCounty[d.LocationID.padStart(5, "0")] = +d.DataValue;
  });

  // Attach obesity data to geoData
  geoData.features.forEach((feature) => {
    const fips = feature.properties.GEOID;
    feature.properties.obesity = obesityByCounty[fips] || 0;
  });

  // Add Mapbox layer
  map.on("load", () => {
    map.addSource("counties", {
      type: "geojson",
      data: geoData,
    });

    map.addLayer({
      id: "obesity-layer",
      type: "fill",
      source: "counties",
      paint: {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["get", "obesity"],
          10,
          "#edf8fb",
          20,
          "#b2e2e2",
          30,
          "#66c2a4",
          40,
          "#238b45",
        ],
        "fill-opacity": 0.7,
      },
    });
  });

  // National average
  const avg = d3.mean(obesityDataFiltered, (d) => +d.DataValue);
  d3.select("#nationalAvg").html(`<h3>National Avg: ${avg.toFixed(2)}%</h3>`);

  // Top 10 Counties Bar Chart
  const top10 = obesityDataFiltered
    .sort((a, b) => +b.DataValue - +a.DataValue)
    .slice(0, 10);

  c3.generate({
    bindto: "#barChart",
    data: {
      columns: [["Obesity"].concat(top10.map((d) => +d.DataValue))],
      type: "bar",
    },
    axis: {
      x: {
        type: "category",
        categories: top10.map((d) => d.LocationDesc),
      },
    },
  });
});
