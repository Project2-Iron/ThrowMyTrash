const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require("../models/user");
const passport = require("passport");
const { hashPassword, checkHashed } = require("../lib/hashing");
const Cpoint = require("../models/cleanPoint");

//search
passportRouter.get("/favourites", (req, res, next) => {
  const _id = req.user.id;
  User.findOne({ _id })
    .populate("favourites")
    .then(user => {
      console.log(user);
      return res.render("passport/favourites", {
        favourites: user.favourites
      });
    })
    .catch(error => console.log(error));
});

passportRouter.post("/favourites", (req, res, next) => {
  const search = req.body.search;
  Cpoint.find({ "properties.name": { $regex: search, $options: "i" } })
    //.populate("review")
    .then(foundCleanPoint => {
      console.log(foundCleanPoint);
      res.render("passport/favourites", { foundCleanPoint });
    })
    .catch(error => {
      console.log(error);
      next();
    });
});

passportRouter.post("/favourites/:id", async (req, res, next) => {
  console.log("entro por aqui");
  const cleanPointId = req.params.id;
  const user = req.user;

  try {
    await User.findByIdAndUpdate(
      user,
      { $addToSet: { favourites: cleanPointId } },
      { new: true }
    );
    return res.redirect("/favourites");
  } catch (error) {
    console.log(error);
    next();
  }
});

passportRouter.post("/favourites/delete/:id", async (req, res, next) => {
  const cleanPointId = req.params.id;
  const id = req.user.id;
  console.log("hey!");

  User.updateOne(
    { _id: id },
    { $pull: { favourites: cleanPointId } },
    { safe: true, multi: true }
  )
    .then(() => {
      res.redirect("/favourites");
    })
    .catch(error => console.log(error));
});

passportRouter.get("/about", (req, res, next) => {
  res.render("passport/about");
});

passportRouter.get("/register", (req, res, next) => {
  res.render("passport/register");
});

passportRouter.post("/register", async (req, res, next) => {
  const {
    name,
    lastName,
    address,
    city,
    zip,
    username,
    password,
    favourites
  } = req.body;
  console.log(username);
  const userCreated = await User.findOne({ username });

  if (userCreated) {
    console.log("user already exists");
    return res.render("passport/register", {
      errorMessage: "User already exists"
    });
  } else {
    const newUser = await User.create({
      name,
      lastName,
      address,
      city,
      zip,
      username,
      password: hashPassword(password),
      favourites
    });
    req.login(newUser, function(err) {
      if (!err) {
        return res.redirect("/");
      }
    });
  }
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/maps",
    failureRedirect: "/register"
    // failureFlash: "true"
  })
);

passportRouter.get("/logout", ensureLogin.ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

// passportRouter.get("/favourites", (req, res, next) => {
//   const _id = req.user.id;
//   User.findOne({ _id })
//     .populate("favourites")
//     .then(user => {
//       console.log(user);
//       return res.render("passport/favourites", {
//         favourites: user.favourites
//       });
//     })
//     .catch(error => console.log(error));
// });

passportRouter.get("/maps", ensureLogin.ensureLoggedIn(), (req, res) => {
  const _id = req.user.id;
  User.findOne({ _id })
    .populate("favourites")
    .then(user => {
      console.log(user);
      const searchFavourites = user.favourites;
      res.render("passport/maps", {
        user: req.user,
        searchFavourites
      });
    })
    .catch(error => console.log(error));
});

passportRouter.get("/info", (req, res, next) => {
  return res.render("passport/info");
});

passportRouter.post("/info/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name, lastName, address, password } = req.body;
  try {
    await User.findByIdAndUpdate(id, {
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
