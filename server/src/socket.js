module.exports = function (socket) {
  console.log("socket: a client connected...");

  socket.on("join", (room_id, user_id) => {
    console.log(`socket: ${user_id} wants to join ${room_id}`);
    socket.join(room_id);
  });

  socket.on("leave", (room_id, user_id) => {
    console.log(`socket: ${user_id} is leaving ${room_id}`);
    socket.leave(room_id);
  });

  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    // console.log(`socket: client ${socket.id} disconnected from `, rooms);
  });

  socket.on("disconnect", () => {
    console.log("socket: a client disconected...");
  });

  socket.on("draw", (msg) => {
    console.log("draw: ", msg);
    socket.broadcast.emit("draw", msg);
  });
};
