const withDbConnection = require("../withDbConnection");
const data = require("../data/pilas.json");
const batteriesModel = require("../models/batteries");

function process(str) {
  return str.replace(/^([^.]*\.)(.*)$/, function(a, b, c) {
    return b + c.replace(/\./g, "");
  });
}

const batteries = data.map(e => {
  const battery = {};
  battery.type = "Feature";
  battery.geometry = {
    type: "Point",
    coordinates: [
      parseFloat(process(e.Longitud)),
      parseFloat(process(e.Latitud))
    ]
  };
  battery.properties = {
    name: e["TIPO MOBILIARIO (ACTUAL)"],
    address: e.emplazamiento
  };
  return battery;
});

// console.log(batterys[0]);
withDbConnection(async () => {
  // await dropIfExist(batteriesModel);
  const newBattery = await batteriesModel.create(batteries);
  console.log(`${newBattery.length} batteries created`);
});
