const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || username.length < 8) {
      return res
        .status(400)
        .json({ error: "Username must be at least 8 characters long!" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({
          error:
            "Password must contain an uppercase, lowercase, and a special character!",
        });
    }

    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "User already exists!" });

    user = new User({ username, password });
    await user.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error!" });
  }
});

// Protected Route
router.get("/dashboard", async (req, res) => {
  res.json({ message: "Welcome to the SecureConnect dashboard!" });
});


// Get User Role Route
router.post("/get-role", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials!" });

    // Send back the user's role
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error!" });
  }
});

module.exports = router;
