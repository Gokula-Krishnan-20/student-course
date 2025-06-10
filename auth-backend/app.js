const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./model/User');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = 'secret123';

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://harivarshinisr:W0LGfYTndADWxi8g@cluster0.vzc65q1.mongodb.net/student-course')
  .then(() => console.log('✅ Connected to student-course DB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// ✅ Login API
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ✅ Start server
app.listen(3002, () => {
  console.log('🚀 Auth server running at http://localhost:3002');
});
