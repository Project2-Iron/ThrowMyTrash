mapboxgl.accessToken =
  "pk.eyJ1IjoidGhyb3dteXRyYXNoIiwiYSI6ImNrNnF1MjN6NDAwZmYzZ28yeDNvcWhjZjEifQ.UkRO4CCllNp_uI6CR-gqNw";

// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v11"
// });

window.setMap = (center, zoom = 12) => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl());

  return map;
};
