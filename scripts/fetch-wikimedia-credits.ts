/**
 * Fills in licence and attribution for the Wikimedia images by asking the
 * Commons API. CC BY-SA obliges us to credit the author wherever the image
 * appears, and that obligation follows the image rather than the host — so
 * self-hosting the file does not remove it.
 */
import fs from 'fs/promises';
import path from 'path';

const CREDITS_PATH = path.join(
  process.cwd(),
  'public',
  'uploads',
  'external',
  'CREDITS.json'
);

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT =
  'LucLamSiteBuild/1.0 (https://gift.luclam.vn; contact via https://www.facebook.com/luclamartoftea)';

type Credit = {
  originalUrl: string;
  localPath: string;
  host: string;
  license: string;
  attribution: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Strip HTML that Commons returns inside extmetadata values. */
function plain(value: string): string {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Name.jpg/960px-Name.jpg
 * https://upload.wikimedia.org/wikipedia/commons/4/45/Name.jpg
 * Both carry the canonical file name in the segment after the two hash dirs.
 */
function fileTitleFrom(url: string): string | null {
  const withoutQuery = url.split('?')[0];
  const thumb = withoutQuery.match(/\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//);
  if (thumb) return decodeURIComponent(thumb[1]);

  const direct = withoutQuery.match(/\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)$/);
  if (direct) return decodeURIComponent(direct[1]);

  return null;
}

async function lookup(title: string) {
  const url = `${API}?action=query&prop=imageinfo&iiprop=extmetadata&titles=${encodeURIComponent(
    `File:${title}`
  )}&format=json&origin=*`;

  const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = (await response.json()) as {
    query?: { pages?: Record<string, { imageinfo?: Array<{ extmetadata?: Record<string, { value: string }> }> }> };
  };

  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0];
  const meta = page?.imageinfo?.[0]?.extmetadata;
  if (!meta) return null;

  return {
    artist: meta.Artist ? plain(meta.Artist.value) : '',
    licenseName: meta.LicenseShortName ? plain(meta.LicenseShortName.value) : '',
    licenseUrl: meta.LicenseUrl ? plain(meta.LicenseUrl.value) : '',
    credit: meta.Credit ? plain(meta.Credit.value) : '',
  };
}

async function main() {
  const credits: Credit[] = JSON.parse(await fs.readFile(CREDITS_PATH, 'utf-8'));
  const targets = credits.filter(
    (credit) => credit.host === 'upload.wikimedia.org' && !credit.attribution
  );

  console.log(`Tra cứu ${targets.length} ảnh Wikimedia trên Commons API…\n`);

  let filled = 0;
  const unresolved: string[] = [];

  for (const credit of targets) {
    const title = fileTitleFrom(credit.originalUrl);
    if (!title) {
      unresolved.push(`${credit.localPath}: không tách được tên file từ URL`);
      continue;
    }

    try {
      const info = await lookup(title);
      if (!info || (!info.artist && !info.licenseName)) {
        unresolved.push(`${credit.localPath}: Commons không trả về metadata cho "${title}"`);
        continue;
      }

      const author = info.artist || 'Không rõ tác giả';
      const license = info.licenseName || 'xem trang Commons';

      credit.license = info.licenseUrl ? `${license} (${info.licenseUrl})` : license;
      credit.attribution = `Ảnh: ${author} — ${license}, qua Wikimedia Commons`;
      filled += 1;

      console.log(`  ✓ ${title}\n      ${credit.attribution}`);
    } catch (error) {
      unresolved.push(`${credit.localPath}: ${(error as Error).message}`);
    }

    await sleep(300);
  }

  await fs.writeFile(CREDITS_PATH, `${JSON.stringify(credits, null, 2)}\n`, 'utf-8');

  console.log(`\nĐã điền ${filled}/${targets.length} bản ghi.`);
  if (unresolved.length > 0) {
    console.log('\nCần điền tay:');
    for (const item of unresolved) console.log(`  - ${item}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
