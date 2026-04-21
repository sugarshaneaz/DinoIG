import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dinoig:device-id";

let cachedId: string | null = null;
let inflight: Promise<string> | null = null;

function generateId(): string {
  // 24 bytes of base36 entropy — enough to be unique per install, short enough to fit a header
  return (
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Date.now().toString(36)
  ).slice(0, 48);
}

export async function getDeviceId(): Promise<string> {
  if (cachedId) return cachedId;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      if (existing && existing.length > 0) {
        cachedId = existing;
        return existing;
      }
    } catch {
      // AsyncStorage can fail in rare edge cases (disk full, etc.) — fall through
      // to generating a fresh ID that simply won't be persisted.
    }

    const fresh = generateId();
    try {
      await AsyncStorage.setItem(STORAGE_KEY, fresh);
    } catch {
      // Same fallback: we still return the fresh ID so this session can proceed.
    }
    cachedId = fresh;
    return fresh;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
