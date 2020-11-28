const router = require("express").Router();
const nanoid = require("nanoid");
const db = require("../config/db");
const { route } = require("./auth-route");
const constants = require("../src/Constants");

module.exports = function (Manager) {
  router.post("/create", (req, res) => {
    const lobbyCode = nanoid.nanoid();
    const lobby = {
      code: lobbyCode,
      hostId: req.query.hostId,
      state: constants.IN_LOBBY,
    };

    db.collection("Lobbies")
      .doc(lobbyCode)
      .set(lobby)
      .then(() => {
        Manager.createNewRoom({
          host_name: req.query.hostName,
          ...lobby,
        });
        res.json({
          success: true,
          message: "successfully created lobby",
          code: lobbyCode,
          hostId: req.query.hostId,
          state: constants.IN_LOBBY,
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          message: error,
        });
      });
  });

  router.post("/join2", (req, res) => {
    const lobbies = db.collection("Lobbies");
    lobbies
      .doc(req.body.id)
      .get()
      .then((lobby) => {
        if (!lobby.exists) {
          res.json({
            success: false,
            message: "Cannot find lobby",
          });
        } else {
          const data = lobby.data();
          if (data.state === constants.IN_LOBBY) {
            res.json({
              success: true,
              message: "found lobby",
              ...data,
            });
          } else {
            res.json({
              success: false,
              message: "Cannot connect to the lobby",
            });
          }
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  });

  router.post("/join", (req, res) => {
    db.collection("Lobbies")
      .doc(req.query.lobbycode)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().state === constants.IN_LOBBY) {
            doc.ref
              .collection("Players")
              .doc(req.query.userid)
              .get()
              .then((playerdoc) => {
                if (
                  !playerdoc.exists ||
                  playerdoc.data().state !== constants.KICKED
                ) {
                  playerdoc.ref.set({
                    id: req.query.userid,
                    name: req.query.name,
                    state: constants.CONNECTED,
                  });
                } else {
                  throw Error("player could not join");
                }
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
            throw Error("lobby unavailable");
          }
        } else {
          throw Error("lobby not found");
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  });

  router.post("/kick", (req, res) => {
    db.collection("Lobbies")
      .doc(req.query.lobbycode)
      .collection("Players")
      .doc(req.query.userid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          doc.ref
            .update({
              state: constants.KICKED,
            })
            .then(() => {
              res.json({
                success: true,
                message: "successfully kicked user from lobby",
              });
            });
        } else {
          throw Error("player is not in lobby");
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  });

  // this doesnt handle case if user is host
  router.post("/disconnect", (req, res) => {
    db.collection("Lobbies")
      .doc(req.query.lobbycode)
      .get()
      .then((doc) => {
        if (doc.exists) {
          doc.ref
            .collection("Players")
            .doc(req.query.userid)
            .get()
            .then((playerdoc) => {
              if (playerdoc.exists) {
                playerdoc.ref
                  .update({
                    state: constants.DISCONNECTED,
                  })
                  .then(() => {
                    res.json({
                      success: true,
                      message: "successfully disconected from lobby",
                      code: doc.data().code,
                      hostId: doc.data().hostId,
                      state: doc.data().state,
                    });
                  });
              } else {
                throw Error("player not found");
              }
            });
        } else {
          throw Error("lobby not found");
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
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
                  state: constants.GAME_ENDED,
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
          throw Error("lobby not found");
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
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
                  state: constants.IN_GAME,
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
          throw Error("lobby not found");
        }
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  });

  router.get("/playerState", (req, res) => {
    db.collection("Lobbies")
      .doc(req.query.lobbycode)
      .collection("Players")
      .doc(req.query.userid)
      .get()
      .then((doc) => {
        res.json({
          success: true,
          state: doc.data().state,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          message: err.message,
        });
      });
  });

  return router;
};
