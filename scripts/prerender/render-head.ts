import { translations, type Language } from '../../src/translations';
import { pathFor, HTML_LANG, LANGUAGES, type Topic } from '../../src/routes';
import { escapeHtml } from './render-content';

const ORIGIN = 'https://gift.luclam.vn';
const OG_IMAGE = `${ORIGIN}/uploads/cover_benthanh.jpg`;

export type Assets = { scripts: string[]; stylesheets: string[] };

function absolute(path: string): string {
  return `${ORIGIN}${path}`;
}

function hreflangTags(topic: Topic): string {
  const tags = LANGUAGES.map(
    (lang) =>
      `<link rel="alternate" hreflang="${HTML_LANG[lang]}" href="${absolute(
        pathFor(lang, topic)
      )}" />`
  );
  // x-default points at English: a visitor matching none of the six is more
  // likely to read English than Vietnamese.
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="${absolute(pathFor('en', topic))}" />`
  );
  return tags.join('\n    ');
}

function breadcrumb(lang: Language, topic: Topic): string {
  if (topic === 'cover') return '';
  const t = translations[lang];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.title,
        item: absolute(pathFor(lang, 'cover')),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.pages[topic],
        item: absolute(pathFor(lang, topic)),
      },
    ],
  });
}

type InfoBlock = {
  categories: Array<{ title: string; items: Array<{ label: string; detail: string }> }>;
};

/**
 * The info block is a list of places and services — "Bệnh viện Quốc tế FV",
 * "Tiệm Vàng Hà Tâm" — not questions. Emitting those as FAQPage Questions
 * would be schema misuse, so they go out as an ItemList, which is what they
 * actually are and which assistants can still read.
 *
 * A real FAQPage needs questions written as questions, in all six languages.
 * That is a copywriting deliverable for Lục Lam, not something to fabricate
 * here. See the handover note.
 */
function infoItemList(lang: Language, topic: Topic): string {
  if (topic !== 'info') return '';

  const info = translations[lang].info as unknown as InfoBlock;

  const items = info.categories.flatMap((category) =>
    category.items.map((item) => ({
      '@type': 'ListItem',
      name: item.label,
      description: item.detail,
      additionalType: category.title,
    }))
  );

  if (items.length === 0) return '';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absolute(pathFor(lang, topic))}#useful-info`,
    name: translations[lang].pages.info,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({ ...item, position: index + 1 })),
  });
}

/**
 * Genuine question-answer pairs. These three shipped on the live site and are
 * real questions; they are facts about the shop that hold in any language, so
 * the answer text is built from structured values rather than translated prose.
 */
function faqPage(lang: Language, topic: Topic): string {
  if (topic !== 'cover') return '';

  const questions = FAQ_BY_LANGUAGE[lang];
  if (!questions || questions.length === 0) return '';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absolute(pathFor(lang, topic))}#faq`,
    mainEntity: questions.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  });
}

const ADDRESS = 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa, Quận 1, Thành phố Hồ Chí Minh';
const ADDRESS_EN = 'B2 floor, Takashimaya, 92-94 Nam Ky Khoi Nghia, District 1, Ho Chi Minh City';

/**
 * Vietnamese entries are the three that already shipped in index.html.
 * English is a direct rendering of the same facts. The other four languages
 * are intentionally absent — see infoItemList above.
 */
const FAQ_BY_LANGUAGE: Partial<Record<Language, Array<{ q: string; a: string }>>> = {
  vi: [
    {
      q: 'Lục Lam tại Thành phố Hồ Chí Minh nằm ở đâu?',
      a: `Lục Lam nằm tại ${ADDRESS}.`,
    },
    {
      q: 'Lục Lam mở cửa lúc mấy giờ?',
      a: 'Lục Lam mở cửa từ 09:30 đến 22:00 mỗi ngày.',
    },
    {
      q: 'Chợ Bến Thành nằm ở đâu?',
      a: 'Chợ Bến Thành nằm tại Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh.',
    },
  ],
  en: [
    {
      q: 'Where is Lục Lam located in Ho Chi Minh City?',
      a: `Lục Lam is on the ${ADDRESS_EN}.`,
    },
    {
      q: 'What are Lục Lam’s opening hours?',
      a: 'Lục Lam is open from 09:30 to 22:00 every day.',
    },
    {
      q: 'Where is Bến Thành Market?',
      a: 'Bến Thành Market is in Bến Thành Ward, District 1, Ho Chi Minh City.',
    },
  ],
};

type MenuItem = {
  name: string;
  desc?: string;
  price?: string;
  image?: string;
  buyLuclam?: string;
};

/**
 * Prices are authored as "155,000 VND". Structured data needs a bare number and
 * a separate currency, so parse rather than pass the string through.
 *
 * Anything that does not parse cleanly gets no `offers` block at all. A wrong
 * price in structured data is worse than an absent one — search engines and
 * assistants repeat it as fact, and nobody sees the mistake on the page.
 */
function parsePrice(raw: string | undefined): { price: string; currency: string } | null {
  if (!raw) return null;

  const match = raw.match(/^\s*([\d.,]+)\s*(VND|VNĐ|đ)\s*$/i);
  if (!match) return null;

  const digits = match[1].replace(/[.,]/g, '');
  if (!/^\d+$/.test(digits)) return null;

  const value = Number(digits);
  if (!Number.isFinite(value) || value <= 0) return null;

  return { price: String(value), currency: 'VND' };
}

function products(lang: Language, topic: Topic): string {
  if (topic !== 'luclam') return '';

  const items = ((translations[lang] as unknown as Record<string, { menuItems?: MenuItem[] }>)
    .luclam?.menuItems ?? []) as MenuItem[];
  if (items.length === 0) return '';

  const listed = items.map((item, index) => {
    const offer = parsePrice(item.price);

    const product: Record<string, unknown> = {
      '@type': 'Product',
      '@id': `${absolute(pathFor(lang, 'luclam'))}#product-${index}`,
      name: item.name,
      brand: { '@type': 'Brand', name: 'Lục Lam Art Of Tea' },
      category: 'Herbal tea',
    };

    if (item.desc) product.description = item.desc;
    if (item.image) product.image = item.image;

    if (offer) {
      product.offers = {
        '@type': 'Offer',
        price: offer.price,
        priceCurrency: offer.currency,
        availability: 'https://schema.org/InStock',
        // Sold through the shop's own store and Takashimaya rather than here —
        // this page presents the range, it does not take orders.
        url: item.buyLuclam || 'https://luclam.vn/collections/all',
        seller: { '@type': 'Organization', name: 'Lục Lam Art Of Tea' },
      };
    }

    return { '@type': 'ListItem', position: index + 1, item: product };
  });

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${absolute(pathFor(lang, 'luclam'))}#products`,
    name: translations[lang].pages.luclam,
    numberOfItems: listed.length,
    itemListElement: listed,
  });
}

function localBusiness(lang: Language): string {
  // The telephone field is deliberately absent: the official number has not
  // been confirmed by Lục Lam, and a wrong number in structured data is worse
  // than none — assistants would read it out as fact. See item #7 in the spec.
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': ['TeaStore', 'LocalBusiness'],
    name: 'Lục Lam Art Of Tea',
    alternateName: translations[lang].title,
    image: OG_IMAGE,
    '@id': ORIGIN,
    url: absolute(pathFor(lang, 'cover')),
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa',
      addressLocality: 'Quận 1',
      addressRegion: 'Thành phố Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 10.7733, longitude: 106.7011 },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:30',
      closes: '22:00',
    },
    sameAs: ['https://www.facebook.com/luclamartoftea'],
  });
}

export function renderHead(lang: Language, topic: Topic, assets: Assets): string {
  const t = translations[lang];
  const isCover = topic === 'cover';

  const title = isCover ? `${t.title} | ${t.subtitle}` : `${t.pages[topic]} | ${t.title}`;
  const description = isCover ? t.subtitle : `${t.pages[topic]} — ${t.subtitle}`;
  const canonical = absolute(pathFor(lang, topic));

  const jsonLd = [
    isCover ? localBusiness(lang) : '',
    breadcrumb(lang, topic),
    faqPage(lang, topic),
    infoItemList(lang, topic),
    products(lang, topic),
  ]
    .filter(Boolean)
    .map((json) => `<script type="application/ld+json">${json}</script>`)
    .join('\n    ');

  const styles = assets.stylesheets
    .map((href) => `<link rel="stylesheet" crossorigin href="${href}" />`)
    .join('\n    ');

  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="Lục Lam Art Of Tea" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    ${hreflangTags(topic)}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:site_name" content="Lục Lam Art Of Tea" />
    <meta property="og:locale" content="${HTML_LANG[lang]}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${escapeHtml(title)}" />
    <meta property="twitter:description" content="${escapeHtml(description)}" />
    <meta property="twitter:image" content="${OG_IMAGE}" />
    ${styles}
    ${jsonLd}`;
}
