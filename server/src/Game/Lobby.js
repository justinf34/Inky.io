class Lobby {
  constructor(id, host) {
    this.id = id;
    this.host = host; // Should be an object {id, name}
    this.state = "IN_LOBBY";

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

  changeSetting(setting) {
    this.rounds = setting.rounds;
    this.drawing_time = setting.draw_time;
  }

  // returns random int between min and max
  rndInt(min, max) {
    [min,max] = [Math.ceil(min), Math.floor(max)]
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // returns array of 3 words from the list of words
  getWordOptions() {
    // removes last word from possible words to be chosen from
    // will be added back
    for(let i = 0; i < this.word_list; i++) {
      if(arr[i] === this.word) {
        this.word_list.splice(i, 1);
        break;
      }
    }

    let wordOptions = [];
    // gets 3 random words from list and add them to word options
    for(let i = 0; i < 3; i++) {
      let index = this.rndInt(0, this.word_list.length);
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
    // remove douplicates
    let uniqueWords = [...new Set(newWords)];
    this.word_list.concat(uniqueWords);
  }


}

module.exports = Lobby;
