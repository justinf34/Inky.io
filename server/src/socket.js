const { settings } = require("../config/db");
const constants = require("./Constants");

module.exports = function (Manager, io) {
  return function (socket) {
    console.log("socket: a client connected...");

    socket.on("join", ({ lobby_id, player }) => {
      console.log(`socket: ${player.id} wants to join ${lobby_id}`);

      const res = Manager.joinRoom(socket.id, lobby_id, player);
      if (res.success) {
        socket.join(lobby_id);
        socket.emit("join", res);
        socket.to(lobby_id).emit("player-list-update", res.lobby);
      } else {
        socket.emit("join", { success: false });
      }
    });

    socket.on("leave", (lobby_id, player) => {
      console.log(`socket: ${player.id} is leaving ${lobby_id}`);

      const res = Manager.leaveRoom(socket.id, lobby_id);

      if (res.success) {
        socket.leave(room_id);
        socket.send("leave", { success: true });
        socket.to(lobby_id).emit("player-list-update", res.lobby);
      } else {
        socket.emit("leave");
      }
    });

    socket.on("disconnecting", async () => {
      const rooms = Array.from(socket.rooms);
      console.log(`Client ${socket.id} were in room ${rooms}`);

      if (rooms.length == 2) {
        const res = await Manager.leaveRoom(socket.id, rooms[1]);
        socket.to(rooms[1]).emit("player-list-update", res.lobby);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket: a client disconected...");
    });

    socket.on("setting-change", (lobby_id, setting) => {
      Manager.changeLobbySetting(lobby_id, setting); // Handle it with the manager
      socket.to(lobby_id).emit("setting-change", setting); // Send it to other clients
    });

    socket.on("lobby-state-change", (lobby_id, state) => {
      console.log(state + " " + constants.IN_GAME);
      // Set up the game notifer for the lobby to send messages
      if (state === constants.IN_GAME) {
        function gameNotifier() {
          io.to(lobby_id).emit("new-round-status");
        }
        Manager.initNotifier(lobby_id, gameNotifier);
      }

      Manager.changeLobbyState(lobby_id, state).then(() => {
        io.to(lobby_id).emit("state-change", state);
      });
    });

    socket.on("game-status", (lobby_id, user_id) => {
      const status = Manager.getGameStatus(lobby_id, user_id);
      socket.emit("game-status", status);
    });

    socket.on("draw", (lobby_id, msg) => {
      // console.log("draw: ", msg);
      const strokes = Manager.addStroke(lobby_id, msg);
      socket.to(lobby_id).emit("draw", msg, strokes);
    });

    socket.on("chat", async (lobby_id, msg) => {
      Manager.addChat(lobby_id, socket.id, msg).then((result) => {
        if (result.success) {
          io.to(lobby_id).emit("chat", result.name, msg);
          console.log(`Sending "${result.name}: ${msg}" to lobby ${lobby_id}`);
        } else {
          console.log(result.message);
        }
      });
    });
  };
};
