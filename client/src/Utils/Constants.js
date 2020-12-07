const {
  createBootstrapComponent,
} = require("react-bootstrap/esm/ThemeProvider");

// Player states
const DISCONNECTED = 0;
const CONNECTED = 1;
const KICKED = 2;

// Game states
const GAME_ENDED = 0;
const IN_LOBBY = 1;
const IN_GAME = 2;
const GAME_DISCONNECTED = 3;

const ERR = -1;

const constants = {
  DISCONNECTED: DISCONNECTED,
  CONNECTED: CONNECTED,
  KICKED: KICKED,
  GAME_ENDED: GAME_ENDED,
  IN_LOBBY: IN_LOBBY,
  IN_GAME: IN_GAME,
  GAME_DISCONNECTED: GAME_DISCONNECTED,
  ERR: ERR,
};

export default constants;
