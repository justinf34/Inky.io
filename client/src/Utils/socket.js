import io from "socket.io-client";

const SOCKET_IO_URL = "http://localhost:8888";

export default function () {
  const socket = io(SOCKET_IO_URL);

  socket.on("connect", (data) => {
    console.log("Connected to the server socket...");
  });

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
    draw,
    registerDraw,
    disconnect,
  };
}
