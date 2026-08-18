import { type Language } from '../../src/translations';
import { pathFor, TOPICS, type Topic } from '../../src/routes';
import { type ResolvedContent } from '../../src/resolveContent';
import { type PlaceImage } from './place-images';

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
    renderImages(images),
    '</article>',
    `<nav aria-label="${escapeHtml(t.pages.info)}"><ul>${topicNav}</ul></nav>`,
    `<nav aria-label="Languages"><ul>${languageNav}</ul></nav>`,
  ].join('\n');
}
