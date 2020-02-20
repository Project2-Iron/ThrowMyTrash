const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trashSchema = new Schema(
  {
    type: String,
    lng: String,
    lat: String,
    street: String
  },
  {
    timestamps: true
  }
);

const Trash = mongoose.model("trash", trashSchema);
module.exports = Trash;
