const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const loginController = require("../controllers/login.controller");
const signupController = require("../controllers/signup.controller");
const PushupEntry = require("../models/pushupentry.model");
const mainpageController = require("../controllers/mainpage.controller");
router.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.currentUrl = req.path;
  next();
});
// Render the login page
router.get("/login", (req, res) => {
    const { error } = req.query;
    res.locals.currentUrl = req.path;
    res.render("login", { error, user: req.session.user });
  });
// Home route
router.get("/", mainpageController.getMainpage);



// Render the signup page
router.get("/signup", (req, res) => {
  const { error } = req.query;
  res.render("signup", { error, user: req.session.user });
});

// Handle logout
router.get("/logout", (req, res) => {
  // Clear user session
  req.session.user = null;

  // Redirect to login page
  res.redirect("/login");
});

// Handle signup form submission
router.post("/signup", signupController.signup);

// Handle login form submission
router.post("/login", loginController.login);

module.exports = router;
