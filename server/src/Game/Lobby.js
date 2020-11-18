class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.players = new Map(); // Keep track of the players(key = id, value = {socket_id, name, score})

    this.max_round = null; // Number of rounds in the game
    this.curr_round = null; // Current round in the game
    this.timer = null; // Timer for the game
    this.word = null; // Current word
    this.drawer = null; //Current drawer of the game
  }

  joinPlayer(player_info, socket_id) {
    // Add player to the player list
    this.players.set(player_info.id, {
      id: player_info.id,
      socket_id: socket_id,
      name: player_info.name,
      score: 0,
    });

    //TODO:
    //  - Need to send a socket event that a new player joined
    //  - Tell player of successful join
  }

  leavePlayer(player_info) {
    // Remove the player from player list
    this.players.delete(player_info.id);

    if (player_info.id == this.host.id) {
      this.hostChange(); // Handle the case when the user is the host
    } else {
      // TODO: send socket event that player left the lobby
    }
  }

  hostChange() {
    const next_host = this.players.values().next().value;
    this.host = {
      id: next_host.id,
      name: next_host.name,
    };
    //TODO: new there is a new host
  }
}
