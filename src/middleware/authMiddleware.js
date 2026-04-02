import User from '../models/userModel.js';

export default async function authenticate(req, res, next) {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Missing 'x-user-id' header." });
  }

  try {
    const user = await User.findById(parseInt(userId, 10));
    
    if (!user) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: "Forbidden. User is inactive." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
