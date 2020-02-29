mapboxgl.accessToken =
  "pk.eyJ1IjoidGhyb3dteXRyYXNoIiwiYSI6ImNrNnF1MjN6NDAwZmYzZ28yeDNvcWhjZjEifQ.UkRO4CCllNp_uI6CR-gqNw";

window.trashApi = axios.create({
  // baseURL: "https://throw-my-trash.herokuapp.com/"
  baseURL: "https://localhost:3000"
});

window.cpointsApi = axios.create({
  baseURL: "https://localhost:3000"
  // baseURL: "https://throw-my-trash.herokuapp.com/"
});

window.setMap = (center, zoom = 10) => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    })
  );

  return map;
};
