/**
 * Role-based access control middleware.
 * Usage: router.get('/admin-only', auth, roleCheck('admin'), handler)
 *        router.get('/staff', auth, roleCheck('admin','responder'), handler)
 */
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = roleCheck;
