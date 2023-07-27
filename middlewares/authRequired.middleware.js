const status = require("http-status");
const jwt = require("jsonwebtoken");

const { ERROR_RESPONSES, genericResponse } = require("../constants/responses");

const authRequired = (req, res, next) => {
  if (!req.headers?.authorization) {
    const response = genericResponse(
      status.UNAUTHORIZED,
      false,
      null,
      ERROR_RESPONSES.TOKEN_NOT_PROVIDED
    );
    return res.status(response.status.code).json(response);
  }

  const token = req.headers.authorization;
  if (!token) {
    const response = genericResponse(
      status.UNAUTHORIZED,
      false,
      null,
      ERROR_RESPONSES.TOKEN_NOT_PROVIDED
    );
    return res.status(response.status.code).json(response);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      const response = genericResponse(
        status.UNAUTHORIZED,
        false,
        null,
        ERROR_RESPONSES.INVALID_TOKEN
      );
      return res.status(response.status.code).json(response);
    }

    req.user = decoded;
    next();
  });
};

module.exports = authRequired;
