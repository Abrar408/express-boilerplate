const status = require("http-status");
const jwt = require("jsonwebtoken");

const { ERROR_RESPONSES, genericResponse } = require("../constants/responses");
const parseCookieString = require("../utility/parseCookieString");

const guestAccess = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    req.user = {};
    next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      req.user = decoded || {};
      next();
    });
  }
};

module.exports = guestAccess;
