import http from "http";
import { Socket } from "net";

export function setupGracefulShutdown(
  server: http.Server,
  timeoutMs = 10000,
  onShutdown?: () => void
) {
  const connections = new Set<Socket>();

  server.on("connection", (conn: Socket) => {
    connections.add(conn);
    conn.on("close", () => connections.delete(conn));
  });

  const shutdown = (reason: string) => {
    console.log(`Shutting down: ${reason}`);
    try {
      onShutdown && onShutdown();
    } catch {}
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => {
      connections.forEach((c) => c.destroy());
      process.exit(1);
    }, timeoutMs).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("unhandledRejection", (r) => {
    console.error("Unhandled rejection", r);
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (e) => {
    console.error("Uncaught exception", e);
    shutdown("uncaughtException");
  });
}
