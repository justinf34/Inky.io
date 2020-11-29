const db = require("../../config/db");
const constants = require("../Constants");

class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.state = constants.IN_LOBBY;

    this.players = new Map(); // Keep track of the players(key = id, value = {socket_id, name, score})
    this.connected_players = new Map(); // key = socket id, value = player id

    this.rounds = 3; // Number of rounds in the game
    this.curr_round = null; // Current round in the game

    this.drawing_time = 100;
    this.timer = null; // Timer for the game

    this.word_list = []; // TODO: Set a default when user does not input a lot
    this.word = null; // Current word

    this.drawer = null; //Current drawer of the game
  }

  joinPlayer(player_info, socket_id) {
    this.players.set(player_info.id, {
      id: player_info.id,
      name: player_info.name,
      disconnected: false,
      score: 0,
    });

    this.connected_players.set(socket_id, player_info.id);
  }

  /**
   * connects player in db, unless player state is kicked
   * @param {id: string, username: string} player_info 
   */
  dbJoinPlayer(player_info) {
    if (this.state === constants.IN_LOBBY) {
      try {
        db.collection('Lobbies')
          .doc(this.id)
          .collection('Players')
          .doc(player_info.id)
          .get().then((doc) => {
            // NOTE: comment out if condition if we want to allow kicked players to reconnect 
            if (!doc.exists || doc.data().state !== constants.KICKED) {
              doc.ref.set({
                id: player_info.id,
                name: player_info.name,
                state: constants.CONNECTED,
              })
            } else {
              throw Error ("could not connect player")
            }
          })
          
        .then(() => {
          return constants.CONNECTED;
        })
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

    if (this.connected_players.size === 0) {
      // Check if it is the last player
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
    try{
      db.collection('Lobbies')
        .doc(this.id)
        .collection('Players')
        .doc(player)
        .update({
          state: constants.DISCONNECTED,
        })
      .then(() => {
        return constants.DISCONNECTED;
      })
    } catch (err) {
      return err;
    }
  }

  /**
   * changes db game host to match this.host
   * used by dbLeavePlayer
   */
  dbHostChange() {
    let lobby = db.collection('Lobbies').doc(this.id).get();
    if (this.host.id !== lobby.hostId) {
      try{
        db.collection('Lobbies')
          .doc(this.id)
          .set({
            hostId: this.hostId,
          }).then(() => {
            return hostId;
          })
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
    try{
      db.collection('Lobbies')
        .doc(this.id)
        .set({
          state: this.state,
        })
    } catch (err) {
      return err;
    }
  }

  /**
   * sets player state in db to kicked
   * @param {id: string, username: string} player_info 
   */
  dbKickPlayer(player_info) {
    try{
      db.collection('Lobbies')
        .doc(this.id)
        .collection('Players')
        .doc(player_info.id)
        .set({
          state: constants.KICKED,
        })
      .then(() => {
        return constants.KICKED;
      })
    } catch (err) {
      return err;
    }
  }
}

module.exports = Lobby;
