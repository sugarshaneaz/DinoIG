import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// `dist/index.mjs` is sibling to `public/` at runtime; `src/lib/...` in dev.
// Resolve relative to process.cwd() so both layouts work.
const IMAGES_ROOT = path.resolve(process.cwd(), "public", "images", "dinosaurs");

const ALLOWED_CONTENT_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const MAX_BYTES = 5 * 1024 * 1024; // 5 MiB

function extFromUrl(url: string): string | null {
  const match = url.match(/\.(jpe?g|png|webp|gif)(?:\?|$)/i);
  if (!match) return null;
  const ext = match[1].toLowerCase();
  return ext === "jpeg" ? "jpg" : ext;
}

/**
 * Download a remote image and persist it under public/images/dinosaurs/.
 * Returns the relative URL path (e.g. /api/images/dinosaurs/42.jpg) or null
 * on any failure. Keeps the blast radius contained: failures fall back to
 * returning the original remote URL, so callers can still use hotlinking.
 */
export async function cacheRemoteImage(
  id: number,
  remoteUrl: string,
): Promise<string | null> {
  try {
    const res = await fetch(remoteUrl, {
      headers: {
        "User-Agent":
          "DinoIG/1.0 (+https://github.com/sugarshaneaz/DinoIG; image-cache)",
      },
    });
    if (!res.ok) return null;

    const contentType = (res.headers.get("content-type") ?? "")
      .split(";")[0]
      .trim()
      .toLowerCase();

    const ext =
      ALLOWED_CONTENT_TYPES.get(contentType) ?? extFromUrl(remoteUrl);
    if (!ext) return null;

    const contentLength = Number(res.headers.get("content-length") ?? "0");
    if (contentLength > MAX_BYTES) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > MAX_BYTES) return null;

    await mkdir(IMAGES_ROOT, { recursive: true });
    const filename = `${id}.${ext}`;
    await writeFile(path.join(IMAGES_ROOT, filename), buf);

    return `/api/images/dinosaurs/${filename}`;
  } catch {
    return null;
  }
}
