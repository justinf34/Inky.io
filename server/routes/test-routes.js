const router = require("express").Router();
const db = require("../config/db");
const constants = require("../src/Constants");
const { values } = require("../src/Game/word-list");

router.get("/game_scores", (req, res) => {
  const games = [];
  req.body.games.forEach((id) => {
    console.log(id);
    games.push(getGame(id));
  });

  Promise.all(games)
    .then((values) => {
      res.json({
        success: true,
        scores: values,
      });
    })
    .catch((error) => {
      console.log(error);
      res.json({
        success: false,
        message: error,
      });
    });
});

const getGame = async (game_id) => {
  const Games = db.collection("Games").doc(game_id);

  const game = await Games.get();

  const game_info = {
    rounds: game.data().rounds,
    date: game.data(),
  };

  const score_lists = [];
  const scores = await Games.collection("Scores").get();

  scores.forEach((doc) => {
    const player = doc.data();
    score_lists.push({
      name: player.name,
      score: player.score,
    });
  });

  game_info.scores = score_lists;
  return game_info;
};

module.exports = router;
