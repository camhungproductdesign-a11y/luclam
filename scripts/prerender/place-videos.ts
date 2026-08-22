import fs from 'fs';
import path from 'path';
import { type Topic } from '../../src/routes';
import { getEmbedDetails } from '../../src/videoEmbed';
import { placesOn } from './place-images';

/**
 * The videos a topic's page shows, with the metadata a crawler needs.
 *
 * Same shape of gap the images had, and the same cause: render-content walks
 * translations.ts, videos live in config.json, and its SKIP_KEYS drops `video`
 * as machinery. So a page could carry two embeds and go out describing none of
 * them.
 *
 * Nothing is guessed. A video appears here only when videos.json holds a
 * complete record for it, because VideoObject has three required properties —
 * name, thumbnailUrl, uploadDate — and a record missing any of them is markup
 * Google will reject and a reader would be misled by. uploadDate in particular
 * cannot be derived: neither YouTube's nor TikTok's oEmbed returns it, so it is
 * filled by hand, the way CREDITS.json attribution is.
 */
export type PlaceVideoMeta = {
  /** The link an editor pasted. */
  sourceUrl: string;
  /** The frame the page mounts. */
  embedUrl: string;
  /** The place this belongs to, which is what the caption says. */
  placeName: string;
  /** Empty until fetch-video-meta has run. */
  name: string;
  thumbnailUrl: string;
  /** ISO 8601, hand-filled — see fetch-video-meta. Empty until someone types it. */
  uploadDate: string;
  description: string;
  /**
   * Whether this can be described in structured data, which is a stricter bar
   * than being shown. A link to the video needs nothing but the URL; a
   * VideoObject needs a name, a thumbnail and a date, and lacking any one of
   * them the block is discarded by Google rather than partially honoured.
   */
  describable: boolean;
};

type Record_ = { name?: string; thumbnailUrl?: string; uploadDate?: string; description?: string };

const readJson = <T,>(rel: string, fallback: T): T => {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), 'utf-8')) as T;
  } catch {
    return fallback;
  }
};

const overrides: Record<string, { video?: string }> =
  readJson<any>('public/config.json', {}).customMedia ?? {};

const meta: Record<string, Record_> = readJson('public/videos.json', {});

/** How many videos are attached but cannot be described yet, for the build log. */
export const incompleteVideos: string[] = [];

export function videosFor(topic: Topic, t: any): PlaceVideoMeta[] {
  const out: PlaceVideoMeta[] = [];
  const seen = new Set<string>();

  for (const place of placesOn(topic, t)) {
    const url = (overrides[place.id]?.video ?? '').trim();
    if (!url || seen.has(url)) continue;

    const details = getEmbedDetails(url);
    // Only what the page actually mounts a frame for. A direct file plays in a
    // <video> the prerenderer does not emit, so describing it would describe
    // something absent again.
    if (details.type !== 'tiktok' && details.type !== 'youtube') continue;
    seen.add(url);

    const record = meta[url] ?? {};
    const describable = Boolean(record.name && record.thumbnailUrl && record.uploadDate);
    if (!describable && !incompleteVideos.includes(url)) incompleteVideos.push(url);

    out.push({
      sourceUrl: url,
      embedUrl: details.embedUrl,
      placeName: place.name,
      // Falls back to the place, so the link on the page always has something
      // to say even before anyone has run fetch-video-meta.
      name: record.name || place.name,
      thumbnailUrl: record.thumbnailUrl ?? '',
      uploadDate: record.uploadDate ?? '',
      description: record.description || place.name,
      describable,
    });
  }

  return out;
}
