const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");
const Cpoint = require("../models/cleanPoint");

passportRouter.get("/page-personal/battery", (req, res, next) => {
  return res.render("passport/battery");
});

passportRouter.get("/page-personal/clothes", (req, res, next) => {
  return res.render("passport/clothes");
});

passportRouter.get("/page-personal/vegetalOil", (req, res, next) => {
  return res.render("passport/vegetalOil");
});

passportRouter.get("/page-personal/cleanPoints", (req, res, next) => {
  return res.render("passport/cleanPoints");
});

module.exports = passportRouter;
