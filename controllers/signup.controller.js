const signupController = [];
const User = require("../models/user.model");
signupController.signup = async (req, res) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.redirect("/signup?error=Password must be at least 8 characters");
    return;
  }
  if (!username || !password) {
    res.redirect("/signup?error=Please enter all fields");
    return;
  }
  if (password.length > 20) {
    res.redirect("/signup?error=Password must be at most 20 characters");
    return;
  }
  try {
    // Use Mongoose to find the user with the credentials
    const user = await User.findOne({ name: username });
    if (user) {
      // If the user exists, return an error
      res.redirect("/signup?error=User already exists");
    } else {
      // Create the user
      const newUser = new User({ name: username, password });
      await newUser.save();
      // Store the user in the session
      req.session.user = newUser;
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = signupController;
