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

    this.word_list = ["turtle","garfield","alligator","headphones","wedding dress","violin","newspaper",
      "raincoat","chameleon","cardboard","oar","drip","shampoo","time machine","yardstick","think","lace",
      "darts","avocado","bleach","curtain","extension cord","birthday","sandbox","bruise",
      "fog","sponge","wig","pilot","mascot","fireman","zoo","sushi","fizz","ceiling","post office",
      "season","internet","chess","puppet","chime","koala","dentist","ping pong","bonnet","sheets",
      "sunburn","houseboat","sleep","kneel","crust","speakers","cheerleader","dust","salmon","cabin",
      "handle","swamp","cruise","pharmacist","dream","raft","plank","cliff","sweater","safe","picnic",
      "shrink","ray","leak","deep","tiptoe","hurdle","knight","cloak","bedbug","hot tub","firefighter",
      "charger","nightmare","coach","sneeze","goblin","chef","applause","golden retriever","joke",
      "comedian","cupcake","baker","facebook","convertible","giant","garden","diving","hopscotch",
      "stingray","song","trip","backbone","bomb","treasure","garbage","park","pirate","ski","whistle",
      "state","baseball","coal","queen","photograph","computer","hockey","hot dog","salt and pepper","ipad",
      "frog","lawnmower","mattress","pinwheel","circus","battery","mailman","cowboy","password","bicycle",
      "skate","electricity","thief","teapot","spring","nature","shallow","outside","america","bow tie",
      "wax","light bulb","music","popsicle","brain","knee","pineapple","tusk","sprinkler","money",
      "pool","lighthouse","doormat","face","flute","rug","snowball","purse","owl","gate","suitcase","stomach",
      "doghouse","pajamas","bathroom","scale","peach","watering can","hook","school","french fries",
      "beehive","artist","flagpole","camera","hair dryer","mushroom","tv","quilt","chalk","angle","ant","apple",
      "arch","arm","army","baby","bag","ball","band","basin","basket","bath","bed","bee","bell","berry","bird",
      "blade","board","boat","bone","book","boot","bottle","box","boy","brake","branch","brick","bridge",
      "brush","bucket","button","cake","card","carriage","cart","cat","chain","cheese","chin",
      "church","circle","clock","cloud","coat","collar","comb","cord","cow","cup","cushion","dog","door",
      "drain","drawer","dress","drop","ear","egg","engine","eye","farm","feather","finger","fish","flag",
      "floor","fly","foot","fork","fowl","frame","girl","glove","goat","gun","hair","hammer","hand","hat",
      "head","heart","horn","horse","hospital","house","island","jewel","kettle","key","knife","knot",
      "leaf","leg","line","lip","lock","map","match","monkey","moon","mouth","muscle","nail","neck","needle","nerve",
      "net","nose","nut","office","orange","oven","parcel","pen","pencil","picture","pig","pin","pipe","plane","plate",
      "plough","pocket","pot","potato","prison","pump","rail","rat","receipt","ring","rod","roof","root","sail",
      "scissors","screw","seed","sheep","shelf","ship","shirt","shoe","skin","skirt","snake","sock","spade","spoon",
      "square","stamp","star","station","stem","stick","stocking","store","street","sun","table","tail",
      "thread","throat","thumb","ticket","toe","tongue","tooth","town","train","tray","tree","trousers","umbrella","wall",
      "watch","wheel","whip","window","wing","wire","worm"];
    this.word = null; // Current word

    this.drawer = null; //Current drawer of the game
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
    console.log(this.word_list.length);
    this.word_list = [...new Set(this.word_list)];
    console.log(this.word_list.length + " old list length. " + newWords.length + " in new words");
    let wordsToAdd = [];
    for(let word in newWords) {
      newWords[word] = newWords[word].trim().toLowerCase();
      // handles empty inputs
      if(newWords[word].length) {
         wordsToAdd.push(newWords[word]);
         console.log(newWords[word]);
      }
    }
    this.word_list = [...new Set(this.word_list.concat(wordsToAdd))];
    console.log("new list length is " + this.word_list.length);
  }
}

module.exports = Lobby;
