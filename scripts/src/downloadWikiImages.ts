/**
 * Downloads every dinosaur's fossil image from Wikimedia / Wikipedia and
 * stores it locally under artifacts/api-server/public/images/wiki/, then
 * rewrites the imageUrl column to point at /api/images/wiki/<id>.<ext>.
 *
 * After running this once and redeploying the API server, the mobile app
 * stops hitting Wikimedia and Wikipedia rate limiting goes away — the
 * Replit deployment serves all 311 fossils as plain static files.
 *
 * Safe to re-run: each download is skipped when the file already exists
 * and each row is only updated when imageUrl still points at wikimedia.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts exec tsx ./src/downloadWikiImages.ts
 *
 * Or to run against a different database (e.g. production):
 *   DATABASE_URL='postgres://...' pnpm --filter @workspace/scripts exec \
 *     tsx ./src/downloadWikiImages.ts
 */

import { db, dinosaursTable } from "@workspace/db";
import { eq, like } from "drizzle-orm";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(
  __dirname,
  "../../artifacts/api-server/public/images/wiki",
);

const USER_AGENT = "DinoIG/1.0 (https://github.com/sugarshaneaz/DinoIG)";
const THROTTLE_MS = 2000;
const MAX_RETRIES = 4;

function extensionFromUrl(url: string): string {
  const cleaned = url.split("?")[0];
  const match = cleaned.match(/\.(jpe?g|png|gif|webp)$/i);
  return (match?.[1] ?? "jpg").toLowerCase().replace("jpeg", "jpg");
}

async function fetchWithBackoff(url: string): Promise<Response> {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.status !== 429 || attempt >= MAX_RETRIES) return res;

    const retryAfterHeader = res.headers.get("retry-after");
    const retryAfterSec = retryAfterHeader ? parseInt(retryAfterHeader, 10) : NaN;
    const backoffMs = !isNaN(retryAfterSec)
      ? retryAfterSec * 1000
      : Math.min(60_000, 5_000 * 2 ** attempt);

    console.warn(
      `    ⏳ 429 — waiting ${Math.round(backoffMs / 1000)}s before retry #${attempt + 1}`,
    );
    await new Promise((r) => setTimeout(r, backoffMs));
    attempt++;
  }
}

async function downloadOne(
  id: number,
  url: string,
): Promise<{ localPath: string; ext: string } | null> {
  const ext = extensionFromUrl(url);
  const filename = `${id}.${ext}`;
  const fullPath = path.join(IMAGES_DIR, filename);

  try {
    await fs.access(fullPath);
    return { localPath: `/api/images/wiki/${filename}`, ext };
  } catch {
    // not on disk yet, continue
  }

  const res = await fetchWithBackoff(url);

  if (!res.ok) {
    console.warn(
      `  ✗ #${id}  HTTP ${res.status} fetching ${url.slice(0, 80)}…`,
    );
    return null;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(fullPath, buffer);
  return { localPath: `/api/images/wiki/${filename}`, ext };
}

async function main() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  console.log(`📁 Saving images to: ${IMAGES_DIR}\n`);

  const wikiDinos = await db
    .select({
      id: dinosaursTable.id,
      name: dinosaursTable.name,
      imageUrl: dinosaursTable.imageUrl,
    })
    .from(dinosaursTable)
    .where(like(dinosaursTable.imageUrl, "https://%wikimedia.org/%"));

  console.log(`Found ${wikiDinos.length} dinosaurs with Wikimedia URLs.\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [i, dino] of wikiDinos.entries()) {
    if (!dino.imageUrl) continue;

    const progress = `[${i + 1}/${wikiDinos.length}]`;

    try {
      const result = await downloadOne(dino.id, dino.imageUrl);
      if (!result) {
        failed++;
        continue;
      }

      await db
        .update(dinosaursTable)
        .set({ imageUrl: result.localPath })
        .where(eq(dinosaursTable.id, dino.id));

      console.log(`  ✓ ${progress} #${dino.id}  ${dino.name}  →  ${result.localPath}`);
      downloaded++;
    } catch (err) {
      failed++;
      console.warn(`  ✗ ${progress} #${dino.id}  ${dino.name}  →  ${err}`);
    }

    await new Promise((r) => setTimeout(r, THROTTLE_MS));
  }

  console.log(
    `\n✓ Done.  downloaded=${downloaded}  skipped=${skipped}  failed=${failed}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
