const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReservatersSchema = new Schema(
  {
    date: Number,
    time: { type: Array }
  },
  {
    timestamps: true
  }
);

const Reservate = mongoose.model("reservate", ReservatersSchema);
module.exports = Reservate;
