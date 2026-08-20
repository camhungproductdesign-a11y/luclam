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
import { AEO_LEGACY_BLOG_PREFIX } from '../src/aeoBlog';

const BASE = (process.argv[2] ?? 'http://localhost:4177').replace(/\/$/, '');




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

  // ---- the blog, which is another server's pages wearing this domain ---
  //
  // /blog is proxied to app.aeo.how. Nothing about that is visible on disk, so
  // `npm run verify` cannot see it and this is the only place it gets checked.
  //
  // The canonical assertion is the one that matters, and it is not the same
  // question the homepage's canonical asks below. AEO builds blog canonicals
  // from its own database, not from the Host header, so a brand whose custom
  // domain has not been filled in serves perfectly good pages that all claim to
  // live at app.aeo.how. The proxy works, every status code is 200, and Google
  // hands the credit to app.aeo.how — measured on this brand before the domain
  // was declared. Asserting the negative rather than matching BASE is what lets
  // the same check run against localhost, where the canonical is correctly
  // gift.luclam.vn and a match against BASE would be wrong.
  const [blog, blogSitemap] = await Promise.all([
    fetch(`${BASE}/blog`, { redirect: 'follow' }).catch(() => null),
    fetch(`${BASE}/blog/sitemap.xml`, { redirect: 'follow' }).catch(() => null),
  ]);

  check(
    blog?.status === 200,
    `/blog trả ${blog?.status ?? 'lỗi mạng'} — proxy chưa chạy. Kiểm thứ tự middleware ` +
      'trong server.ts: proxy phải đứng trước express.static và trước catch-all 404. ' +
      'Trên GitHub Pages thì không có proxy nào cả, đây là đường chỉ VPS mới có.'
  );
  check(
    blogSitemap?.status === 200,
    `/blog/sitemap.xml trả ${blogSitemap?.status ?? 'lỗi mạng'} — crawler đọc sitemap này qua ` +
      'dòng Sitemap trong robots.txt, nên nó 404 là blog không được index'
  );

  if (blog?.status === 200) {
    const blogHtml = await blog.text();
    const blogCanonical = blogHtml.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';

    // Two things go wrong here and one assertion has to catch both, because a
    // 200 proves neither. Written the obvious way — "canonical must not say
    // app.aeo.how" — this passed against a server with no proxy at all: the SPA
    // fallback answered /blog with index.html, whose canonical is the homepage's
    // and mentions no aeo.how. Requiring /blog in the path is what separates the
    // blog answering from this site answering in its place.
    const servedByBlog = blogCanonical.includes('/blog');
    const ownsItsUrl = Boolean(blogCanonical) && !blogCanonical.includes('app.aeo.how');

    check(
      servedByBlog,
      `canonical của /blog là "${blogCanonical || 'không có'}", không trỏ vào /blog — ` +
        'đây là trang chủ của site này trả lời thay, không phải blog. Proxy chưa chạy, ' +
        'hoặc đứng sau catch-all trong server.ts. (`npm run dev` luôn trả 200 cho mọi URL, ' +
        'nên đừng tin status code ở đó.)'
    );
    check(
      ownsItsUrl,
      `canonical của /blog trỏ về "${blogCanonical || 'không có'}" — brand chưa khai custom domain ` +
        'trong AEO (Settings → Connections → Blog Domain), nên mọi bài viết đang nhường ' +
        'toàn bộ giá trị SEO cho app.aeo.how. Proxy chạy đúng cũng không cứu được chỗ này.'
    );
    console.log(`  /blog 200 · canonical ${blogCanonical || 'không có'}`);

    // Every link the blog index offers, followed. This is the check that would
    // have caught the state this site shipped in before the redirect existed:
    // /blog answered 200, the canonical named a real page, and all seventeen
    // links out of it were 404 — a crawler arrives, finds the index, and cannot
    // reach a single article. Nothing that looks only at /blog can see that.
    // Both link shapes, because AEO emits different ones depending on whether
    // the brand knows its custom domain: /blog/<article> once declared,
    // /<brand-slug>/blog/<article> before that. The first version of this
    // pattern required a segment in front of /blog/ and matched only the
    // second. When the domain was declared it silently stopped matching
    // anything — the counter vanished from the output and the check reported
    // success by finding nothing to test.
    const outbound = [...new Set(
      [...blogHtml.matchAll(/<a [^>]*href="(\/(?:[^"]*\/)?blog\/[^"#?]+)"/g)].map((m) => m[1])
    )].slice(0, 20);

    // A blog index with no links out of it is not a pass. Either AEO changed
    // its markup and this pattern needs updating, or the index really is a dead
    // end — and those two look identical from here, so both have to fail.
    check(
      outbound.length > 0,
      'Không tìm thấy link bài viết nào trên /blog để kiểm. Trang index không có ' +
        'link nào, hoặc AEO đổi cách viết href và regex trong smoke.ts đã lạc hậu — ' +
        'mở https://gift.luclam.vn/blog xem href thật đang là gì.'
    );

    if (outbound.length) {
      const results = await inBatches(outbound, 6, async (href) => {
        try {
          const r = await fetch(BASE + href, { redirect: 'follow' });
          return { href, status: r.status };
        } catch {
          return { href, status: 0 };
        }
      });
      const dead = results.filter((r) => r.status !== 200);

      // How many fail says where to look, so the message says which it is
      // rather than making the reader guess. All of them means the path is
      // wrong at this end — the prefix redirect is gone, or the proxy moved
      // below the catch-all — and no article is reachable at all. A few means
      // the path works and AEO is publishing links to pages it has not got;
      // one such topic link was 404 upstream when this check was written, on
      // app.aeo.how directly, with nothing of this site's in the way.
      const allDead = dead.length === results.length;
      check(
        dead.length === 0,
        `${dead.length}/${results.length} link bài viết trên /blog không tới nơi: ` +
          `${dead.slice(0, 3).map((d) => `${d.href} (${d.status})`).join(', ')}. ` +
          (allDead
            ? 'Không bài nào đọc được — hỏng ở phía này: kiểm redirect tiền tố và ' +
              'vị trí proxy trong server.ts.'
            : 'Phần lớn link vẫn tới nơi, nên đường đi đúng — mấy cái này hầu như ' +
              'chắc chắn 404 sẵn trên app.aeo.how. Thử curl thẳng lên đó để xác nhận ' +
              'rồi báo bên AEO, không sửa được từ repo này.')
      );
      console.log(`  ${results.length - dead.length}/${results.length} link bài viết đi tới nơi`);
    }
  }

  // ---- the redirect that keeps the old link shape alive -----------------
  //
  // Independent of what the index currently emits: once AEO knows the custom
  // domain it writes /blog/... and the prefixed shape stops appearing, so the
  // loop above would go quiet and stop proving anything. This asserts the net is
  // still there for the day the upstream reverts.
  const legacy = await fetch(`${BASE}${AEO_LEGACY_BLOG_PREFIX}/bai-viet-thu`, {
    redirect: 'manual',
  }).catch(() => null);
  check(
    legacy?.status === 301 && legacy.headers.get('location') === '/blog/bai-viet-thu',
    `${AEO_LEGACY_BLOG_PREFIX}/… trả ${legacy?.status ?? 'lỗi mạng'} tới ` +
      `"${legacy?.headers.get('location') ?? 'không có Location'}", chờ 301 tới /blog/bai-viet-thu`
  );

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
    check(
      /immutable|max-age=\d{6,}/.test(cache),
      `${asset} có tên chứa hash nhưng cache-control là "${cache || 'không có'}" — ` +
        'mỗi lượt quay lại tải lại toàn bộ JS và CSS. Kiểm handler /assets trong server.ts.'
    );

    // The inverse, and the one worth failing over. Hashed assets cached too
    // briefly cost bandwidth; HTML cached too long costs correctness — the
    // sixty pages are rewritten at the same URLs every time Creator Studio
    // publishes, so a year-long cache means an editor fixes a price and
    // returning readers keep reading the old one until 2027. Nothing sets that
    // today; this check exists so that widening the /assets rule to cover all
    // of dist fails here instead of silently in six months.
    const homeCache = (await fetch(`${BASE}/`)).headers.get('cache-control') ?? '';
    check(
      !/immutable/.test(homeCache) && !/max-age=\d{5,}/.test(homeCache),
      `Trang chủ có cache-control "${homeCache}" — HTML bị cache quá lâu. Nội dung do ` +
        'Creator Studio sửa được ghi đè lên đúng URL cũ, nên bản đã sửa sẽ không tới người đọc.'
    );
    console.log(`  ${asset.split('/').pop()} nén bằng ${enc || 'không'} · cache "${cache}"`);
    console.log(`  HTML cache "${homeCache || 'không đặt'}"`);
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
