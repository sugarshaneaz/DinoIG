export function parseIdParam(raw: unknown): number | null {
  if (Array.isArray(raw)) raw = raw[0];
  if (typeof raw !== "string") return null;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? null : n;
}
