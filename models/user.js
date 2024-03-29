const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    lastName: String,
    address: String,
    city: String,
    zip: Number,
    username: String,
    password: String,
    favourites: [{ type: Schema.ObjectId, ref: "CPoint" }],
    //para añadir las coordenadas
    coordinates: { type: [Number], required: true },
    //para añadir las resesrvas
    dates: [{ type: Schema.ObjectId, ref: "Reservate" }]
    // dates: [{ type: String }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
