/**
 * Digs a plausible pixel height out of whatever a third-party embed posts.
 *
 * A fixed height for a TikTok embed can only be wrong in one of two ways: too
 * short and it scrolls inside its own iframe, too tall and it leaves a blank
 * slab under the caption. Caption length decides which, and captions vary — so
 * the height has to come from the embed rather than from a guess.
 *
 * TikTok's iframe posts its measured height to the parent; that is how their
 * embed.js sizes it. Reading the message directly gets the same number without
 * putting their script on a page built to load fast.
 *
 * The payload's shape belongs to them and can change, so this reads it loosely
 * rather than matching one known form: any key whose name mentions height, at
 * any depth, in an object or a JSON string. The bounds are what stop a width, a
 * video id or a timestamp being mistaken for a height.
 */
export function findEmbedHeight(value: unknown, depth = 0): number | null {
  if (depth > 4 || value == null) return null;

  if (typeof value === 'string') {
    try {
      return findEmbedHeight(JSON.parse(value), depth + 1);
    } catch {
      return null;
    }
  }

  if (typeof value !== 'object') return null;

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const n = typeof entry === 'string' ? Number(entry) : entry;
    if (/height/i.test(key) && typeof n === 'number' && Number.isFinite(n) && n >= 300 && n <= 2400) {
      return n;
    }
    const nested = findEmbedHeight(entry, depth + 1);
    if (nested) return nested;
  }

  return null;
}

/** True when a postMessage genuinely came from TikTok rather than any other frame. */
export function isTikTokOrigin(origin: string): boolean {
  let host: string;
  try {
    host = new URL(origin).hostname;
  } catch {
    return false;
  }
  return host === 'tiktok.com' || host.endsWith('.tiktok.com');
}
