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
    password: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
