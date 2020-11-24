const router = require("express").Router();
const nanoid = require("nanoid");
const db = require("../config/db");
const { route } = require("./auth-route");

router.post("/create", (req, res) => {
  const lobbyCode = nanoid.nanoid();
  db.collection("Lobbies")
    .doc(lobbyCode)
    .set({
      code: lobbyCode,
      hostId: req.query.hostId,
      state: "IN_LOBBY",
    })
    .then(() => {
      db.collection("Lobbies")
        .doc(lobbyCode)
        .collection("Players")
        .doc(req.query.hostId.toString())
        .set({
          id: req.query.hostId,
          name: req.query.hostName,
          disconnected: false,
        })
        .then(() => {
          res.json({
            success: true,
            message: "successfully created lobby",
            code: lobbyCode,
            hostId: req.query.hostId,
            state: "IN_LOBBY",
          });
        });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: error,
      });
    });
});

router.post("/lobbyInfo", async (req, res) => {
  const lobbies = db.collection("Lobbies");
  let msg;

  try {
    const lobby = await lobbies.doc(req.body.id).get();

    if (!lobby.exists) {
      msg = {
        success: false,
        error_msg: "Lobby does not exist!",
      };
      res.send(JSON.stringify(msg));
    } else {
      const players = await lobbies
        .doc(req.body.id)
        .collection("Players")
        .get();

      const player_list = players.docs.map((player) => {
        return player.data();
      });

      msg = {
        success: true,
        player_list: player_list,
        ...lobby.data(),
      };

      res.send(JSON.stringify(msg));
    }
  } catch (error) {
    console.log(e);
    msg = {
      success: false,
      error_msg: e,
    };
    res.send(JSON.stringify(msg));
  }
});

router.post("/join", (req, res) => {
  db.collection("Lobbies")
    .where("code", "==", req.query.lobbyCode)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            if (doc.data().state === "IN_LOBBY") {
              // if theyre in the lobby already their user name will just update
              db.collection("Lobbies")
                .doc(doc.id)
                .collection("Players")
                .doc(req.query.userId.toString())
                .set({
                  id: req.query.userId,
                  name: req.query.userName,
                  disconnected: false,
                })
                .then(() => {
                  res.json({
                    success: true,
                    message: "successfully joined lobby",
                    code: doc.data().code,
                    hostId: doc.data().hostId,
                    state: doc.data().state,
                  });
                });
            } else {
              res.json({
                success: false,
                message: "cannot join lobby at this time",
                code: doc.data().code,
                hostId: doc.data().hostId,
                state: doc.data().state,
              });
            }
          }
        });
      } else {
        res.json({
          success: false,
          message: "couldn't find lobby",
        });
      }
    });
});

router.post("/disconnect", (req, res) => {
  db.collection("Lobbies")
    .where("code", "==", req.query.lobbyCode)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            // if user is host disconnect the whole lobby
            if (req.query.userId === doc.data().hostId) {
              db.collection("Lobbies")
                .doc(doc.id)
                .update({
                  state: "DISCONNECTED",
                })
                .then(() => {
                  res.json({
                    success: true,
                    message: "successfully disconnected lobby",
                    code: doc.data().code,
                    hostId: doc.data().hostId,
                    state: doc.data().state,
                  });
                });
            }
            // disconnect the user
            db.collection("Lobbies")
              .doc(doc.id)
              .collection("Players")
              .doc(req.query.userId.toString())
              .update({
                disconnected: true,
              })
              .then(() => {
                res.json({
                  success: true,
                  message: "successfully disconnected from lobby",
                  code: doc.data().code,
                  hostId: doc.data().hostId,
                  state: doc.data().state,
                });
              });
          }
        });
      } else {
        res.json({
          success: false,
          message: "couldn't find lobby",
        });
      }
    });
});

router.post("/end", (req, res) => {
  db.collection("Lobbies")
    .where("code", "==", req.query.lobbyCode)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            db.collection("Lobbies")
              .doc(doc.id)
              .update({
                state: "GAME_ENDED",
              })
              .then(() => {
                res.json({
                  success: true,
                  message: "successfully ended game",
                  code: doc.data().code,
                  hostId: doc.data().hostId,
                  state: doc.data().state,
                });
              });
          }
        });
      } else {
        res.json({
          success: false,
          message: "couldn't find lobby",
        });
      }
    });
});

router.post("/start", (req, res) => {
  db.collection("Lobbies")
    .where("code", "==", req.query.lobbyCode)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.exists) {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            db.collection("Lobbies")
              .doc(doc.id)
              .update({
                state: "IN_GAME",
              })
              .then(() => {
                res.json({
                  success: true,
                  message: "successfully started game",
                  code: doc.data().code,
                  hostId: doc.data().hostId,
                  state: doc.data().state,
                });
              });
          }
        });
      } else {
        res.json({
          success: false,
          message: "couldn't find lobby",
        });
      }
    });
});

module.exports = router;
