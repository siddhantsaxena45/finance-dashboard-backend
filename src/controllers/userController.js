import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-internship-key';

export const loginUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required to login.' });
    }

    const user = await User.findByUsername(username);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'Invalid or inactive user.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (e) {
    next(e);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ users });
  } catch(e) { next(e); }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, role, status } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }
    
    const existing = await User.findByUsername(username);
    if (existing) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const user = await User.create({ username, role, status });
    res.status(201).json({ message: "User created successfully", user });
  } catch(e) { next(e); }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { status, role } = req.body;
    
    const existing = await User.findById(userId);
    if (!existing) {
      return res.status(404).json({ error: "User not found." });
    }

    const updatedUser = await User.update(userId, { status, role });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch(e) { next(e); }
};
