const data = require("../data/convertcsv.json");
// console.log(data);

const containers = data.map(e => {
  const container = {};
  container.type = e["Tipo Contenedor"];
  container.lng = e.LONGITUD;
  container.lat = e.LATITUD;
  container.street = e.NOMBRE;
  return container;
});

console.log(containers);
