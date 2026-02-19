mapboxgl.accessToken =
  "pk.eyJ1Ijoidmlwc2hlaGJheiIsImEiOiJjbWt1eDYzcWQwMGtzM2NxeDN1Z2NuMzZrIn0.UtNx0noYlyAJPAkP1g6x1g";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: [-98, 38],
  zoom: 3,
});

let popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });
const mapLoaded = new Promise((resolve) => map.on("load", resolve));

Promise.all([
  d3.json("data/counties.geojson"),
  d3.csv("data/PLACES_county.csv"),
  mapLoaded,
])
  .then(([geoData, placesData]) => {
    const obesityFiltered = placesData.filter(
      (d) =>
        d.MeasureId === "OBESITY" &&
        d.Data_Value !== "" &&
        !isNaN(+d.Data_Value),
    );

    const obesityByCounty = {};
    obesityFiltered.forEach((d) => {
      obesityByCounty[d.LocationID] = +d.Data_Value;
    });

    geoData.features.forEach((f) => {
      f.properties.obesity = obesityByCounty[f.properties.GEOID] ?? null;
    });

    geoData.features = geoData.features.filter((f) => f.geometry !== null);

    map.addSource("counties", { type: "geojson", data: geoData });

    map.addLayer({
      id: "obesity-layer",
      type: "fill",
      source: "counties",
      paint: {
        "fill-color": [
          "case",
          ["==", ["get", "obesity"], null],
          "#cccccc",
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
      paint: { "line-color": "#ffffff", "line-width": 0.3 },
    });

    map.on("mousemove", "obesity-layer", (e) => {
      map.getCanvas().style.cursor = "pointer";
      const props = e.features[0].properties;
      const raw = props.obesity;
      const value =
        raw !== null && raw !== undefined && !isNaN(+raw)
          ? (+raw).toFixed(1)
          : "N/A";
      popup
        .setLngLat(e.lngLat)
        .setHTML(
          `<strong>${props.NAME} County</strong><br>Obesity Rate: ${value}%`,
        )
        .addTo(map);
    });

    map.on("mouseleave", "obesity-layer", () => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    });

    map.on("click", "obesity-layer", (e) => {
      const props = e.features[0].properties;
      const raw = props.obesity;
      const value =
        raw !== null && raw !== undefined && !isNaN(+raw)
          ? (+raw).toFixed(1)
          : "N/A";
      d3.select("#selectedCounty").html(
        `<h3>${props.NAME} County</h3>
       <p>Obesity Rate: <strong>${value}%</strong></p>`,
      );
    });

    const avg = d3.mean(obesityFiltered, (d) => +d.Data_Value);
    d3.select("#nationalAvg").html(
      `<h3>National Average: ${avg.toFixed(1)}%</h3>`,
    );

    const sortedDesc = obesityFiltered
      .slice()
      .sort((a, b) => +b.Data_Value - +a.Data_Value);

    const topCounty = sortedDesc[0];
    d3.select("#topCounty").html(
      `<h3>Highest: ${topCounty.LocationName}, ${topCounty.StateAbbr} (${(+topCounty.Data_Value).toFixed(1)}%)</h3>`,
    );

    const top10 = sortedDesc.slice(0, 10);

    c3.generate({
      bindto: "#barChart",
      data: {
        columns: [["Obesity Rate"].concat(top10.map((d) => +d.Data_Value))],
        type: "bar",
      },
      axis: {
        x: {
          type: "category",
          categories: top10.map((d) => `${d.LocationName}, ${d.StateAbbr}`),
          tick: { rotate: 45, multiline: false },
        },
        y: {
          label: { text: "Obesity Rate (%)", position: "outer-middle" },
          min: 0,
          padding: { bottom: 0 },
        },
      },
      bar: { width: { ratio: 0.7 } },
      legend: { show: false },
    });

    const stateAvgs = d3
      .rollups(
        obesityFiltered,
        (v) => d3.mean(v, (d) => +d.Data_Value),
        (d) => d.StateAbbr,
      )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    c3.generate({
      bindto: "#lineChart",
      data: {
        columns: [
          ["Avg County Obesity"].concat(stateAvgs.map((d) => +d[1].toFixed(1))),
        ],
        type: "bar",
      },
      axis: {
        x: {
          type: "category",
          categories: stateAvgs.map((d) => d[0]),
          tick: { rotate: 45, multiline: false },
        },
        y: {
          label: { text: "Avg Obesity (%)", position: "outer-middle" },
          min: 0,
          padding: { bottom: 0 },
        },
      },
      bar: { width: { ratio: 0.7 } },
      legend: { show: false },
      title: { text: "Top 15 States by Avg County Obesity" },
    });

    d3.select("#legend").html(`
    <h3>Legend</h3>
    <div><span style="background:#cccccc;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>No data</div>
    <div><span style="background:#edf8fb;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>&lt; 20%</div>
    <div><span style="background:#b2e2e2;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>20–25%</div>
    <div><span style="background:#66c2a4;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>25–30%</div>
    <div><span style="background:#2ca25f;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>30–35%</div>
    <div><span style="background:#006d2c;display:inline-block;width:16px;height:16px;margin-right:6px;vertical-align:middle;"></span>&gt; 35%</div>
  `);
  })
  .catch((err) => {
    console.error("Failed to load data:", err);
  });
