import { DeferredFrame } from './DeferredFrame';
import { getEmbedDetails } from '../videoEmbed';

export type PlaceVideo = { id: string; name: string; video: string };

const HEADING: Record<string, string> = {
  vi: 'Video',
  en: 'Video',
  ja: '動画',
  ko: '영상',
  zh: '视频',
  zht: '影片',
};

/**
 * The videos an editor attached to places on this page, shown on the page.
 *
 * They were only ever inside the detail modal, which opens on a click. That is
 * fine for a reader and useless to everything else: the prerendered HTML for
 * these pages contained no reference to a video at all, so a crawler had no way
 * to know one existed, and describing them in structured data would have been
 * describing something not on the page.
 *
 * DeferredFrame rather than a plain iframe, for the reason its own comment
 * gives: all ten pages are siblings in one scroll container, so `loading="lazy"`
 * does not stop a third-party player being fetched before the reader has gone
 * anywhere near it. Withheld until approached, these cost nothing until they
 * are wanted.
 */
export function PlaceVideos({ items, lang }: { items: PlaceVideo[]; lang: string }) {
  // Deduplicated by URL. The same clip can be attached to more than one place —
  // it is at the time of writing — and showing it twice under two names reads as
  // a mistake, as well as putting two VideoObject records on one video.
  const seen = new Set<string>();
  const unique: PlaceVideo[] = [];
  for (const item of items) {
    const key = (item.video || '').trim();
    if (!key || seen.has(key)) continue;
    const details = getEmbedDetails(key);
    // Only what the player can actually mount. A direct file plays in a <video>
    // and needs no frame, so it is left to the modal rather than given a slot
    // here it cannot fill.
    if (details.type !== 'tiktok' && details.type !== 'youtube') continue;
    seen.add(key);
    unique.push(item);
  }

  if (!unique.length) return null;

  return (
    <div className="lm-span mt-4 pt-3 border-t border-zinc-200/40 space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
        {HEADING[lang] ?? HEADING.en}
      </h3>

      <div className="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-3">
        {unique.map((item) => {
          const details = getEmbedDetails(item.video);
          const portrait = details.type === 'tiktok';
          return (
            <figure key={item.video} className="space-y-1 break-inside-avoid">
              <div
                className={`relative w-full overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-100 ${
                  portrait ? 'aspect-[9/16] max-w-[280px]' : 'aspect-video'
                }`}
              >
                <DeferredFrame
                  title={item.name}
                  src={details.embedUrl}
                  className="absolute inset-0 w-full h-full"
                  placeholder={<span className="text-[9px] font-light text-zinc-400">{item.name}</span>}
                />
              </div>
              <figcaption className="text-[9px] text-zinc-500">{item.name}</figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}
