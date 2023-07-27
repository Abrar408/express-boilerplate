const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");

const pool = require("./db.config");
const { USER_RESPONSES, genericResponse } = require("../constants/responses");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // callbackURL: `${process.env.BACKEND_DOMAIN}/api/auth/google/callback`,
        callbackURL: `/api/auth/google/callback`,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        const conn = await pool.getConnection();
        try {
          await conn.beginTransaction();

          const [[results]] = await pool.query(
            `
          SELECT 
            users.id,
            users.is_verified,
            users.password,
            COUNT(logged_in_devices.user_id) AS count
          FROM 
            users 
          LEFT JOIN logged_in_devices ON users.id = logged_in_devices.user_id
          WHERE 
            users.email = ?
          GROUP BY 
            users.id,
            users.is_verified,
            users.password`,
            [profile.email]
          );
          if (Object.keys(results).length > 0) {
            if (results.count >= 3) {
              const errorResponse = genericResponse(
                400,
                false,
                null,
                USER_RESPONSES.MAX_LOGIN_LIMIT_REACHED
              );
              return done(errorResponse, null);
            }
            if (!results.is_verified) {
              await pool.query(
                `
              UPDATE users SET is_verified = 1 WHERE email = ?`,
                [profile.email]
              );
            }

            const token = jwt.sign(
              {
                userId: results.id,
              },
              process.env.JWT_SECRET_KEY
            );
            await conn.commit();
            return done(null, token);
          }

          const [{ insertId: userId }] = await pool.query(
            `INSERT INTO users(
                    name,
                    email,
                    profile_picture,
                    provider,
                    is_verified
                )
                VALUES(?, ?, ?, ?, ?)`,
            [
              profile.displayName,
              profile.email,
              profile.picture,
              profile.provider,
              1,
            ]
          );

          await conn.commit();

          const token = jwt.sign(
            {
              userId: userId,
            },
            process.env.JWT_SECRET_KEY
          );

          return done(null, token);
        } catch (error) {
          await conn.rollback();
          return done(error, false);
        } finally {
          conn.release();
        }
      }
    )
  );
};
