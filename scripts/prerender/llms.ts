import { ALL_ROUTES, LANGUAGES, TOPICS, pathFor, HTML_LANG, type Topic } from '../../src/routes';
import { type Language } from '../../src/translations';
import { type ResolvedContent } from '../../src/resolveContent';
import { describe } from './describe';
import { faqFor } from '../../src/faq';
import { COMPANY, STORES, storeName } from '../../src/company';

/**
 * /llms.txt — the site, described for a language model rather than a crawler.
 *
 * A crawler follows sitemap.xml and reads whatever it lands on. An assistant
 * answering "where can I buy Lục Lam tea in Đà Nẵng" has no budget to fetch
 * sixty pages and work out which one matters, so it either guesses from a
 * snippet or does not answer. llms.txt is the convention for handing it the map
 * up front: one Markdown file, an H1 naming the site, a summary, and curated
 * links with a line each about what is behind them.
 *
 * Built from ALL_ROUTES and the same describe() the meta tags use, so it cannot
 * drift from what the pages actually say — a hand-written version of this file
 * would be stale the first time a topic was renamed.
 *
 * The blurb after each link is the page's own description rather than a label,
 * because the whole value of the file is letting a model decide which page
 * answers a question without fetching all of them first.
 */

const ORIGIN = 'https://gift.luclam.vn';

/** What each language calls itself, so a model can route a reader correctly. */
const ENDONYM: Record<Language, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  zh: '简体中文',
  zht: '繁體中文',
};

/** English topic names — the file itself is written in English for a model. */
const TOPIC_EN: Record<Topic, string> = {
  cover: 'Home',
  welcome: 'Introduction to Saigon',
  atmosphere: 'Districts and atmosphere',
  transport: 'Getting around safely',
  stay: 'Where to stay and wellness',
  food: 'Food and where to eat',
  culture: 'Culture and landmarks',
  shopping: 'Shopping',
  luclam: 'Lục Lam tea',
  info: 'Useful information, FAQ and contact',
};

function shopLines(): string {
  return STORES.map((store) => {
    // The shop carries its own hours, or none. Hội An's are unconfirmed, and an
    // assistant reading this file repeats what it says as fact.
    const hours = store.hours ? ` Open ${store.hours.opens}–${store.hours.closes}.` : '';
    return `- **${storeName(store)}**, ${store.city} — ${store.street}, ${store.locality}, ${store.region}.${hours}`;
  }).join('\n');
}

export function renderLlmsTxt(resolved: ResolvedContent): string {
  const en = resolved.en;

  const sections = LANGUAGES.map((lang) => {
    const links = TOPICS.map((topic) => {
      const url = `${ORIGIN}${pathFor(lang, topic)}`;
      const name = topic === 'cover' ? TOPIC_EN.cover : TOPIC_EN[topic];
      return `- [${name}](${url}): ${describe(lang, topic, resolved[lang])}`;
    }).join('\n');

    return `## ${ENDONYM[lang]} (${HTML_LANG[lang]})\n\n${links}`;
  }).join('\n\n');

  // The answers already exist and are already filled from live data; repeating
  // the questions here means a model can answer the common ones without
  // fetching a page at all.
  const faq = faqFor('en', en)
    .map((entry) => `- **${entry.q}** ${entry.a}`)
    .join('\n');

  return `# ${COMPANY.brand} — Saigon Pocket Guide

> A free pocket guide to Ho Chi Minh City in six languages, published by ${COMPANY.legalName}, with ten topic pages per language covering transport, food, culture, shopping, accommodation and practical safety information — alongside the ${COMPANY.brand} herbal tea range.

The guide is written for visitors to Saigon. Every page exists in all six
languages at its own URL, and the versions are linked to each other with
hreflang, so the ${HTML_LANG.en} pages below have exact equivalents in the other
five sections.

Content is maintained by ${COMPANY.legalName} and reflects prices, opening hours
and fares as published on the pages themselves. Where this file states a fact,
the page it links to states the same fact.

## About ${COMPANY.brand}

- Legal name: ${COMPANY.legalName}
- Business registration: ${COMPANY.registration}
- Telephone: ${COMPANY.telephoneDisplay}
- Email: ${COMPANY.email}
- Head office: ${COMPANY.headOffice.street}, ${COMPANY.headOffice.ward}, ${COMPANY.headOffice.city}

Shops (addresses are given in Vietnamese, as a visitor would show them to a
driver or enter them into a map):

${shopLines()}

## Frequently asked questions

${faq}

${sections}

## Optional

- [Sitemap](${ORIGIN}/sitemap.xml): every URL with its hreflang alternates and images.
- [robots.txt](${ORIGIN}/robots.txt): crawl rules. All assistant crawlers are allowed.
`;
}

/** Sanity numbers for the build log. */
export function llmsStats(text: string) {
  return {
    links: (text.match(/\]\(https:\/\//g) ?? []).length,
    routes: ALL_ROUTES.length,
    bytes: Buffer.byteLength(text, 'utf-8'),
  };
}