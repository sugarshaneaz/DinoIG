import { createHash } from "node:crypto";
import type { Request } from "express";

export function getDeviceKey(req: Request): string {
  const provided = req.header("x-device-id");
  if (provided && provided.length > 0 && provided.length <= 128) {
    return `dev:${provided}`;
  }
  const ip = req.ip ?? "unknown";
  const ua = req.header("user-agent") ?? "";
  return `ipua:${createHash("sha256").update(`${ip}::${ua}`).digest("hex")}`;
}
