import fs from 'fs/promises';
import { COMPANY } from '../src/company';
import path from 'path';
import { ALL_ROUTES, LANGUAGES, TOPICS } from '../src/routes';

const DIST = path.join(process.cwd(), 'dist');
const ORIGIN = 'https://gift.luclam.vn';

/**
 * Characters, not words: ja, ko, zh and zht do not put spaces between words,
 * so a word count reads every CJK page as nearly empty. The thinnest real page
 * measured 547 characters, so 400 leaves headroom without letting an empty
 * page through.
 */
const MIN_CHARS = 400;

const failures: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) failures.push(message);
}

/** Visible text only — scripts and tags stripped. */
function contentLength(html: string): number {
  const body = html.split('<body>')[1] ?? html;
  return body
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    // Strip style blocks too, or their CSS text would count as page content and
    // a nearly empty page could clear the minimum on stylesheet rules alone.
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().length;
}

function countOccurrences(haystack: string, needle: RegExp): number {
  return (haystack.match(needle) ?? []).length;
}

async function main() {
  for (const route of ALL_ROUTES) {
    const file = path.join(DIST, route.path, 'index.html');
    const label = `${route.lang}/${route.topic}`;

    let html: string;
    try {
      html = await fs.readFile(file, 'utf-8');
    } catch {
      failures.push(`${label}: thiếu trang ${route.path}`);
      continue;
    }

    // Only <link rel="alternate">, never <a hreflang> in the body nav.
    const alternates = countOccurrences(html, /<link rel="alternate" hreflang=/g);
    check(alternates === 7, `${label}: ${alternates} thẻ alternate, cần 7`);

    const canonical = countOccurrences(html, /<link rel="canonical"/g);
    check(canonical === 1, `${label}: ${canonical} canonical, cần 1`);
    check(
      html.includes(`<link rel="canonical" href="${ORIGIN}${route.path}" />`),
      `${label}: canonical không trỏ chính nó`
    );

    const chars = contentLength(html);
    check(chars >= MIN_CHARS, `${label}: chỉ ${chars} ký tự nội dung, tối thiểu ${MIN_CHARS}`);

    check(
      countOccurrences(html, /<h1[\s>]/g) === 1,
      `${label}: cần đúng 1 thẻ h1`
    );

    check(
      html.includes('id="static-content"'),
      `${label}: thiếu khối #static-content`
    );

    for (const match of html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )) {
      try {
        JSON.parse(match[1]);
      } catch (error) {
        failures.push(`${label}: JSON-LD không parse được — ${(error as Error).message}`);
        continue;
      }

      // This asserted the absence of a telephone until Lục Lam confirmed the
      // number, and it did its job — the build refused the moment one appeared.
      // Now that there is a confirmed number, absence is no longer the thing
      // worth guarding: the risk is a different number, since an assistant
      // reads whatever is here out as fact. So the rule inverts to "if a
      // telephone is present it must be the one in src/company.ts", which fails
      // just as loudly on a typo or a stale copy.
      const telephones = [...match[1].matchAll(/"telephone"\s*:\s*"([^"]*)"/g)].map((m) => m[1]);
      const wrong = telephones.filter((number) => number !== COMPANY.telephone);
      check(
        wrong.length === 0,
        `${label}: JSON-LD có số điện thoại lạ: ${wrong.join(', ')} (đúng phải là ${COMPANY.telephone})`
      );
    }
  }

  try {
    const sitemap = await fs.readFile(path.join(DIST, 'sitemap.xml'), 'utf-8');
    const locs = countOccurrences(sitemap, /<loc>/g);
    const alternates = countOccurrences(sitemap, /xhtml:link/g);
    const expected = TOPICS.length * (LANGUAGES.length + 1);

    check(locs === TOPICS.length, `sitemap: ${locs} thẻ loc, cần ${TOPICS.length}`);
    check(alternates === expected, `sitemap: ${alternates} thẻ alternate, cần ${expected}`);
  } catch {
    failures.push('sitemap: không đọc được dist/sitemap.xml');
  }

  try {
    await fs.access(path.join(DIST, '404.html'));
  } catch {
    failures.push('thiếu dist/404.html');
  }

  if (failures.length > 0) {
    console.error(`Kiểm chứng thất bại (${failures.length} lỗi):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log(
    `Kiểm chứng đạt: ${ALL_ROUTES.length} trang, mỗi trang 1 canonical tự trỏ + 7 alternate + 1 h1, ` +
      `sitemap đủ alternate, 404.html có mặt.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
