const withDbConnection = require("../withDbConnection");
const data = require("../data/aceite.json");
const oilModel = require("../models/oil");

function process(str) {
  return (
    str +
    "".replace(/^([^.]*\.)(.*)$/, function(a, b, c) {
      return b + c.replace(/\./g, "");
    })
  );
}

const oil = data.map(e => {
  const oil = {};
  oil.type = "Feature";
  oil.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(process(e.LONGITUD)),
      parseFloat(process(e.LATITUD))
    ]
  };
  oil.properties = {
    name: e["TIPO_DATO"],
    address: e["DIRECCION_COMPLETA"]
  };
  return oil;
});

// console.log(oils[0]);
withDbConnection(async () => {
  // await dropIfExist(oilModel);
  const newoil = await oilModel.create(oil);
  console.log(`${newoil.length} oil created`);
});
