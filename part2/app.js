const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    httpOnly: true,
    sameSite: 'lax', // or 'strict' / 'none' with CORS setup
    secure: false     // set true in production if using HTTPS
  }
}));
app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


// Export the app instead of listening here
module.exports = app;