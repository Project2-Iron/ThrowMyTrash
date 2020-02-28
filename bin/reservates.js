const withDbConnection = require("../withDbConnection");
const reservateModel = require("../models/reservates");

withDbConnection(async () => {
  const newReservate = await reservateModel.create([
    {
      date: "",
      time: ["10:00", "11:00", "12:00"]
    }
  ]);
  console.log(newReservate);
});
