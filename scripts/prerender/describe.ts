import { type Language } from '../../src/translations';
import { type Topic } from '../../src/routes';

/**
 * The meta description for one page, built from what that page actually holds.
 *
 * Every description used to be `${t.pages[topic]} — ${t.subtitle}`, which gave
 * "Legends Food — Saigon strolls & exclusive hospitality guide" on the food
 * page and the same tail on all sixty. Measured, they averaged 35 characters
 * against the ~155 a search result shows, and none of them named a single
 * thing on the page they described.
 *
 * Naming the actual restaurants, districts and landmarks is what makes the
 * snippet worth clicking, and it is also what an assistant reads when it
 * summarises the page. Building them from the data rather than writing sixty
 * strings by hand means they cannot drift out of date when the content changes,
 * and they arrive translated because the data already is.
 */

const LIMIT = 158;

/** Cut on a word boundary rather than mid-word, and only when over the limit. */
function clamp(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= LIMIT) return clean;

  const cut = clean.slice(0, LIMIT);
  // CJK has no spaces to cut at, so fall back to a hard cut for those.
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > LIMIT * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;–—-]\s*$/, '')}…`;
}

/** A few real names, as many as fit comfortably. */
function names(list: unknown[], take: number, pick: (item: any) => string): string {
  return list
    .slice(0, take)
    .map((item) => pick(item))
    .filter(Boolean)
    .join(', ');
}

export function describe(_lang: Language, topic: Topic, t: any): string {
  const lead = topic === 'cover' ? t.subtitle : `${t.pages[topic]} — ${t.title}.`;

  switch (topic) {
    case 'cover':
      return clamp(`${t.subtitle}. ${t.welcome?.p1 ?? ''}`);

    case 'welcome':
      return clamp(`${lead} ${t.welcome?.p1 ?? ''}`);

    case 'atmosphere':
      return clamp(
        `${lead} ${names(t.atmosphere?.districts ?? [], 3, (d) => d.name)}. ${t.atmosphere?.description ?? ''}`
      );

    case 'transport': {
      const modes = names(t.transport?.options ?? [], 4, (o) => String(o.name).replace(/\s*\(.*\)\s*$/, ''));
      return clamp(`${lead} ${modes}. ${t.transport?.intro ?? ''}`);
    }

    case 'stay':
      return clamp(`${lead} ${names(t.stay?.categories ?? [], 3, (c) => c.title)}. ${t.stay?.intro ?? ''}`);

    case 'food': {
      const cats = names(t.food?.categories ?? [], 5, (c) => c.title);
      const first = t.food?.categories?.[0]?.restaurants ?? [];
      const shops = names(first, 2, (r) => String(r.name).replace(/\s*\(.*\)\s*$/, ''));
      return clamp(`${lead} ${cats}. ${shops}${shops ? '…' : ''} ${t.food?.intro ?? ''}`);
    }

    case 'culture':
      return clamp(`${lead} ${names(t.culture?.items ?? [], 4, (i) => i.name)}. ${t.culture?.intro ?? ''}`);

    case 'shopping':
      return clamp(`${lead} ${names(t.shopping?.items ?? [], 3, (i) => i.name)}. ${t.shopping?.intro ?? ''}`);

    case 'luclam': {
      const teas = names(t.luclam?.menuItems ?? [], 3, (m) => m.name);
      return clamp(`${lead} ${teas}. ${t.luclam?.menuHeading ?? ''}`);
    }

    case 'info': {
      const cats = names(t.info?.categories ?? [], 4, (c) => c.title);
      // The category titles alone left the Chinese pages at 62 characters,
      // because those titles are two or three characters each. Naming the
      // entries underneath them is both longer and more useful: this page is a
      // list of hospitals, pharmacies and exchange counters, and the names are
      // what somebody searches for.
      const entries = (t.info?.categories ?? [])
        .flatMap((c: any) => c.items ?? [])
        .slice(0, 5)
        .map((i: any) => i.label)
        .filter(Boolean)
        .join(', ');
      return clamp(`${lead} ${cats}. ${entries}`);
    }

    default:
      return clamp(`${lead} ${t.subtitle}`);
  }
}