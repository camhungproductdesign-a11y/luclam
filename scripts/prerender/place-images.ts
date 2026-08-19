import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { type Language } from '../../src/translations';
import { type Topic } from '../../src/routes';
import { defaultMedia } from '../../src/defaultMedia';
import { creditFor } from '../../src/mediaCredits';

export type PlaceImage = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
};

/**
 * The images a topic's page shows, resolved the way the app resolves them.
 *
 * They were absent from the generated HTML entirely: render-content walks
 * translations.ts, and images live in defaultMedia and config.json instead. So
 * every photograph on this site was drawn by React after the crawler had read
 * the page and left — fifty-two of them, credited and derived to AVIF, that
 * Google had never seen. For a travel guide that closes Google Images off
 * completely.
 */
const overrides: Record<string, { img?: string }> = (() => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'config.json'), 'utf-8'))
      .customMedia ?? {};
  } catch {
    return {};
  }
})();

// Same rule as getPlaceMedia in the app: an empty override means "not set".
const imageFor = (id: string): string =>
  overrides[id]?.img || (defaultMedia as any)[id]?.img || '';

const dimensions = new Map<string, { width: number; height: number }>();

async function measure(src: string) {
  if (dimensions.has(src)) return dimensions.get(src)!;
  const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
  const meta = await sharp(await fs.promises.readFile(file)).metadata();
  const size = { width: meta.width ?? 0, height: meta.height ?? 0 };
  dimensions.set(src, size);
  return size;
}

/**
 * Every place on a topic, as id and the name to describe its picture with.
 *
 * `img` is set only where the item carries its own picture rather than getting
 * one through defaultMedia. The five teas are the case: the app reads
 * `item.image` straight off the resolved translations for them and uses the
 * place id only to find the product video. Routing them through defaultMedia
 * here found nothing, so the six Lục Lam pages — the only pages that sell
 * anything — went out with no <img> at all and no sitemap entry, while
 * Product.image pointed at a CDN on another hostname.
 */
function placesOn(topic: Topic, t: any): Array<{ id: string; name: string; img?: string }> {
  switch (topic) {
    case 'food':
      return (t.food?.categories ?? []).flatMap((c: any, ci: number) =>
        (c.restaurants ?? []).map((r: any, ri: number) => ({ id: `food-${ci}-${ri}`, name: r.name }))
      );
    case 'culture':
      return (t.culture?.items ?? []).map((it: any, i: number) => ({ id: `culture-${i}`, name: it.name }));
    case 'shopping':
      return (t.shopping?.items ?? []).map((it: any, i: number) => ({ id: `shopping-${i}`, name: it.name }));
    case 'stay':
      return (t.stay?.categories ?? []).map((c: any, i: number) => ({ id: `stay-${i}`, name: c.title }));
    case 'luclam':
      return (t.luclam?.menuItems ?? []).map((it: any, i: number) => ({
        id: `luclam-${i}`,
        name: it.name,
        img: it.image,
      }));
    default:
      return [];
  }
}

export async function imagesFor(
  _lang: Language,
  topic: Topic,
  t: any
): Promise<PlaceImage[]> {
  const out: PlaceImage[] = [];

  for (const place of placesOn(topic, t)) {
    const src = place.img || imageFor(place.id);
    // Only what is served from here: a hotlink in the markup would hand a third
    // party a say in whether this page renders.
    if (!src.startsWith('/uploads/')) continue;

    const file = path.join(process.cwd(), 'public', src.replace(/^\//, ''));
    if (!fs.existsSync(file)) continue;

    const { width, height } = await measure(src);
    out.push({
      src,
      // The place is the subject; saying so is the whole point of alt text, and
      // it is what the app's shared strings like "Wellness illustration" never
      // did.
      alt: place.name,
      caption: place.name,
      credit: creditFor(src) ?? '',
      width,
      height,
    });
  }

  return out;
}
