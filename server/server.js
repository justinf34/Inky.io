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
const lobbyRouter = require("./routes/lobby-route");
const profileRouter = require("./routes/profile-route");
const reportRouter = require("./routes/report-route");
const session = require("express-session");
const path = require("path");

const keys = require("./config/keys");
const cors = require("cors");

const LobbyManager = require("./src/Game/Manager")();
const socket_handler = require("./src/socket");

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cors());

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

// app.get("/", authCheck, (req, res) => {
//   res.status(200).json({
//     authenticated: true,
//     message: "user successfully authenticated",
//     user: req.user,
//     cookies: req.cookies,
//   });
// });
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use("/auth", authRouter);
app.use("/lobby", lobbyRouter(LobbyManager));
app.use("/profile", profileRouter);
app.use("/report", reportRouter);

io.on("connection", socket_handler(LobbyManager, io));

let port = process.env.PORT || 8888;
http.listen(port, (err) => {
  if (err) throw err;
  console.log(`Listening on port ${port}...`);
});
