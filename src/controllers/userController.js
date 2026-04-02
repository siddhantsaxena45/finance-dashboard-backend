import User from '../models/userModel.js';

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
