const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const basuraSchema = new Schema(
  {
    type: String,
    longitud: String,
    latitud: String,
    street: String
  },
  {
    timestamps: true
  }
);

const Basura = mongoose.model("Basura", basuraSchema);
module.exports = Basura;
