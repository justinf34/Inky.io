const Lobby = require("./Lobby");
const db = require("../../config/db");

/**
 * Interface to interact with the rooms
 * and manage creation and deletion of rooms
 */
module.exports = function () {
  const Lobbies = new Map();

  function createNewRoom(lobby) {
    Lobbies.set(
      lobby.code,
      new Lobby(lobby.code, { id: lobby.hostId, name: lobby.host_name })
    );
  }

  function joinRoom(socket_id, lobby_id, player_info) {
    const lobby = Lobbies.get(lobby_id);
    if (lobby) {
      lobby.joinPlayer(player_info, socket_id);

      //TODO: add the player in the lobby record in db
      return {
        success: true,
        lobby: lobby.getLobbyStatus(),
      };
    }

    return {
      success: false,
    };
  }

  async function leaveRoom(socket_id, lobby_id) {
    const lobby = Lobbies.get(lobby_id);
    const res = lobby.leavePlayer(socket_id);

    const lobbies = db.collection("Lobbies").doc(lobby_id);
    if (!res) {
      const state_res = await lobbies.update({ state: "DISCONNECTED" });
      //TODO: Add player list to the lobby
    }

    const host_res = await lobbies.update({ hostId: lobby.host.id });

    return {
      success: true,
      lobby: lobby.getLobbyStatus(),
    };
  }

  function changeLobbySetting(lobby_id, setting) {
    const lobby = Lobbies.get(lobby_id);
    lobby.changeSetting(setting);
  }

  async function changeLobbyState(lobby_id, state) {
    // Update the DB
    try {
      const lobbies = db.collection("Lobbies").doc(lobby_id);
      const state_res = await lobbies.update({ state: state });

      lobby = Lobbies.get(lobby_id);
      //TODO: should probably use a function in Lobby class
      lobby.state = state;

      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  return {
    createNewRoom,
    joinRoom,
    leaveRoom,
    changeLobbySetting,
    changeLobbyState,
  };
};
