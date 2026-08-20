/**
 * Where /blog comes from, written once.
 *
 * Three files need these values and they have to agree: server.ts proxies with
 * them, server.ts redirects the old shape with them, and smoke.ts asserts that
 * redirect works. Spread across three literals, the first slug change would fix
 * two of them and leave the third quietly testing a URL nobody serves — which is
 * the same trap src/origin.ts exists to close.
 *
 * Server-side only, like origin.ts: this reads process.env and nothing in the
 * browser bundle imports it.
 */

/** The platform the articles actually live on. */
export const AEO_UPSTREAM = 'https://app.aeo.how';

/**
 * The brand's slug on AEO — the folder its blog sits in over there.
 *
 * Overridable so a staging brand can be pointed at without editing code, which
 * is the one value here that legitimately differs per deployment.
 */
export const AEO_BRAND_SLUG =
  process.env.AEO_BRAND_SLUG?.trim() || 'luclamvietnamteagiftsvietnamfoodbeverage';

/** Where this site serves the blog. Matches rewritePath declared in AEO. */
export const BLOG_PATH = '/blog';

/**
 * The prefix AEO writes into its own internal links while the brand has no
 * custom domain declared.
 *
 * With the domain declared, AEO builds links as /blog/... and this never
 * appears. Without it, every link on the blog index reads
 * /<slug>/blog/<article> — measured, seventeen of them — and on this domain
 * that path has no file, no route and no proxy mount, so it is a 404. A crawler
 * reaches the blog index and every way onward is a dead end.
 *
 * server.ts redirects this shape rather than serving it, so the site survives
 * the upstream emitting either shape. See the redirect for why 301 and not a
 * second proxy mount.
 */
export const AEO_LEGACY_BLOG_PREFIX = `/${AEO_BRAND_SLUG}${BLOG_PATH}`;
