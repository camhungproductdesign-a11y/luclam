import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const UPLOADS = path.join(process.cwd(), 'public', 'uploads');
const WIDTHS = [640, 1280, 1920];
const SOURCE_PATTERN = /\.(jpe?g|png)$/i;

// Skip files that are themselves derivatives, so a second run does not
// recompress its own output.
const DERIVED_PATTERN = /-(640|1280|1920)\.(avif|webp)$/i;

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
    await sharp(sourcePath).metadata();
    return null;
  } catch (error) {
    return `sharp không đọc được: ${(error as Error).message}`;
  }
}

async function optimise(relativePath: string) {
  const sourcePath = path.join(UPLOADS, relativePath);
  const base = relativePath.replace(SOURCE_PATTERN, '');
  const meta = await sharp(sourcePath).metadata();
  const sourceWidth = meta.width ?? 0;

  let derivatives = 0;

  for (const width of WIDTHS) {
    // Never upscale past the source.
    if (sourceWidth && width > sourceWidth) continue;

    await sharp(sourcePath)
      .resize({ width })
      .avif({ quality: 55 })
      .toFile(path.join(UPLOADS, `${base}-${width}.avif`));

    await sharp(sourcePath)
      .resize({ width })
      .webp({ quality: 72 })
      .toFile(path.join(UPLOADS, `${base}-${width}.webp`));

    derivatives += 2;
  }

  // Recompress the original in place so the src fallback is light too.
  const originalSize = (await fs.stat(sourcePath)).size;
  const recompressed = await sharp(sourcePath)
    .resize({ width: Math.min(1920, sourceWidth || 1920) })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  if (recompressed.length < originalSize) {
    await fs.writeFile(sourcePath, recompressed);
  }

  const finalSize = (await fs.stat(sourcePath)).size;
  console.log(
    `  ${relativePath}: ${formatKb(originalSize)} -> ${formatKb(finalSize)}, +${derivatives} derivatives`
  );
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

  for (const relativePath of sources) {
    const failure = await readFailure(path.join(UPLOADS, relativePath));
    if (failure) {
      broken.push({ file: relativePath, reason: failure });
      console.error(`  ✗ ${relativePath}: ${failure}`);
      continue;
    }
    await optimise(relativePath);
  }

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
