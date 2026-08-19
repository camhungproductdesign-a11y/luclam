/**
 * Smoke-test a running deployment over HTTP.
 *
 * `npm run verify` reads the built files off disk. It cannot see anything that
 * only exists once something is serving them: status codes, cache headers,
 * whether compression is on, whether a missing URL answers 404 or quietly
 * returns the homepage with a 200. Those are exactly the ways a deploy goes
 * wrong while every file on disk is perfect.
 *
 * Point it at anything — the local preview before deploying, the live site
 * after, or a VPS while setting one up:
 *
 *   npm run smoke                              # http://localhost:4177
 *   npm run smoke -- https://gift.luclam.vn
 *   npm run smoke -- https://staging.example   # a VPS mid-setup
 *
 * Exits non-zero on failure, so a deploy script can gate the symlink swap on it.
 */
import { ALL_ROUTES } from '../src/routes';

const BASE = (process.argv[2] ?? 'http://localhost:4177').replace(/\/$/, '');

/** Where the build wrote its canonicals. A different host is a real problem. */
const BUILT_ORIGIN = 'https://gift.luclam.vn';

const failures: string[] = [];
const warnings: string[] = [];

function check(ok: boolean, message: string) {
  if (!ok) failures.push(message);
}

function warn(ok: boolean, message: string) {
  if (!ok) warnings.push(message);
}

/** Fetches in batches, so sixty routes do not open sixty sockets at once. */
async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>) {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  }
  return out;
}

async function main() {
  console.log(`Kiểm tra ${BASE}\n`);

  // ---- every generated route answers ----------------------------------
  const routes = await inBatches([...ALL_ROUTES], 8, async (r) => {
    try {
      const res = await fetch(BASE + r.path, { redirect: 'follow' });
      return { path: r.path, status: res.status };
    } catch (e) {
      return { path: r.path, status: 0 };
    }
  });

  const broken = routes.filter((r) => r.status !== 200);
  check(
    broken.length === 0,
    `${broken.length} route không trả 200: ${broken.slice(0, 5).map((b) => `${b.path} (${b.status})`).join(', ')}`
  );
  console.log(`  ${routes.length - broken.length}/${routes.length} route trả 200`);

  // ---- a missing URL must be a real 404 -------------------------------
  //
  // The failure this catches is silent: a SPA fallback answers every unknown
  // URL with index.html and a 200, so the site looks fine to a person and Google
  // indexes an unlimited number of duplicate pages. It is the single most
  // likely thing to break when moving to nginx.
  const missing = await fetch(`${BASE}/khong-ton-tai-${Date.now()}`, { redirect: 'follow' });
  check(
    missing.status === 404,
    `URL không tồn tại trả ${missing.status}, phải là 404 — đây là soft-404. ` +
      'Nếu đang thử với `vite preview` thì đó là hành vi của chính nó, không phải lỗi của site: ' +
      'nó đáp mọi URL bằng index.html. Thử trước khi deploy bằng `node dist/server.cjs`, ' +
      'đúng thứ chạy trên VPS. Trên nginx thì kiểm try_files.'
  );
  console.log(`  URL sai trả ${missing.status}`);

  // ---- the files a crawler and an assistant look for ------------------
  const [llms, sitemap, robots] = await Promise.all([
    fetch(`${BASE}/llms.txt`),
    fetch(`${BASE}/sitemap.xml`),
    fetch(`${BASE}/robots.txt`),
  ]);
  check(llms.ok, `llms.txt trả ${llms.status}`);
  check(sitemap.ok, `sitemap.xml trả ${sitemap.status}`);
  check(robots.ok, `robots.txt trả ${robots.status}`);

  const llmsText = await llms.text();
  const links = (llmsText.match(/\]\(https:\/\//g) ?? []).length;
  check(links >= 60, `llms.txt chỉ có ${links} liên kết, chờ ít nhất 60`);

  const sitemapText = await sitemap.text();
  const urls = (sitemapText.match(/<url>/g) ?? []).length;
  const images = (sitemapText.match(/<image:image>/g) ?? []).length;
  check(urls >= 10, `sitemap chỉ có ${urls} URL`);
  check(images >= 60, `sitemap chỉ có ${images} ảnh`);
  console.log(`  llms.txt ${links} liên kết · sitemap ${urls} URL, ${images} ảnh`);

  // ---- the structured data matches src/company.ts ---------------------
  const home = await (await fetch(`${BASE}/`)).text();
  const ld = [...home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  check(ld.length > 0, 'Trang chủ không có JSON-LD nào đọc được');

  const org = ld.find((b: any) => b['@type'] === 'Organization');
  check(Boolean(org), 'Không tìm thấy khối Organization');

  if (org) {
    const shops = org.location ?? [];
    check(shops.length >= 5, `Organization khai ${shops.length} cửa hàng, chờ 5`);
    const noHours = shops.filter((s: any) => !s.openingHoursSpecification);
    check(
      noHours.length === 0,
      `${noHours.length} cửa hàng thiếu giờ mở cửa: ${noHours.map((s: any) => s.name).join(', ')}`
    );
    console.log(`  Organization: ${shops.length} cửa hàng, ${shops.length - noHours.length} có giờ`);
  }

  // ---- the FAQ describes something the page shows ---------------------
  const infoPath = ALL_ROUTES.find((r) => r.lang === 'vi' && r.topic === 'info')!.path;
  const info = await (await fetch(BASE + infoPath)).text();
  const faq = [...info.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    })
    .find((b: any) => b?.['@type'] === 'FAQPage');

  check(Boolean(faq), 'Trang thông tin không có FAQPage');
  if (faq) {
    const missingFromPage = faq.mainEntity.filter((q: any) => !info.includes(q.name));
    check(
      missingFromPage.length === 0,
      `${missingFromPage.length} câu hỏi FAQ không xuất hiện trong nội dung trang`
    );
    console.log(`  FAQPage: ${faq.mainEntity.length} câu hỏi, đều có mặt trong trang`);
  }

  // ---- canonicals point where this deployment actually lives ----------
  //
  // They are absolute and baked at build time. Serving the same build from a
  // different hostname makes every page tell Google the content belongs
  // somewhere else — which is worth knowing before, not after.
  const canonical = home.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
  const canonicalOrigin = canonical ? new URL(canonical).origin : '';
  warn(
    canonicalOrigin === new URL(BASE).origin || BASE.includes('localhost'),
    `canonical trỏ về ${canonicalOrigin} nhưng đang phục vụ từ ${BASE} — build lại với đúng origin trước khi công khai`
  );

  // ---- compression -----------------------------------------------------
  const asset = home.match(/\/assets\/index-[A-Za-z0-9_-]+\.js/)?.[0];
  if (asset) {
    const res = await fetch(BASE + asset, { headers: { 'Accept-Encoding': 'gzip, br' } });
    const enc = res.headers.get('content-encoding') ?? '';
    check(
      /gzip|br/.test(enc),
      `${asset} trả về không nén (content-encoding: ${enc || 'không có'}) — bật gzip trong nginx`
    );
    const cache = res.headers.get('cache-control') ?? '';
    warn(
      /immutable|max-age=\d{6,}/.test(cache),
      `${asset} có tên chứa hash nhưng cache-control là "${cache || 'không có'}" — nên đặt immutable`
    );
    console.log(`  ${asset.split('/').pop()} nén bằng ${enc || 'không'}`);
  }

  // ---- the write API, where there is one -------------------------------
  //
  // A warning, not a failure: GitHub Pages has no Node at all, and the public
  // site is complete without it. Only Creator Studio needs this.
  // A 200 is not enough to believe. A server with an SPA fallback answers this
  // with index.html and a 200, which read as a healthy API the first time this
  // ran — the body has to actually be the JSON the endpoint returns.
  const health = await fetch(`${BASE}/api/health`).catch(() => null);
  let healthy = false;
  if (health?.ok) {
    try {
      healthy = (await health.clone().json()).status === 'ok';
    } catch {
      healthy = false;
    }
  }

  if (healthy) {
    console.log('  /api/health trả JSON ok — Creator Studio ghi được');
  } else if (health?.ok) {
    warnings.push(
      '/api/health trả 200 nhưng không phải JSON — server đang đáp mọi URL bằng trang chủ. ' +
        'Creator Studio sẽ báo lưu thành công trong khi không có gì được ghi'
    );
  } else {
    warnings.push(
      `/api/health trả ${health?.status ?? 'lỗi mạng'} — Creator Studio mở được nhưng không lưu được. ` +
        'Bình thường trên GitHub Pages; trên VPS thì kiểm systemctl status luclam'
    );
  }

  // ---- report -----------------------------------------------------------
  console.log('');
  for (const w of warnings) console.log(`  Lưu ý: ${w}`);
  if (warnings.length) console.log('');

  if (failures.length) {
    console.error(`Không đạt (${failures.length}):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log(`Đạt: ${routes.length} route, 404 thật, structured data và tệp cho crawler đầy đủ.`);
}

main().catch((e) => {
  console.error(`Không chạy được phép thử: ${e.message}`);
  console.error(`Có chắc ${BASE} đang phục vụ không?`);
  process.exit(1);
});
