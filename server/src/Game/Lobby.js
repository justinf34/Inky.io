const db = require("../../config/db");
const constants = require("../Constants");

class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.state = constants.IN_LOBBY;

    this.notifier = null;

    this.players = new Map(); // Keep track of the players(key = id, value = {socket_id, name, score})
    this.connected_players = new Map(); // key = socket id, value = player id

    this.rounds = 3; // Number of rounds in the game
    this.curr_round = 1; // Current round in the game
    this.round_state = 0;
    this.players_guessed = []; //Number of players that correctly guessed the word

    this.drawing_time = 100;
    this.timer = null; // Timer for the game

    this.word_list = []; // TODO: Set a default when user does not input a lot
    this.word = "temp"; // Current word

    this.drawer = null; // user_id of drawer
    this.drawer_order = [];
    this.strokes = []; // Strokes that was sent to the player

    this.interval = null; //Timer interval
  }

  init_sock(notifier_func) {
    this.notifier = notifier_func;
  }

  getRoundStatus(user_id) {
    return {
      rounds: this.rounds,
      curr_round: this.curr_round,
      state: this.round_state,
      drawer: this.drawer, // user_id of the drawer
      word_list: this.drawer === user_id ? this.word_list : [],
      word: this.drawer === user_id ? this.word : "_".repeat(this.word.length),
      strokes: this.strokes,
      timer: this.timer,
      // TODO: Add current time here
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
    this.strokes = []; // Clear the canvas
    this.round_state = 0; // State to choosing

    // Restart timer but do not start it
    this.timer = this.drawing_time;
    //console.log("drawer:",this.drawer);
    this.startTurn(this.word_list[0]);
  }

  startTurn(word) {
    this.word = word; // set the word

    // start timer
    //this.startTimer();

    setTimeout(()=>{this.startTimer();this.notifier(); }, 100);
    //this.notifier(); // Let all the players know that turn started
    
  }

  startTimer(){

    this.interval = setInterval(() => {
      if(this.timer > 0 ){
        this.timer -=1;
        //console.log("timer now:" ,this.timer);
      }else{
        clearInterval(this.interval)
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
    let endGame = false;

    //check if all the players already had a turn to draw
    if (this.drawer_order.length === 0) {
      //check for last round
      if (this.curr_round == this.rounds) {
        this.round_state = 3;
        endGame = true;
      } else {
        this.curr_round += 1;
        this.drawer_order = Array.from(this.connected_players.values());
      }
    }

    if (!endGame) this.newTurn();

    this.notifier(); // Let all the players know that turn ended
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
    } else {
      this.strokes.push(stroke);
    }

    return this.strokes;
  }
}

module.exports = Lobby;
