// ==========================================================================
// Reading a video link, in one place
// ==========================================================================

/**
 * This lived inside PlaceDetailModal, which was fine while the modal was the
 * only thing that showed a video. It is not any more: the topic pages carry
 * the embeds too, and the prerenderer has to describe them to a crawler.
 * Three callers reading a URL three ways is how the import field and the
 * player came to disagree in the first place, so the matcher moves out here
 * before there is a third opinion to reconcile.
 */
/**
 * What the import field accepts, worked out from what getEmbedDetails below
 * can actually render — one rule rather than two.
 *
 * There used to be two, and they disagreed. The field validated against a
 * TikTok-only pattern while the player already handled YouTube and plain
 * video files, so a YouTube link was refused at the door by the very
 * component that would have played it happily. The same link pasted into
 * Creator Studio's Video URL box worked, because that route has no gate at
 * all. Three ways in, three different answers to one question.
 *
 * 'direct' needs the extension test that getEmbedDetails does not do. That
 * branch is a catch-all returning the URL untouched, which is right for
 * rendering — a <video src> either plays or it does not — and wrong as an
 * acceptance test, since it would wave through any string at all.
 */
export const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov|m4v)(?:[?#].*)?$/i;

export type Detected = { ok: boolean; kind: 'tiktok' | 'youtube' | 'direct' | 'none' | 'tiktok-short'; handle: string };

/**
 * vt.tiktok.com and vm.tiktok.com are the links TikTok's own share sheet
 * produces, and they are redirects: the video id only exists on the other side
 * of a request this page cannot make, because TikTok sends no CORS header that
 * would let it. So the field cannot accept them, but it can stop pretending it
 * does not recognise them — the difference between "no idea what this is" and
 * "I know what this is, open it and copy the address bar" is the difference
 * between a dead end and an instruction.
 */
const TIKTOK_SHORT = /^https?:\/\/(?:vt|vm)\.tiktok\.com\//i;

export const detectEmbed = (raw: string): Detected => {
  const url = raw.trim();
  const none: Detected = { ok: false, kind: 'none', handle: '' };
  if (!url) return none;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return none;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return none;
  if (TIKTOK_SHORT.test(url)) return { ok: false, kind: 'tiktok-short', handle: '' };

  const details = getEmbedDetails(url);
  if (details.type === 'tiktok') return { ok: true, kind: 'tiktok', handle: details.handle };
  if (details.type === 'youtube') return { ok: true, kind: 'youtube', handle: '' };
  if (details.type === 'direct' && VIDEO_FILE.test(parsed.pathname)) {
    return { ok: true, kind: 'direct', handle: '' };
  }
  return none;
};
/** The @handle out of a TikTok URL, so the credit can be rendered as our own text. */
const tiktokHandle = (url: string): string => (url.match(/tiktok\.com\/(@[\w.-]+)/i)?.[1] ?? '');

export const getEmbedDetails = (url: string | undefined) => {
  if (!url) return { type: 'none' as const, embedUrl: '', handle: '', sourceUrl: '' };

  // TikTok Video Match
  const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      type: 'tiktok' as const,
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      handle: tiktokHandle(url),
      sourceUrl: url,
    };
  }

  // YouTube match
  // shorts and live sit in the path exactly as embed does, and both were
  // falling through to the catch-all and being refused. They matter more than
  // their share of the URL space suggests: /shorts/ is what YouTube's mobile
  // app puts on the clipboard, so the commonest way to hand this field a link
  // was also the one it would not take.
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube' as const,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`,
      handle: '',
      sourceUrl: url,
    };
  }

  // General fallback if it contains tiktok.com but different format
  if (url.includes('tiktok.com')) {
    const parts = url.split('/video/');
    if (parts.length > 1) {
      const id = parts[1].split('?')[0];
      if (/^\d+$/.test(id)) {
        return {
          type: 'tiktok' as const,
          embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
          handle: tiktokHandle(url),
          sourceUrl: url,
        };
      }
    }
  }

  return { type: 'direct' as const, embedUrl: url, handle: '', sourceUrl: url };
};
