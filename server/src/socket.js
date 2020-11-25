const { settings } = require("../config/db");

module.exports = function (Manager) {
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

    socket.on("draw", (msg) => {
      console.log("draw: ", msg);
      socket.broadcast.emit("draw", msg);
    });
  };
};
