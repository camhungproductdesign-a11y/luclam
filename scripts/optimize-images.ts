import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const UPLOADS = path.join(process.cwd(), 'public', 'uploads');
// 960 sits between 640 and 1280 because that gap was costing real bytes: a
// 412px viewport at the 1.75x pixel ratio of a mid-range phone needs about
// 720px, and with nothing offered between 640 and 1200 the browser had to
// take the 1200 rung and throw away 67KB of it on the cover photograph.
const WIDTHS = [640, 960, 1280, 1920];
const SOURCE_PATTERN = /\.(jpe?g|png)$/i;
const MANIFEST = path.join(process.cwd(), 'src', 'imageDerivatives.ts');

// Skip files that are themselves derivatives, so a second run does not
// recompress its own output. Any width, because the ladder now includes each
// source's own width and those are not known ahead of time.
const DERIVED_PATTERN = /-\d+\.(avif|webp)$/i;

/**
 * The rungs to build for one source.
 *
 * The fixed ladder alone left most images without a usable derivative. These
 * sources are 960px wide, so 1280 and 1920 were skipped as upscales and only
 * 640 was ever produced — a third of the width the page can show. Serving that
 * would have traded resolution for the bytes it saved.
 *
 * Adding the source's own width gives every image one derivative that matches
 * what the original could show, so AVIF replaces JPEG at the same size rather
 * than at a smaller one.
 */
function widthsFor(sourceWidth: number): number[] {
  const rungs = WIDTHS.filter((w) => w < sourceWidth);
  if (sourceWidth) rungs.push(sourceWidth);
  return [...new Set(rungs)].sort((a, b) => a - b);
}

function formatKb(bytes: number) {
  return `${(bytes / 1024).toFixed(0)}KB`;
}

/**
 * A JPEG starts with FF D8 FF. Files that were run through a UTF-8 text
 * pipeline have every byte >= 0x80 replaced by U+FFFD (EF BF BD), which
 * destroys the image irreversibly. Detect that here so the run reports the
 * bad file by name instead of dying on the first one.
 */
async function readFailure(sourcePath: string): Promise<string | null> {
  const handle = await fs.open(sourcePath, 'r');
  try {
    const { buffer } = await handle.read(Buffer.alloc(3), 0, 3, 0);
    if (buffer[0] === 0xef && buffer[1] === 0xbf && buffer[2] === 0xbd) {
      return 'hỏng — byte đầu là U+FFFD, file đã bị xử lý như văn bản UTF-8';
    }
  } finally {
    await handle.close();
  }

  try {
    await sharp(await fs.readFile(sourcePath)).metadata();
    return null;
  } catch (error) {
    return `sharp không đọc được: ${(error as Error).message}`;
  }
}

async function optimise(relativePath: string, manifest: Record<string, number[]>) {
  const sourcePath = path.join(UPLOADS, relativePath);
  const base = relativePath.replace(SOURCE_PATTERN, '');

  // Read the bytes up front rather than letting sharp open the path itself.
  // On Windows sharp keeps a handle on a file it opened, and writing the
  // recompressed result back to that same path then fails with EUNKNOWN.
  const original = await fs.readFile(sourcePath);
  const meta = await sharp(original).metadata();
  const sourceWidth = meta.width ?? 0;

  const widths = widthsFor(sourceWidth);
  let derivatives = 0;

  for (const width of widths) {
    // rotate() with no argument applies the EXIF orientation.
    //
    // A camera records "this is portrait" as a tag rather than by storing the
    // pixels that way, and sharp drops metadata unless asked to keep it — so
    // without this the derivative comes out with the sideways pixels and no tag
    // to correct them, while the JPEG beside it still displays upright. Now
    // that <picture> offers AVIF first, that lands the wrong one on the reader.
    //
    // No image in the repo currently trips it. It is here so the next one that
    // arrives with a tag does not.
    await sharp(original)
      .rotate()
      .resize({ width })
      .avif({ quality: 55 })
      .toFile(path.join(UPLOADS, `${base}-${width}.avif`));

    await sharp(original)
      .rotate()
      .resize({ width })
      .webp({ quality: 72 })
      .toFile(path.join(UPLOADS, `${base}-${width}.webp`));

    derivatives += 2;
  }

  if (widths.length) {
    manifest[`/uploads/${relativePath.split(path.sep).join('/')}`] = widths;
  }

  // Recompress the original in place so the src fallback is light too — but
  // only a JPEG, and only into JPEG.
  //
  // This step used to run on every source and always encode JPEG, writing the
  // result back over whatever path it came from. On a PNG that produced JPEG
  // bytes inside a .png filename: transparency gone, format lying about itself.
  // It cost the two brand marks the moment this script first met them, and the
  // Xanh SM mark is nothing but a shape on a transparent ground.
  //
  // PNGs are left alone. They are here because they need an alpha channel, and
  // the AVIF and WebP derivatives above already carry one.
  const originalSize = original.length;
  const isJpeg = /\.jpe?g$/i.test(relativePath);

  if (isJpeg) {
    const recompressed = await sharp(original)
      .resize({ width: Math.min(1920, sourceWidth || 1920) })
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();

    if (recompressed.length < originalSize) {
      await fs.writeFile(sourcePath, recompressed);
    }
  }

  const finalSize = (await fs.stat(sourcePath)).size;
  console.log(
    `  ${relativePath}: ${formatKb(originalSize)} -> ${formatKb(finalSize)}, +${derivatives} derivatives`
  );
}

/**
 * Records which widths were actually written, for the markup to read.
 *
 * A <source srcset> pointing at a file that is not there is worse than no
 * <source> at all: the browser takes the first type it supports and shows a
 * broken image rather than falling through to the JPEG. Rather than infer the
 * filenames from a convention that has already proved wrong once — the fixed
 * ladder skipped every width above the source — the run writes down what it
 * produced, and the component only offers what is listed here.
 */
async function writeManifest(manifest: Record<string, number[]>) {
  const entries = Object.keys(manifest)
    .sort()
    .map((key) => `  ${JSON.stringify(key)}: [${manifest[key].join(', ')}],`)
    .join('\n');

  const body = `// Generated by scripts/optimize-images.ts — do not edit by hand.
// Regenerate with: npm run images
//
// Maps an image's public path to the widths that exist beside it as .avif and
// .webp. An image absent from this map has no derivatives and is served as-is.

export const IMAGE_DERIVATIVES: Record<string, number[]> = {
${entries}
};
`;

  await fs.writeFile(MANIFEST, body, 'utf-8');
  console.log(`Đã ghi ${Object.keys(manifest).length} mục vào src/imageDerivatives.ts`);
}

async function main() {
  const entries = (await fs.readdir(UPLOADS, { recursive: true })) as string[];
  const sources = entries.filter(
    (name) => SOURCE_PATTERN.test(name) && !DERIVED_PATTERN.test(name)
  );

  if (sources.length === 0) {
    console.log('Không tìm thấy ảnh nguồn nào trong public/uploads.');
    return;
  }

  console.log(`Đang xử lý ${sources.length} ảnh nguồn…`);

  const broken: Array<{ file: string; reason: string }> = [];
  const manifest: Record<string, number[]> = {};

  for (const relativePath of sources) {
    const failure = await readFailure(path.join(UPLOADS, relativePath));
    if (failure) {
      broken.push({ file: relativePath, reason: failure });
      console.error(`  ✗ ${relativePath}: ${failure}`);
      continue;
    }
    await optimise(relativePath, manifest);
  }

  await writeManifest(manifest);

  if (broken.length > 0) {
    console.error(
      `\n${broken.length}/${sources.length} ảnh nguồn không dùng được. ` +
        'Cần thay bằng file gốc trước khi tối ưu — nội dung đã mất, không khôi phục được từ git.'
    );
    process.exit(1);
  }

  console.log('Xong.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
