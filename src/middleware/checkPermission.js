export const checkPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user.role?.permissions || [];

    if (userPermissions.includes("*")) {
      return next();
    }

    if (userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Permission denied",
    });
  };
};
