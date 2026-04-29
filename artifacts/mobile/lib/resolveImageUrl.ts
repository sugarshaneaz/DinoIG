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

// Wikimedia's User-Agent policy blocks default mobile HTTP client UAs (okhttp,
// CFNetwork). Requests need a descriptive UA with contact info or they get
// dropped. https://meta.wikimedia.org/wiki/User-Agent_policy
const WIKIMEDIA_HEADERS = {
  "User-Agent": "DinoIG/1.0 (https://github.com/sugarshaneaz/DinoIG)",
};

/**
 * Returns an image source object with the right headers for the given URL.
 * Wikimedia URLs need a descriptive User-Agent or they 403.
 */
export function resolveImageSource(
  url: string | null | undefined,
): { uri: string; headers?: Record<string, string> } | null {
  const uri = resolveImageUrl(url);
  if (!uri) return null;

  if (uri.includes("wikimedia.org") || uri.includes("wikipedia.org")) {
    return { uri, headers: WIKIMEDIA_HEADERS };
  }

  return { uri };
}
