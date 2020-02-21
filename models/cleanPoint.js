const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cPointSchema = new Schema(
  {
    type: String,
    lng: Number,
    lat: Number,
    street: String
  },
  {
    timestamps: true
  }
);

const Temple = mongoose.model("CPoint", cPointSchema);
module.exports = Temple;
