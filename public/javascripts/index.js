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
      const dataContainers = res.data;
      console.log(dataContainers);
      map.addSource("containers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataContainers
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
  map.on("click", "trashcontainers", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var id = e._id;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      // .setHTML(id)
      .setHTML(name)
      .addTo(map);
  });
  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "trashcontaiers", function() {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "trashcontainters", function() {
    map.getCanvas().style.cursor = "";
  });
});
