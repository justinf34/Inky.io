const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const db = require("../config/db");

// Don't really know how this works yet
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Don't really undesstand how this works yet
passport.deserializeUser(function (id, done) {
  const users = db.collection("Users");

  users
    .doc(id)
    .get()
    .then((user) => {
      done(null, user.data());
    })
    .catch((e) => {
      done(new Error("Failed to deserialize a user"));
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.AUTH_ID,
      clientSecret: process.env.AUTH_SECRET,
      callbackURL: "http://localhost:8888/auth/google/callback",
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const users = db.collection("Users");

      const user = await users.doc(profile.id).get();

      if (!user.exists) {
        const new_user = {
          id: profile.id,
          name: profile.id,
          role: false,
        };
        //TODO: Handle errors
        const res = await users.doc(profile.id).set(new_user);
        done(null, new_user);
      } else {
        done(null, user.data());
      }
    }
  )
);
