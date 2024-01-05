const mainpageController = [];
const User = require("../models/user.model");
const PushupEntry = require("../models/pushupentry.model");
const WebSocket = require('ws');
// WebSocket broadcast function
function broadcast(data, wss) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

mainpageController.getMainpage = async (req, res) => {
  if (!req.session.user) {
    res.redirect("/login");
    return;
  }

  try {
    const users = await User.find();
    
    const leaderboard = users.map(async (user) => {
      const totalPushups = await PushupEntry.find({ user: user._id })
        .then((entries) => entries.reduce((total, entry) => total + entry.pushups, 0));

      return { name: user.name, totalPushups };
    });

    const results = await Promise.all(leaderboard);
    results.sort((a, b) => b.totalPushups - a.totalPushups);

    // Convert the leaderboard data to JSON
    const leaderboardData = JSON.stringify(results);

    // Broadcast updated leaderboard data to connected WebSocket clients
    broadcast(leaderboardData, req.app.get('wss'));
    res.render('index', { leaderboard: results, users, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = mainpageController;
