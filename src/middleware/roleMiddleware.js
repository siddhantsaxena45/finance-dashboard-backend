export default function requireRoles(allowedRoles) {
  return function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. No user context found." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Forbidden. Insufficient permissions.",
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  }
}
