const STORAGE_KEY = 'luclam_admin_token';

/**
 * The server guards POST /api/upload and POST /api/config with a bearer token.
 * It is entered by the operator and kept in localStorage — never bundled, since
 * the bundle is a public file.
 */
export function getAdminToken(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    // Storage is unavailable in private browsing; the operator can still
    // re-enter the token, it just will not survive a reload.
    return '';
  }
}

export function setAdminToken(value: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // See above — losing persistence is acceptable, throwing here is not.
  }
}

/**
 * What the server said about a token.
 *
 * The two failures are kept apart because they need different words: a
 * rejected token is the operator mistyping, an unreachable server is nothing
 * to do with what they typed. Collapsing both into "wrong password" sends
 * someone hunting for a replacement for a token that was fine.
 */
export type TokenCheck = 'ok' | 'rejected' | 'unreachable';

/**
 * Asks the server whether a token is the one it was started with.
 *
 * It has to be the server that answers: it is the only party that knows
 * ADMIN_TOKEN, which is the entire point of the arrangement. The upside is
 * that this door inherits the per-IP backoff guarding the write endpoints, so
 * guessing at it is exactly as slow as guessing at those.
 *
 * The token is not stored here. A check is a question, and answering one must
 * not have the side effect of granting what was being asked about.
 */
export async function verifyAdminToken(token: string): Promise<TokenCheck> {
  if (!token) return 'rejected';
  try {
    const response = await fetch('/api/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) return 'ok';
    return response.status === 401 ? 'rejected' : 'unreachable';
  } catch {
    // Server stopped, or no network at all. Not a verdict on the token.
    return 'unreachable';
  }
}
/**
 * Forgets the token on this device.
 *
 * removeItem rather than storing an empty string: an empty value is still a
 * value, and anything that asks only whether the key is present would read it
 * as one. Nothing does today, which is the moment to make sure nothing can.
 */
export function clearAdminToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Same reasoning as setAdminToken: storage may be unavailable, and that
    // is not a reason to throw out of a click handler.
  }
}
export function authHeaders(): Record<string, string> {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/**
 * Both messages lead with what it means rather than what went wrong.
 *
 * The editor applies a change to the screen and to localStorage before it
 * reaches the server, so the new content is visible whether or not the save
 * landed. Saying only "the server refused" reads as a warning beside an edit
 * that plainly worked — and the operator moves on believing the site is
 * updated. public/config.json is what visitors are served; until the change is
 * written there it exists in one browser and nowhere else.
 */
const LOCAL_ONLY = 'Thay đổi chỉ nằm trên máy này — khách truy cập vẫn thấy nội dung cũ.';

/** Shown when the server rejects the token. */
export const UNAUTHORIZED_MESSAGE =
  `CHƯA LƯU LÊN MÁY CHỦ. ${LOCAL_ONLY}\n\n` +
  'Máy chủ từ chối token quản trị. Mở Creator Studio, điền lại ô "Token quản trị" rồi lưu lại.';

/** Shown when the save fails for any other reason: server error, server stopped, connection dropped. */
export function saveFailedMessage(detail: string): string {
  return `CHƯA LƯU LÊN MÁY CHỦ. ${LOCAL_ONLY}\n\nLý do: ${detail}`;
}
