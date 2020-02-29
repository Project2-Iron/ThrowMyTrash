const express = require("express");
const router = express.Router();
const Trash = require("../models/trash");
const CPoint = require("../models/cleanPoint");

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

// router.get("/cPointns", async (req, res, next) => {
//   const trash = await Trash.find();
//   res.json(trash);
// });

module.exports = router;
