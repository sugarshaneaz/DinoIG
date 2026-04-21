import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db, dinosaursTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DUMP_PATH = path.resolve(__dirname, "..", "seeds", "dinosaurs.sql");

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  if (!existsSync(DUMP_PATH)) {
    console.error(`Seed file not found at ${DUMP_PATH}`);
    process.exit(1);
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dinosaursTable);

  const force = process.argv.includes("--force");
  if (count > 0 && !force) {
    console.log(
      `dinosaurs table already has ${count} row(s); refusing to restore.`,
    );
    console.log("Re-run with --force to replay the dump anyway.");
    return;
  }

  console.log(`Restoring dinosaurs from ${DUMP_PATH} ...`);

  await new Promise<void>((resolve, reject) => {
    const child = spawn("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", DUMP_PATH], {
      stdio: "inherit",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`psql exited with code ${code}`));
    });
  });

  const [{ count: after }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(dinosaursTable);
  console.log(`Done. dinosaurs table now has ${after} row(s).`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
