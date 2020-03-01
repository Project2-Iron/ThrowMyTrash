const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservatersSchema = new Schema(
  {
    typeOfWaste: String,
    direction: String,
    phone: Number,
    date: String,
    time: { type: Array, default: ["10:00", "11:00", "12:00"] },
    observation: { type: String, default: "" }
  },
  {
    timestamps: true
  }
);

// const ReservatersSchema = new Schema(
//   {
//     date: Number,
//     time: { type: Array }
//   },
//   {
//     timestamps: true
//   }
// );

const Reservate = mongoose.model("Reservate", ReservatersSchema);
module.exports = Reservate;
