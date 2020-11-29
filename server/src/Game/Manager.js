const Lobby = require("./Lobby");
const db = require("../../config/db");
const constants = require("../../src/Constants");

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

      lobby.dbJoinPlayer(player_info);
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
    lobby.dbLeavePlayer(socket_id);
    
    const res = lobby.leavePlayer(socket_id);

    const lobbies = db.collection("Lobbies").doc(lobby_id);
    if (!res) {
      const state_res = await lobbies.update({
        state: constants.GAME_DISCONNECTED,
      });
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

  async function addChat(lobby_id, socket_id, message) {
    try {
      lobby = Lobbies.get(lobby_id);
      let user_id = lobby.connected_players.get(socket_id);
      let name = lobby.players.get(user_id).name;
      db.collection("Chats").add({
        name: name,
        lobbyID: lobby_id,
        message: message,
      });
      return { success: true, name: name };
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
    addChat,
  };
};
