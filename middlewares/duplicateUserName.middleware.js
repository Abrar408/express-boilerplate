const pool = require("../config/db.config");

const { genericResponse, USER_RESPONSES } = require("../constants/responses");

const checkDuplicateUsername = async (req, res, next) => {
  const username = req.body.username;

  try {
    const [results] = await pool.query(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );

    if (results.length !== 0) {
      const response = genericResponse(
        400,
        false,
        null,
        USER_RESPONSES.USERNAME_ALREADY_EXISTS
      );
      return res.status(response.status.code).json(response);
    }

    next();
  } catch (error) {
    console.log(error.message);
    const response = genericResponse(500, false, null, error.message);
    return res.status(response.status.code).json(response);
  }
};

module.exports = checkDuplicateUsername;
