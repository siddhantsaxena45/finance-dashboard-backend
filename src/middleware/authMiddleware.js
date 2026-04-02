import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-internship-key';

export default async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized. Missing or invalid 'Authorization: Bearer <token>' header." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User no longer exists." });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: "Forbidden. User is inactive." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
       return res.status(401).json({ error: "Unauthorized. Token has expired." });
    }
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
}
