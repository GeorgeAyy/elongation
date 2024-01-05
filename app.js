const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
const WebSocket = require('ws'); // Import WebSocket module

dotenv.config();

const app = express();
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${server.address().port}`);
});

// Set up WebSocket server
const wss = new WebSocket.Server({ noServer: true });
app.set('wss', wss);
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.secretkey,
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB connection
mongoose.connect(process.env.mongo_uri);

// Middleware to check if the user is authenticated (You can add this middleware here)

// Routes configuration
app.use("/", require("./routes/index.routes"));
app.use("/pushup", require("./routes/pushup.routes"));

// Upgrade HTTP to WebSocket for existing server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
