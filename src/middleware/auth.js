import jwt from "jsonwebtoken";

export const authorizeUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // if (!req.user) {
    //   return res.status(401).json({ message: "User not authenticated" });
    // }
    // if (!allowedRoles.includes(req.user.role)) {
    //   return res.status(403).json({ message: "Insufficient permission" });
    // }
    next();
  };
};
