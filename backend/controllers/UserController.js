const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup Controller
exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || username.length < 8) {
      return res
        .status(400)
        .json({ error: "Username must be at least 8 characters long!" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain an uppercase letter, a lowercase letter, and a special character!",
      });
    }

    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "User already exists!" });

    // 🔹 Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error!" });
  }
};


// Login Controller
exports.login = async (req, res) => {
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
};

// Dashboard (Protected Route)
exports.dashboard = async (req, res) => {
  res.json({ message: "Welcome to the SecureConnect dashboard!" });
};

// Get User Role
exports.getUserRole = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials!" });

    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server error!" });
  }
};
