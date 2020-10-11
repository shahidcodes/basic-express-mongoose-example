const jwt = require("jsonwebtoken");
const constants = require("./constants");

module.exports = function (req, res, next) {
  if (!req.headers["authorization"]) {
    return next(new Error("Invalid auth header"));
  }
  try {
    const token = req.headers["authorization"];
    const user = jwt.verify(token, constants.jwtSecret);
    req.user = user;
    next();
  } catch (err) {
    next(new Error("Failed to authorize"));
  }
};
