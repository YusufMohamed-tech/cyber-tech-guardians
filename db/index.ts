import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

let schemaReady: Promise<unknown> | null = null;

function getD1() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }
  return env.DB;
}

export function getDb() {
  return drizzle(getD1(), { schema });
}

export async function ensureDbSchema() {
  const d1 = getD1();
  schemaReady ??= d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      email TEXT NOT NULL,
      locale TEXT DEFAULT 'en' NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
    )`),
    d1.prepare(
      "CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email)"
    ),
    d1.prepare("PRAGMA optimize"),
  ]);
  await schemaReady;
}
