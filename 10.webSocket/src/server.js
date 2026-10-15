import app from "./app/app.js";
import { createServer } from "node:http";
import { initializeScoket } from "./scoket/initiate.socket.js";

const httpServer = createServer(app);
initializeScoket(httpServer);

httpServer.listen(3000, () => {
  console.log("Server is Runnnig on Port 3000");
});
