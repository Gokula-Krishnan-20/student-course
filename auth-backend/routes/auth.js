const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../model/User');

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password }); // TODO: use bcrypt in production

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      username: user.username,
      role: user.role
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
