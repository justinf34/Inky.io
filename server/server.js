const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

const authRouter = require("./routes/auth-route");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
require("./config/passport");

app.use("/auth", authRouter);

app.get("/", (req, res) => res.send("Hello, Wolrd!"));

let port = process.env.PORT || 8888;
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
