const db = require("../../config/db");
const constants = require("../Constants");
const word_list = require("./word-list");

class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.state = constants.IN_LOBBY;

    this.notifier = null;
    this.io = null;

    this.players = new Map(); // Keep track of the players(key = id, value = {socket_id, name, score})
    this.connected_players = new Map(); // key = socket id, value = player id

    this.rounds = 1; // Number of rounds in the game
    this.curr_round = 1; // Current round in the game
    this.round_state = 0;
    this.players_guessed = []; //Number of players that correctly guessed the word

    this.drawing_time = 30;
    this.timer = null; // Timer for the game

    this.drawer = null; // user_id of drawer
    this.drawer_order = [];
    this.strokes = []; // Strokes that was sent to the player

    this.interval = null; //Timer interval

    this.word = "placeholder";
    this.word_list = ["apple", "banana", "cat"];
  }

  init_sock(notifier_func, io) {
    this.notifier = notifier_func;
    this.io = io;
  }

  getRoundStatus(user_id) {
    return {
      rounds: this.rounds,
      curr_round: this.curr_round,
      round_state: this.round_state,
      drawer: this.drawer, // user_id of the drawer
      word_list: this.drawer === user_id ? this.word_list : [],
      word: this.drawer === user_id ? this.word : "_".repeat(this.word.length),
      strokes: this.strokes,
      timer: this.timer,
    };
  }

  changeLobbyState(state) {
    this.state = state;
    if (state === constants.IN_GAME) {
      //Init game settings
      this.curr_round = 1;
      this.players_guessed = [];

      this.timer = this.drawing_time;
      // Setting draw order
      this.drawer_order = Array.from(this.connected_players.values());

      this.newTurn();
    }
  }

  newTurn() {
    this.drawer = this.drawer_order.shift();
    this.word_list = ["apple", "banana", "cat"]; // Generate word choices
    this.round_state = 0; // State to choosing

    // Restart timer but do not start it
    this.timer = this.drawing_time;
  }

  startTurn(word) {
    console.log(`Starting ${this.id} with ${word}`);
    // this.word_list = word_list;
    this.round_state = 1;
    this.word = word; // Current word

    setTimeout(() => {
      this.startTimer(); // Start timer
      this.notifier(); // Let everyone know
    }, 1000);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1;
        this.io.to(this.id).emit("time-update", this.timer);
        // console.log("timer now:", this.timer);
      } else {
        clearInterval(this.interval);
        this.endTurn();
      }
    }, 1000);
  }

  /**
   * Should be called when timer ends, when
   * all the guesser guessed the word, or when
   * the drawer disconnects
   */
  endTurn() {
    clearInterval(this.interval); // Clear interval

    // Clear canvas
    this.strokes.length = 0; // Clear the canvas
    this.io.to(this.id).emit("draw", { type: 1 }, this.strokes);

    let endGame = false;

    //check if all the players already had a turn to draw
    if (this.drawer_order.length === 0) {
      //check for last round
      if (this.curr_round === this.rounds) {
        endGame = true;
      } else {
        this.curr_round += 1;
        this.drawer_order = Array.from(this.connected_players.values());
      }
    }

    if (!endGame) {
      this.newTurn();
      this.notifier(); // Let all the players know that turn ended
    } else {
      this.state = constants.IN_LOBBY;
      this.round_state = 3;
      db.collection("Lobbies")
        .doc(this.id)
        .update({
          state: constants.IN_LOBBY,
        })
        .then((_) => {
          this.io.to(this.id).emit("state-change", constants.IN_LOBBY);
        });
    }
  }

  joinPlayer(player_info, socket_id) {
    if (!this.players.has(player_info.id)) {
      // Create new player record in players list
      this.players.set(player_info.id, {
        id: player_info.id,
        name: player_info.name,
        state: constants.CONNECTED,
        score: 0,
      });
    } else {
      this.players.get(player_info.id).state = constants.CONNECTED;
    }

    this.connected_players.set(socket_id, player_info.id);

    // Adding player to draw order when in game
    if (this.state === constants.IN_GAME)
      this.drawer_order.push(player_info.id);
  }

  /**
   * connects player in db, unless player state is kicked
   * @param {id: string, username: string} player_info
   */
  dbJoinPlayer(player_info) {
    if (this.state === constants.IN_LOBBY) {
      try {
        db.collection("Lobbies")
          .doc(this.id)
          .collection("Players")
          .doc(player_info.id)
          .get()
          .then((doc) => {
            // NOTE: comment out if condition if we want to allow kicked players to reconnect
            if (!doc.exists || doc.data().state !== constants.KICKED) {
              doc.ref.set({
                id: player_info.id,
                name: player_info.name,
                state: constants.CONNECTED,
              });
            } else {
              throw Error("could not connect player");
            }
          })

          .then(() => {
            return constants.CONNECTED;
          });
      } catch (err) {
        return err;
      }
    } else {
      return constants.ERR;
    }
  }

  leavePlayer(socket_id) {
    const user_id = this.connected_players.get(socket_id);
    this.players.get(user_id).state = constants.DISCONNECTED;
    this.connected_players.delete(socket_id);

    //TODO: If in game, and only 1 player -> black to lobby

    if (this.state === constants.IN_GAME) {
      this.drawer_order = this.drawer_order.filter(
        (drawer) => drawer !== user_id
      );
      if (this.drawer === user_id) {
        //TODO: Test on case were last person leaves or last drawer leaves
        this.endTurn();
      }
    }

    // Check if it is the last player
    if (this.connected_players.size === 0) {
      this.state = constants.GAME_DISCONNECTED;
      return false;
    }

    // Handle the case when the user is the host
    if (user_id == this.host.id) {
      console.log("Changing host....");
      this.hostChange();
    }
    return user_id;
  }

  /**
   * sets player state in db to disconnected
   * @param {id: string, username: string} player_info
   */
  dbLeavePlayer(socket_id) {
    let player = this.connected_players.get(socket_id);
    try {
      db.collection("Lobbies")
        .doc(this.id)
        .collection("Players")
        .doc(player)
        .update({
          state: constants.DISCONNECTED,
        })
        .then(() => {
          return constants.DISCONNECTED;
        });
    } catch (err) {
      return err;
    }
  }

  /**
   * changes db game host to match this.host
   * used by dbLeavePlayer
   */
  dbHostChange() {
    let lobby = db.collection("Lobbies").doc(this.id).get();
    if (this.host.id !== lobby.hostId) {
      try {
        db.collection("Lobbies")
          .doc(this.id)
          .set({
            hostId: this.hostId,
          })
          .then(() => {
            return hostId;
          });
      } catch (err) {
        return err;
      }
    }
  }

  hostChange() {
    const next_hostId = this.connected_players.values().next().value;
    const next_host = this.players.get(next_hostId);
    console.log(`New host id: ${next_host}`);
    this.host = {
      id: next_host.id,
      name: next_host.name,
    };
  }

  getLobbyStatus() {
    return {
      state: this.state,
      host: { id: this.host.id, name: this.host.name },
      settings: {
        rounds: this.rounds,
        draw_time: this.drawing_time,
        word_list: this.word_list,
      },
      players: Array.from(this.players.values()),
    };
  }

  changeSetting(setting) {
    this.rounds = setting.rounds;
    this.drawing_time = setting.draw_time;
  }

  /**
   * changes db game state to match this.state
   */
  dbChangeGameState() {
    try {
      db.collection("Lobbies").doc(this.id).set({
        state: this.state,
      });
    } catch (err) {
      return err;
    }
  }

  /**
   * sets player state in db to kicked
   * @param {id: string, username: string} player_info
   */
  dbKickPlayer(player_info) {
    try {
      db.collection("Lobbies")
        .doc(this.id)
        .collection("Players")
        .doc(player_info.id)
        .set({
          state: constants.KICKED,
        })
        .then(() => {
          return constants.KICKED;
        });
    } catch (err) {
      return err;
    }
  }

  saveStroke(stroke) {
    if (stroke.type === 1) {
      this.strokes = [];
      console.log("should be 1");
    } else {
      this.strokes.push(stroke);
    }

    return this.strokes;
  }

  // returns random int between min and max
  rndInt(min, max) {
    [min, max] = [Math.ceil(min), Math.floor(max)];
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // returns array of 3 words from the list of words
  getWordOptions() {
    // removes last word from possible words to be chosen from
    // will be added back
    for (let i = 0; i < this.word_list; i++) {
      if (this.word_list[i] === this.word) {
        this.word_list.splice(i, 1);
        break;
      }
    }

    let wordOptions = [];
    // gets 3 random words from list and add them to word options
    for (let i = 0; i < 3; i++) {
      let index = this.rndInt(0, this.word_list.length - 1);
      wordOptions.push(this.word_list[index]);
      this.word_list.splice(index, 1);
    }

    // add back wordOptions and word to word list
    this.word_list.concat(wordOptions);
    this.word_list.push(this.word);

    return wordOptions;
  }

  // takes in array of words to add to wordlist
  addToWords(newWords) {
    let wordsToAdd = [];
    for (let word in newWords) {
      newWords[word] = newWords[word].trim().toLowerCase();
      // handles empty inputs
      if (newWords[word].length) {
        wordsToAdd.push(newWords[word]);
      }
    }
    this.word_list = [...new Set(this.word_list.concat(wordsToAdd))];
  }
}

module.exports = Lobby;
