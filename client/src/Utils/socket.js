import io from "socket.io-client";
const SOCKET_IO_URL = "http://localhost:8888";

export const socket = io(SOCKET_IO_URL);

function handlers() {
  socket.on("connect", (data) => {
    console.log("Connected to the server socket...");
  });

  function join(req_info) {
    console.log(req_info);
    socket.emit("join", req_info);
  }

  function registerOnJoin(onJoin) {
    socket.on("join", onJoin);
  }

  function draw(msg) {
    socket.emit("draw", msg);
  }

  function registerDraw(onDraw) {
    socket.on("draw", onDraw);
  }

  function disconnect() {
    socket.close();
  }

  return {
    join,
    registerOnJoin,
    draw,
    registerDraw,
    disconnect,
  };
}
