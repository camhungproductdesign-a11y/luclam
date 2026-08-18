import { type Language } from '../../src/translations';
import { pathFor, TOPICS, type Topic } from '../../src/routes';
import { type ResolvedContent } from '../../src/resolveContent';
import { type PlaceImage } from './place-images';
import { COMPANY, STORES } from '../../src/company';
import { faqFor } from '../../src/faq';

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Keys that hold a title rather than body copy. */
const HEADING_KEYS = new Set(['title', 'name', 'heading', 'subheading', 'label', 'tagline']);

/** Keys that hold machinery, not readable content. */
const SKIP_KEYS = new Set([
  'id',
  'icon',
  'color',
  'image',
  'img',
  'url',
  'video',
  'videoUrl',
  'link',
  'href',
  'badge',
  'scanMe',
]);

/**
 * Walks a translation branch and flattens it to HTML.
 *
 * Topic data is not uniform — some branches are strings, some are arrays of
 * objects with title/desc, others use label/detail. So this follows the shape
 * of the data rather than a fixed schema, which keeps it working when a topic
 * gains a field.
 */
function renderNode(node: unknown, depth: number): string {
  if (typeof node === 'string') {
    const text = node.trim();
    if (!text) return '';
    // Translations use \n for hard breaks inside a paragraph.
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<p>${escapeHtml(line)}</p>`)
      .join('');
  }

  if (Array.isArray(node)) {
    const items = node.map((item) => renderNode(item, depth + 1)).filter(Boolean);
    if (items.length === 0) return '';
    return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  }

  if (node && typeof node === 'object') {
    const headingLevel = Math.min(depth + 2, 6);

    return Object.entries(node as Record<string, unknown>)
      .map(([key, value]) => {
        if (SKIP_KEYS.has(key)) return '';
        if (typeof value === 'string' && HEADING_KEYS.has(key)) {
          const text = value.trim();
          if (!text) return '';
          return `<h${headingLevel}>${escapeHtml(text)}</h${headingLevel}>`;
        }
        return renderNode(value, depth + 1);
      })
      .filter(Boolean)
      .join('');
  }

  return '';
}

/**
 * The topic's photographs, each named by the place it shows.
 *
 * A figure with a caption rather than a bare img: the caption states which
 * place the picture belongs to, which is the association a crawler otherwise
 * has to guess at, and it carries the licence line the images are used under.
 *
 * loading="lazy" and the intrinsic dimensions are for the reader who lands on
 * this markup with JavaScript off — the SPA replaces it on mount.
 */
function renderImages(images: PlaceImage[]): string {
  if (images.length === 0) return '';

  const figures = images
    .map(
      (image) =>
        `<figure><img src="${image.src}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" />` +
        `<figcaption>${escapeHtml(image.caption)}${
          image.credit ? ` — <small>${escapeHtml(image.credit)}</small>` : ''
        }</figcaption></figure>`
    )
    .join('');

  return figures;
}

/**
 * The questions, as text on the page.
 *
 * The FAQPage markup describing these has been emitted for a while; the
 * questions themselves were never rendered anywhere, so it described nothing.
 * Google's rule is that the markup match visible content, and an assistant
 * reading the page would have found the claim unsupported.
 *
 * dl/dt/dd rather than headings: it is a list of pairs, and that is what the
 * element is for.
 */
function renderFaq(lang: Language, topic: Topic, t: any): string {
  if (topic !== 'info') return '';

  const entries = faqFor(lang, t);
  if (entries.length === 0) return '';

  const pairs = entries
    .map(
      (entry) =>
        `<dt>${escapeHtml(entry.q)}</dt><dd>${escapeHtml(entry.a)}</dd>`
    )
    .join('');

  return `<section><h2>${escapeHtml(t.faqHeading ?? 'FAQ')}</h2><dl>${pairs}</dl></section>`;
}

/**
 * The company's own details, on the page that already answers practical
 * questions.
 *
 * Structured data is supposed to describe what the page shows, and the
 * Organization block now names four shops, a phone number, an email and a
 * registration number that appeared nowhere in the markup. This puts them where
 * a reader can see them too — and where an assistant quoting the schema can
 * point at the sentence it came from.
 *
 * Addresses stay in Vietnamese in every language. A visitor shows one to a
 * driver or types it into a map, and a translated street name serves neither.
 */
function renderContact(topic: Topic, t: any): string {
  if (topic !== 'info' || !t.contact) return '';
  const c = t.contact;

  const shops = STORES.map(
    (store) =>
      `<li><strong>${escapeHtml(store.city)}</strong> — ${escapeHtml(
        `${store.street}, ${store.locality}`
      )}</li>`
  ).join('');

  return (
    `<section><h2>${escapeHtml(c.heading)}</h2>` +
    `<p>${escapeHtml(COMPANY.legalName)}</p>` +
    `<p>${escapeHtml(c.phone)}: <a href="tel:${COMPANY.telephone}">${escapeHtml(
      COMPANY.telephoneDisplay
    )}</a></p>` +
    `<p>${escapeHtml(c.email)}: <a href="mailto:${COMPANY.email}">${escapeHtml(
      COMPANY.email
    )}</a></p>` +
    `<p>${escapeHtml(c.office)}: ${escapeHtml(
      `${COMPANY.headOffice.street}, ${COMPANY.headOffice.ward}, ${COMPANY.headOffice.city}`
    )}</p>` +
    `<p>${escapeHtml(c.licence)}: ${escapeHtml(COMPANY.registration)}</p>` +
    `<h3>${escapeHtml(c.stores)}</h3><ul>${shops}</ul>` +
    `</section>`
  );
}

export function renderContent(
  lang: Language,
  topic: Topic,
  resolved: ResolvedContent,
  images: PlaceImage[] = []
): string {
  // Resolved rather than raw: English fills any gap, then the editor's
  // overrides from public/config.json go on top — the same content the running
  // app shows. Reading translations directly here is what let the two diverge.
  const t = resolved[lang];
  const source = t as unknown as Record<string, unknown>;

  // The cover block is only a headline and a tagline — far too thin for the
  // homepage, which is the most important page on the site. Carry the welcome
  // block with it so the root URL introduces the guide properly.
  const topicData =
    topic === 'cover' ? [source.cover, source.welcome] : source[topic];

  const topicNav = TOPICS.filter((item) => item !== topic)
    .map(
      (item) =>
        `<li><a href="${pathFor(lang, item)}">${escapeHtml(t.pages[item])}</a></li>`
    )
    .join('');

  const languageNav = (['vi', 'en', 'ja', 'ko', 'zh', 'zht'] as Language[])
    .filter((other) => other !== lang)
    .map(
      (other) =>
        `<li><a href="${pathFor(other, topic)}" hreflang="${other}">${escapeHtml(
          resolved[other].title
        )}</a></li>`
    )
    .join('');

  const heading =
    topic === 'cover'
      ? `${escapeHtml(t.title)} — ${escapeHtml(t.subtitle)}`
      : `${escapeHtml(t.pages[topic])} — ${escapeHtml(t.title)}`;

  return [
    '<article>',
    `<h1>${heading}</h1>`,
    renderNode(topicData, 1),
    renderFaq(lang, topic, t),
    renderContact(topic, t),
    renderImages(images),
    '</article>',
    `<nav aria-label="${escapeHtml(t.pages.info)}"><ul>${topicNav}</ul></nav>`,
    `<nav aria-label="Languages"><ul>${languageNav}</ul></nav>`,
  ].join('\n');
}
