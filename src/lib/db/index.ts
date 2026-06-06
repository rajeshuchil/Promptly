/**
 * FastApp – Drizzle DB client (runtime singleton)
 *
 * Driver choice rationale
 * ───────────────────────
 * We use `drizzle-orm/neon-http` backed by `@neondatabase/serverless`.
 *
 * Neon provides TWO connection strings:
 *   • DATABASE_URL          — pooled (goes through Neon's PgBouncer in
 *                             *transaction* mode).  Fast, scales to zero,
 *                             ideal for serverless/edge invocations.
 *   • DATABASE_URL_UNPOOLED — direct TCP connection to the Postgres
 *                             primary.  Required for Drizzle Kit CLI
 *                             migrations (see drizzle.config.ts).
 *
 * The HTTP transport used here sends every query as a single HTTP POST
 * which is fully compatible with transaction-mode pooling — it never
 * issues SET/RESET or PREPARE statements that would cause
 * "prepared statement does not exist" errors under PgBouncer.
 *
 * This file is only imported at RUNTIME (Next.js server components,
 * Route Handlers, Server Actions).  It must NOT be imported in
 * drizzle.config.ts or any CLI migration script.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// ── Guard ─────────────────────────────────────────────────────────────────────

const connectionString =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/fastapp_mock";

// ── Client ────────────────────────────────────────────────────────────────────

/**
 * `neon(url)` creates a tagged-template SQL function that speaks the
 * Neon HTTP protocol — no WebSockets, no persistent TCP, zero cold-start
 * overhead, and safe behind any transaction-mode pooler.
 */
const sql = neon(connectionString);

/**
 * Singleton Drizzle client.
 *
 * Usage anywhere in the Next.js app (Server Components, Route Handlers,
 * Server Actions):
 *
 *   import { db } from "@/lib/db";
 *   const users = await db.select().from(schema.users);
 */
export const db = drizzle(sql, { schema });

// Re-export schema for convenience so callers can do:
//   import { db, schema } from "@/lib/db";
export { schema };

export type DB = typeof db;
