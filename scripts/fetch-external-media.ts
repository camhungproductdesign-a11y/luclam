import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'external');
const CREDITS_PATH = path.join(OUTPUT_DIR, 'CREDITS.json');

const SOURCES = [
  path.join(process.cwd(), 'src', 'App.tsx'),
  path.join(process.cwd(), 'src', 'defaultMedia.ts'),
  path.join(process.cwd(), 'src', 'translations.ts'),
  path.join(process.cwd(), 'src', 'components', 'CreatorStudio.tsx'),
  path.join(process.cwd(), 'public', 'config.json'),
];

/**
 * cdn.hstatic.net is Lục Lam's own Haravan store, which is why it was left
 * hotlinked at first: hosting someone else's bandwidth is the usual reason to
 * vendor, and that reason did not apply.
 *
 * It applies for a different reason. Those five URLs are the tea product
 * photographs, and while they live off-domain they cannot go in this site's
 * image sitemap, they never reach the prerendered HTML — the product pages
 * carried zero <img> tags — and Product.image points a crawler at a hostname
 * that is not this site. Google credits the images to the CDN and this site
 * gets nothing for its only commercial pages.
 *
 * assets.mixkit.co still stays hotlinked: those are videos, far too heavy to
 * vendor, and video files earn none of the above.
 */
const TARGET_HOSTS =
  /https:\/\/(?:images\.unsplash\.com|upload\.wikimedia\.org|cdn\.hstatic\.net)\/[^"'\s)\\]+/g;

// Wikimedia blocks requests without a descriptive User-Agent.
const USER_AGENT =
  'LucLamSiteBuild/1.0 (https://gift.luclam.vn; contact via https://www.facebook.com/luclamartoftea)';

type Credit = {
  originalUrl: string;
  localPath: string;
  host: string;
  license: string;
  attribution: string;
};

function fileNameFor(url: string): string {
  const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 12);
  const withoutQuery = url.split('?')[0];
  const match = withoutQuery.match(/\.(jpe?g|png|webp|avif|gif)$/i);
  const extension = match ? match[0].toLowerCase() : '.jpg';
  return `${hash}${extension}`;
}

function licenseFor(host: string): string {
  // Lục Lam's own product photographs, from Lục Lam's own store.
  if (host === 'cdn.hstatic.net') {
    return 'Ảnh sản phẩm của Lục Lam — tài sản của công ty, tự do dùng trên site này';
  }
  if (host === 'images.unsplash.com') {
    return 'Unsplash License — dùng được cho mục đích thương mại, không bắt buộc ghi nguồn nhưng nên có';
  }
  return 'CẦN ĐIỀN — mở trang mô tả trên Wikimedia Commons để lấy giấy phép chính xác';
}

function attributionFor(host: string): string {
  if (host === 'cdn.hstatic.net') return 'Ảnh: Lục Lam';
  if (host === 'images.unsplash.com') return 'Ảnh: Unsplash';
  return '';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wikimedia rate-limits bulk fetches and answers 429. Space the requests out
 * and back off when told to, rather than hammering a free service.
 */
async function download(url: string, attempt = 1): Promise<Buffer> {
  const MAX_ATTEMPTS = 4;
  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });

  if (response.status === 429 && attempt < MAX_ATTEMPTS) {
    const retryAfter = Number(response.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 2000 * 2 ** (attempt - 1);
    console.log(`      429, chờ ${(waitMs / 1000).toFixed(0)}s rồi thử lại (lần ${attempt + 1})`);
    await sleep(waitMs);
    return download(url, attempt + 1);
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const urls = new Set<string>();
  for (const source of SOURCES) {
    let content: string;
    try {
      content = await fs.readFile(source, 'utf-8');
    } catch {
      console.warn(`  bỏ qua ${path.basename(source)} (không đọc được)`);
      continue;
    }
    for (const match of content.matchAll(TARGET_HOSTS)) urls.add(match[0]);
  }

  console.log(`Tìm thấy ${urls.size} URL cần kéo về.\n`);

  // Keep any credits already filled in by hand across re-runs.
  let existing: Credit[] = [];
  try {
    existing = JSON.parse(await fs.readFile(CREDITS_PATH, 'utf-8'));
  } catch {
    // First run.
  }
  const previous = new Map(existing.map((credit) => [credit.originalUrl, credit]));

  const credits: Credit[] = [];
  const failed: Array<{ url: string; reason: string }> = [];

  for (const url of urls) {
    const host = new URL(url).host;
    const fileName = fileNameFor(url);
    const target = path.join(OUTPUT_DIR, fileName);

    try {
      const buffer = await download(url);
      if (buffer.length === 0) throw new Error('phản hồi rỗng');

      await fs.writeFile(target, buffer);

      const carried = previous.get(url);
      credits.push({
        originalUrl: url,
        localPath: `/uploads/external/${fileName}`,
        host,
        license: carried?.license || licenseFor(host),
        attribution: carried?.attribution || attributionFor(host),
      });

      console.log(`  ✓ ${fileName}  ${(buffer.length / 1024).toFixed(0)}KB  ${host}`);
    } catch (error) {
      failed.push({ url, reason: (error as Error).message });
      console.error(`  ✗ ${url}\n      ${(error as Error).message}`);
    }

    // Be a polite client to two free services.
    await sleep(400);
  }

  // Merge, never replace. Once the sources have been rewritten to local paths
  // a later run finds fewer URLs, and rebuilding the file from scratch would
  // silently drop the licence record for everything already fetched — which is
  // the part that actually matters legally.
  const merged = new Map(previous);
  for (const credit of credits) merged.set(credit.originalUrl, credit);

  const all = [...merged.values()].sort((a, b) => a.localPath.localeCompare(b.localPath));
  await fs.writeFile(CREDITS_PATH, `${JSON.stringify(all, null, 2)}\n`, 'utf-8');
  console.log(`CREDITS.json: ${all.length} bản ghi (${credits.length} mới/cập nhật lần này)`);

  const needsAttribution = all.filter((credit) => !credit.attribution).length;

  console.log(`\nĐã tải ${credits.length}/${urls.size} ảnh.`);
  if (needsAttribution > 0) {
    console.log(
      `${needsAttribution} mục còn trống trường "attribution" trong CREDITS.json — ` +
        'ảnh Wikimedia bắt buộc ghi nguồn, cần điền tay từ trang mô tả trên Commons.'
    );
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} URL hỏng ở nguồn, cần thay ảnh khác:`);
    for (const item of failed) console.error(`  - ${item.url} (${item.reason})`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
