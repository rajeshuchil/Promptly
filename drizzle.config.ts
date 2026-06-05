/**
 * FastApp – Drizzle Kit configuration (CLI-only)
 *
 * This file is used EXCLUSIVELY by the Drizzle Kit CLI:
 *   npm run db:generate   → introspect schema and write SQL migration files
 *   npm run db:migrate    → apply pending migrations
 *   npm run db:push       → push schema directly (dev only)
 *   npm run db:studio     → open Drizzle Studio visual browser
 *
 * ⚠️  IMPORTANT — Use DATABASE_URL_UNPOOLED here, NOT DATABASE_URL
 * ─────────────────────────────────────────────────────────────────
 * Drizzle Kit uses a native `node-postgres` (pg) driver under the hood.
 * `pg` sends extended-query-protocol messages (PARSE/BIND/EXECUTE) which
 * require a persistent session.  Neon's *pooled* endpoint sits behind
 * PgBouncer in **transaction mode** — it tears down the session after each
 * transaction, so PREPARE'd statements disappear, causing:
 *
 *   ERROR: prepared statement "..." does not exist
 *
 * The *unpooled* (direct) URL bypasses PgBouncer entirely and connects
 * straight to the Postgres primary — migrations work correctly.
 *
 * Neon exposes both strings side-by-side in the Connection Details panel:
 *   DATABASE_URL          → pooled   (use in src/lib/db/index.ts at runtime)
 *   DATABASE_URL_UNPOOLED → direct   (use here for CLI migrations)
 */

import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env.local — must come before any process.env access
dotenv.config({ path: ".env.local" });

// Prefer the direct/unpooled URL for CLI operations; fall back to the pooled
// URL only if an unpooled one isn't configured yet (acceptable during initial
// setup when the database has zero traffic and pooler mode doesn't matter).
const migrationUrl =
  process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!migrationUrl) {
  throw new Error(
    "[drizzle-kit] Neither DATABASE_URL_UNPOOLED nor DATABASE_URL is set.\n" +
      "Add them to .env.local — see .env.example for the exact variable names.",
  );
}

export default defineConfig({
  /** TypeScript schema file — single source of truth */
  schema: "./src/lib/db/schema.ts",

  /** Output directory for generated SQL migration files */
  out: "./drizzle/migrations",

  dialect: "postgresql",

  dbCredentials: {
    // Uses the unpooled direct connection so that Drizzle Kit's pg driver
    // can safely issue prepared statements during introspection/migration.
    url: migrationUrl,
  },

  verbose: true,
  strict: true,
});
