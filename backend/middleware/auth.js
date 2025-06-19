const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is authenticated
  } else {
    res.status(401).json({
      success: false,
      message: "Please Log in to access this resource",
    });
  }
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session.userRole === role) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }
  };
};

module.exports = { requireAuth, requireRole };
