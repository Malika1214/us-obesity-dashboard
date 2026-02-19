mapboxgl.accessToken =
  "pk.eyJ1Ijoidmlwc2hlaGJheiIsImEiOiJjbWt1eDYzcWQwMGtzM2NxeDN1Z2NuMzZrIn0.UtNx0noYlyAJPAkP1g6x1g";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 38],
  zoom: 3,
});

let popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

Promise.all([
  d3.json("data/counties.json"),
  d3.csv("data/U.S._Chronic_Disease_Indicators.csv"),
]).then(([geoData, obesityData]) => {
  const obesityDataFiltered = obesityData.filter(
    (d) =>
      d.Topic === "Nutrition, Physical Activity, and Weight Status" &&
      d.Question === "Obesity among adults" &&
      !isNaN(+d.DataValue),
  );

  const obesityByCounty = {};
  obesityDataFiltered.forEach((d) => {
    obesityByCounty[d.LocationID.padStart(5, "0")] = +d.DataValue;
  });

  geoData.features.forEach((feature) => {
    const fips = feature.properties.GEOID;
    feature.properties.obesity = obesityByCounty[fips] || null;
  });

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
          "case",
          ["==", ["get", "obesity"], null],
          "#cccccc", // grey for missing
          [
            "step",
            ["get", "obesity"],
            "#edf8fb",
            20,
            "#b2e2e2",
            25,
            "#66c2a4",
            30,
            "#2ca25f",
            35,
            "#006d2c",
          ],
        ],

        "fill-opacity": 0.8,
      },
    });

    map.addLayer({
      id: "county-borders",
      type: "line",
      source: "counties",
      paint: {
        "line-color": "#ffffff",
        "line-width": 0.3,
      },
    });

    // Hover popup
    map.on("mousemove", "obesity-layer", (e) => {
      const props = e.features[0].properties;
      const value = props.obesity !== null ? props.obesity.toFixed(2) : "N/A";
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>${props.NAME} County</strong><br>
       Obesity Rate: ${value}%`,
        )
        .addTo(map);
    });

    map.on("mouseleave", "obesity-layer", () => {
      popup.remove();
    });

    // Click interaction
    map.on("click", "obesity-layer", (e) => {
      const props = e.features[0].properties;
      const value = props.obesity !== null ? props.obesity.toFixed(2) : "N/A";
      d3.select("#selectedCounty").html(
        `<h3>${props.NAME} County</h3>
     <p>Obesity Rate: <strong>${value}%</strong></p>`,
      );
    });
  });

  // National average
  const avg = d3.mean(obesityDataFiltered, (d) => +d.DataValue);
  d3.select("#nationalAvg").html(
    `<h3>National Average: ${avg.toFixed(2)}%</h3>`,
  );

  // Top 10 Counties
  const top10 = obesityDataFiltered
    .sort((a, b) => +b.DataValue - +a.DataValue)
    .slice(0, 10);

  c3.generate({
    bindto: "#barChart",
    data: {
      columns: [["Obesity Rate"].concat(top10.map((d) => +d.DataValue))],
      type: "bar",
    },
    axis: {
      x: {
        type: "category",
        categories: top10.map((d) => d.LocationDesc),
        tick: {
          rotate: 45,
          multiline: false,
        },
      },
      y: {
        label: {
          text: "Obesity Rate (%)",
          position: "outer-middle",
        },
      },
    },
    bar: {
      width: { ratio: 0.7 },
    },
  });

  createLegend();
});

function createLegend() {
  const legendHTML = `
    <h3>Legend</h3>
    <div><span style="background:#edf8fb"></span> < 20%</div>
    <div><span style="background:#b2e2e2"></span> 20–25%</div>
    <div><span style="background:#66c2a4"></span> 25–30%</div>
    <div><span style="background:#2ca25f"></span> 30–35%</div>
    <div><span style="background:#006d2c"></span> > 35%</div>
  `;
  d3.select("#panel").append("div").attr("id", "legend").html(legendHTML);
}
