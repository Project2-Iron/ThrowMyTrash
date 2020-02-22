mapboxgl.accessToken =
  "pk.eyJ1IjoidGhyb3dteXRyYXNoIiwiYSI6ImNrNnF1MjN6NDAwZmYzZ28yeDNvcWhjZjEifQ.UkRO4CCllNp_uI6CR-gqNw";

window.trashApi = axios.create({
  baseURL: "http://localhost:3000/"
});

window.setMap = (center, zoom = 10) => {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl());

  return map;
};
