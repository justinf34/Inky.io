const router = require("express").Router();
const nanoid = require("nanoid");
const db = require("../config/db");


router.post("/create", (req, res) => {
  const lobbyCode =  nanoid.nanoid();
  db.collection("Lobbies").add({
    code: lobbyCode,
    hostId: req.query.hostId,
    state: "IN_LOBBY",
  }).then((doc) => {
    db.collection("Lobbies").doc(doc.id).collection("Players").doc(req.query.hostId.toString()).set({
      id: req.query.hostId,
      name: req.query.hostName,
    }).then(() => {
      res.json({
        success: true,
        message: "successfully created lobby",
        code: lobbyCode,
        hostId: req.query.hostId,
        state: "IN_LOBBY",
      })
    })
  });
});

//dosent rlly work yet
router.get("/join", (req, res) => {
  db.collection("Lobbies").where('code', '==', req.query.lobbycode).get().then((doc) => {
    console.log(doc[0]);
    db.collection("Lobbies").doc(doc.id).collection("Players").doc(req.query.userId.toString()).set({
      id: req.query.userId,
      name: req.query.userName,
    }).then(() => {
      res.json({
        success: true,
        message: "successfully joined lobby",
        code: doc.code,
        hostId: doc.hostId,
        state: doc.state,
      })
    })
  });
  
});

module.exports = router;