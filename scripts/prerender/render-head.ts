import { type Language } from '../../src/translations';
import { IMAGE_DERIVATIVES } from '../../src/imageDerivatives';
import { type ResolvedContent } from '../../src/resolveContent';
import { pathFor, HTML_LANG, LANGUAGES, type Topic } from '../../src/routes';
import { escapeHtml } from './render-content';
import { parsePrice } from '../../src/parsePrice';
import { describe } from './describe';
import { faqFor } from '../../src/faq';
import { COMPANY, STORES, storeName, type Store } from '../../src/company';

const ORIGIN = 'https://gift.luclam.vn';
const OG_IMAGE = `${ORIGIN}/uploads/og-cover.jpg`;

export type Assets = { scripts: string[]; stylesheets: string[] };

function absolute(path: string): string {
  return `${ORIGIN}${path}`;
}

/**
 * Start the cover photograph downloading with the HTML, not after it.
 *
 * It is the largest element on every page — the full-bleed background of the
 * first screen — and it is drawn by React, so the browser had no idea it
 * existed until the bundle had arrived, parsed and rendered. Measured on a
 * throttled mobile profile that was a second of dead air before the request
 * even started, against 26ms to actually transfer the file.
 *
 * AVIF specifically, and only AVIF: `imagesrcset` with a `type` makes the
 * preload match the <source> the browser will pick, and a preload that does
 * not match what the page requests downloads the bytes twice. Every browser
 * that reads this tag supports AVIF; the rest ignore it and fetch normally.
 */
function coverPreload(): string {
  const src = '/uploads/cover-benthanh';
  // From the manifest the optimiser writes, never a hand-kept list. A preload
  // that offers different rungs from the <picture> it is meant to warm up is
  // worse than no preload: the browser takes one from each and pays twice.
  const widths = IMAGE_DERIVATIVES[`${src}.jpg`] ?? [];
  if (widths.length === 0) return '';
  const srcset = widths.map((w) => `${src}-${w}.avif ${w}w`).join(', ');
  return (
    `    <link rel="preload" as="image" type="image/avif" fetchpriority="high"\n` +
    `          imagesrcset="${srcset}" imagesizes="(min-width: 1024px) 430px, 100vw" />`
  );
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

function breadcrumb(lang: Language, topic: Topic, resolved: ResolvedContent): string {
  if (topic === 'cover') return '';
  const t = resolved[lang];

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
function infoItemList(lang: Language, topic: Topic, resolved: ResolvedContent): string {
  if (topic !== 'info') return '';

  const info = resolved[lang].info as unknown as InfoBlock;

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
    name: resolved[lang].pages.info,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({ ...item, position: index + 1 })),
  });
}

/**
 * The page's questions and answers, for the format an assistant quotes most
 * directly. Questions are written per language in translations.ts; the facts in
 * the answers are filled from live data. See src/faq.ts.
 *
 * On the info page, not the cover. This markup used to sit on the six home
 * pages while the questions themselves appeared nowhere at all — not in the
 * static block, not in the app — which breaks Google's rule that FAQ markup
 * describe content the reader can see, and is worse than useless for an
 * assistant, which reads the rendered page and would find nothing behind the
 * claim. The questions are practical ones — hours, fares, where to buy tea —
 * so the useful-info page is where they belong, next to the contact block.
 */
function faqPage(lang: Language, topic: Topic, resolved: ResolvedContent): string {
  if (topic !== 'info') return '';

  const questions = faqFor(lang, resolved[lang]);
  if (questions.length === 0) return '';

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

// ADDRESS, ADDRESS_EN and FAQ_BY_LANGUAGE lived here: three questions, in two
// of the six languages, with the address written out twice. They are in
// translations.ts and ./faq.ts now, where all six languages get the same
// eight and the facts come from the data the pages already render.

type MenuItem = {
  name: string;
  desc?: string;
  price?: string;
  image?: string;
  buyLuclam?: string;
};

// parsePrice moved to src/parsePrice.ts so Creator Studio applies exactly the
// same rule when it warns about a price. See the note there.

function products(lang: Language, topic: Topic, resolved: ResolvedContent): string {
  if (topic !== 'luclam') return '';

  const items = ((resolved[lang] as unknown as Record<string, { menuItems?: MenuItem[] }>)
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
    // Absolute: a crawler may read this JSON-LD away from the page it came
    // from, and a bare "/uploads/…" has nothing to resolve against then. It was
    // a full URL before only because it pointed at someone else's CDN.
    if (item.image) {
      product.image = item.image.startsWith('/') ? absolute(item.image) : item.image;
    }

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
    name: resolved[lang].pages.luclam,
    numberOfItems: listed.length,
    itemListElement: listed,
  });
}

/**
 * A shop's hours, or nothing at all where they were never confirmed.
 *
 * Hội An is the one shop without them, and it stays without them: an assistant
 * repeats opening times as fact, so a guess here sends somebody to a shut door.
 */
function openingHours(store: Store) {
  if (!store.hours) return undefined;
  return {
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
    opens: store.hours.opens,
    closes: store.hours.closes,
  };
}

function localBusiness(lang: Language, resolved: ResolvedContent): string {
  // telephone was empty here until Lục Lam confirmed the number, because a
  // wrong one in structured data is worse than none — an assistant reads it out
  // as fact. It comes from src/company.ts now, along with everything else the
  // company told us, so the copy, the schema and the FAQ cannot disagree.
  const flagship = STORES[0];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': ['TeaStore', 'LocalBusiness'],
    name: COMPANY.brand,
    alternateName: resolved[lang].title,
    image: OG_IMAGE,
    '@id': ORIGIN,
    url: absolute(pathFor(lang, 'cover')),
    priceRange: '$$',
    telephone: COMPANY.telephone,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: flagship.street,
      addressLocality: flagship.locality,
      addressRegion: flagship.region,
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geo: flagship.geo
      ? { '@type': 'GeoCoordinates', latitude: flagship.geo.latitude, longitude: flagship.geo.longitude }
      : undefined,
    openingHoursSpecification: openingHours(flagship),
    parentOrganization: { '@id': `${ORIGIN}#organization` },
    sameAs: ['https://www.facebook.com/luclamartoftea', COMPANY.website],
  });
}

/**
 * The company behind the shops, and every one of them.
 *
 * The site knew one address — the Takashimaya counter — while Lục Lam trades
 * from five: that one, Hội An, and three on Trần Phú in Đà Nẵng. Somebody
 * asking an assistant where to buy this tea was being told about a fifth of
 * the answer.
 */
function organization(lang: Language, resolved: ResolvedContent): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${ORIGIN}#organization`,
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    alternateName: resolved[lang].title,
    // Vietnam's business registration number; taxID is the field Google reads.
    taxID: COMPANY.registration,
    url: COMPANY.website,
    logo: OG_IMAGE,
    telephone: COMPANY.telephone,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY.headOffice.street,
      addressLocality: COMPANY.headOffice.ward,
      addressRegion: COMPANY.headOffice.city,
      addressCountry: COMPANY.headOffice.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: COMPANY.telephone,
      email: COMPANY.email,
      availableLanguage: ['vi', 'en', 'ja', 'ko', 'zh'],
    },
    location: STORES.map((store) => ({
      '@type': 'Store',
      '@id': `${ORIGIN}#store-${store.id}`,
      name: `${storeName(store)} — ${store.city}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: store.street,
        addressLocality: store.locality,
        addressRegion: store.region,
        addressCountry: 'VN',
      },
      ...(store.geo
        ? { geo: { '@type': 'GeoCoordinates', latitude: store.geo.latitude, longitude: store.geo.longitude } }
        : {}),
      ...(store.hours ? { openingHoursSpecification: openingHours(store) } : {}),
    })),
    sameAs: ['https://www.facebook.com/luclamartoftea', COMPANY.website],
  });
}

export function renderHead(
  lang: Language,
  topic: Topic,
  assets: Assets,
  resolved: ResolvedContent
): string {
  // The same resolved content the app renders, so a price edited in Creator
  // Studio reaches the Product JSON-LD rather than only the screen.
  const t = resolved[lang];
  const isCover = topic === 'cover';

  const title = isCover ? `${t.title} | ${t.subtitle}` : `${t.pages[topic]} | ${t.title}`;
  // Built from the page's own content. See describe.ts for what the previous
  // `${t.pages[topic]} — ${t.subtitle}` cost: sixty snippets averaging 35
  // characters, none naming anything on the page it described.
  const description = describe(lang, topic, t);
  const canonical = absolute(pathFor(lang, topic));

  const jsonLd = [
    isCover ? localBusiness(lang, resolved) : '',
    isCover ? organization(lang, resolved) : '',
    breadcrumb(lang, topic, resolved),
    faqPage(lang, topic, resolved),
    infoItemList(lang, topic, resolved),
    products(lang, topic, resolved),
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
${coverPreload()}
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
