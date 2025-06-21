const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { body, validationResult } = require('express-validator');

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
router.post('/login', [body('username')
  .trim()
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be 3–30 chars')
  .escape(),

body('password')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('Password must be 5–100 chars')

], async (req, res) => {

  /*  Validate based on rules in validation array in second param,
   return 400 if any validation fails */
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

    /* Respond with User details and 200 Success code */
    res.json({ message: 'Login successful', user: user });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST method to handle Logout
router.post('/logout', async (req, res) => {
  try {
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

      /* Respond with  200 Success code */
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});


// GET method to fetch all dogs of users
router.get('/dogs', async (req, res) => {

  try {
    /* Fetch the dogs from DB using user id from the session */
    if (!req.session.user && !req.session.user.user_id) {
      return res.status(401).json({ error: 'Invalid user id' });
    }
    const user_id = req.session.user.user_id;
    const [rows] = await db.query(`
      select Dogs.dog_id,Dogs.name from Dogs where Dogs.owner_id = ?;
    `, [user_id]);
    /* If no dogs found, Respond with empty array object */
    let dogsList = [];

    if (rows.length !== 0) {
      dogsList = rows;
    }
    /* Respond as simple json arrray list */
    return res.status(200).json(dogsList);

  } catch (error) {
    res.status(500).json({ error: 'Fetching Dogs for user failed' });
  }
});
module.exports = router;
