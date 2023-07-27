const AppleStrategy = require("passport-apple");

module.exports = (passport) => {
  passport.use(
    new AppleStrategy(
      {
        clientID: "",
        teamID: "",
        callbackURL: "",
        keyID: "",
        privateKeyLocation: "",
        passReqToCallback: true,
      },
      async function (req, accessToken, refreshToken, idToken, profile, cb) {
        // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.decode(idToken)
        // to access the properties of the decoded idToken properties which contains the user's
        // identity information.
        // Here, check if the idToken.sub exists in your database!
        // idToken should contains email too if user authorized it but will not contain the name
        // `profile` parameter is REQUIRED for the sake of passport implementation
        // it should be profile in the future but apple hasn't implemented passing data
        // in access token yet https://developer.apple.com/documentation/sign_in_with_apple/tokenresponse
        cb(null, idToken);
      }
    )
  );
};
