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
    new mapboxgl.Marker().setLngLat(center).addTo(map);

    // Draw more markers
    // const markers = [
    //   { name: "El celler de Can Roca", coords: [2.805826, 41.9933814] },
    //   { name: "Sublimotion", coords: [1.4023929, 38.8835446] },
    //   { name: "El Gofio", coords: [-3.7005086, 40.4138856] }
    // ];

    drawMarkers(map /*, markers*/);
  });
});
