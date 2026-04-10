const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Signup
exports.signup = async (req, res) => {
  try {
    const { email, password, name, profile } = req.body;

    console.log("Signup request for:", email);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      profile: {
        overthinking: profile.overthinking || 3,
        riskTolerance: profile.riskTolerance || 3,
        frustration: profile.frustration || 3,
        aiTrust: profile.aiTrust || 3
      }
    });

    await user.save();
    console.log("User created:", user._id);

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });
    console.log("JWT token generated");

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request for:", email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("Password matched for:", email);

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "30d" });
    console.log("JWT token generated for:", email);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
