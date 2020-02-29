const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservatersSchema = new Schema(
  {
    typeOfWaste: String,
    direction: String,
    phone: Number,
    date: String,
    time: { type: Array }
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
