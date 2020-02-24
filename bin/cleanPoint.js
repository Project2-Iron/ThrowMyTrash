const withDbConnection = require("../withDbConnection");
const CleanPoint = require("../models/cleanPoint");
const axios = require("axios");

const getCleanPoint = async () => {
  let cPoints = [];

  try {
    const response = await axios({
      method: "get",
      url:
        "https://datos.madrid.es/egob/catalogo/200284-0-puntos-limpios-fijos.json"
    });
    cPoints = response.data["@graph"];
    cPoints = cPoints.map(e => {
      const cPoint = {};
      cPoint.type = "Feature";
      cPoint.geometry = {
        type: "Point",
        coordinates: [e.location.longitude, e.location.latitude]
      };
      cPoint.properties = {
        name: e.title
      };
      return cPoint;
    });
    await withDbConnection(async () => {
      const newCleanPoint = await CleanPoint.create(cPoints);
      console.log(`${newCleanPoint.length} Clean Points created`);
    });
  } catch (error) {
    console.log(error);
  }
};

getCleanPoint();
