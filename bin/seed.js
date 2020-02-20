const withDbConnection = require("../withDbConnection");
const data = require("../data/convertcsv.json");
const trashModel = require("../models/trash");

const containers = data.map(e => {
  const container = {};
  container.type = e["Tipo Contenedor"];
  container.lng = e.LONGITUD;
  container.lat = e.LATITUD;
  container.street = e.NOMBRE;
  return container;
});

withDbConnection(async () => {
  await trashModel.create(containers);
});
