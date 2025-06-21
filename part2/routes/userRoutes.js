const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST method to handle Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    /* Fetch the user from DB matching the username and password_hash */
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    /* If no user found, Respond with 401 Unauthorized */
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    /*
      If  user found, Populate the User information such as user_id and role
      in Request.session object
    */
    const user = rows[0];
    req.session.user = user;
    req.session.role = user.role;
    req.session.isAuthenticated = true;

    res.json({ message: 'Login successful', user: user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  try{
  /* Destroy the session stored in the server side */
  req.session.destroy((err) => {
    if (err) {
      console.error(`ERROR : Error during logout - ${err}`);
      return res.status(500).json({ error: 'Logout failed' });
    }

    /* If session destroyed in server, Clear Client side session cookie */
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true
    });
    res.json({ message: 'Login successful', user: user });
  });
});
module.exports = router;
