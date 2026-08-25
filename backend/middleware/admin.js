// Must run AFTER protect - checks req.user.role === 'admin'.
export const authorize = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: admin privileges required' });
  }
  next();
};

// Alias for readability at call sites.
export const adminOnly = authorize;
