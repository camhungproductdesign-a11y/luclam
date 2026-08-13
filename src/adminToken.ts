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

/** Message shown when the server rejects the token. */
export const UNAUTHORIZED_MESSAGE =
  'Máy chủ từ chối: token quản trị sai hoặc chưa nhập. Mở Creator Studio và điền lại ô "Token quản trị".';
