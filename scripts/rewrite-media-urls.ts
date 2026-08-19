import fs from 'fs/promises';
import path from 'path';

type Credit = { originalUrl: string; localPath: string };

const CREDITS_PATH = path.join(
  process.cwd(),
  'public',
  'uploads',
  'external',
  'CREDITS.json'
);

const TARGETS = [
  path.join(process.cwd(), 'src', 'App.tsx'),
  path.join(process.cwd(), 'src', 'defaultMedia.ts'),
  path.join(process.cwd(), 'src', 'translations.ts'),
  path.join(process.cwd(), 'src', 'components', 'CreatorStudio.tsx'),
  path.join(process.cwd(), 'public', 'config.json'),
];

async function main() {
  const credits: Credit[] = JSON.parse(await fs.readFile(CREDITS_PATH, 'utf-8'));
  let total = 0;

  for (const target of TARGETS) {
    let content = await fs.readFile(target, 'utf-8');
    const before = content;
    let replaced = 0;

    for (const credit of credits) {
      if (!content.includes(credit.originalUrl)) continue;
      const occurrences = content.split(credit.originalUrl).length - 1;
      content = content.split(credit.originalUrl).join(credit.localPath);
      replaced += occurrences;
    }

    if (content !== before) {
      await fs.writeFile(target, content, 'utf-8');
    }

    total += replaced;
    console.log(`  ${path.basename(target)}: ${replaced} URL đã thay`);
  }

  console.log(`\nTổng ${total} lần thay thế từ ${credits.length} ảnh.`);

  // Anything still pointing at those two hosts had no local copy — either the
  // download failed or the source URL is dead. Name them rather than leaving
  // them to be discovered in production.
  const remaining: string[] = [];
  for (const target of TARGETS) {
    const content = await fs.readFile(target, 'utf-8');
    for (const match of content.matchAll(
      /https:\/\/(?:images\.unsplash\.com|upload\.wikimedia\.org)\/[^"'\s)\\]+/g
    )) {
      remaining.push(`${path.basename(target)}: ${match[0]}`);
    }
  }

  if (remaining.length > 0) {
    console.log(`\nCòn ${remaining.length} URL chưa thay được (không có bản local):`);
    for (const item of remaining) console.log(`  - ${item}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
