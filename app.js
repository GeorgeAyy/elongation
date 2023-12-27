const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");

// Load environment variables from a .env file
dotenv.config();

// Create an Express application
const app = express();

// Set the port for the server to listen on, default to 3000 if not specified
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from the "public" directory
app.set("view engine", "ejs"); // Set the view engine to EJS
app.use(
  session({
    secret: process.env.secretkey, // Replace with a secret key
    resave: false,
    saveUninitialized: true,
  })
);

// MongoDB connection
mongoose.connect(process.env.mongo_uri); // Replace with your MongoDB connection string

// Middleware to check if the user is authenticated (You can add this middleware here)

// Routes configuration
app.use("/", require("./routes/index.routes")); // Mount the index routes
app.use("/pushup", require("./routes/pushup.routes")); // Mount the pushup routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
