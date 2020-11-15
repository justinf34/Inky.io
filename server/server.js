require("dotenv").config();
const cookieSession = require("cookie-session");

const express = require("express");
const app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http, { cors: true, origins: ["*:*"] });

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const passport = require("passport");
const passportSetup = require("./config/passport");
const authRouter = require("./routes/auth-route");
const session = require("express-session");

const keys = require("./config/keys");
const cors = require("cors");

const db = require("./config/db");

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(cookieParser());

app.use(passport.initialize());

app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRouter);

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});

app.get("/testDB", (req, res) => {
  const users = db.collection("Users");
  users
    .doc("26bvYOHnhbqaEf5KMEVS")
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.send("No such user!");
      } else {
        console.log(doc.data());
        res.send(doc.data());
      }
    });
});

io.on("connection", (socket) => {
  console.log("socket: a user connected");

  socket.on("disconnect", () => {
    console.log("socket: a user disconnected");
  });

  socket.on("draw", (msg) => {
    console.log("draw: ", msg);
    socket.broadcast.emit("draw", msg);
  });
});

let port = process.env.PORT || 8888;
http.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
