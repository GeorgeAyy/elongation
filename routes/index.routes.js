const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const loginController = require("../controllers/login.controller");
const signupController = require("../controllers/signup.controller");

// Home route
router.get("/", async (req, res) => {
  // Redirect to login if the user is not authenticated
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  try {
    // Use Mongoose to find all users
    const users = await User.find();

    // Render the index page with the list of users
    res.render("index", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Render the login page
router.get("/login", (req, res) => {
  const { error } = req.query;
  res.render("login", { error });
});

// Render the signup page
router.get("/signup", (req, res) => {
  const { error } = req.query;
  res.render("signup", { error });
});

// Handle signup form submission
router.post("/signup", signupController.signup);

// Handle login form submission
router.post("/login", loginController.login);

module.exports = router;
