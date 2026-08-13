import fs from 'fs/promises';
import path from 'path';
import { ALL_ROUTES, pathFor, HTML_LANG, LANGUAGES, TOPICS, type Topic } from '../../src/routes';
import type { Language } from '../../src/translations';
import { renderContent } from './render-content';
import { renderHead, type Assets } from './render-head';

const DIST = path.join(process.cwd(), 'dist');
const ORIGIN = 'https://gift.luclam.vn';

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
        font-family: Georgia, "Times New Roman", serif;
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

async function writeSitemap(): Promise<number> {
  // One <url> per topic, with the six languages as alternates. Listing every
  // language as its own <url> would repeat the same alternate set six times.
  const entries = TOPICS.map((topic: Topic) => {
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
${xDefault}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  await fs.writeFile(path.join(DIST, 'sitemap.xml'), xml, 'utf-8');
  return entries.length;
}

async function main() {
  // Read before the loop: the root route overwrites dist/index.html.
  const assets = await readAssets();
  let written = 0;

  for (const route of ALL_ROUTES) {
    const head = renderHead(route.lang, route.topic, assets);
    const body = renderContent(route.lang, route.topic);
    const html = renderPage(route.lang, head, body, assets.scripts);

    const outputDir = path.join(DIST, route.path);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, 'index.html'), html, 'utf-8');
    written += 1;
  }

  const sitemapEntries = await writeSitemap();

  // GitHub Pages serves 404.html for paths that match no file. Ship the
  // Vietnamese homepage there so the SPA can still boot and route.
  await fs.copyFile(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));

  console.log(
    `Đã sinh ${written} trang, sitemap.xml (${sitemapEntries} URL + alternates) và 404.html`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
