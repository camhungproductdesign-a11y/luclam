import type { Language } from './translations';

/**
 * One source of truth for the 60 language/topic URLs. Both the SPA router and
 * the build-time page generator read this, so they cannot drift apart.
 */

export const TOPICS = [
  'cover',
  'welcome',
  'atmosphere',
  'transport',
  'stay',
  'food',
  'culture',
  'shopping',
  'luclam',
  'info',
] as const;

export type Topic = (typeof TOPICS)[number];

export const LANGUAGES: readonly Language[] = ['vi', 'en', 'ja', 'ko', 'zh', 'zht'];

export const DEFAULT_LANGUAGE: Language = 'vi';

export const HTML_LANG: Record<Language, string> = {
  vi: 'vi',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  zh: 'zh-CN',
  zht: 'zh-TW',
};

/** Vietnamese slugs, used at the site root. */
const VI_SLUG: Record<Topic, string> = {
  cover: '',
  welcome: 'gioi-thieu',
  atmosphere: 'khu-vuc',
  transport: 'di-chuyen',
  stay: 'luu-tru',
  food: 'am-thuc',
  culture: 'van-hoa',
  shopping: 'mua-sam',
  luclam: 'luc-lam',
  info: 'thong-tin-huu-ich',
};

/**
 * ASCII slugs for the other five languages. Native-script slugs would be
 * percent-encoded in the address bar and when shared, for no SEO gain.
 */
const INTL_SLUG: Record<Topic, string> = {
  cover: '',
  welcome: 'welcome',
  atmosphere: 'atmosphere',
  transport: 'transport',
  stay: 'stay',
  food: 'food',
  culture: 'culture',
  shopping: 'shopping',
  luclam: 'luclam',
  info: 'info',
};

function slugTable(lang: Language): Record<Topic, string> {
  return lang === DEFAULT_LANGUAGE ? VI_SLUG : INTL_SLUG;
}

export function slugFor(lang: Language, topic: Topic): string {
  return slugTable(lang)[topic];
}

export function pathFor(lang: Language, topic: Topic): string {
  const slug = slugTable(lang)[topic];
  const prefix = lang === DEFAULT_LANGUAGE ? '' : `/${lang}`;
  return slug ? `${prefix}/${slug}/` : `${prefix}/`;
}

export function parsePath(pathname: string): { lang: Language; topic: Topic } {
  const segments = pathname.split('/').filter(Boolean);

  let lang: Language = DEFAULT_LANGUAGE;
  let rest = segments;

  if (segments.length > 0 && (LANGUAGES as readonly string[]).includes(segments[0])) {
    lang = segments[0] as Language;
    rest = segments.slice(1);
  }

  if (rest.length === 0) return { lang, topic: 'cover' };

  const table = slugTable(lang);
  const found = TOPICS.find((topic) => table[topic] === rest[0]);

  return { lang, topic: found ?? 'cover' };
}

export const ALL_ROUTES: ReadonlyArray<{ lang: Language; topic: Topic; path: string }> =
  LANGUAGES.flatMap((lang) =>
    TOPICS.map((topic) => ({ lang, topic, path: pathFor(lang, topic) }))
  );
