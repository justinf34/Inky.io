class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.state = "IN_LOBBY";

    this.players = new Map(); // Keep track of the players(key = id, value = {socket_id, name, score})
    this.connected_players = new Map(); // key = socket id, value = player id

    this.rounds = 0; // Number of rounds in the game
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

  leavePlayer(socket_id) {
    const user_id = this.connected_players.get(socket_id);
    this.players.get(user_id).disconnected = true;
    this.connected_players.delete(socket_id);

    if (this.connected_players.size === 0) {
      // Check if it is the last player
      this.state = "DISCONNECTED";
      return false;
    }

    // Handle the case when the user is the host
    if (user_id == this.host.id) {
      console.log("Changing host....");
      this.hostChange();
    }
    return user_id;
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
}

module.exports = Lobby;
