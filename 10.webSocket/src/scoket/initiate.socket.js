import { Server } from "socket.io";

export const initializeScoket = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("message", (msg) => {
      console.log(msg);
      socket.emit("elon", "hello from elon event");
    });
  });
};
