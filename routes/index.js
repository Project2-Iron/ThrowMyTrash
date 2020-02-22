const express = require("express");
const router = express.Router();
const Trash = require("../models/trash");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/trash", async (req, res, next) => {
  const trash = await Trash.find();
  res.json(trash);
});

module.exports = router;
