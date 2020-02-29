const withDbConnection = require("../withDbConnection");
const data = require("../data/ropa.json");
const clothesModel = require("../models/clothes");

function process(str) {
  return (
    str +
    "".replace(/^([^.]*\.)(.*)$/, function(a, b, c) {
      return b + c.replace(/\./g, "");
    })
  );
}

const clothes = data.map(e => {
  const clothes = {};
  clothes.type = "Feature";
  clothes.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(process(e.LONGITUD)),
      parseFloat(process(e.LATITUD))
    ]
  };
  clothes.properties = {
    name: e["TIPO_DATO"],
    address: e["DIRECCION_COMPLETA"]
  };
  return clothes;
});

// console.log(clothess[0]);
withDbConnection(async () => {
  // await dropIfExist(clothesModel);
  const newclothes = await clothesModel.create(clothes);
  console.log(`${newclothes.length} clothes created`);
});
