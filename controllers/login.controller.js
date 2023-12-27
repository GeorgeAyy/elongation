const loginController = [];
const User = require("../models/user.model");

loginController.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Use Mongoose to find the user with the credentials
    const user = await User.findOne({ name: username, password });
    if (user) {
      // If the user exists, store the user in the session
      req.session.user = user;
      res.redirect("/");
    } else {
      // If the user doesn't exist, redirect to the login page with an error
      res.redirect("/login?error=Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = loginController;
