import { sqlite } from "../db/drizzle";
import { config } from "../config";

export function getHealth() {
  const now = new Date();
  const mem = process.memoryUsage();
  let dbOk = false;
  let dbError: string | undefined;

  try {
    const row = sqlite.prepare("SELECT 1 AS checkNum").get() as {
      checkNum: number;
    };
    dbOk = row?.checkNum === 1;
  } catch (e: any) {
    dbError = e?.message || "unknown";
  }

  const statusCode = dbOk ? 200 : 503;
  const body = {
    status: dbOk ? "ok" : "degraded",
    db: dbOk ? "ok" : "error",
    dbError,
    env: config.nodeEnv,
    pid: process.pid,
    uptime: process.uptime(),
    now: now.toISOString(),
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
    },
  };

  return { statusCode, body };
}
