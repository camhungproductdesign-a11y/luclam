import fs from 'fs/promises';
import path from 'path';

/**
 * Bring Be Vietnam Pro in-house.
 *
 * index.css opened with `@import url('https://fonts.googleapis.com/…')`, which
 * costs more than it looks. CSS is render-blocking and an @import inside it
 * serialises: the browser fetches /assets/index.css, parses it, only then
 * discovers fonts.googleapis.com and pays a DNS + TCP + TLS handshake for it,
 * and only then discovers fonts.gstatic.com and pays a second one. Three round
 * trips before a word can be drawn, two of them to origins this site does not
 * control.
 *
 * The stronger reason is not speed. fonts.googleapis.com is blocked in mainland
 * China, and this is a six-language visitor guide that ships a Simplified
 * Chinese edition. For those readers the request does not merely arrive late,
 * it hangs until the connection times out — while holding up the stylesheet
 * that the whole page is waiting on.
 *
 * Run: npx tsx scripts/fetch-fonts.ts
 */

const FAMILY =
  'Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,900;1,400;1,600';
const CSS_URL = `https://fonts.googleapis.com/css2?family=${FAMILY}&display=swap`;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'fonts');
const CSS_OUTPUT = path.join(process.cwd(), 'src', 'fonts.css');

// Google serves woff2 only to user agents it believes support it.
const MODERN_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/131.0.0.0 Safari/537.36';

/**
 * Which subsets to keep.
 *
 * Google's CSS declares one @font-face per subset per variant, each guarded by
 * a unicode-range, so a browser downloads only the subsets a page actually
 * uses. Cyrillic and Greek are never used here — no page contains those
 * characters — so they are dropped rather than shipped and ignored.
 */
const KEEP_SUBSETS = new Set(['latin', 'latin-ext', 'vietnamese']);

type Face = { block: string; subset: string; url: string };

async function main() {
  const response = await fetch(CSS_URL, { headers: { 'User-Agent': MODERN_UA } });
  if (!response.ok) throw new Error(`Google Fonts trả về HTTP ${response.status}`);
  const css = await response.text();

  // Each @font-face is preceded by a /* subset */ comment.
  const faces: Face[] = [];
  const blocks = css.split('/*').slice(1);
  for (const chunk of blocks) {
    const subset = chunk.slice(0, chunk.indexOf('*/')).trim();
    const body = chunk.slice(chunk.indexOf('*/') + 2);
    const url = (body.match(/url\((https:\/\/[^)]+\.woff2)\)/) ?? [])[1];
    if (!url) continue;
    faces.push({ block: body.trim(), subset, url });
  }

  console.log(`Google Fonts khai báo ${faces.length} @font-face.`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const kept: string[] = [];
  let bytes = 0;
  let dropped = 0;

  for (const face of faces) {
    if (!KEEP_SUBSETS.has(face.subset)) {
      dropped++;
      continue;
    }

    const fileName = `${path.basename(new URL(face.url).pathname)}`;
    const target = path.join(OUTPUT_DIR, fileName);

    const file = await fetch(face.url, { headers: { 'User-Agent': MODERN_UA } });
    if (!file.ok) throw new Error(`${fileName}: HTTP ${file.status}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(target, buffer);
    bytes += buffer.length;

    kept.push(face.block.replace(face.url, `/fonts/${fileName}`));
    console.log(`  ✓ ${face.subset.padEnd(10)} ${fileName}  ${(buffer.length / 1024).toFixed(0)}KB`);
  }

  const header = `/* Sinh bởi scripts/fetch-fonts.ts — đừng sửa tay.
 *
 * Be Vietnam Pro, phục vụ từ chính domain này thay vì fonts.gstatic.com.
 * Lý do đầy đủ nằm trong scripts/fetch-fonts.ts; tóm tắt: @import từ
 * fonts.googleapis.com bắt trình duyệt đi ba vòng tuần tự trước khi vẽ được
 * chữ, và Google Fonts bị chặn ở Trung Quốc đại lục — nơi bản tiếng Trung
 * giản thể của trang này hướng tới.
 *
 * unicode-range giữ nguyên: trình duyệt chỉ tải subset mà trang thực sự dùng,
 * nên trang tiếng Việt không kéo về latin-ext và ngược lại.
 */

`;

  await fs.writeFile(CSS_OUTPUT, header + kept.join('\n\n') + '\n', 'utf-8');

  console.log(
    `\n${kept.length} @font-face → src/fonts.css, ${(bytes / 1024).toFixed(0)}KB vào public/fonts/` +
      ` (bỏ ${dropped} face thuộc subset không dùng).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});