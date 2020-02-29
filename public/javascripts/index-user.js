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
    //MAPA DE LOS CUBOS DE BASURA

    cpointsApi.get("/cpoint").then(res => {
      //////
      const dataContainers = res.data;
      console.log(dataContainers);

      document.getElementsByClassName("wrapper")[0].classList.remove("hide");
      document.getElementsByClassName("lds-roller")[0].style.display = "none";

      dataContainers.forEach((container, i) => {
        container.properties.id = i;
      });

      map.addSource("containers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataContainers
          // .map(e => ({
          //   // type: e.type,
          //   // geometry: e.geometry,
          //   ...e, // todo lo que tiene mi objeto, +...
          //   properties: { ...e.properties, id: e._id }
          // })
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

      //LISTING

      function buildLocationList(data) {
        data.forEach(function(container, i) {
          /**
           * Create a shortcut for `store.properties`,
           * which will be used several times below.
           **/
          var prop = container.properties;

          /* Add a new listing section to the sidebar. */
          var listings = document.getElementById("listings");
          var listing = listings.appendChild(document.createElement("div"));
          /* Assign a unique `id` to the listing. */
          listing.id = "listing-" + prop.id;
          /* Assign the `item` class to each listing for styling. */
          listing.className = "item";

          /* Add the link to the individual listing created above. */
          var link = listing.appendChild(document.createElement("a"));
          link.href = "#";
          link.className = "title";
          link.id = "link-" + prop.id;
          link.innerHTML = prop.name;

          /* Add details to the individual listing. */
          var details = listing.appendChild(document.createElement("div"));
          details.innerHTML = prop.address;

          /**
           * Listen to the element and when it is clicked, do four things:
           * 1. Update the `currentFeature` to the store associated with the clicked link
           * 2. Fly to the point
           * 3. Close all other popups and display popup for clicked store
           * 4. Highlight listing in sidebar (and remove highlight for all other listings)
           **/
          link.addEventListener("click", function(e) {
            for (var i = 0; i < dataContainers.length; i++) {
              if (this.id === "link-" + dataContainers[i].properties.id) {
                var clickedListing = dataContainers[i];
                flyToStore(clickedListing);
                createPopUp(clickedListing);
              }
            }
            var activeItem = document.getElementsByClassName("active");
            if (activeItem[0]) {
              activeItem[0].classList.remove("active");
            }
            this.parentNode.classList.add("active");
          });
        });
      }

      /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
       **/
      function flyToStore(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 15
        });
      }

      buildLocationList(dataContainers); // CREA LA LISTA DE PUNTOS EN EL MAPA
      addMarkers();

      //ADD MARKERS

      /**
       * Add a marker to the map for every store listing.
       **/
      function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        dataContainers.forEach(function(marker) {
          /* Create a div element for the marker. */
          var el = document.createElement("div");
          /* Assign a unique `id` to the marker. */
          el.id = "marker-" + marker.properties.id;
          /* Assign the `marker` class to each marker for styling. */
          el.className = "marker";

          /**
           * Create a marker using the div element
           * defined above and add it to the map.
           **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

          /**
           * Listen to the element and when it is clicked, do three things:
           * 1. Fly to the point
           * 2. Close all other popups and display popup for clicked store
           * 3. Highlight listing in sidebar (and remove highlight for all other listings)
           **/
          el.addEventListener("click", function(e) {
            /* Fly to the point */
            flyToStore(marker); //////////////////
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            var activeItem = document.getElementsByClassName("active");
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove("active");
            }
            var listing = document.getElementById(
              "listing-" + marker.properties.id
            );
            listing.classList.add("active");
          });
        });
      }

      /**
       * Create a Mapbox GL JS `Popup`.
       **/
      function createPopUp(currentFeature) {
        var popUps = document.getElementsByClassName("mapboxgl-popup");
        if (popUps[0]) popUps[0].remove();
        var popup = new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML(
            "<h3>" +
              currentFeature.properties.name +
              "</h3>" +
              "<h4>" +
              currentFeature.properties.address +
              "</h4>"
          )
          .addTo(map);

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
      }

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

    // map.on("click", "unclustered-point", function(e) {
    //   var coordinates = e.features[0].geometry.coordinates.slice();
    //   var name = e.features[0].properties.name;
    //   var id = e.features[0].properties.id;

    //   // console.log(e.features[0]);

    //   // Ensure that if the map is zoomed out such that multiple
    //   // copies of the feature are visible, the popup appears
    //   // over the copy being pointed to.
    //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //   }

    //   new mapboxgl.Popup()
    //     .setLngLat(coordinates)
    //     .setHTML(`${name}`)
    //     .addTo(map);
    // });

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
});
