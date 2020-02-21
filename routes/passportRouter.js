const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const model = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");
const Cpoint = require("../models/cleanPoint"); // añadido

passportRouter.get("/about", (req, res, next) => {
  res.render("passport/about");
});

passportRouter.get("/favourites", (req, res, next) => {
  const cpoint = Cpoint.find(); // añadido

  console.log(cpoint);

  res.render("passport/favourites", { cpoint }); // añadido
});

passportRouter.get("/register", (req, res, next) => {
  res.render("passport/register");
});

passportRouter.post("/register", async (req, res, next) => {
  const { name, lastName, address, city, zip, username, password } = req.body;
  console.log("username");
  const userCreated = await model.findOne({ username });

  if (userCreated) {
    return res.redirect("/login");
  } else {
    await model.create({
      name,
      lastName,
      address,
      city,
      zip,
      username,
      password: hashPassword(password),
      favourites: " "
    });
  }
  return res.redirect("/");
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/page-personal",
    failureRedirect: "/register"
  })
);

passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get(
  "/page-personal",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/page-personal", { user: req.user });
  }
);

passportRouter.get("/info", (req, res, next) => {
  return res.render("passport/info");
});

passportRouter.post("/info/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, lastName, address, password } = req.body;
  try {
    await model.findByIdAndUpdate(id, {
      name,
      lastName,
      address,
      password: hashPassword(password)
    });
    res.redirect("/info");
  } catch (error) {
    console.log(error);
    next();
  }
});

module.exports = passportRouter;
