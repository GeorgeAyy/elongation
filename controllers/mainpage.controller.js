 const mainpageController = [];
const User = require("../models/user.model");
const PushupEntry = require("../models/pushupentry.model");

mainpageController.getMainpage = async (req, res) => {
        // Redirect to login if the user is not authenticated
  if (!req.session.user) {
    
    res.redirect("/login");
    return;
  }

  try {
    
    // Use Mongoose to find all users
    const users = await User.find();
    

    // Create a leaderboard by summing up push-up entries for each user
    const leaderboard = users.map(async (user) => {
      const totalPushups = await PushupEntry.find({ user: user._id }) // Assuming user._id is the reference to the user in the PushupEntry model
        .then((entries) =>
          entries.reduce((total, entry) => total + entry.pushups, 0)
        );

      return { name: user.name, totalPushups };
    });

    // Wait for all promises to resolve
    const results = await Promise.all(leaderboard);

    // Sort the leaderboard by total push-ups in descending order
    results.sort((a, b) => b.totalPushups - a.totalPushups);
    // Render the index page with the list of users
    res.render("index", { user: req.session.user, users,leaderboard:results });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = mainpageController;