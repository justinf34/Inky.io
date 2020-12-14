const router = require("express").Router();
const { app } = require("firebase-admin");
const db = require("../config/db");

router.get("/", (req, res) => {
  console.log("hello");
  res.send("This is the profile endpoint gateway");
});

async function getGameInfo(gameID) {
  return new Promise((res, rej) => {
    db.collection("Games")
    .doc(gameID)
    .get()
    .then(async (doc) => {
      let gameInfo = {
        rounds: doc.data().rounds,
        date: doc.data().date
      }
      await doc.ref.collection("Scores")
      .get()
      .then((scores) => {
        scores.forEach((player) => {
          gameInfo[player.id] = {
            name: player.data().name,
            score: player.data().score
          }
        });
      });
      res(gameInfo);
    });
  });
  }

router.get("/matches", async (req, res) => {
  const user_id = req.query.userID;
  let gameIds = [];

  try {
    await db.collection("Users")
    .doc(user_id)
    .collection("Games")
    .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
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
    const promises = gameIds.map(getGameInfo);

    await Promise.all(promises).then((values) => {
      res.send({
        success: true,
        message: "successfully gathered game history",
        gameHistory: values
      });
    })

    // gameHistory = new Promise((resolve, reject) => {
    //   let gameData = [];
    //   gameIds.forEach((game) => {
    //     db.collection("Games")
    //     .doc(game)
    //     .get()
    //     .then((doc) => {
    //       let gameInfo = {
    //         rounds: doc.data().rounds,
    //         date: doc.data().date
    //       }
    //       doc.ref.collection("Scores")
    //       .get()
    //       .then((scores) => {
    //         scores.forEach((player) => {
    //           gameInfo[player.id] = {
    //             name: player.data().name,
    //             score: player.data().score
    //           }
    //           //console.log("game info inside player", gameInfo);
    //         });
    //       })
    //       .then(() => {
    //         gameData.push(gameInfo);
    //         console.log(gameData);
    //       });
    //       //console.log("game info outside player", gameInfo);
    //       // gameData.push(gameInfo);
    //       // console.log("Game Hist", gameHistory);
    //     });
    //   });
    //   console.log(gameData)
    //   resolve(gameData);
    // });

    // Promise.all([gameHistory]).then(values => {
    //   res.send({
    //     success: true,
    //     message: "successfully gathered game history",
    //     gameHistory: values[0]
    //   });
    // });
    // gameIds.forEach((game) => {
    //   db.collection("Games")
    //   .doc(game)
    //   .get()
    //   .then((doc) => {
    //     let gameInfo = {
    //       rounds: doc.data().rounds,
    //       date: doc.data().date
    //     }
    //     doc.ref.collection("Scores")
    //     .get()
    //     .then((scores) => {
    //       scores.forEach((player) => {
    //         gameInfo[player.id] = {
    //           name: player.data().name,
    //           score: player.data().score
    //         }
    //         //console.log("game info inside player", gameInfo);
    //       });
    //     });
    //     //console.log("game info outside player", gameInfo);
    //     gameHistory.push(gameInfo);
    //     //console.log("Game Hist", gameHistory);
    //   })
    // });
    // res.send({
    //   success: true,
    //   message: "successfully gathered game history",
    //   gameHistory: gameHistory
    // });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
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
