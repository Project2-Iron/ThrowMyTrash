const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cPointSchema = new Schema(
  {
    name: String,
    address: {
      locality: String,
      streetAddress: String
    },
    location: {
      lat: String,
      lng: String
    }
  },
  {
    timestamps: true
  }
);

const Temple = mongoose.model("CPoint", cPointSchema);
module.exports = Temple;
