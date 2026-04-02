/**
 * Converts a relative image URL (e.g. /api/images/trex.jpeg) into an absolute
 * URL that Expo's Image component can load on all platforms (iOS, Android, web).
 *
 * On web, the proxy handles relative paths fine.
 * On native, the app runs outside the proxy and needs a full https:// URL.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // Already absolute — return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Relative path — prepend the Replit domain so native can reach it
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) {
    return `https://${domain}${url}`;
  }

  // Fallback: return the relative path (works on web only)
  return url;
}
