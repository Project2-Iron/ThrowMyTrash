const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");
const Cpoint = require("../models/cleanPoint");

passportRouter.get("/page-personal/prueba", (req, res, next) => {
  return res.render("passport/prueba");
});
