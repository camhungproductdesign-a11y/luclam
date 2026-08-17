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
