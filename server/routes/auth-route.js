const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

router.get("/", (req, res) => {
  res.send("This is the authentication endpoint");
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    let token = req.user.token;
    res.redirect(CLIENT_HOME_PAGE_URL + "?token=" + token);
  }
);

module.exports = router;
