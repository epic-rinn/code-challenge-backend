import http from "http";
import app from "./app";
import { setupGracefulShutdown } from "./utils";
import { closeDb } from "./db";
import { config } from "./config";

const port = config.port;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

setupGracefulShutdown(server, 10000, () => {
  // On Graceful Shutdown Hook
  closeDb();
});
