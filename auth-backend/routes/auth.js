const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/User");

const SECRET = "jwtSecret123";

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { username: user.username, role: user.role },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
