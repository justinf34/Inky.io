const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_ID,
      clientSecret: process.env.AUTH_SECRET,
      callbackURL: "http://localhost:8888/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      var userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
      };
      done(null, userData);
    }
  )
);
