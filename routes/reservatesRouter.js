const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const passport = require("passport");
const Reservates = require("../models/reservates");
const Cpoint = require("../models/cleanPoint");

passportRouter.get("/reservates", (req, res, next) => {
  Reservates.findOne().then(reservate => {
    console.log(reservate);
    const dates = req.user.dates;
    console.log(dates);
    User.findOne().then(date => {
      console.log("eeeeeeeeee" + date.dates);
      const data = date.dates;
      console.log("ooooooooooooo" + data);
      return res.render("passport/reservates", { reservate, data });
    });
  });
});

passportRouter.post("/reservates", async (req, res, next) => {
  const { tipeOfWaste, direction, date, time } = req.body;
  const user = req.user;
  console.log(tipeOfWaste);
  console.log(direction);
  console.log(date);
  console.log(time);
  console.log(user);
  const data = date.concat(", ", time);

  try {
    await User.findByIdAndUpdate(
      user,
      { $addToSet: { dates: data } },
      { new: true }
    );
    return res.redirect("/reservates");
  } catch (error) {
    console.log(error);
    next();
  }
});

passportRouter.post("/reservates/delete/:this", async (req, res, next) => {
  console.log("holiiii");
  const user = req.user;
  const cleanPointId = req.params.this;
  try {
    await User.updateOne(
      user,
      { $pull: { dates: cleanPointId } },
      { safe: true, multi: true }
    );
    return res.redirect("/reservates");
  } catch (error) {
    console.log(error);
  }
});

module.exports = passportRouter;
