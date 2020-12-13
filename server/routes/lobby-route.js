const router = require("express").Router();
const { query } = require("express");
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
          if (data.state !== constants.GAME_DISCONNECTED) {
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

  /**
   * This should only be used for development purposes
   */
  router.post("/deleteLobbies", async (req, res) => {
    if (req.body.key === "password") {
      const query = db
        .collection("Lobbies")
        .where("state", "==", "DISCONNECTED");

      try {
        const disconnected = await query.get();
        await disconnected.forEach((doc) => {
          doc.ref.delete();
        });
        res.json({
          success: true,
          message: "Deleted disconnected lobbies",
        });
      } catch (error) {
        res.json({
          success: false,
          message: error,
        });
      }
    }
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

  router.get("/chatHistory", (req, res) => {
    let chatLog = [];
    console.log(req.query.lobbycode)
    db.collection("Chats")
      .where('lobbyID', '==', req.query.lobbycode)
      .where('correctGuess','==', false)
      .orderBy('timestamp','asc')
      .get()
      .then((snapshot)=>{
        snapshot.forEach( doc => {
          chatLog.push({'name': doc.data().name, 'content': doc.data().message});
        })
      })
      .then(() => {
        res.json({
          success: true,
          chatLog : chatLog
        })
      })
  })

  return router;
};
