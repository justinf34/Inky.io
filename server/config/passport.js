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
      clientID:
        "865441991846-bk4v5nlvdbn908n04bql5jhqdg7sgrc4.apps.googleusercontent.com",
      clientSecret: "Cdfp8iS7Qp3nb7NA8fsSjFR8",
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
