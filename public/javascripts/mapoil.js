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
    oilApi.get("/oil").then(res => {
      const dataContainers = res.data;
      console.log(dataContainers);

      document.getElementsByClassName("wrapper")[0].classList.remove("hide");
      document.getElementsByClassName("lds-roller")[0].style.display = "none";

      dataContainers.forEach((container, i) => {
        container.properties.id = i;
      });

      /* This will let you use the .remove() function later on */
      if (!("remove" in Element.prototype)) {
        Element.prototype.remove = function() {
          if (this.parentNode) {
            this.parentNode.removeChild(this);
          }
        };
      }

      map.addSource("containers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: dataContainers
        }
      });

      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: true,
        bbox: [
          -3.889302833323484,
          40.31950673783538,
          -3.54872936230592,
          40.64119742977738
        ]
      });

      /**
       * Add all the things to the page:
       * - The location listings on the side of the page
       * - The search box (MapboxGeocoder) onto the map
       * - The markers onto the map
       */
      buildLocationList(dataContainers);
      map.addControl(geocoder, "top-left");
      addMarkers();

      /**
       * Listen for when a geocoder result is returned. When one is returned:
       * - Calculate distances
       * - Sort stores by distance
       * - Rebuild the listings
       * - Adjust the map camera
       * - Open a popup for the closest store
       * - Highlight the listing for the closest store.
       */
      geocoder.on("result", function(ev) {
        /* Get the coordinate of the search result */
        var searchResult = ev.result.geometry;

        /**
         * Calculate distances:
         * For each store, use turf.disance to calculate the distance
         * in miles between the searchResult and the store. Assign the
         * calculated value to a property called `distance`.
         */
        var options = { units: "kilometers" };
        dataContainers.forEach(function(container) {
          Object.defineProperty(container.properties, "distance", {
            value: turf.distance(searchResult, container.geometry, options),
            writable: true,
            enumerable: true,
            configurable: true
          });
        });

        /**
         * Sort stores by distance from closest to the `searchResult`
         * to furthest.
         */
        dataContainers.sort(function(a, b) {
          if (a.properties.distance > b.properties.distance) {
            return 1;
          }
          if (a.properties.distance < b.properties.distance) {
            return -1;
          }
          return 0; // a must be equal to b
        });

        /**
         * Rebuild the listings:
         * Remove the existing listings and build the location
         * list again using the newly sorted stores.
         */
        var listings = document.getElementById("listings");
        while (listings.firstChild) {
          listings.removeChild(listings.firstChild);
        }
        buildLocationList(dataContainers);

        /* Open a popup for the closest store. */
        createPopUp(dataContainers[0]);

        /** Highlight the listing for the closest store. */
        var activeListing = document.getElementById(
          "listing-" + dataContainers[0].properties.id
        );
        activeListing.classList.add("active");

        /**
         * Adjust the map camera:
         * Get a bbox that contains both the geocoder result and
         * the closest store. Fit the bounds to that bbox.
         */
        var bbox = getBbox(dataContainers, 0, searchResult);
        map.fitBounds(bbox, {
          padding: 100
        });
      });

      /**
       * Using the coordinates (lng, lat) for
       * (1) the search result and
       * (2) the closest store
       * construct a bbox that will contain both points
       */
      function getBbox(dataContainers, storeIdentifier, searchResult) {
        var lats = [
          dataContainers[storeIdentifier].geometry.coordinates[1],
          searchResult.coordinates[1]
        ];
        var lons = [
          dataContainers[storeIdentifier].geometry.coordinates[0],
          searchResult.coordinates[0]
        ];
        var sortedLons = lons.sort(function(a, b) {
          if (a > b) {
            return 1;
          }
          if (a.distance < b.distance) {
            return -1;
          }
          return 0;
        });
        var sortedLats = lats.sort(function(a, b) {
          if (a > b) {
            return 1;
          }
          if (a.distance < b.distance) {
            return -1;
          }
          return 0;
        });
        return [
          [sortedLons[0], sortedLats[0]],
          [sortedLons[1], sortedLats[1]]
        ];
      }

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
          el.className = "markeroil";

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
            flyToStore(marker);
            createPopUp(marker);
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
       * Add a listing for each store to the sidebar.
       **/
      function buildLocationList(data) {
        dataContainers.forEach(function(container, i) {
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
          if (prop.distance) {
            var roundedDistance = Math.round(prop.distance * 100) / 100;
            details.innerHTML +=
              "<p><strong>" + roundedDistance + " kilometers away</strong></p>";
          }

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
    });
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
    }
  });
});
