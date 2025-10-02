import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hasheed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compared password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find({ isAdmin: false }).select('name _id');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};