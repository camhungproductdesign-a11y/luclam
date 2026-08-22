import fs from 'fs/promises';
import path from 'path';
import { getEmbedDetails } from '../src/videoEmbed';

/**
 * Fill in what can be fetched about each attached video, and say what cannot.
 *
 * VideoObject needs three things Google treats as required: name, thumbnailUrl
 * and uploadDate. oEmbed gives the first two for both YouTube and TikTok, from
 * a public endpoint that needs no key. It does not give the third — neither
 * provider returns an upload date there — so uploadDate is left blank and
 * filled by hand, exactly as CREDITS.json attribution is.
 *
 * Nothing here overwrites a value already present. A run after someone has
 * typed the dates in must not wipe them, which is the same rule
 * fetch-external-media follows for licence records and for the same reason: the
 * hand-entered part is the part that cannot be recovered.
 */

const CONFIG = path.join(process.cwd(), 'public', 'config.json');
const OUT = path.join(process.cwd(), 'public', 'videos.json');

const UA =
  'LucLamSiteBuild/1.0 (https://gift.luclam.vn; contact via https://www.facebook.com/luclamartoftea)';

type Record_ = { name?: string; thumbnailUrl?: string; uploadDate?: string; description?: string };

const readJson = async <T,>(file: string, fallback: T): Promise<T> => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf-8')) as T;
  } catch {
    return fallback;
  }
};

const oembedFor = (url: string): string | null => {
  const details = getEmbedDetails(url);
  if (details.type === 'youtube') {
    return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  }
  if (details.type === 'tiktok') {
    return `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
  }
  return null;
};

async function main() {
  const config = await readJson<any>(CONFIG, {});
  const previous = await readJson<Record<string, Record_>>(OUT, {});

  const urls = new Set<string>();
  for (const entry of Object.values<any>(config.customMedia ?? {})) {
    const url = (entry?.video ?? '').trim();
    if (!url) continue;
    const type = getEmbedDetails(url).type;
    // A direct file is played by a <video> the prerenderer does not emit, so
    // there is nothing on the page for a record to describe.
    if (type === 'youtube' || type === 'tiktok') urls.add(url);
  }

  if (urls.size === 0) {
    console.log('Không có video nào được gán trong public/config.json.');
    return;
  }

  const merged: Record<string, Record_> = { ...previous };
  let fetched = 0;
  const failed: string[] = [];

  for (const url of urls) {
    const endpoint = oembedFor(url);
    if (!endpoint) continue;

    const carried = merged[url] ?? {};
    try {
      const response = await fetch(endpoint, { headers: { 'User-Agent': UA } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: any = await response.json();

      merged[url] = {
        // Kept if already present: a hand-written name is usually better than
        // the uploader's, and this must never undo an edit.
        name: carried.name || data.title || '',
        thumbnailUrl: carried.thumbnailUrl || data.thumbnail_url || '',
        // Never touched. oEmbed does not carry it and this is the field a
        // person fills.
        uploadDate: carried.uploadDate ?? '',
        description: carried.description ?? '',
      };
      fetched += 1;
      console.log(`  ✓ ${url}\n      ${merged[url].name}`);
    } catch (error) {
      merged[url] = {
        name: carried.name ?? '',
        thumbnailUrl: carried.thumbnailUrl ?? '',
        uploadDate: carried.uploadDate ?? '',
        description: carried.description ?? '',
      };
      failed.push(`${url} (${(error as Error).message})`);
      console.error(`  ✗ ${url}\n      ${(error as Error).message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  await fs.writeFile(OUT, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8');

  const missingDate = Object.entries(merged).filter(([, r]) => !r.uploadDate);
  console.log(`\npublic/videos.json: ${Object.keys(merged).length} bản ghi (${fetched} lấy được lần này).`);

  if (missingDate.length > 0) {
    console.log(
      `\n${missingDate.length} bản ghi còn trống "uploadDate" — VideoObject bắt buộc trường này,\n` +
        'và không nguồn nào trả về nó, nên phải điền tay theo dạng YYYY-MM-DD:'
    );
    for (const [url] of missingDate) console.log(`  - ${url}`);
    console.log('\nChừng nào còn trống, prerender sẽ bỏ qua video đó thay vì sinh markup không hợp lệ.');
  }

  if (failed.length > 0) {
    console.error(`\n${failed.length} video không lấy được metadata:`);
    for (const item of failed) console.error(`  - ${item}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
