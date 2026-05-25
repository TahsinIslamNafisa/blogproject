const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/response.util");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return errorResponse(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, "Invalid or expired token.");
  }
};

module.exports = authMiddleware;