const withDbConnection = require("../withDbConnection");
const CleanPoint = require("../models/cleanPoint");
const axios = require("axios");

const getCleanPoint = async () => {
  let cPoints;

  try {
    const response = await axios({
      method: "get",
      url:
        "https://datos.madrid.es/egob/catalogo/200284-0-puntos-limpios-fijos.json"
    });
    cPoints = response.data["@graph"];
    cPoints = cPoints.filter(e => e.location);
    cPoints = cPoints.map(cPoint => ({
      type: cPoint.title,
      lng: cPoint.location.longitude,
      lat: cPoint.location.latitude,
      street: cPoint.address["street-address"]
    }));
  } catch (error) {
    console.log(error);
  }

  try {
    await withDbConnection(async () => {
      const newCleanPoint = await CleanPoint.create(cPoints);
      console.log(`${newCleanPoint.length} Clean Points created`);
    });
  } catch (error) {
    console.log(error);
  }
};

getCleanPoint();
