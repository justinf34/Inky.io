const Lobby = require("./Lobby");
const db = require("../../config/db");
const constants = require("../../src/Constants");
const admin = require("firebase-admin");

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

  function kickPlayer(lobby_id, playerId) {
    const lobby = Lobbies.get(lobby_id);
    const playerSocketId = lobby.kickPlayer(playerId);
    lobby.dbKickPlayer(playerId);
    return playerSocketId;
  }

  function changeLobbySetting(lobby_id, setting) {
    const lobby = Lobbies.get(lobby_id);
    lobby.changeSetting(setting);
  }

  async function addCustomWords(lobby_id, customWords) {
    const lobby = Lobbies.get(lobby_id);
    lobby.addToWords(customWords);
  }

  async function changeLobbyState(lobby_id, state) {
    // Update the DB
    try {
      const lobbies = db.collection("Lobbies").doc(lobby_id);
      const state_res = await lobbies.update({ state: state });

      lobby = Lobbies.get(lobby_id);
      //TODO: should probably use a function in Lobby class
      lobby.changeLobbyState(state);

      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  function dcGame(lobby_id) {
    const lobby = Lobbies.get(lobby_id);
    Lobbies.delete(lobby_id);

    // Tell lobby instance to handle disconnect
    const res = lobby.dcLobby();
  }

  async function addChat(lobby_id, socket_id, message) {
    try {
      lobby = Lobbies.get(lobby_id);
      let user_id = lobby.connected_players.get(socket_id);
      let name = lobby.players.get(user_id).name;
      let correctGuess = lobby.checkGuess(user_id, message);

      db.collection("Chats").add({
        name: name,
        lobbyID: lobby_id,
        message: message,
        correctGuess: correctGuess,
        timestamp: admin.firestore.Timestamp.now(),
        userID: user_id,
      });
      return { success: true, name: name, correctGuess: correctGuess };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  function getScore(lobby_id, socket_id) {
    try {
      lobby = Lobbies.get(lobby_id);
      let user_id = lobby.connected_players.get(socket_id);
      let score = lobby.players.get(user_id).score;
      let results = { user_id: user_id, score: score };
      return results;
    } catch (error) {
      console.error(error);
    }
  }

  async function addReport(lobby_id, user_id, name, reason) {
    var reasons = "";
    if (reason.cheating) {
      reasons += "Cheating. ";
    }
    if (reason.verbalAbuse) {
      reasons += "Verbal Abuse. ";
    }
    if (reason.inappropriateName) {
      reasons += "Inappropriate Name. ";
    }

    try {
      //console.log(new Timestamp());
      db.collection("Reports").add({
        date: admin.firestore.Timestamp.now(),
        lobbyID: lobby_id,
        name: name,
        playerID: user_id,
        reason: reasons,
      });
      return { success: true, name: name };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  function addStroke(lobby_id, stroke) {
    const lobby = Lobbies.get(lobby_id);
    return lobby.saveStroke(stroke);
  }

  function initNotifier(lobby_id, notifier_func, io) {
    const lobby = Lobbies.get(lobby_id);
    lobby.init_sock(notifier_func, io);
  }

  function getGameStatus(lobby_id, user_id) {
    const lobby = Lobbies.get(lobby_id);
    return lobby.getRoundStatus(user_id);
  }

  function getSyncTime(lobby_id, user_id) {
    const lobby = Lobbies.get(lobby_id);
    return lobby.getRoundStatus(user_id).timer;
  }

  function startTurn(lobby_id, word) {
    const lobby = Lobbies.get(lobby_id);
    lobby.startTurn(word);
  }

  return {
    createNewRoom,
    joinRoom,
    leaveRoom,
    changeLobbySetting,
    addCustomWords,
    changeLobbyState,
    addChat,
    // getChatLog,
    addReport,
    addStroke,
    initNotifier,
    getGameStatus,
    getSyncTime,
    startTurn,
    dcGame,
    kickPlayer,
    getScore,
  };
};
