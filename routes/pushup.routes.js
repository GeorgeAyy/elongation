const express = require("express");
const router = express.Router();
const PushupEntry = require("../models/pushupentry.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

// Handle the push-up recording form submission
router.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
});
router.post("/record", async (req, res) => {
    try {
      const { username, pushups } = req.body;
  
      // Use Mongoose to find a user by their name
      const user = await User.findOne({ name: username });
  
      if (user) {
        // Update user's pushup count
        user.pushups += parseInt(pushups, 10);
        await user.save();
  
        // Create a new PushupEntry and associate it with the user
        const pushupEntry = new PushupEntry({
          user: user._id,
          pushups: parseInt(pushups, 10),
        });
        await pushupEntry.save();
      }
  
      res.redirect("/pushup/leaderboard");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

router.get("/leaderboard", async (req, res) => {
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

    res.render("leaderboard", { leaderboard: results });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
