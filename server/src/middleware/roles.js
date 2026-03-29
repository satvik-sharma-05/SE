// middleware/roles.js

/**
 * Middleware to require specific role(s)
 * Usage: router.post('/create', auth, requireRole('organizer'), createEvent)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`
      });
    }

    next();
  };
};

/**
 * Middleware to require admin role
 */
export const requireAdmin = requireRole("admin");

/**
 * Middleware to require organizer role
 */
export const requireOrganizer = requireRole("organizer");

/**
 * Middleware to require student role
 */
export const requireStudent = requireRole("student");

/**
 * Middleware to allow multiple roles
 */
export const requireAnyRole = (...roles) => requireRole(...roles);
