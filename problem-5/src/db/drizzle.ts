import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { drizzle } from "drizzle-orm/better-sqlite3";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const sqlite = new Database(path.join(dataDir, "app.db"));

sqlite.pragma("foreign_keys = ON");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle({ client: sqlite });

export function closeDb() {
  try {
    sqlite.close();
  } catch (error) {
    console.error("Error closing database:", error);
  }
}
