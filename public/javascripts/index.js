document.addEventListener("DOMContentLoaded", () => {
  // the mapbox map
  const map = setMap();

  // Geolocate the user
  geolocateMe().then(geo => {
    console.log(geo);
    const { latitude, longitude } = geo.coords;
    const center = [longitude, latitude];
    // Center the map and add a marker
    map.setCenter(center);
  });

  map.on("load", function() {
    trashApi.get("/trash").then(res => {
      const data = res.data;
      const formatData = data.map(({ geometry, type }) => ({ geometry, type }));
      console.log(formatData);
      map.addSource("containers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: data
        }
      });
      map.addLayer({
        id: "trashcontainers",
        type: "circle",
        source: "containers",
        paint: {
          // make circles larger as the user zooms from z12 to z22
          "circle-radius": {
            base: 5,
            stops: [
              [12, 2],
              [22, 180]
            ]
          },
          "circle-color": "red"
        }
      });
    });
  });
});
