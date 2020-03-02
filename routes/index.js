const express = require("express");
const router = express.Router();
const Trash = require("../models/trash");
const CPoint = require("../models/cleanPoint");
const Batteries = require("../models/batteries");
const Clothes = require("../models/clothes");
const Oil = require("../models/oil");
const User = require("../models/user");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/trash", async (req, res, next) => {
  const trash = await Trash.find();
  res.json(trash);
});

router.get("/cpoint", async (req, res, next) => {
  const cpoint = await CPoint.find();
  res.json(cpoint);
});

router.get("/batteries", async (req, res, next) => {
  const batteries = await Batteries.find();
  res.json(batteries);
});

router.get("/clothes", async (req, res, next) => {
  const clothes = await Clothes.find();
  res.json(clothes);
});

router.get("/oil", async (req, res, next) => {
  const oil = await Oil.find();
  res.json(oil);
});

router.get("/user", async (req, res, next) => {
  const user = await User.find();
  res.json(user);
});

// router.get("/cPointns", async (req, res, next) => {
//   const trash = await Trash.find();
//   res.json(trash);
// });

module.exports = router;
