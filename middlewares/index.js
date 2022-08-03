var jwt = require("jsonwebtoken");
var { APIError } = require("../config/error");
const httpStatus = require("http-status");

const isLoggedIn = (req, _res, next) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new APIError({
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Secret not found",
        errors: "Secret not found",
      });
    }

    if (!req.headers["authorization"]) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: "User not authorized",
        errors: "User not authorized",
      });
    }

    const token = req.headers["authorization"].split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded) {
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: "You are not logged in. Please login to continue",
        errors: "User not logged in",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    throw new APIError({
      status: error.status || httpStatus.INTERNAL_SERVER_ERROR,
      errors: error,
      message: error.message || error,
    });
  }
};

module.exports = {
  isLoggedIn,
};
