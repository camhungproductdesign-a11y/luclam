/**
 * The public address this build will be served from.
 *
 * It was written out four times — the prerenderer, the head renderer, llms.txt
 * and the verifier each carried their own copy of the literal. That was fine
 * while GitHub Pages was the only target, and it stops being fine the moment
 * the site moves: canonicals, hreflang, og:url, every sitemap entry and every
 * llms.txt link are absolute, so serving the same build from another hostname
 * tells Google the content belongs somewhere else. Four copies is four chances
 * to change three of them.
 *
 * SITE_ORIGIN overrides it at build time:
 *
 *   SITE_ORIGIN=https://luclam.vn npm run build
 *
 * Validated, because a typo here is invisible in the output but wrong on all
 * sixty pages — a trailing slash would double every path, and a bare hostname
 * would produce "gift.luclam.vn/en/" as a relative URL that resolves against
 * whatever page a crawler read it on.
 */
const DEFAULT_ORIGIN = 'https://gift.luclam.vn';

function resolveOrigin(): string {
  const raw = process.env.SITE_ORIGIN?.trim();
  if (!raw) return DEFAULT_ORIGIN;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `SITE_ORIGIN không phải URL hợp lệ: "${raw}". Cần dạng https://ten-mien.com (không có dấu / ở cuối).`
    );
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    throw new Error(`SITE_ORIGIN phải là http hoặc https, đang là "${parsed.protocol}".`);
  }
  if (parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error(
      `SITE_ORIGIN chỉ được là gốc tên miền, không kèm đường dẫn: "${raw}". Dùng "${parsed.origin}".`
    );
  }

  return parsed.origin;
}

export const ORIGIN = resolveOrigin();
