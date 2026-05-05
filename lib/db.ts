import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

// Reuse the pool across hot-reloads in dev (Next.js re-executes modules on
// each reload, which would exhaust the connection limit without this guard).
const pool = global._pgPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

// Swallow connection errors so a missing DB doesn't crash the dev server.
// Query errors are still thrown to callers (and caught in page/route code).
pool.on("error", () => {});

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export default pool;
