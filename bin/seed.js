const withDbConnection = require("../withDbConnection");
const data = require("../data/csvjson.json");
const trashModel = require("../models/trash");

// const containers = data.map(e => {
//   const container = {};
//   container.type = e["Tipo Contenedor"];
//   container.lng = e.LONGITUD;
//   container.lat = e.LATITUD;
//   container.street = e.NOMBRE;
//   return container;
// });

const containers = data.map(e => {
  const container = {};
  container.type = "Feature";
  container.geometry = {
    type: "Point",
    coordinates: [e.LATITUD, e.LONGITUD] //.split(",").map(Number)
    //req.body.coordinates.split(',').map(Number)
  };
  container.properties = {
    name: e["Tipo Contenedor"]
  };
  return container;
});

// console.log(containers[0]);
withDbConnection(async () => {
  // await dropIfExist(trashModel);
  const newTrash = await trashModel.create(containers);
  console.log(`${newTrash.length} Containers created`);
});
