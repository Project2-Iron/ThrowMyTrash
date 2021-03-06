document.addEventListener("DOMContentLoaded", () => {
  document.getElementsByClassName("wrapper")[0].classList.add("hide");
  document.getElementsByClassName("lds-roller")[0].classList.add("show");

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

      document.getElementsByClassName("wrapper")[0].classList.remove("hide");
      document.getElementsByClassName("lds-roller")[0].style.display = "none";

      map.addSource("containers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataContainers.map(e => ({
            // type: e.type,
            // geometry: e.geometry,
            ...e, // todo lo que tiene mi objeto, +...
            properties: { ...e.properties, id: e._id }
          }))
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "containers",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three types of circles:
          //   * Blue, 20px circles when point count is less than 100
          //   * Yellow, 30px circles when point count is between 100 and 750
          //   * Pink, 40px circles when point count is greater than or equal to 750
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1"
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "containers",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12
        }
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "containers",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff"
        }
      });
      // inspect a cluster on click
      map.on("click", "clusters", function(e) {
        var features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"]
        });
        var clusterId = features[0].properties.cluster_id;
        map
          .getSource("containers")
          .getClusterExpansionZoom(clusterId, function(err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          });
      });
    });

    var geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken, // Set the access token
      mapboxgl: map, // Set the mapbox-gl instance
      marker: true, // Use the geocoder's default marker style
      bbox: [
        -3.889302833323484,
        40.31950673783538,
        -3.54872936230592,
        40.64119742977738
      ] // Set the bounding box coordinates
    });

    map.addControl(geocoder, "top-left");
  });

  map.on("click", "unclustered-point", function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var name = e.features[0].properties.name;
    var id = e.features[0].properties.id;

    console.log(e.features[0]);

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var popUps = document.getElementsByClassName("mapboxgl-popup");
    if (popUps[0]) popUps[0].remove();

    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(
        "<h3>" +
          e.features[0].properties.name +
          "</h3>" +
          "<h4>" +
          e.features[0].properties.address +
          "</h4>"
      )
      .addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "clusters", function() {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "clusters", function() {
    map.getCanvas().style.cursor = "";
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "unclustered-point", function() {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "unclustered-point", function() {
    map.getCanvas().style.cursor = "";
  });
});
