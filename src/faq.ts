import { type Language } from './translations';
import { LANGUAGES, HTML_LANG } from './routes';
import { parsePrice } from './parsePrice';
import { COMPANY, STORES, storeName } from './company';

/**
 * The FAQ for one language, with its facts filled in from live data.
 *
 * The questions are written per language in translations.ts; the answers carry
 * {{placeholders}} instead of literal facts. Address, hours, fares, app names
 * and tea prices are substituted here from the same values the pages render, so
 * a price changed in Creator Studio changes the answer too.
 *
 * That matters more here than anywhere else on the site: an assistant reads a
 * FAQPage and repeats the answer as fact. A second, hand-copied set of numbers
 * would be a set that goes quietly wrong.
 *
 * Only four of the six languages had any FAQPage at all before this — Japanese,
 * Korean and both Chinese pages carried none.
 */

const ADDRESS: Record<Language, string> = {
  vi: 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa, Quận 1, Thành phố Hồ Chí Minh',
  en: 'B2 floor, Takashimaya, 92-94 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City',
  ja: 'ホーチミン市1区グエン・キー・コイ・ギア通り92-94、タカシマヤ B2階',
  ko: '호찌민시 1군 응우옌 끼 코이 응이아 92-94, 타카시마야 B2층',
  zh: '胡志明市第一郡阮氏明开街92-94号 高岛屋 B2层',
  zht: '胡志明市第一郡阮氏明開街92-94號 高島屋 B2層',
};

const HOURS = '09:30 – 22:00';

/** The language names as each language writes them, for the "what languages" answer. */
const LANGUAGE_NAMES: Record<Language, string> = {
  vi: 'Tiếng Việt, English, 日本語, 한국어, 简体中文, 繁體中文',
  en: 'Vietnamese, English, Japanese, Korean, Simplified Chinese, Traditional Chinese',
  ja: 'ベトナム語、英語、日本語、韓国語、簡体字中国語、繁体字中国語',
  ko: '베트남어, 영어, 일본어, 한국어, 중국어 간체, 중국어 번체',
  zh: '越南语、英语、日语、韩语、简体中文、繁体中文',
  zht: '越南語、英語、日語、韓語、簡體中文、繁體中文',
};

function joinNames(list: unknown[], take: number, pick: (item: any) => string): string {
  return list.slice(0, take).map(pick).filter(Boolean).join(', ');
}

/** The cheapest tea on the menu, so "from X" is true rather than decorative. */
function cheapest(items: Array<{ price?: string }>): string {
  const priced = items
    .map((item) => ({ raw: item.price ?? '', parsed: parsePrice(item.price) }))
    .filter((entry) => entry.parsed);
  if (priced.length === 0) return '';
  priced.sort((a, b) => Number(a.parsed!.price) - Number(b.parsed!.price));
  return priced[0].raw.trim();
}

export function faqFor(lang: Language, t: any): Array<{ q: string; a: string }> {
  const entries: Array<{ q: string; a: string }> = t.faq ?? [];
  if (entries.length === 0) return [];

  const options: any[] = t.transport?.options ?? [];
  const appCategory = (t.transport?.categories ?? []).find((c: any) => c.id === 'apps');
  const taxiCategory = (t.transport?.categories ?? []).find((c: any) => c.id === 'taxis');

  const strip = (name: string) => String(name).replace(/\s*\(.*\)\s*$/, '').trim();

  const values: Record<string, string> = {
    address: ADDRESS[lang],
    hours: HOURS,
    apps: joinNames(appCategory?.options ?? [], 2, (o) => strip(o.name)),
    taxis: joinNames(taxiCategory?.options ?? [], 2, (o) => strip(o.name)),
    // The first fare column is the short-hop price for that mode.
    fareBike: options[0]?.fares?.[0] ?? '',
    fareCar: options[1]?.fares?.[0] ?? '',
    teas: joinNames(t.luclam?.menuItems ?? [], 3, (m) => strip(m.name)),
    priceFrom: cheapest(t.luclam?.menuItems ?? []),
    languages: LANGUAGE_NAMES[lang],
    // Addresses stay in Vietnamese in every language: a visitor shows them to a
    // driver or types them into a map, and a translated street name serves
    // neither.
    // Three of the shops are in Đà Nẵng, so the city alone no longer tells them
    // apart — the branch name goes in front of it.
    stores: STORES.map(
      (store) => `${storeName(store)}, ${store.city} — ${store.street}, ${store.locality}`
    ).join('; '),
    storeCount: String(STORES.length),
    phone: COMPANY.telephoneDisplay,
    email: COMPANY.email,
  };

  return entries
    .map((entry) => ({
      q: entry.q,
      a: entry.a.replace(/\{\{(\w+)\}\}/g, (_m, key: string) => values[key] ?? ''),
    }))
    // An answer whose fact never arrived is worse than an absent question: it
    // would publish a sentence with a hole in it as though it were true.
    .filter((entry) => !/\{\{|\s{2,}|^\s*\.?\s*$/.test(entry.a));
}

/** Sanity check used by the build: every language should carry the same count. */
export function faqCoverage(resolved: Record<Language, any>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const lang of LANGUAGES) out[HTML_LANG[lang]] = faqFor(lang, resolved[lang]).length;
  return out;
}