const router = require("express").Router();
const { app } = require("firebase-admin");
const db = require("../config/db");

router.get("/", (req, res) => {
  console.log("hello");
  res.send("This is the profile endpoint gateway");
});

router.get("/matches", async (req, res) => {
  const user_id = req.query.userID;
  const gameIds = [];
  const gameHistory = [];
  const getGameIDs = db.collection("Users")
    .doc(user_id)
    .collection("Games")

  try {
    await getGameIDs.get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //docs of each game
          gameIds.push(doc.data().gameID);
        });
      });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }

  try {
    gameIds.forEach((game) => {
      db.collection("Games")
      .doc(game)
      .get()
      .then((doc) => {
        let gameInfo = {
          rounds: doc.data().rounds,
          date: doc.data().date
        }
        doc.ref.collection("Scores")
        .get()
        .then((scores) => {
          scores.forEach((player) => {
            gameInfo[player.id] = {
              name: player.data().name,
              score: player.data().score
            }
          });
        });
        gameHistory.push(gameInfo);
      });
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }

  res.json({
    success: true,
    message: "successfully gathered game history",
    gameHistory: gameHistory
  });
    //gamehistory isnt updated by the time this sends
    //gameHistory is  empty
  console.log(gameHistory);
});

router.post("/change/name", async (req, res) => {
  const user_id = req.query.userID;
  const new_name = req.query.newName;
  const pictureId = req.query.userPicture;
  const user = db.collection("Users");

  const resetUser = user
    .doc(user_id)
    .update({
      name: new_name,
      profileKey: pictureId,
    })
    .then(() => {
      res.json({
        success: true,
        message: "successfully changed the username",
      });
    })
    .catch((error) =>
      res.json({
        success: false,
        message: error,
      })
    );
});

module.exports = router;
