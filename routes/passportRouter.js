const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const model = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");

passportRouter.get("/register", (req, res, next) => {
  res.render("passport/register");
});

passportRouter.post("/register", async (req, res, next) => {
  const { name, lastName, address, city, zip, username, password } = req.body;
  console.log("username");
  const userCreated = await model.findOne({ username });

  if (userCreated) {
    return res.redirect("/register");
  } else {
    await model.create({
      name,
      lastName,
      address,
      city,
      zip,
      username,
      password: hashPassword(password)
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
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/profile", { user: req.user });
});

module.exports = passportRouter;
