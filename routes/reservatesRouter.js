const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const passport = require("passport");
const Reservates = require("../models/reservates");
const Cpoint = require("../models/cleanPoint");

passportRouter.get("/bookings", (req, res, next) => {
  const _id = req.user.id;
  User.findOne({ _id })
    .populate("dates")
    .then(user => {
      const data = user.dates;
      Reservates.findOne().then(reservate => {
        console.log("este es reservateeeeeee", reservate);
        console.log(data);
        return res.render("passport/bookings", { data, reservate });
      });
    });
});

passportRouter.post("/bookings", (req, res, next) => {
  const { typeOfWaste, direction, phone, date, time, observation } = req.body;
  const data = date.concat(", ", time);

  const newReservate = {
    date: data,
    phone: phone,
    typeOfWaste: typeOfWaste,
    direction: direction,
    observation: observation
  };
  Reservates.create(newReservate).then(result =>
    User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { dates: result._id } },
      { new: true }
    )
  );

  return res.redirect("/bookings");
});

passportRouter.post("/bookings/delete/:id", async (req, res, next) => {
  console.log("holiiii");
  const user = req.user;
  const reservate = req.params.id;
  console.log(reservate);
  try {
    await User.updateOne(
      user,
      { $pull: { dates: reservate } },
      { safe: true, multi: true }
    );
    return res.redirect("/bookings");
  } catch (error) {
    console.log(error);
  }
});

module.exports = passportRouter;
