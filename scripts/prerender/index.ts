import fs from 'fs/promises';
import { renderLlmsTxt, llmsStats } from './llms';
import path from 'path';
import { ALL_ROUTES, pathFor, HTML_LANG, LANGUAGES, TOPICS, type Topic } from '../../src/routes';
import type { Language } from '../../src/translations';
import { renderContent } from './render-content';
import { renderHead, type Assets } from './render-head';
import { resolveAllLanguages, type Overrides } from '../../src/resolveContent';
import { imagesFor, type PlaceImage } from './place-images';

const DIST = path.join(process.cwd(), 'dist');
import { ORIGIN } from '../../src/origin';

/** Read the hashed asset paths out of the index.html Vite just produced. */
async function readAssets(): Promise<Assets> {
  const html = await fs.readFile(path.join(DIST, 'index.html'), 'utf-8');

  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const stylesheets = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
    (m) => m[1]
  );

  if (scripts.length === 0) {
    throw new Error('Không tìm thấy thẻ script nào trong dist/index.html — vite build hỏng?');
  }

  return { scripts, stylesheets };
}

/**
 * The static block exists for crawlers that do not run JavaScript. It carries no
 * CSS classes, so leaving it visible meant the first paint was a wall of unstyled
 * text until the 532KB bundle mounted — about a second that reads as "the CSS
 * failed to load". Hiding it and painting a branded splash instead removes that
 * without taking the content out of the HTML.
 *
 * This is progressive enhancement rather than cloaking: both the static block and
 * the React tree are generated from the same translations, so a crawler and a
 * reader end up with the same content.
 */
const BOOT_STYLES = `<style>
      #static-content { display: none; }
      #app-splash {
        position: fixed; inset: 0; z-index: 9999;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 14px; background: #0b1513;
      }
      #app-splash .wordmark {
        /* A system stack, not Be Vietnam Pro: the splash paints before any
           webfont has arrived, so naming one here would show nothing until it
           landed. These are sans faces already installed on the reader's
           device, which is what keeps the first frame sans too. */
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        font-size: 22px; font-weight: 700; letter-spacing: 0.22em; color: #d16b4c;
      }
      #app-splash .bar {
        width: 56px; height: 2px; background: #d16b4c; opacity: 0.35;
        animation: app-splash-pulse 1.1s ease-in-out infinite;
      }
      @keyframes app-splash-pulse {
        0%, 100% { opacity: 0.2; transform: scaleX(0.6); }
        50%      { opacity: 0.7; transform: scaleX(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        #app-splash .bar { animation: none; opacity: 0.45; }
      }
    </style>
    <noscript><style>
      #static-content { display: block; }
      #app-splash { display: none; }
    </style></noscript>`;

function renderPage(lang: Language, head: string, body: string, scripts: string[]): string {
  const scriptTags = scripts
    .map((src) => `<script type="module" crossorigin src="${src}"></script>`)
    .join('\n    ');

  return `<!doctype html>
<html lang="${HTML_LANG[lang]}">
  <head>
    ${head}
    ${BOOT_STYLES}
  </head>
  <body>
    <div id="root">
      <div id="app-splash" aria-hidden="true">
        <span class="wordmark">LỤC LAM</span>
        <span class="bar"></span>
      </div>
    </div>
    <div id="static-content">
${body}
    </div>
    <script>
      // The splash covers the viewport, so a bundle that never mounts would leave
      // the page permanently blank. If React has not taken over in time, drop the
      // splash and fall back to the static content rather than showing nothing.
      setTimeout(function () {
        var splash = document.getElementById('app-splash');
        if (!splash) return;
        splash.remove();
        var fallback = document.getElementById('static-content');
        if (fallback) fallback.style.display = 'block';
      }, 8000);
    </script>
    ${scriptTags}
  </body>
</html>
`;
}

async function writeSitemap(imagesByTopic: Map<Topic, PlaceImage[]>): Promise<{ urls: number; images: number }> {
  let imageCount = 0;

  // One <url> per topic, with the six languages as alternates. Listing every
  // language as its own <url> would repeat the same alternate set six times.
  const entries = TOPICS.map((topic: Topic) => {
    // The photographs on that topic, declared for Google Images. A picture in
    // the markup is discoverable; one named here is discoverable without
    // waiting for the page to be crawled, and carries its caption with it.
    const images = imagesByTopic.get(topic) ?? [];
    imageCount += images.length;

    const imageTags = images
      .map(
        (image) =>
          `      <image:image>\n` +
          `        <image:loc>${ORIGIN}${image.src}</image:loc>\n` +
          `        <image:title>${escapeXml(image.alt)}</image:title>\n` +
          `      </image:image>`
      )
      .join('\n');

    const alternates = LANGUAGES.map(
      (lang) =>
        `      <xhtml:link rel="alternate" hreflang="${HTML_LANG[lang]}" href="${ORIGIN}${pathFor(
          lang,
          topic
        )}" />`
    ).join('\n');

    const xDefault = `      <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(
      'en',
      topic
    )}" />`;

    return `  <url>
    <loc>${ORIGIN}${pathFor('vi', topic)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${topic === 'cover' ? '1.0' : '0.8'}</priority>
${alternates}
${xDefault}${imageTags ? `\n${imageTags}` : ''}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
  return { urls: entries.length, images: imageCount };
}

/** Sitemap values are XML text, not HTML — escapeHtml would leave a bare &. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * The editor's overrides, as Creator Studio last wrote them.
 *
 * These pages used to be generated from translations.ts alone, so an edit
 * reached readers — who run the app, which fetches this file — and never
 * reached crawlers, who read the HTML. A price changed in Creator Studio
 * stayed old in the Product JSON-LD for as long as nobody noticed.
 *
 * A missing or unreadable file is not an error: a fresh checkout has no
 * overrides, and the generated pages are simply the translations as written.
 * A malformed one is worth saying out loud, though — silently ignoring it
 * would ship a build that quietly drops every edit.
 */
async function loadOverrides(): Promise<Overrides> {
  const configPath = path.join(process.cwd(), 'public', 'config.json');
  let raw: string;
  try {
    raw = await fs.readFile(configPath, 'utf-8');
  } catch {
    console.log('Không có public/config.json — sinh trang từ bản dịch gốc.');
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    const overrides = (parsed?.overrides ?? {}) as Overrides;
    const langs = Object.keys(overrides);
    console.log(
      langs.length
        ? `Đã nạp override từ public/config.json cho: ${langs.join(', ')}`
        : 'public/config.json không có override nào.'
    );
    return overrides;
  } catch (e) {
    throw new Error(
      `public/config.json không phải JSON hợp lệ, nên build sẽ bỏ mất mọi chỉnh sửa: ${
        e instanceof Error ? e.message : String(e)
      }`
    );
  }
}

async function main() {
  // Read before the loop: the root route overwrites dist/index.html.
  const assets = await readAssets();
  const resolved = resolveAllLanguages(await loadOverrides());
  let written = 0;

  let withImages = 0;
  // The sitemap names each image once per topic, so keep one language's set —
  // the files are the same whichever page shows them.
  const imagesByTopic = new Map<Topic, PlaceImage[]>();

  for (const route of ALL_ROUTES) {
    const images = await imagesFor(route.lang, route.topic, resolved[route.lang]);
    if (images.length) withImages += images.length;
    if (route.lang === 'en' && images.length) imagesByTopic.set(route.topic, images);

    const head = renderHead(route.lang, route.topic, assets, resolved);
    const body = renderContent(route.lang, route.topic, resolved, images);
    const html = renderPage(route.lang, head, body, assets.scripts);

    const outputDir = path.join(DIST, route.path);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf-8');
    written += 1;
  }

  const sitemap = await writeSitemap(imagesByTopic);

  // sitemap.xml is for crawlers; llms.txt is the same map written for an
  // assistant, which will not fetch sixty pages to find the one that answers a
  // question. See ./llms.ts.
  //
  // Written to public/ as well as dist/, and that is not belt and braces. The
  // dev server does not serve dist/, so /llms.txt there fell through to the SPA
  // fallback and answered 200 with a page of HTML — which is worse than a 404,
  // because a tool fetching it gets a valid response containing no H1 and no
  // links and reports the file as malformed rather than missing. public/ is
  // served verbatim in dev and copied into dist/ by vite build, so one file now
  // answers the same way in both. dist/ is still written directly because the
  // prerender runs after vite build, so that copy has already happened.
  const llms = renderLlmsTxt(resolved);
  await fs.writeFile(path.join(process.cwd(), 'public', 'llms.txt'), llms, 'utf-8');
  await fs.writeFile(path.join(DIST, 'llms.txt'), llms, 'utf-8');
  const llmsInfo = llmsStats(llms);

  // GitHub Pages serves 404.html for paths that match no file. Ship the
  // Vietnamese homepage there so the SPA can still boot and route.
  await fs.copyFile(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));

  console.log(
    `Đã sinh ${written} trang, ${withImages} thẻ ảnh, sitemap.xml (${sitemap.urls} URL + alternates, ${sitemap.images} ảnh), ` +
      `llms.txt (${llmsInfo.links} liên kết, ${(llmsInfo.bytes / 1024).toFixed(1)}KB) và 404.html`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
