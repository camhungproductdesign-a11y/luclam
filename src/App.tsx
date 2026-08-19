import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe,
  Motorbike,
  Car,
  TrainFront,
  CarTaxiFront,
  Navigation, 
  BookOpen, 
  Compass, 
  PhoneCall, 
  ExternalLink, 
  Info, 
  Star, 
  Map, 
  Coffee, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  Smartphone, 
  ArrowRight, 
  ChevronRight, 
  Calendar,
  Grid,
  Users,
  Utensils,
  Eye,
  Award,
  DollarSign,
  Clock,
  Ticket,
  Tag,
  ShieldAlert,
  Settings
} from 'lucide-react';
import { COMPANY, STORES, STORES_BY_CITY, storeMapUrl, storeName } from './company';
import { faqFor } from './faq';
import { PageHeading } from './components/PageHeading';
import { SectionTabs } from './components/SectionTabs';
import { DeferredFrame } from './components/DeferredFrame';

// ==========================================================================
// Translation Data for Saigon Pocket Guide
// ==========================================================================
import { Language, translations } from './translations';
import { useMediaUrl } from './hooks/useMediaUrl';
import { withBasePath } from './basePath';
import { Picture } from './components/Picture';
import { PlaceDetailModal } from './components/PlaceDetailModal';
const CreatorStudio = React.lazy(() =>
  import('./components/CreatorStudio').then((module) => ({ default: module.CreatorStudio }))
);
import { defaultMedia } from './defaultMedia';
import { authHeaders, saveFailedMessage, UNAUTHORIZED_MESSAGE } from './adminToken';
import { resolveContent } from './resolveContent';
import { pathFor, parsePath, TOPICS, type Topic } from './routes';

/**
 * Keep a hyphenated word whole when a navigation label has to wrap.
 *
 * "Văn Hóa & Điểm Check-In" broke as "…Check-" / "In" in the sidebar, because a
 * hyphen is a line-break opportunity: at weight 400 the first line measured
 * 166px inside 167px of room, so it fit by a single pixel and the browser took
 * it. Selecting the item made the text bold, that pixel disappeared, and the
 * break moved to the space — the same label wrapped two different ways
 * depending on whether you had clicked it.
 *
 * U+2011 draws as a hyphen and offers no break, so the wrap point stops
 * depending on a pixel. Only the navigation labels get it: these same strings
 * go into <title>, the breadcrumb and the meta description, and those keep the
 * plain ASCII hyphen a crawler expects to match.
 */
const unbreakableHyphens = (label: string): string =>
  label.replace(/(\p{L})-(\p{L})/gu, '$1‑$2');

const supportedLanguages: Language[] = ['ja', 'vi', 'zh', 'zht', 'en', 'ko'];
const htmlLanguage: Record<Language, string> = {
  ja: 'ja', vi: 'vi', zh: 'zh-CN', zht: 'zh-TW', en: 'en', ko: 'ko'
};
/**
 * An inline SVG rather than a file: this is the last resort for every image on
 * the site, so it must not depend on a network request or on a file being
 * decodable. It previously pointed at /uploads/cover-benthanh.jpg, which cannot
 * be decoded, so a broken image fell back to another broken image and the
 * handler ended up hiding the element entirely — the empty grey boxes.
 *
 * A tea leaf on the brand's cream, drawn so a missing photo reads as a
 * deliberate placeholder rather than a failure.
 */
const fallbackImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#e6e2d8"/>
      <path d="M48 24C34 38 34 60 48 74C62 60 62 38 48 24Z" fill="#0b433f" opacity="0.22"/>
      <path d="M48 30V70" stroke="#0b433f" stroke-opacity="0.3" stroke-width="2" stroke-linecap="round"/>
    </svg>`.replace(/\s+/g, ' ')
  );

/**
 * Opens the Creator Studio interface, and nothing beyond it.
 *
 * This value ships inside the JavaScript bundle, so anyone who opens devtools
 * can read it. That is a door kept shut against visitors, not a lock — and it
 * is all this needs to be, because it guards no data on its own.
 *
 * Writing is a separate gate on the server: every change to config.json is
 * checked against ADMIN_TOKEN with a timing-safe comparison, and the server
 * refuses to start without one. Someone who reads the passcode out of the
 * bundle can open the panel and look; saving still fails without that token.
 *
 * There used to be two entrances and only one of them asked. `?creator=true`
 * granted creator mode outright, so the passcode on the brand tap was
 * decorative — typing the parameter walked straight past it. Both go through
 * here now.
 */
const CREATOR_PASSCODE = '12345';

function askForCreatorPasscode(): boolean {
  const entered = window.prompt('Nhập mật khẩu quản trị để mở Creator Studio:');
  if (entered === null) return false; // cancelled — say nothing
  if (entered === CREATOR_PASSCODE) return true;
  window.alert('Mật khẩu không đúng.');
  return false;
}

/**
 * Where each tea can be bought, used when nothing has been set in the editor.
 * These sat inline in the render as an array indexed by position, so a sixth
 * product silently fell through to a generic search page. Editable per product
 * as menuItems[i].buyLuclam / buyTaka; these are only the starting values.
 */
const DEFAULT_BUY_LINKS: Array<{ luclam: string; taka: string }> = [
  {
    luclam: 'https://luclam.vn/collections/hop-50-g',
    taka: 'https://online.takashimaya-vn.com/chai-tra-red-lava-luc-lam-50g--s230800289',
  },
  {
    luclam: 'https://luclam.vn/collections/hop-50-g',
    taka: 'https://online.takashimaya-vn.com/chai-tra-velvet-rose-luc-lam-50g--s230800295',
  },
  {
    luclam: 'https://luclam.vn/collections/hop-50-g',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
    luclam: 'https://luclam.vn/collections/hop-50-g',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
    luclam: 'https://luclam.vn/collections/hop-50-g',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
];

/**
 * The fare table used to live here, as a module constant holding names, prices
 * and payment methods for the four modes. Every part of it has moved into
 * translations.transport.options, and for two different reasons.
 *
 * The names and payment methods moved because they are language: readers of
 * all six were being shown English.
 *
 * The figures moved because of where this file ends up. scripts/prerender
 * generates the static pages from translations.ts, so anything held here is
 * absent from the HTML — the fare table was rendered by the app and by nothing
 * else, which meant crawlers and assistants had never seen a single price on
 * the transport page. They are also the most perishable facts on the site,
 * owned by Grab and the taxi firms rather than by Lục Lam, and being outside
 * translations put them beyond the editor's reach as well: the numbers most
 * likely to change were the only ones that needed a developer.
 */

const FALLBACK_BUY_LINKS = {
  luclam: 'https://luclam.vn/collections/all',
  taka: 'https://www.takashimaya-vietnam.com/vn/search?q=luc+lam',
};

function useFallbackImage(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') {
    image.style.display = 'none';
    return;
  }
  image.dataset.fallbackApplied = 'true';
  image.src = fallbackImage;
}

function getInitialLanguage(): Language {
  const requested = new URLSearchParams(window.location.search).get('lang') as Language | null;
  if (requested && supportedLanguages.includes(requested)) return requested;
  try {
    const saved = localStorage.getItem('saigon_guide_lang') as Language | null;
    if (saved && supportedLanguages.includes(saved)) return saved;
  } catch {
    // Storage can be unavailable in private browsing; continue with browser language.
  }
  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith('zh-tw') || browserLanguage.startsWith('zh-hk')) return 'zht';
  const language = browserLanguage.split('-')[0] as Language;
  return supportedLanguages.includes(language) ? language : 'vi';
}

/**
 * A non-root path was requested explicitly, so it decides both language and
 * topic. Only at the root do we fall back to query, storage, then locale.
 */
function getInitialState(): { lang: Language; topic: Topic } {
  const fromPath = parsePath(window.location.pathname);
  if (window.location.pathname !== '/') return fromPath;
  return { lang: getInitialLanguage(), topic: 'cover' };
}

// Inline helper component to safely resolve hook-based media URLs inside mapped lists
function ThumbnailPreview({ url }: { url: string | undefined }) {
  const resolved = useMediaUrl(url);
  if (!resolved) {
    // The flag emoji that used to sit here has no glyph on Windows, which draws
    // the two regional-indicator letters instead — every place without a photo
    // showed a bare "VN". The shared fallback graphic renders the same
    // everywhere.
    return (
      <img
        src={fallbackImage}
        alt=""
        width={64}
        height={64}
        decoding="async"
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <Picture
      src={resolved}
      alt=""
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover" 
      referrerPolicy="no-referrer"
      onError={useFallbackImage}
    />
  );
}

export default function App() {
  const [initialState] = useState(getInitialState);
  const [lang, setLang] = useState<Language>(initialState.lang);
  const [currentPage, setCurrentPage] = useState<number>(TOPICS.indexOf(initialState.topic));
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  
  // Custom states for interactive elements
  const [showFeaturePopup, setShowFeaturePopup] = useState<number | null>(null);
  const [showTransportPopup, setShowTransportPopup] = useState<number | null>(null);
  const [voucherClaimed, setVoucherClaimed] = useState<boolean>(false);
  const [activeFoodTab, setActiveFoodTab] = useState<number>(0);
  // No 'all' here, the same way page 06 has no "all" tab: it listed 26 places
  // at once, which came to 2315px in a 820px screen — the single worst overflow
  // on the site, and it was the default, so that wall of cards was what the
  // page opened on. One category at a time is what the tabs are for.
  const [activeCultureCategory, setActiveCultureCategory] = useState<'heritage' | 'spiritual' | 'modern' | 'nature'>('heritage');
  const [benThanhMapTab, setBenThanhMapTab] = useState<'gate' | 'google'>('google');
  // Pages 03, 09 and 10 held more than their screen could take — 461px, 702px
  // and 573px of scroll at 1440x900. Each now shows one group at a time, the
  // way pages 06 and 07 already did. The panels stay mounted; see SectionTabs.
  const [activeAtmosphereTab, setActiveAtmosphereTab] = useState<'districts' | 'map'>('districts');
  const [activeLuclamTab, setActiveLuclamTab] = useState<'teas' | 'stores' | 'offers'>('teas');
  const [activeInfoTab, setActiveInfoTab] = useState<'info' | 'contact' | 'faq'>('info');
  const [expandedTea, setExpandedTea] = useState<number | null>(null);
  
  // Creator check
  const [isCreator, setIsCreator] = useState<boolean>(() => {
    try {
      return localStorage.getItem('saigon_guide_is_creator') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Dynamic custom content and custom media assignment states
  const [overrides, setOverrides] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('saigon_guide_overrides');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [customMedia, setCustomMedia] = useState<Record<string, { img: string; video: string }>>(() => {
    try {
      const saved = localStorage.getItem('saigon_guide_custom_media');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.cover?.img || parsed.cover.img.includes('unsplash.com')) {
          parsed.cover = { img: '/uploads/cover-benthanh.jpg', video: '' };
        }
        return parsed;
      }
      return { cover: { img: '/uploads/cover-benthanh.jpg', video: '' } };
    } catch (e) {
      return { cover: { img: '/uploads/cover-benthanh.jpg', video: '' } };
    }
  });

  const [showEditor, setShowEditor] = useState<boolean>(() => {
    try {
      return localStorage.getItem('saigon_guide_is_creator') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [activeEditPlaceId, setActiveEditPlaceId] = useState<string | null>(null);

  useEffect(() => {
    if (!isCreator || !showEditor || selectedPlace) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowEditor(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCreator, showEditor, selectedPlace]);

  const phoneScreenRef = useRef<HTMLDivElement>(null);

  // True while navigateToPage's own smooth scroll is running, so the scroll
  // handler does not rewrite state and URL for every page it passes through.
  const programmaticScrollRef = useRef(false);
  const scrollSettleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pagesList = ['cover', 'welcome', 'atmosphere', 'transport', 'stay', 'food', 'culture', 'shopping', 'luclam', 'info'] as const;

  const [brandClicks, setBrandClicks] = useState<number>(0);

  // Sync state with server on load, and check query params for ?creator=true
  useEffect(() => {
    const initConfigAndCreator = async () => {
      // Check query param
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('creator') === 'true') {
          // Strip the parameter before asking, not after. Left in place, a
          // wrong answer would be met with the same prompt on every reload,
          // and the URL would keep advertising the way in.
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

          if (askForCreatorPasscode()) {
            localStorage.setItem('saigon_guide_is_creator', 'true');
            setIsCreator(true);
            setShowEditor(true);
          }
        }
      } catch (e) {
        console.warn('URL parsing error:', e);
      }

      // Fetch config from server
      let configLoaded = false;
      try {
        // Try fetching dynamic config from Express API first
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          if (data && (data.overrides || data.customMedia)) {
            const loadedOverrides = data.overrides || {};
            const loadedMedia = data.customMedia || {};
            if (!loadedMedia.cover?.img || loadedMedia.cover.img.includes('unsplash.com')) {
              loadedMedia.cover = { img: '/uploads/cover-benthanh.jpg', video: '' };
            }
            setOverrides(loadedOverrides);
            setCustomMedia(loadedMedia);
            localStorage.setItem('saigon_guide_overrides', JSON.stringify(loadedOverrides));
            localStorage.setItem('saigon_guide_custom_media', JSON.stringify(loadedMedia));
            configLoaded = true;
            console.log('Successfully loaded config from Express API.');
          }
        }
      } catch (err) {
        console.warn('Express API /api/config not available, trying static config:', err);
      }

      if (!configLoaded) {
        try {
          // Fallback to static config.json from CDN/root
          const res = await fetch(withBasePath('/config.json'));
          if (res.ok) {
            const data = await res.json();
            if (data && (data.overrides || data.customMedia)) {
              const loadedOverrides = data.overrides || {};
              const loadedMedia = data.customMedia || {};
              if (!loadedMedia.cover?.img || loadedMedia.cover.img.includes('unsplash.com')) {
                loadedMedia.cover = { img: '/uploads/cover-benthanh.jpg', video: '' };
              }
              setOverrides(loadedOverrides);
              setCustomMedia(loadedMedia);
              localStorage.setItem('saigon_guide_overrides', JSON.stringify(loadedOverrides));
              localStorage.setItem('saigon_guide_custom_media', JSON.stringify(loadedMedia));
              configLoaded = true;
              console.log('Successfully loaded static config.json from CDN/root as fallback.');
            }
          }
        } catch (err) {
          console.warn('Failed to fetch fallback static /config.json:', err);
        }
      }
    };

    initConfigAndCreator();
  }, []);

  // Language is initialized synchronously to avoid a flash of the wrong language.
  useEffect(() => {
    try {
      const savedVoucher = localStorage.getItem('saigon_guide_voucher');
      if (savedVoucher === 'true') {
        setVoucherClaimed(true);
      }
    } catch (e) {
      console.warn('LocalStorage blocked or not supported:', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLanguage[lang];
  }, [lang]);

  useEffect(() => {
    // The static block exists for crawlers that do not run JavaScript. Remove it
    // once React has rendered, or the page carries the content twice.
    document.getElementById('static-content')?.remove();

    // createRoot clears #root on mount, which should already have taken the
    // splash with it. Removing it again is a no-op then, and a safety net if
    // that behaviour ever changes.
    document.getElementById('app-splash')?.remove();
  }, []);

  useEffect(() => {
    // Do not leave a pending scroll-settle callback behind on unmount.
    return () => {
      if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current);
    };
  }, []);

  useEffect(() => {
    // Back and forward restore the language and topic encoded in the URL.
    const handlePopState = () => {
      const { lang: nextLang, topic } = parsePath(window.location.pathname);
      setLang(nextLang);
      setCurrentPage(TOPICS.indexOf(topic));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update localStorage when preferences change
  const handleLangChange = (selectedLang: Language) => {
    setLang(selectedLang);
    // Stay on the topic being read rather than bouncing back to the cover.
    window.history.pushState({}, '', pathFor(selectedLang, TOPICS[currentPage]));
    try {
      localStorage.setItem('saigon_guide_lang', selectedLang);
    } catch (e) {
      console.warn('Failed to save language:', e);
    }
  };

  /**
   * Sends the editor's state to the server and reports whether it arrived.
   *
   * Both callers apply the change to React state and localStorage before this
   * runs, which keeps the editor responsive and stops an operator losing work
   * to a failed request. The cost is that the screen shows the new content
   * whatever happens next, so a failure has to be said out loud — it cannot be
   * inferred from anything visible.
   *
   * Only 401 used to be reported. A 500, a stopped server or a dropped
   * connection all landed in a catch with a console.warn, and the editor looked
   * like it had saved every single time. public/config.json is what visitors
   * are served, so those silent failures left the operator's browser and the
   * live site disagreeing with nothing on screen to say so.
   */
  const saveConfigToServer = async (payload: { overrides: any; customMedia: Record<string, { img: string; video: string }> }) => {
    let response: Response;
    try {
      response = await fetch('/api/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // Thrown when the request never completed: server stopped, network down.
      alert(saveFailedMessage(e instanceof Error ? e.message : 'không gọi được máy chủ'));
      return;
    }

    if (response.status === 401) {
      alert(UNAUTHORIZED_MESSAGE);
      return;
    }
    if (!response.ok) {
      alert(saveFailedMessage(`máy chủ trả về HTTP ${response.status}`));
    }
  };

  const handleUpdateOverrides = async (newOverrides: any) => {
    setOverrides(newOverrides);
    try {
      localStorage.setItem('saigon_guide_overrides', JSON.stringify(newOverrides));
    } catch (e) {
      console.warn('Failed to save overrides locally:', e);
    }
    await saveConfigToServer({ overrides: newOverrides, customMedia });
  };

  const handleUpdateCustomMedia = async (newCustomMedia: Record<string, { img: string; video: string }>) => {
    setCustomMedia(newCustomMedia);
    try {
      localStorage.setItem('saigon_guide_custom_media', JSON.stringify(newCustomMedia));
    } catch (e) {
      console.warn('Failed to save custom media locally:', e);
    }
    await saveConfigToServer({ overrides, customMedia: newCustomMedia });
  };

  // The prompt used to live inside the setBrandClicks updater. React may run an
  // updater more than once for the same click — StrictMode does exactly that in
  // development — and each run opened its own dialog, so unlocking meant typing
  // the passcode twice. Updaters have to stay pure; the dialog belongs out here.
  const handleBrandClick = () => {
    const next = brandClicks + 1;
    if (next < 5) {
      setBrandClicks(next);
      return;
    }

    setBrandClicks(0);
    if (askForCreatorPasscode()) {
      localStorage.setItem('saigon_guide_is_creator', 'true');
      setIsCreator(true);
      setShowEditor(true);
      alert("🎉 Đã kích hoạt Chế độ Creator trên thiết bị này!");
    }
  };

  const handleDeactivateCreator = () => {
    if (window.confirm("Bạn có chắc chắn muốn Tắt chế độ Creator trên thiết bị này? Thiết bị sẽ quay lại chế độ Xem (Reader Mode).")) {
      localStorage.removeItem('saigon_guide_is_creator');
      setIsCreator(false);
      setShowEditor(false);
      alert("Đã tắt chế độ Creator thành công.");
    }
  };

  // Helper to retrieve active media (custom takes precedence over defaults)
  /**
   * Merges the override over the default field by field, rather than letting
   * the presence of an override replace the pair.
   *
   * The editor writes both keys whenever either changes — assignMediaToPlace
   * starts from { img: '', video: '' } — so adding a TikTok link to a place
   * stored an empty img beside it. Returning that record whole then hid the
   * default photograph, and the card fell back to the placeholder graphic. The
   * Saigon Central Post Office lost its picture that way: the file was intact
   * on disk and referenced correctly, and an empty string was standing in front
   * of it.
   *
   * The trade-off is that an override can no longer clear a default down to
   * nothing, since an empty value now means "not set" rather than "set to
   * empty". Nothing in the interface asks for that, and the other reading has
   * cost this project real content twice — nineteen places were shadowed the
   * same way once before.
   */
  const getPlaceMedia = (placeId: string) => {
    const fallback = defaultMedia[placeId] || { img: '', video: '' };
    const custom = customMedia[placeId];
    if (!custom) return fallback;

    return {
      img: custom.img || fallback.img,
      video: custom.video || fallback.video,
    };
  };

  const handleOpenDetail = (type: 'food' | 'culture' | 'shopping' | 'product', catIdxOrIdx: number, itemIdx?: number, placeData?: any) => {
    let placeId = '';
    let emoji = '📍';
    if (type === 'food') {
      placeId = `food-${catIdxOrIdx}-${itemIdx}`;
      emoji = t.food.categories[catIdxOrIdx].emoji;
    } else if (type === 'culture') {
      placeId = `culture-${catIdxOrIdx}`;
      emoji = placeData.emoji || '🏛️';
    } else if (type === 'shopping') {
      placeId = `shopping-${catIdxOrIdx}`;
      emoji = placeData.emoji || '🛍️';
    } else if (type === 'product') {
      // Tea products reuse the place modal so they inherit its TikTok embed.
      placeId = `luclam-${catIdxOrIdx}`;
      emoji = '🍵';
    }

    const stored = getPlaceMedia(placeId);
    // Product images live in translations rather than defaultMedia, so fall back
    // to the one shipped with the item when nothing has been assigned.
    const media =
      type === 'product' && !stored.img
        ? { ...stored, img: placeData.image || '' }
        : stored;

    setSelectedPlace({
      id: placeId,
      name: placeData.name,
      sub: placeData.sub,
      desc: placeData.desc,
      addr: placeData.addr,
      hours: placeData.hours,
      price: placeData.price || '',
      emoji,
      media
    });
  };

  /**
   * How wide one page is, and how many of them the frame is showing.
   *
   * Measured from the first section rather than assumed from a breakpoint: the
   * spread is expressed in CSS (`lg:w-1/2`), and reading it back means the
   * arithmetic follows the layout instead of restating it. A second copy of
   * "1024px means two pages" is a second thing to get wrong.
   */
  const spreadMetrics = () => {
    const el = phoneScreenRef.current;
    if (!el) return null;
    const frame = el.clientWidth;
    const page = (el.firstElementChild as HTMLElement | null)?.clientWidth || frame;
    if (page <= 0 || frame <= 0) return null;
    return { frame, page, perView: Math.max(1, Math.round(frame / page)) };
  };

  /** Where the scroll must sit for a page to be on screen. */
  const offsetFor = (index: number) => {
    const m = spreadMetrics();
    if (!m) return 0;
    return Math.floor(index / m.perView) * m.frame;
  };

  /**
   * Which page a scroll position means.
   *
   * A spread holds two pages, so a position maps to a pair rather than to one
   * page. If the reader's current page is already in that pair, it stays
   * selected — otherwise clicking "Useful Info" would scroll to the 9-10 spread
   * and the highlight would slide back to "Lục Lam Stop" on its own.
   */
  const pageAtScroll = (scrollLeft: number, current: number) => {
    const m = spreadMetrics();
    if (!m) return current;
    const left = Math.round(scrollLeft / m.frame) * m.perView;
    if (current >= left && current < left + m.perView) return current;
    return Math.min(left, pagesList.length - 1);
  };

  // Keep phone screen scroll position in sync with page transitions
  const navigateToPage = (index: number) => {
    if (index < 0 || index >= pagesList.length) return;
    setCurrentPage(index);

    // Each topic gets its own URL, so it can be linked to, shared and indexed.
    const nextPath = pathFor(lang, TOPICS[index]);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({ topic: TOPICS[index] }, '', nextPath);
    }

    if (phoneScreenRef.current) {
      // The smooth scroll travels across every page in between, firing the
      // scroll handler the whole way. State and URL are already correct, so
      // flag the animation and let the handler stand down until it settles.
      programmaticScrollRef.current = true;
      phoneScreenRef.current.scrollTo({
        left: offsetFor(index),
        behavior: 'smooth'
      });
    }
  };

  // Sync state if user swipes inside the mockup (scroll listener)
  const handlePhoneScroll = () => {
    if (!phoneScreenRef.current) return;
    if (!spreadMetrics()) return;

    const index = pageAtScroll(phoneScreenRef.current.scrollLeft, currentPage);
    if (index < 0 || index >= pagesList.length) return;

    // Writing the URL on every frame of a scroll rewrites it once per page
    // crossed, and browsers throttle the History API for exactly that. Wait
    // until the scroll stops, then write once.
    if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current);
    scrollSettleRef.current = setTimeout(() => {
      scrollSettleRef.current = null;
      programmaticScrollRef.current = false;
      if (!phoneScreenRef.current) return;

      const settled = pageAtScroll(phoneScreenRef.current.scrollLeft, currentPage);
      if (settled < 0 || settled >= pagesList.length) return;

      // Reconcile against where the scroll actually stopped rather than where it
      // was sent: a swipe can interrupt a click's animation and land elsewhere.
      // After a plain click these already match, so nothing is written.
      setCurrentPage(settled);
      // A swipe should not stack history entries, hence replace rather than push.
      const nextPath = pathFor(lang, TOPICS[settled]);
      if (window.location.pathname !== nextPath) {
        window.history.replaceState({ topic: TOPICS[settled] }, '', nextPath);
      }
    }, 120);

    // The page indicator should track a finger in real time, but must not fight
    // the animation a click already started.
    if (!programmaticScrollRef.current && index !== currentPage) {
      setCurrentPage(index);
    }
  };

  useEffect(() => {
    // The carousel always starts on the first page, so anything that sets the
    // page from outside it — a deep link on load, the back button — moved the
    // nav and the URL while leaving the cover on screen. Bring the scroll
    // position to whatever the state says.
    //
    // Skipped while navigateToPage's own smooth scroll is running, or this
    // would jump straight to the destination and cut the animation short.
    if (programmaticScrollRef.current) return;

    const el = phoneScreenRef.current;
    if (!el) return;
    const target = offsetFor(currentPage);
    if (!spreadMetrics()) return;

    if (Math.abs(el.scrollLeft - target) < 1) return;
    programmaticScrollRef.current = true;
    el.scrollLeft = target;
  }, [currentPage]);

  // Handle window resizing to keep page alignment in scroll mockup
  useEffect(() => {
    const handleResize = () => {
      if (phoneScreenRef.current) {
        // Crossing the lg breakpoint changes how many pages the frame holds, so
        // the offset has to be recomputed rather than scaled.
        phoneScreenRef.current.scrollLeft = offsetFor(currentPage);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage]);

  // Scroll active mobile tab button into view
  useEffect(() => {
    const activeBtn = document.getElementById(`mobile-tab-btn-${currentPage}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentPage]);

  // Shared with scripts/prerender so the generated HTML and the running app
  // resolve content the same way. See src/resolveContent.ts.
  const t = resolveContent(lang, overrides);


  return (
    <div
      className="app-shell w-full flex flex-col md:flex-row overflow-hidden bg-[#0b1513] text-zinc-200"
      id="saigon-guide-root"
    >
      
      {/* ==========================================================================
          DESKTOP SIDEBAR NAVIGATION (Hidden on mobile)
          ========================================================================== */}
      {/* Scrolls on its own: the shell is a fixed 100dvh so anything taller than
          the viewport has nowhere else to go. justify-start plus mt-auto on the
          footer rather than justify-between, which can push content above the
          scroll origin once it overflows. */}
      <aside className="hidden lg:flex flex-col w-[340px] border-r border-zinc-800/50 p-8 shrink-0 bg-[#0f1f1b] relative z-10 justify-start overflow-y-auto">
        <div className="space-y-8 shrink-0">
          {/* Brand header */}
          <div className="space-y-1">
            {/* Brand mark, not the page heading — the cover heading is the h1. */}
            <div
              onClick={handleBrandClick}
              className="text-2xl font-serif tracking-wider text-[#d16b4c] font-bold select-none cursor-pointer"
            >
              {t.brand}
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-medium">{t.subtitle}</p>
          </div>

          {/* Language Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d16b4c]" />
              <span>Language / 言語 / ngôn ngữ</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-black/30 p-1.5 rounded-xl border border-zinc-800/40">
              <button 
                id="btn-lang-en"
                onClick={() => handleLangChange('en')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'en' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇺🇸</span><span>English</span>
              </button>
              <button 
                id="btn-lang-zht"
                onClick={() => handleLangChange('zht')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'zht' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇹🇼</span><span>繁體中文</span>
              </button>
              <button 
                id="btn-lang-zh"
                onClick={() => handleLangChange('zh')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'zh' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇨🇳</span><span>简体中文</span>
              </button>
              <button 
                id="btn-lang-ja"
                onClick={() => handleLangChange('ja')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'ja' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇯🇵</span><span>日本語</span>
              </button>
              <button 
                id="btn-lang-ko"
                onClick={() => handleLangChange('ko')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'ko' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇰🇷</span><span>한국어</span>
              </button>
              <button 
                id="btn-lang-vi"
                onClick={() => handleLangChange('vi')}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  lang === 'vi' 
                    ? 'bg-[#0b433f] text-white shadow-lg shadow-black/20 ring-1 ring-[#d16b4c]/30' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'
                }`}
              >
                <span>🇻🇳</span><span>Tiếng Việt</span>
              </button>
            </div>
          </div>

          {/* Theme Switcher & Settings */}
          {/* Whole block is creator-only now. It used to hold the theme toggle
              too, so a reader saw the heading with the editor button hidden
              beneath it; with the toggle gone that left a heading over nothing. */}
          {isCreator && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d16b4c]" />
                <span>Editor / 編集</span>
              </label>
              <button 
                onClick={() => setShowEditor(!showEditor)}
                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group text-left ${
                  showEditor 
                    ? 'bg-[#b85233]/20 border-[#b85233]/45 text-[#f0815e] ring-1 ring-[#b85233]/30' 
                    : 'bg-black/30 hover:bg-black/50 border-zinc-800/40 text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`w-5 h-5 text-[#d16b4c] group-hover:rotate-45 transition-transform duration-500 ${showEditor ? 'animate-spin-slow' : ''}`} />
                  <div>
                    <div className="text-xs font-bold">Creator Studio / 編集</div>
                    <div className="text-[10px] text-zinc-400">Add photos, video, content overrides</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
              </button>
            </div>
          )}

          {/* Navigation Menu Links */}
          <nav className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-4">
              Guide Contents
            </label>
            <ul className="space-y-1" id="desktop-nav-menu">
              {pagesList.map((pageName, idx) => (
                <li key={pageName}>
                  {/* border-l-4 on both states, colour on one.
                      It used to sit only on the selected item, so selecting a
                      page took 4px off its own text box — measured, 269px
                      unselected against 265px selected. A label near a wrap
                      point therefore re-wrapped the moment you clicked it. The
                      border is always there now; only its colour turns on. */}
                  <button
                    id={`desktop-nav-item-${idx}`}
                    onClick={() => navigateToPage(idx)}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl transition-all duration-300 text-left border-l-4 ${
                      currentPage === idx
                        ? 'bg-[#b85233]/15 text-[#d98a6e] font-semibold border-[#b85233]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* opacity-90, not 75: at 75 the numeral resolved to
                          #7b7f86 against the sidebar and measured 4.23:1, just
                          under the 4.5:1 this size needs. 90 keeps it quieter
                          than the label beside it and measures 5.75:1. */}
                      {/* padStart, not a literal "0" in front: the tenth page
                          read "010". */}
                      <span className="font-serif text-xs opacity-90 shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm">{unbreakableHyphens(t.pages[pageName])}</span>
                    </div>
                    {/* zinc-400 on zinc-800 is 5.81:1; zinc-500 was 3.08:1. */}
                    {/* shrink-0 + whitespace-nowrap: justify-between de ca hai con deu co
                        duoc, nen "Pg 7" bi bop thanh hai dong khi nhan ben canh
                        dai — dung cai loi da sua o PageHeading. Nua ngan phai
                        duoc ghim de nua dai xuong dong. */}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase shrink-0 whitespace-nowrap ${
                      currentPage === idx ? 'bg-[#b85233] text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      Pg {idx + 1}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto pt-6 border-t border-zinc-800/50 space-y-1 text-center shrink-0">
          <p className="text-[11px] text-zinc-400">&copy; 2026 Lục Lam. All rights reserved.</p>
          <p className="text-[9px] text-zinc-400">Designed for Saigon Travelers with Premium UI</p>
        </div>
      </aside>

      {/* ==========================================================================
          MOBILE NAVIGATION TOP STICKY BAR (Visible on mobile/tablet)
          ========================================================================== */}
      <header className="lg:hidden shrink-0 flex items-center justify-between px-4 py-3 bg-[#0f1f1b] border-b border-zinc-800 sticky top-0 z-50">
        <span
          onClick={handleBrandClick}
          className="text-lg font-serif font-bold text-[#d16b4c] select-none cursor-pointer"
        >
          {t.brand}
        </span>
        <div className="flex items-center gap-2">
          {/* Quick select language */}
          {/* A select whose options are language names still needs to say what
              it is for: a screen reader announces "combo box, Tiếng Việt" and
              the reader has no idea whether that picks a language, a city or a
              currency. The same gap is why an assistant driving this page
              cannot tell what the control does. */}
          <select
            id="mobile-lang-select"
            aria-label={
              {
                vi: 'Chọn ngôn ngữ',
                en: 'Select language',
                ja: '言語を選択',
                ko: '언어 선택',
                zh: '选择语言',
                zht: '選擇語言',
              }[lang] ?? 'Select language'
            }
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as Language)}
            className="bg-zinc-800/90 text-white text-xs py-1.5 px-2.5 rounded-lg border border-zinc-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#d16b4c]"
          >
            <option value="en">English</option>
            <option value="zht">繁體中文</option>
            <option value="zh">简体中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="vi">Tiếng Việt</option>
          </select>
          
        </div>
      </header>

      {/* ==========================================================================
          MAIN AREA: THE INTERACTIVE MOBILE DEVICE MOCKUP / OR DIRECT LAYOUT
          ========================================================================== */}
      <main className="flex-1 flex items-center justify-center p-0 lg:p-8 relative overflow-y-auto">
        
        {/* Device Container Mockup frame on desktop */}
        <div className="w-full max-w-full lg:max-w-none h-full bg-zinc-900 border-0 lg:border-8 lg:border-zinc-800 lg:rounded-3xl lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden transition-all duration-300">
          
          {/* Nothing here any more. The notch went when the frame stopped
              pretending to be a phone, and the fold went with the spread. */}

          {/* Safe viewport window inside device frame */}
          <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f6f3eb]">
            
            {/* Phone Screen Container: Scroll snapping slides */}
            <div 
              ref={phoneScreenRef}
              onScroll={handlePhoneScroll}
              className="flex-1 flex overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              id="phone-screen-viewport"
            >

              {/* ==========================================================================
                  PAGE 01: COVER PAGE
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start text-[#f6f3eb] flex flex-col justify-between page-section p-6 relative overflow-y-auto overflow-x-hidden bg-zinc-950">
                
                {/* Full-bleed high-contrast premium Ben Thanh aerial photograph background */}
                <div className="absolute inset-0 transition-all duration-700">
                  <Picture
                    src={(customMedia.cover?.img && !customMedia.cover.img.includes('unsplash.com')) ? customMedia.cover.img : "/uploads/cover-benthanh.jpg"}
                    alt="Chợ Bến Thành Sài Gòn Aerial Cover" 
                    width={1200}
                    height={1600}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={useFallbackImage}
                    className="w-full h-full object-cover transition-opacity duration-300 opacity-90"
                  />
                  {/* Premium vignette gradient overlays for magazine contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/60 to-zinc-950/40"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/85"></div>
                </div>
                
                {/* Masthead strip. The brand leads and the edition is a quiet
                    stamp beside it; they used to compete because wide tracking
                    made the brand read thin while the tighter edition read
                    heavier. Padding was pt-8/pb-3 alongside py-2, so the box sat
                    32px off the top and 12px off the bottom. */}
                <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-black/45 backdrop-blur-md px-4 py-2.5">
                  {/* Larger below lg because the mobile type floor lifts the
                      edition stamp from 8.5px to 11px; without this the two
                      would sit a pixel apart and read as equals again. */}
                  <span className="font-serif font-bold uppercase text-[12px] max-lg:text-[15px] tracking-[0.3em] text-amber-400 leading-none">
                    {t.brand}
                  </span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="w-1 h-1 rounded-full bg-amber-500/70"></span>
                    <span className="font-serif uppercase text-[8.5px] font-medium tracking-[0.14em] text-amber-200/70 leading-none tabular-nums">
                      2026 Edition
                    </span>
                  </span>
                </div>

                {/* Elegant Minimal Magazine Typography Heading */}
                <div className="my-auto space-y-5 text-center relative z-10 px-2 py-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-amber-500/40 rounded-full text-[10px] tracking-widest text-amber-300 uppercase font-bold bg-black/60 backdrop-blur-md shadow-lg">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{t.cover.badge}</span>
                    </div>
                    
                    {/* Big Bold Magazine Title */}
                    <div className="space-y-1">
                      <h1 className="text-5xl md:text-6xl font-serif tracking-tight font-black text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] leading-none uppercase">
                        {t.cover.heading}
                      </h1>
                      <h2 className="text-xl md:text-2xl font-serif tracking-widest font-semibold text-amber-400 italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                        {t.cover.subheading}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-xs mx-auto pt-4">
                    <div className="w-16 h-[2px] bg-amber-500 mx-auto"></div>
                    <p className="text-xs font-semibold tracking-wide text-zinc-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-relaxed">
                      {t.cover.tagline}
                    </p>
                    <div className="w-16 h-[2px] bg-amber-500 mx-auto"></div>
                  </div>

                  {/* Quick highlight chips */}
                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    <span className="text-[8px] font-bold bg-black/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-md shadow">
                      📍 Chợ Bến Thành & Takashimaya
                    </span>
                    <span className="text-[8px] font-bold bg-black/60 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30 backdrop-blur-md shadow">
                      🍵 Lục Lam Art of Tea
                    </span>
                  </div>
                </div>

                {/* Clean cover footer with single elegant call-to-action */}
                <div className="pt-4 pb-4 flex flex-col items-center gap-3 relative z-10 p-5 rounded-2xl w-full text-center bg-black/60 backdrop-blur-md border border-amber-500/20 shadow-2xl">
                  {!customMedia.cover?.img && (
                    <div className="space-y-0.5 text-center">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 block font-semibold">EXCLUSIVE POCKET GUIDE</span>
                      <span className="text-[11px] font-bold text-amber-400 block tracking-wide">by Lục Lam & Team</span>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => navigateToPage(1)}
                    className="w-full max-w-xs inline-flex items-center justify-center gap-2 text-xs text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-5 py-3 rounded-xl transition-all font-bold shadow-xl shadow-black/50 active:scale-95 cursor-pointer text-center uppercase tracking-wider"
                  >
                    <span>{lang === 'vi' ? 'Bắt đầu khám phá' : lang === 'ko' ? '시작하기' : lang === 'ja' ? '探索を始める' : 'Start Exploring'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isCreator && (
                    <button 
                      onClick={() => {
                        setShowEditor(true);
                        setActiveEditPlaceId('cover');
                      }}
                      className="mt-1 text-[9px] text-amber-400 bg-amber-950/40 hover:bg-amber-950/80 px-2.5 py-1.5 rounded-lg border border-amber-500/20 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Settings className="w-3 h-3" />
                      <span>Đổi ảnh bìa (Creator)</span>
                    </button>
                  )}
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 02: WELCOME / INTRODUCTION
                  ========================================================================== */}
              {/* Sized container so the clamps below scale against this page's own
                  height. vh would read the browser window, which on desktop is
                  taller than the 860px device frame this page lives in. */}
              <section className="[container-type:size] w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-5 overflow-y-auto">
                <div className="space-y-[clamp(0.65rem,2.4cqh,1.25rem)] lg:columns-2 lg:gap-6">

                  {/* Minimal page header decoration */}
                  <PageHeading
                    number="02"
                    title={t.pages.welcome}
                    kicker="Welcome to Saigon"
                    padTop="pt-2"
                  />

                  {/* Welcome core headings */}
                  <div className="space-y-2">
                    <h2 className="text-[clamp(1.15rem,3.2cqh,1.5rem)] font-bold font-serif text-[#0b433f] leading-snug whitespace-pre-line">
                      {t.welcome.heading}
                    </h2>
                    <div className="w-12 h-1 bg-[#b85233]"></div>
                  </div>

                  {/* Narrative copy */}
                  <div className="space-y-2 text-xs leading-relaxed text-zinc-700 font-light">
                    <p>{t.welcome.p1}</p>
                    <p>{t.welcome.p2}</p>
                  </div>

                  <p className="text-xs font-semibold text-[#b85233] tracking-wide">
                    {t.welcome.highlight}
                  </p>

                  {/* 2-Column layout: Video mockup + Aesthetic Image Coffee Crop */}
                  <div className="grid grid-cols-2 gap-3">

                    {/* Left: Travel Video & QR Link representation */}
                    <div className="border border-[#b85233]/40 bg-[#b85233]/5 rounded-xl p-3 flex flex-col items-center text-center justify-between space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b85233]">
                        {t.welcome.videoTitle}
                      </span>

                      {/* Custom styled vector play button inside circular gradient */}
                      <div className="relative w-[clamp(2.75rem,7cqh,3.5rem)] h-[clamp(2.75rem,7cqh,3.5rem)] bg-gradient-to-tr from-[#0b433f] to-[#125e59] rounded-full flex items-center justify-center shadow-md shadow-teal-900/20 group cursor-pointer hover:scale-105 transition-all">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-40"></div>
                      </div>

                      <p className="text-[9px] text-zinc-500 leading-normal font-light">
                        {t.welcome.videoDesc}
                      </p>
                    </div>

                    {/* A photograph, where this used to be blurred circles and a
                        line icon behind a gradient. The drawing was meant to
                        suggest coffee and read as a failed image instead — the
                        one card on the page with nothing real in it.

                        Cà phê muối rather than cà phê sữa đá: iced milk coffee
                        is on every corner in Vietnam, while salt coffee and
                        coconut coffee are what a visitor comes back talking
                        about. The photograph is of salt coffee specifically —
                        the salted cream sitting on the dark coffee is the whole
                        point of the drink, and a generic cup would not show it. */}
                    <div className="relative bg-[#e6e2d8] rounded-xl overflow-hidden min-h-[clamp(100px,15cqh,140px)] flex flex-col justify-end p-3 shadow-sm group">
                      <Picture
                        src="/uploads/external/0aad9df07334.jpg"
                        alt="Cà phê muối Sài Gòn"
                        onError={useFallbackImage}
                        width={960}
                        height={1280}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10"></div>

                      {/* Text indicator */}
                      <div className="relative z-20 space-y-0.5">
                        <span className="text-[8px] uppercase tracking-widest text-amber-400 block font-bold">SAIGON COFFEE</span>
                        {/* Translated, like the video card beside it already
                            was. The drink names were hardcoded Vietnamese and
                            showed on all six pages — an English reader was told
                            "Cà Phê Muối", which names the thing without saying
                            what it is. Each language gets its own reading; the
                            Vietnamese page keeps the Vietnamese. */}
                        <span className="text-[10px] font-serif text-white font-bold block">{t.welcome.coffeeTitle}</span>
                      </div>
                    </div>

                  </div>

                  {/* 4 Feature Columns list */}
                  <div className="border-t border-zinc-200/80 pt-3">
                    <div className="grid grid-cols-4 gap-2">
                      {t.welcome.features.map((feat, idx) => {
                        const iconsList = [
                          <Users className="w-4 h-4" />,
                          <Utensils className="w-4 h-4" />,
                          <BookOpen className="w-4 h-4" />,
                          <Navigation className="w-4 h-4" />
                        ];
                        return (
                          <button
                            type="button"
                            key={idx}
                            aria-expanded={showFeaturePopup === idx}
                            aria-controls="feature-detail"
                            onClick={() => setShowFeaturePopup(showFeaturePopup === idx ? null : idx)}
                            className="relative flex flex-col items-center text-center cursor-pointer group rounded-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b433f]/50 transition-transform"
                          >
                            <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center text-[#0b433f] shadow-sm group-hover:bg-[#0b433f] group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                              {iconsList[idx]}
                            </div>
                            {/* The whole title, wrapped over at most two lines.
                                Taking the first word left Vietnamese readers with
                                "Con", "Thiên", "Bản", "Di" — fragments that mean
                                nothing on their own. It only ever looked passable
                                in Japanese and Chinese, which have no spaces for
                                it to cut at. */}
                            <span className="text-[8px] font-bold text-[#0b433f] leading-tight mt-1.5 line-clamp-2 text-balance">
                              {feat.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* The detail below the row, not floating over it — the same
                        move as the transport circles, for the same two reasons.
                        It was w-36, 144px, centred on a column of about 90px, so
                        on the outer two it hung past the frame and was clipped;
                        and it was a dark slab, which is the wrong surface for a
                        guide read outdoors, where reflected light drowns dark
                        pixels first. */}
                    {showFeaturePopup !== null && t.welcome.features[showFeaturePopup] && (
                      <div
                        id="feature-detail"
                        className="mt-3 bg-white p-3 rounded-xl text-[10px] leading-relaxed text-left shadow-sm space-y-1 border border-[#0b433f]/20 animate-in fade-in duration-200"
                      >
                        <strong className="block text-[#0b433f] font-bold text-[11px]">
                          {t.welcome.features[showFeaturePopup].title}
                        </strong>
                        <p className="text-zinc-700">
                          {t.welcome.features[showFeaturePopup].desc}
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Row: Tips Banner (Leaf/Warning/Advice style) */}
                <div className="mt-3 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  {/* Stacked: each of these ran to three lines in a 181px
                      column, a paragraph in a box narrower than its sentences.
                      The rule moves from between them to above the second. */}
                  <div className="space-y-2 divide-y divide-zinc-400/20">
                    <p>{t.welcome.advice[0]}</p>
                    <p className="pt-2">{t.welcome.advice[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 03: CITY GUIDE / DISTRICTS WITH MAP
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6">
                  
                  {/* Minimal page header decoration */}
                  <PageHeading number="03" title={t.pages.atmosphere} kicker="Explore Saigon Map" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.atmosphere.description}
                  </p>

                  {/* Two blocks, one screen. The district cards came to 969px and the
                      Bến Thành map to 727px against 1544px of column, so with both in
                      the flow at once the page scrolled 461px. */}
                  <SectionTabs
                    label={t.pages.atmosphere}
                    active={activeAtmosphereTab}
                    onChange={setActiveAtmosphereTab}
                    tabs={[
                      { id: 'districts', emoji: '🏙️', label: t.pages.atmosphere },
                      {
                        id: 'map',
                        emoji: '🗺️',
                        // The same string the map's own <h3> uses, so the tab
                        // and the heading it reveals cannot say different
                        // things.
                        label: lang === 'vi' ? 'Bản Đồ Chợ Bến Thành' : lang === 'ko' ? '벤탄 시장 지도' : lang === 'ja' ? 'ベンタイン市場 地図' : 'Bến Thành Market Map',
                      },
                    ] as const}
                  />



                  {/* Bến Thành Market Stylized Map Guide */}
                  <div className={`bg-[#fcfbf9] border border-zinc-300/80 rounded-2xl p-4 shadow-sm space-y-3 text-zinc-800 ${activeAtmosphereTab === 'map' ? '' : 'hidden'}`}>
                    {/* Stacked, not two columns on one row.
                        A heading, a subtitle and two labelled tabs will not fit
                        across 430px, and the frame is 430px on a desktop screen
                        as well as on a phone — so a breakpoint fixes nothing
                        here, it only makes the desktop case wrong too. Sharing
                        the row gave the tabs their full width, since they carry
                        shrink-0, and squeezed the text into the remainder: the
                        title broke over two lines and the subtitle over four.

                        Down the page instead, each part gets the full 430px.
                        The tabs split it evenly, which also reads as the
                        segmented control it always was. */}
                    <div className="space-y-2 border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl shrink-0">🗺️</span>
                        <div className="min-w-0">
                          <h3 className="text-xs font-bold text-[#0b433f] uppercase tracking-wider">
                            {lang === 'vi' ? 'Bản Đồ Chợ Bến Thành' : lang === 'ko' ? '벤탄 시장 지도' : lang === 'ja' ? 'ベンタイン市場 地図' : 'Bến Thành Market Map'}
                          </h3>
                          <p className="text-[9px] text-zinc-500 font-light">
                            {lang === 'vi' ? 'Đã đồng bộ trực tiếp với Google Maps' : lang === 'ko' ? '구글 지도와 실시간 동기화됨' : lang === 'ja' ? 'Googleマップと同期済み' : 'Synchronized directly with Google Maps'}
                          </p>
                        </div>
                      </div>

                      {/* Map Toggle Tabs */}
                      <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
                        <button
                          onClick={() => setBenThanhMapTab('google')}
                          className={`flex-1 px-2 py-1 text-[8px] font-bold rounded-md transition-all cursor-pointer ${
                            benThanhMapTab === 'google'
                              ? 'bg-white text-[#0b433f] shadow-sm border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          Google Maps
                        </button>
                        <button
                          onClick={() => setBenThanhMapTab('gate')}
                          className={`flex-1 px-2 py-1 text-[8px] font-bold rounded-md transition-all cursor-pointer ${
                            benThanhMapTab === 'gate'
                              ? 'bg-white text-[#0b433f] shadow-sm border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          {lang === 'vi' ? 'Sơ đồ cổng' : lang === 'ko' ? '게이트 안내도' : 'Gate Layout'}
                        </button>
                      </div>
                    </div>

                    {/* One column, always. sm:grid-cols-2 split this in half on
                        any viewport past 640px — but the box it splits is the
                        430px device frame, which is that size on a desktop
                        screen too, so the map and the bullet list each got
                        about 200px and the tips wrapped every few words.
                        Tailwind's breakpoints measure the window; nothing
                        inside this frame can use them to mean "there is room". */}
                    <div className="grid grid-cols-1 gap-4">
                      {benThanhMapTab === 'google' ? (
                        <div className="w-full aspect-square bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 shadow-inner relative group min-h-[160px]">
                          {/* Withheld rather than lazy: see DeferredFrame. The
                              embed was pulling the entire Google Maps JS API —
                              eight requests, ~300KB, third-party origin — on
                              the home page, before a pixel of this guide had
                              been drawn. */}
                          <DeferredFrame
                            title="Ben Thanh Market Live Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4851493033503!2d106.69634921102951!3d10.772590289329712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f5080e7c5%3A0x7d6f59df04a80693!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                            placeholder={
                              // The market's name and nothing else. It is a
                              // proper noun, so it reads the same in all six
                              // languages, and a translated "loading the map of…"
                              // would need six strings for a box that is on
                              // screen for a moment.
                              <span className="text-[9px] text-zinc-400 font-light">Chợ Bến Thành</span>
                            }
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a 
                              href="https://maps.app.goo.gl/8tExfsHC1m2E4bxH7" 
                              target="_blank" 
                              rel="noreferrer"
                              className="bg-zinc-900/95 text-white border border-zinc-700 font-bold py-1 px-2 rounded-lg text-[8.5px] shadow-lg flex items-center gap-1 hover:bg-black"
                            >
                              <span>{lang === 'vi' ? 'Mở Google Maps' : 'Open in Maps'}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Sized by its content, not locked to a 150px square.
                           The labels are authored at 6-8px, and below lg the
                           type floor lifts those to 11-12px — so a column of
                           this middle row was about 50px holding a word that
                           needs 60. "Souvenirs" ran under the dome and the gate
                           pills touched it.

                           aspect-square made it worse: it fixed the height too,
                           so justify-between had a box that could not grow for
                           the taller text. Without it the diagram is as tall as
                           it needs to be at either type scale, and 280px of the
                           430px frame — free since the two-column split came
                           out — gives the words room to sit apart. */
                        <div className="relative w-full max-w-[280px] mx-auto bg-amber-50/50 rounded-xl border border-amber-900/10 p-3 flex flex-col gap-2 items-center shadow-inner">
                          
                          {/* North Gate (Cổng Bắc) */}
                          <div className="text-center w-full">
                            <span className="bg-[#0b433f] text-white text-[7px] font-bold px-1 py-0.5 rounded shadow">
                              {lang === 'vi' ? 'CỔNG BẮC' : lang === 'ko' ? '북문 (North)' : 'NORTH GATE'}
                            </span>
                            <span className="block text-[8px] text-zinc-500 mt-0.5">{lang === 'vi' ? 'Hoa tươi & Trái cây' : 'Flowers & Fruits'}</span>
                          </div>

                          {/* Middle Row with East and West Gates + Center Dome */}
                          {/* gap-3 and a dome of its own fixed size, rather than
                              three w-1/3 columns pressed together. Thirds of a
                              narrow row leave the side gates too little for the
                              word under them, and with no gap the pills ended up
                              against the dome's edge. */}
                          <div className="flex justify-between items-center gap-3 w-full">
                            {/* West Gate (Cổng Tây) */}
                            <div className="text-center flex-1 min-w-0">
                              <span className="bg-amber-600 text-white text-[7px] font-bold px-1 py-0.5 rounded shadow block">
                                {lang === 'vi' ? 'CỔNG TÂY' : lang === 'ko' ? '서문' : 'WEST'}
                              </span>
                              <span className="block text-[6px] text-zinc-500 mt-0.5 leading-tight">{lang === 'vi' ? 'Quà lưu niệm' : 'Souvenirs'}</span>
                            </div>

                            {/* Center Dome (Gian trung tâm) */}
                            <div className="text-center shrink-0 w-20 h-20 lg:w-28 lg:h-28 flex flex-col items-center justify-center p-1 lg:p-2 bg-[#b85233]/10 border border-[#b85233]/30 rounded-full">
                              <span className="text-[8px] font-bold text-[#b85233] block">
                                {lang === 'vi' ? 'ẨM THỰC' : lang === 'ko' ? '푸드코트' : 'FOOD'}
                              </span>
                              <span className="text-[6px] text-zinc-500 block leading-tight font-light">{lang === 'vi' ? 'Chè, Cà phê' : 'Food court'}</span>
                            </div>

                            {/* East Gate (Cổng Đông) */}
                            <div className="text-center flex-1 min-w-0">
                              <span className="bg-amber-600 text-white text-[7px] font-bold px-1 py-0.5 rounded shadow block">
                                {lang === 'vi' ? 'CỔNG ĐÔNG' : lang === 'ko' ? '동문' : 'EAST'}
                              </span>
                              <span className="block text-[6px] text-zinc-500 mt-0.5 leading-tight">{lang === 'vi' ? 'Bánh kẹo' : 'Sweets'}</span>
                            </div>
                          </div>

                          {/* South Gate (Cổng Nam - Main clock tower) */}
                          <div className="text-center w-full">
                            <span className="block text-[8px] text-zinc-500 mb-0.5">{lang === 'vi' ? 'Vải vóc & Tháp đồng hồ' : 'Textiles & Clock'}</span>
                            <span className="bg-[#b85233] text-white text-[7px] font-bold px-1 py-0.5 rounded shadow">
                              {lang === 'vi' ? 'CỔNG NAM' : lang === 'ko' ? '남문 (South)' : 'SOUTH GATE'}
                            </span>
                          </div>

                        </div>
                      )}

                      {/* Info & Tips */}
                      <div className="space-y-2 text-[10px] text-zinc-600">
                        <div className="bg-zinc-100 p-2 rounded-lg border border-zinc-200">
                          <strong className="block text-[#0b433f] text-[10px] font-bold mb-1">💡 {lang === 'vi' ? 'Mẹo khám phá:' : lang === 'ko' ? '쇼핑 및 네고 팁:' : 'Local Bargaining Pro-Tips:'}</strong>
                          <ul className="space-y-1 list-disc pl-3 text-[9px] font-light leading-tight">
                            <li>{lang === 'vi' ? 'Cổng Nam (đối diện quảng trường) là tháp đồng hồ biểu tượng, chụp ảnh cực đẹp.' : lang === 'ko' ? '남문(광장 쪽)은 시그니처 시계탑이 있어 사진 촬영 명소입니다.' : 'South Gate features the iconic clock tower, ideal for photos.'}</li>
                            <li>{lang === 'vi' ? 'Khu ẩm thực ở trung tâm chợ là thiên đường các món chè, gỏi cuốn, giá cả niêm yết rõ ràng.' : lang === 'ko' ? '중앙 음식 구역은 베트남 빙수(Chè)와 스프링롤의 천국입니다.' : 'The central dome houses food stalls with clear pricing.'}</li>
                            <li>{lang === 'vi' ? 'Nên mặc cả giảm 30-50% khi mua đồ lưu niệm hoặc quần áo ở các cổng Đông & Tây.' : lang === 'ko' ? '동문, 서문의 옷/기념품 상점에서는 30~50% 내외 네고를 권장합니다.' : 'Negotiate 30-50% off for souvenirs at East & West gates.'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 District Detail Cards horizontally or vertically scrollable */}
                  <div className={`space-y-3 ${activeAtmosphereTab === 'districts' ? '' : 'hidden'}`}>
                    {t.atmosphere.districts.map((dist) => {
                      const isHighlighted = highlightedCard === dist.id;
                      const cardColors = dist.id === 'd1' 
                        ? 'border-teal-600/30 bg-teal-500/5' 
                        : dist.id === 'd3' 
                        ? 'border-amber-600/30 bg-amber-500/5' 
                        : 'border-red-600/30 bg-red-500/5';

                      return (
                        <div
                          key={dist.id}
                          id={`card-${dist.id}`}
                          className={`border rounded-xl lg:rounded-2xl lg:break-inside-avoid p-3.5 lg:p-5 transition-all duration-300 ${cardColors} ${
                            isHighlighted ? 'ring-2 ring-[#b85233] scale-[1.02] shadow-md' : 'shadow-sm'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 border-b border-zinc-200/60 pb-1.5">
                            <div>
                              <h3 className="text-sm font-bold text-[#0b433f]">{dist.name}</h3>
                            </div>
                          </div>

                          <p className="text-[10px] text-zinc-600 mb-2 leading-relaxed">
                            {dist.description}
                          </p>

                          <ul className="space-y-1.5 text-[10px] text-zinc-700 leading-normal font-light">
                            {(dist.highlights || []).map((bullet, bidx) => (
                              <li key={bidx} className="flex gap-2 items-start">
                                <span className="text-[#b85233] shrink-0 mt-0.5">•</span>
                                <p>{bullet}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Bottom Tip Banner */}
                <div className="mt-4 lg:mt-0 p-3 bg-[#f0ede4] rounded-xl border border-[#dcd7ca] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#b85233]"></div>
                  {/* Stacked. tipsDesc alone came to seven lines in its 175px
                      column, in English and in Vietnamese both, next to a
                      neighbour of two — a paragraph squeezed into half a narrow
                      frame while the other half sat nearly empty. Down the page
                      each takes the full width, and the rule between the columns
                      becomes a rule above the second. */}
                  <div className="space-y-3 pl-1">
                    <div className="space-y-0.5">
                      <strong className="block text-[#b85233] font-bold">{t.atmosphere.tipsTitle}</strong>
                      <p className="text-zinc-600 leading-tight font-light">{t.atmosphere.tipsDesc}</p>
                    </div>
                    <div className="space-y-0.5 border-t border-zinc-300/40 pt-3">
                      {/* No dedicated key exists for this heading, and pages.transport
                          already names the same idea in all six languages. */}
                      <strong className="block text-[#0b433f] font-bold">{t.pages.transport}</strong>
                      <p className="text-zinc-600 leading-tight font-light">{t.atmosphere.transportTip}</p>
                    </div>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 04: TRANSPORTATION
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6">
                  
                  {/* Minimal page header decoration */}
                  <PageHeading number="04" title={t.pages.transport} kicker="Transit in Ho Chi Minh" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.transport.intro}
                  </p>

                  {/* 4 Circles Transport Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {t.transport.options.map((opt, idx) => {
                      // Line icons rather than emoji: emoji render differently on
                      // every platform and cannot take the brand colour.
                      const iconsList = [
                        <Motorbike className="w-6 h-6 text-[#0b433f]" strokeWidth={1.75} />,
                        <Car className="w-6 h-6 text-[#0b433f]" strokeWidth={1.75} />,
                        <TrainFront className="w-6 h-6 text-[#0b433f]" strokeWidth={1.75} />,
                        <CarTaxiFront className="w-6 h-6 text-[#0b433f]" strokeWidth={1.75} />
                      ];
                      return (
                        <button
                          type="button"
                          key={idx}
                          aria-expanded={showTransportPopup === idx}
                          aria-controls="transport-detail"
                          onClick={() => setShowTransportPopup(showTransportPopup === idx ? null : idx)}
                          className="flex flex-col items-center text-center cursor-pointer group rounded-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b433f]/50 transition-transform"
                        >
                          <div
                            className={`w-14 h-14 lg:w-20 lg:h-20 rounded-full border shadow-sm flex items-center justify-center hover:scale-105 transition-all ${
                              showTransportPopup === idx
                                ? 'bg-[#0b433f]/10 border-[#0b433f] ring-2 ring-[#0b433f]/25'
                                : 'bg-white border-zinc-200 hover:bg-zinc-100'
                            }`}
                          >
                            {iconsList[idx]}
                          </div>
                          {/* Drop the parenthetical, keep the rest: taking only the
                              first word rendered both Grab options as "Grab" and
                              "Traditional Taxi" as "Traditional". */}
                          <span className="text-[8px] font-bold text-[#0b433f] leading-tight mt-1.5">
                            {opt.name.replace(/\s*\(.*\)\s*$/, '')}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* One panel under the grid, not a bubble on each circle.
                      The bubble was w-40 — 160px — centred on its button, and a
                      column of this four-up grid is about 89px inside the 430px
                      frame. On the outer columns half of it therefore hung past
                      the frame edge and was clipped; it also sat above the
                      circles, covering the paragraph it was meant to explain.
                      No anchoring fixes that: the bubble is wider than the
                      column it has to centre on.

                      Below the grid there is full width for the text, nothing
                      to overflow and nothing to cover. The selected circle
                      takes a ring so it stays clear which one the panel is
                      describing, now that the panel no longer points at it. */}
                  {showTransportPopup !== null && t.transport.options[showTransportPopup] && (
                    /* Light, not the dark slab this inherited from being a
                       floating tooltip. Readers of this page are on the street
                       deciding how to travel, and a screen outdoors reflects
                       whatever light is around it. On a dark panel that
                       reflection competes with the text and the surface turns
                       into a mirror; on a light one it lands on a surface that
                       was already bright and the dark text survives. It is why
                       signage outdoors is dark-on-light almost without
                       exception.

                       It also puts this back in the same visual system as
                       everything else on the page, which is cream and white
                       cards throughout. */
                    <div
                      id="transport-detail"
                      className="bg-white p-3 rounded-xl text-[10px] leading-relaxed text-left shadow-sm space-y-1 border border-[#0b433f]/20 animate-in fade-in duration-200"
                    >
                      <strong className="block text-[#0b433f] font-bold text-[11px]">
                        {t.transport.options[showTransportPopup].name}
                      </strong>
                      <p className="text-zinc-700">
                        {t.transport.options[showTransportPopup].desc}
                      </p>
                    </div>
                  )}

                  {/* Estimated Pricing Table */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#0b433f] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#b85233]" />
                      <span>{t.transport.tableTitle}</span>
                    </h4>
                    
                    {/* One card per mode rather than a five-column table: at this
                        width every header and figure wrapped. Every part of a
                        card — name, payment, figures — now comes from the one
                        entry in transport.options that describes that mode, so
                        nothing can fall out of step by index. */}
                    <div className="space-y-2">
                      {t.transport.options.map((mode: any, fidx: number) => (
                        <div
                          key={fidx}
                          className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-2 bg-[#0b433f] text-white px-3 py-1.5">
                            <span className="text-[10px] font-semibold truncate">
                              {mode.name}
                            </span>
                            {/* tableHeaders[4] is the word "Payment", translated in
                                all six languages but rendered nowhere since the
                                table became cards. It labels the value here, where
                                "App / Cash" on its own tells a screen reader
                                nothing about what it is. */}
                            <span
                              className="text-[9px] text-teal-100/80 shrink-0"
                              aria-label={`${t.transport.tableHeaders[4]}: ${mode.payment ?? ''}`}
                            >
                              {mode.payment}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 divide-x divide-zinc-200">
                            {(mode.fares ?? []).map((price: string, pidx: number) => (
                              <div key={pidx} className="px-2 py-2 text-center">
                                <span className="block text-[8px] uppercase tracking-wider text-zinc-400">
                                  {t.transport.tableHeaders[pidx + 1]}
                                </span>
                                <span className="block text-[11px] font-semibold text-[#0b433f] mt-0.5">
                                  {price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="text-[8px] text-zinc-400 italic block">{t.transport.tableNote}</span>
                  </div>

                  {/* 2-Column: Key points list + Ride Apps banner */}
                  {/* Stacked rather than split 7/5. The frame is 430px at most, so
                      the narrower column landed near 150px and the ride-app card's
                      own heading wrapped onto two lines inside it. */}
                  <div className="space-y-3">

                    {/* Points checklist */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-[#0b433f] uppercase tracking-wider">
                        {t.transport.pointsTitle}
                      </h5>
                      <ul className="space-y-1.5 text-[8.5px] text-zinc-600 leading-normal font-light">
                        {t.transport.points.slice(0, 3).map((pt, pidx) => (
                          <li key={pidx} className="flex gap-1.5 items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#b85233] shrink-0 mt-0.5" />
                            <p>{pt}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* App recommendations banner & QRs (5 cols) */}
                    <div className="bg-white border border-[#b85233]/20 rounded-xl p-3 space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#b85233] block">
                        {t.transport.rideApps}
                      </span>
                      <div className="grid grid-cols-2 gap-2">

                      {/* The real marks, not the brand name in a coloured box.
                          Third-party trademarks — see public/uploads/brand/CREDITS.md. */}
                      {/* Each tile takes the ground its own mark was drawn for, the way
                          app icons sit side by side on a home screen.

                          Grab's icon is 76.5% #00b14f, so the tile continues that green
                          and the grey ring around it disappears. Xanh SM's mark is 50.9%
                          #2dccd3 on transparency — drawn for a light ground, and it keeps
                          one. A cyan tile would swallow it: the mark clears only 1.96:1
                          even against plain white, and a cyan tint would close that.

                          Those figures are exact pixel counts. An earlier pass reported
                          #00a848 and #30d8d8, which were artefacts of bucketing colours
                          to multiples of 24 while counting — enough to move #00b14f two
                          steps down each channel.

                          Each border matches its own fill so the two tiles keep identical
                          geometry: Grab's reads as one solid green square, while Xanh
                          SM's hairline is what separates a white tile from a white card. */}
                      {[
                        {
                          name: 'Grab',
                          tag: 'All-in-one',
                          logo: '/uploads/brand/grab.png',
                          tile: 'bg-[#00b14f] border-[#00b14f]',
                        },
                        {
                          name: 'Xanh SM',
                          tag: 'Eco Taxi',
                          logo: '/uploads/brand/xanh-sm.png',
                          tile: 'bg-white border-zinc-200',
                        },
                      ].map((app) => (
                        <div
                          key={app.name}
                          className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-zinc-200/80 shadow-sm"
                        >
                          {/* Grab ships a full-bleed app icon, opaque to all four edges,
                              so with no inset it sat flush against the card. Xanh SM's
                              mark carries its own 21% margin. The padding gives the
                              first one room without shrinking the second, which
                              object-contain already leaves smaller. */}
                          <Picture
                            src={app.logo}
                            alt={`${app.name} logo`}
                            onError={useFallbackImage}
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                            className={`w-9 h-9 shrink-0 rounded-lg object-contain p-1 border border-zinc-200/70 ${app.tile}`}
                          />
                          <div className="min-w-0 leading-tight">
                            <strong className="block text-[9px] text-zinc-800 font-bold truncate">
                              {app.name}
                            </strong>
                            <span className="block text-[8px] text-zinc-500 truncate">{app.tag}</span>
                          </div>
                        </div>
                      ))}
                      </div>


                    </div>

                  </div>

                </div>

                {/* Bottom row advice banner wrapper */}
                <div className="mt-5 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  {/* Stacked: each of these ran to three lines in a 181px
                      column, a paragraph in a box narrower than its sentences.
                      The rule moves from between them to above the second. */}
                  <div className="space-y-2 divide-y divide-zinc-400/20">
                    <p>{t.welcome.advice[0]}</p>
                    <p className="pt-2">{t.welcome.advice[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 05: STAY & REJUVENATE (CARE)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6">
                  
                  {/* Minimal page header decoration */}
                  <PageHeading number="05" title={t.pages.stay} kicker="Wellness & Hotels" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.stay.intro}
                  </p>

                  {/* Collage-style grid visual representation of page 5 */}
                  <div className="grid grid-cols-12 gap-2 h-[220px]">
                    
                    {/* Left block (7 cols): Main colonial boutique hotel room artwork */}
                    <div className="col-span-7 bg-[#dfdacd] border border-zinc-300 rounded-xl relative overflow-hidden group shadow-sm">
                      <Picture
                        src="/uploads/external/9734d76f9fad.jpg"
                        alt="Boutique Hotel Room Saigon" 
                        onError={useFallbackImage}
                        width={800}
                        height={533}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Ambient visual overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b433f]/90 via-[#0b433f]/30 to-transparent z-10"></div>
                      
                      {/* Badge tag */}
                      <span className="absolute top-2.5 left-2.5 z-20 bg-[#0b433f]/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[7px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Boutique Oasis
                      </span>

                      {/* Foreground Text */}
                      <div className="absolute bottom-3 left-3 right-3 z-20 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 text-xs">★★★★★</span>
                        </div>
                        <p className="text-[9.5px] text-white leading-snug font-serif font-bold">
                          {t.stay.leftImgDesc}
                        </p>
                      </div>
                    </div>

                    {/* Right block (5 cols): 3 stacked items with real wellness images */}
                    <div className="col-span-5 flex flex-col gap-2">
                      {t.stay.rightStack.map((stackText, sidx) => {
                        const rightImages = [
                          '/uploads/external/4d9633d557ee.jpg', // Spa & Herbal Wash
                          '/uploads/external/3b9f45655bcf.jpg', // Foot & Body Care
                          '/uploads/external/143a201f9dac.jpg'  // Tea & Hideaway Coffee
                        ];
                        return (
                          <div 
                            key={sidx}
                            className="flex-1 bg-[#e6e2d8] border border-zinc-300 rounded-lg p-1.5 flex flex-col justify-end relative overflow-hidden group shadow-sm"
                          >
                            <Picture
                              src={rightImages[sidx]}
                              alt="Wellness illustration" 
                              onError={useFallbackImage}
                              width={400}
                              height={267}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b433f]/85 via-[#0b433f]/40 to-transparent z-10"></div>

                            <p className="relative z-20 text-[7.5px] text-white font-medium leading-snug drop-shadow-sm">
                              {stackText}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Recommendations Columns list (3 elements) with header illustration banners */}
                  {/* One per row. At three across, each card was about 118px wide
                      with a 56px banner, the title wrapped over the photo and the
                      subtitle was cut to twelve characters in code. */}
                  <div className="grid grid-cols-1 gap-3">
                    {t.stay.categories.map((cat, cidx) => {
                      const iconsList = [
                        <Star className="w-3 h-3 text-white" />,
                        <Sparkles className="w-3 h-3 text-white" />,
                        <Coffee className="w-3 h-3 text-white" />
                      ];
                      const catBanners = [
                        '/uploads/external/d8f33c48cc5c.jpg',
                        '/uploads/external/3e15f452ff6b.jpg',
                        '/uploads/external/2f331a9cff29.jpg'
                      ];
                      return (
                        <div 
                          key={cidx}
                          className="bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:ring-1 hover:ring-[#b85233] transition-all group"
                        >
                          {/* Top Image Banner */}
                          <div className="h-28 lg:h-44 relative overflow-hidden bg-zinc-100">
                            <Picture
                              src={catBanners[cidx]}
                              alt={cat.title}
                              onError={useFallbackImage}
                              width={400}
                              height={267}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                            <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2">
                              <span className="text-[12px] font-bold text-white leading-tight font-serif drop-shadow-md">
                                {cat.title}
                              </span>
                              <div className="w-7 h-7 rounded-full bg-[#b85233] flex items-center justify-center shrink-0 shadow-md">
                                {iconsList[cidx]}
                              </div>
                            </div>
                          </div>

                          <div className="p-3 flex-1 flex flex-col gap-1.5">
                            {/* Full subtitle: it used to be cut with substring(0, 12),
                                which turned "Urban Sanctuary" into "URBAN SANCTU". */}
                            <span className="text-[8px] text-zinc-400 block tracking-[0.14em] uppercase">
                              {cat.subtitle}
                            </span>

                            <ul className="space-y-1.5 text-[9px] text-zinc-400 leading-relaxed font-light">
                              {cat.bullets.map((bul, bidx) => (
                                <li key={bidx} className="flex gap-1.5 items-start">
                                  <span className="text-[#b85233] shrink-0">•</span>
                                  <p>{bul}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                                {/* Bottom row advice tips */}
                <div className="mt-4 lg:mt-0 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  {/* Stacked. Side by side each tip had about 187px, and both
                      run to four lines of prose at that width in English and in
                      Vietnamese — a column narrower than the sentence it holds.
                      Down the page they get the full width and take two.
                      The rule between them becomes a rule above the second. */}
                  <div className="space-y-2 divide-y divide-zinc-400/20">
                    <p>{t.stay.tips[0]}</p>
                    <p className="pt-2">{t.stay.tips[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 06: FOOD (Legends Must-Eat)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto" id="food-page-section">
                <div className="space-y-4 lg:columns-2 lg:gap-6 lm-spread">
                  <PageHeading number="06" title={t.pages.food} kicker="Must-Eat Legends" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.food.intro}
                  </p>

                  {/* Scrolls sideways on a phone, wraps on a desktop. A row that
                      scrolls hides whatever is past its right edge, and a tab
                      a reader cannot see is a tab they will not press. On a
                      380px phone there is nowhere else for them to go; in a
                      440px column there is. */}
                  <div className="flex gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap pb-1 pt-1 no-scrollbar" id="food-category-tabs">
                    {t.food.categories.map((cat: any, idx: number) => (
                      <button
                        key={idx}
                        id={`food-tab-${idx}`}
                        onClick={() => setActiveFoodTab(idx)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide transition-all duration-300 flex items-center gap-1 shrink-0 whitespace-nowrap shadow-sm border ${
                          activeFoodTab === idx
                            ? 'bg-[#b85233] text-white border-[#b85233]'
                            : 'bg-white text-zinc-600 border-zinc-200/60 hover:bg-zinc-50'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.title}</span>
                      </button>
                    ))}
                  </div>

                  {/* Category Quote Card */}
                  {t.food.categories.map((cat: any, catIdx: number) =>
                    cat.quote ? (
                      <div
                        key={catIdx}
                        id={`food-quote-${catIdx}`}
                        className={`${catIdx === activeFoodTab ? 'block' : 'hidden'} bg-amber-50/50 rounded-xl p-3 border-l-4 border-[#b85233]/70 shadow-sm`}
                      >
                        <p className="text-[10px] italic text-zinc-700 leading-relaxed font-serif">
                          {cat.quote}
                        </p>
                      </div>
                    ) : null
                  )}

                  {/* Curated 3 Restaurants List for active Category */}
                  <div className="space-y-3 pt-1" id="food-restaurants-list">
                    {t.food.categories.flatMap((cat: any, catIdx: number) =>
                      (cat.restaurants ?? []).map((item: any, idx: number) => {
                      const shown = catIdx === activeFoodTab;
                      const placeId = `food-${catIdx}-${idx}`;
                      const media = getPlaceMedia(placeId);
                      return (
                        <button
                          type="button"
                          key={`${catIdx}-${idx}`}
                          id={`food-restaurant-${catIdx}-${idx}`}
                          onClick={() => handleOpenDetail('food', catIdx, idx, item)}
                          className={`${shown ? 'flex' : 'hidden'} w-full text-left bg-white rounded-2xl lg:rounded-3xl lg:break-inside-avoid p-3 lg:p-4 border border-zinc-200/80 shadow-sm hover:border-[#b85233]/40 hover:shadow-md active:scale-[0.99] active:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b85233]/50 transition-all duration-200 relative group overflow-hidden gap-3 lg:gap-5 items-center cursor-pointer`}
                        >
                          {/* Card Media Thumbnail Left */}
                          <div className="w-16 h-16 lg:w-28 lg:h-28 rounded-xl lg:rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                            <ThumbnailPreview url={media.img || media.video} />
                          </div>

                          {/* Description and address live in the modal this card
                              opens; clamped to a line and 65% width they only ever
                              broke mid-word here. */}
                          <div className="flex-1 min-w-0 relative z-10 flex flex-col justify-center gap-1">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-[15px] font-bold text-[#0b433f] leading-snug line-clamp-2">{item.name}</h3>
                              <span className="text-[10px] font-mono font-bold text-[#b85233] shrink-0">#{idx + 1}</span>
                            </div>
                            <span className="text-[11px] text-[#b85233] font-medium block line-clamp-1">{item.sub}</span>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                              <Clock className="w-3 h-3 text-[#0b433f] shrink-0" />
                              <span className="line-clamp-1">{item.hours}</span>
                            </span>
                          </div>

                          {/* Persistent disclosure cue. Every other signal on this
                              card was a hover state, which a touch device never
                              shows — so on a phone nothing said it opened. */}
                          <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 self-center group-hover:text-[#b85233] transition-colors" />
                        </button>
                      );
                      })
                    )}
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Pocket Companion</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 07: CULTURE & LANDMARKS
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6 lm-spread">
                  <PageHeading number="07" title={t.pages.culture} kicker="Heritage & Check-in" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.culture.intro}
                  </p>

                  {/* Category Selection Tabs */}
                  <div className="flex gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap pb-1 pt-0.5 no-scrollbar">
                    {(['heritage', 'spiritual', 'modern', 'nature'] as const).map((cat) => {
                      const isSelected = activeCultureCategory === cat;
                      const label = t.culture.categories[cat];
                      const emoji = {
                        heritage: '🏛️',
                        spiritual: '🛕',
                        modern: '🏙️',
                        nature: '🌳'
                      }[cat];
                      
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCultureCategory(cat)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all duration-300 shrink-0 border ${
                            isSelected
                              ? 'bg-[#0b433f] text-white border-[#0b433f] shadow-sm'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300'
                          }`}
                        >
                          <span className="text-[11px] leading-none shrink-0">{emoji}</span>
                          <span className="leading-none">{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-1">
                    {/* Every place stays in the DOM; the tab only hides the ones
                        it is not showing.

                        Filtering them out of the array would have been shorter,
                        and it is what page 06 does — but this page removes
                        #static-content on mount, and it publishes no ItemList,
                        so the rendered DOM is the only place a crawler that runs
                        JS can find these 26 landmarks. Dropping to one category
                        would have hidden 19 of them from Google to win a layout
                        argument. `hidden` costs no height, so the screen fits
                        either way, and the lazy images inside a display:none
                        card are never fetched. */}
                    {t.culture.items.map((item, idx) => {
                        const shown = item.category === activeCultureCategory;
                        const placeId = `culture-${idx}`;
                        const media = getPlaceMedia(placeId);

                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => handleOpenDetail('culture', idx, undefined, item)}
                            className={`${shown ? 'flex' : 'hidden'} w-full text-left bg-white rounded-2xl lg:rounded-3xl lg:break-inside-avoid p-3 lg:p-4 border border-zinc-200/80 shadow-sm hover:border-[#0b433f]/40 hover:shadow-md active:scale-[0.99] active:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b433f]/50 transition-all duration-200 relative group overflow-hidden gap-3 lg:gap-5 items-center cursor-pointer`}
                          >
                            <div className="absolute top-0 left-0 w-1 lg:w-1.5 h-full bg-[#0b433f]"></div>

                            <div className="w-16 h-16 lg:w-28 lg:h-28 rounded-xl lg:rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                              <ThumbnailPreview url={media.img || media.video} />
                            </div>

                            {/* Description and address are not shown here: at one
                                clamped line and 65% width they always broke
                                mid-word and told the reader nothing. Both are in
                                the modal this card opens. The space pays for type
                                that can actually be read. */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                              {/* No emoji before the name. Each card already
                                  carries a photograph of the place; a generic
                                  🏛️ shared by the post office, the city hall and
                                  half the list adds nothing beside it, and the
                                  glyph is drawn differently on every platform
                                  and cannot take the brand colour. Dropping it
                                  also gives the name the full width, which
                                  matters at two clamped lines. */}
                              <h3 className="text-[15px] font-bold text-[#0b433f] leading-snug line-clamp-2 min-w-0">
                                {item.name}
                              </h3>
                              <span className="text-[11px] text-[#b85233] font-medium block line-clamp-1">{item.sub}</span>
                              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                                <Clock className="w-3 h-3 text-[#0b433f] shrink-0" />
                                <span className="line-clamp-1">{item.hours}</span>
                              </span>
                            </div>

                            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-zinc-300 shrink-0 self-center group-hover:text-[#0b433f] transition-colors" />
                          </button>
                        );
                      })}
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Heritage Route</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 08: SHOPPING & SOUVENIRS
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6">
                  <PageHeading number="08" title={t.pages.shopping} kicker="Shop Local Vibes" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.shopping.intro}
                  </p>

                  <div className="space-y-3 pt-1">
                    {t.shopping.items.map((item, idx) => {
                      const placeId = `shopping-${idx}`;
                      const media = getPlaceMedia(placeId);

                      return (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleOpenDetail('shopping', idx, undefined, item)}
                          className="w-full text-left bg-white rounded-2xl lg:rounded-3xl lg:break-inside-avoid p-3 lg:p-4 border border-zinc-200/80 shadow-sm hover:border-amber-600/40 hover:shadow-md active:scale-[0.99] active:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/50 transition-all duration-200 relative group overflow-hidden flex gap-3 lg:gap-5 items-center cursor-pointer"
                        >
                          <div className="w-16 h-16 lg:w-28 lg:h-28 rounded-xl lg:rounded-2xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                            <ThumbnailPreview url={media.img || media.video} />
                          </div>

                          {/* Description and address live in the modal this card
                              opens; clamped to a line and 65% width they only ever
                              broke mid-word here. */}
                          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                            {/* No emoji before the name, as on the culture list.
                                Each card already carries a photograph of the
                                place; a glyph drawn differently on every
                                platform, unable to take the brand colour, adds
                                nothing beside it. Dropping the row that held it
                                also returns the width to the name, which is
                                clamped at two lines. */}
                            <div className="min-w-0 space-y-0.5">
                              <h3 className="text-[15px] font-bold text-[#0b433f] leading-snug line-clamp-2">{item.name}</h3>
                              <span className="text-[11px] text-amber-700 font-medium block line-clamp-1">{item.sub}</span>
                            </div>
                            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                              <Clock className="w-3 h-3 text-[#0b433f] shrink-0" />
                              <span className="line-clamp-1">{item.hours}</span>
                            </span>
                          </div>

                          <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0 self-center group-hover:text-amber-600 transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Shopping Companion</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 09: LỤC LAM TRẠM DỪNG CHÂN (Signature Experience)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#0b1513] text-[#f6f3eb] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-5 lg:columns-2 lg:gap-6 lm-spread">
                  {/* Eyebrow in English by design, like the other eight pages.
                      This one was the only Vietnamese hold-out. */}
                  <PageHeading
                    number="09"
                    title={t.pages.luclam}
                    kicker="Cultural Rest Stop"
                    tone="dark"
                    icon={<Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                  />

                  {/* Stunning Shimmering Indochine Intro Card.

                      lm-span, like the intro paragraph on the other eight
                      pages: without it this card flows into column two and
                      leaves a column-high void beside the title, because there
                      is nothing above it to fill column one. */}
                  <div className="lm-span bg-gradient-to-br from-[#0c2b27] via-[#081e1b] to-black rounded-2xl p-4.5 border border-amber-500/20 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                      <Coffee className="w-40 h-40 text-amber-400" />
                    </div>
                    {/* Glowing corner effect */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="h-[1px] w-6 bg-amber-500/50"></span>
                        <span className="text-[8px] uppercase tracking-[0.25em] text-amber-400 font-bold block">{t.luclam.subtitle}</span>
                        <span className="h-[1px] w-6 bg-amber-500/50"></span>
                      </div>
                      <h3 className="text-base font-serif font-bold text-amber-100 flex items-center gap-1.5">
                        <span>{t.luclam.aboutHeading}</span>
                      </h3>
                      <p className="text-[10.5px] text-zinc-300 leading-relaxed font-light">
                        {t.luclam.aboutText}
                      </p>
                    </div>
                  </div>

                  {/* Four blocks, one screen. Together they came to 2549px against
                      1544px of column — 702px of scroll, the worst left on the site.
                      The card above stays on every tab. */}
                  <SectionTabs
                    tone="dark"
                    label={t.pages.luclam}
                    active={activeLuclamTab}
                    onChange={setActiveLuclamTab}
                    tabs={[
                      { id: 'teas', emoji: '🍵', label: t.luclam.menuHeading },
                      { id: 'stores', emoji: '📍', label: lang === 'vi' ? 'Hệ thống cửa hàng' : lang === 'ko' ? '매장 안내' : lang === 'ja' ? '店舗ネットワーク' : 'Branch locator' },
                      { id: 'offers', emoji: '🎁', label: lang === 'vi' ? 'Ưu đãi & Đánh giá' : lang === 'ko' ? '혜택 & 리뷰' : lang === 'ja' ? '特典＆口コミ' : 'Offers & reviews' },
                    ] as const}
                  />

                  {/* Premium Tea Menu List */}
                  <div className={`space-y-3 ${activeLuclamTab === 'teas' ? '' : 'hidden'}`}>
                    <h4 className="text-[11px] font-bold text-amber-400 tracking-wider uppercase border-l-2 border-amber-500 pl-2">
                      {t.luclam.menuHeading}
                    </h4>

                    <div className="grid grid-cols-1 gap-2.5">
                      {t.luclam.menuItems.map((item, idx) => {
                        const isExpanded = expandedTea === idx;
                        const productItem = item as any;
                        const defaults = DEFAULT_BUY_LINKS[idx] ?? FALLBACK_BUY_LINKS;
                        const links = {
                          luclam: productItem.buyLuclam || defaults.luclam,
                          taka: productItem.buyTaka || defaults.taka,
                        };
                        const productVideo = getPlaceMedia(`luclam-${idx}`).video;

                        const ctaLabels = {
                          vi: { taka: "Mua tại Takashimaya", luclam: "Mua tại Lục Lam" },
                          en: { taka: "Buy at Takashimaya", luclam: "Buy on Lục Lam" },
                          ja: { taka: "Takashimayaで購入", luclam: "Lục Lamで購入" },
                          ko: { taka: "Takashimaya 구매", luclam: "Lục Lam 공식몰 구매" },
                          zh: { taka: "高岛屋购买", luclam: "Lục Lam 官网购买" },
                          zht: { taka: "高島屋購買", luclam: "Lục Lam 官網購買" }
                        }[lang] || { taka: "Buy at Takashimaya", luclam: "Buy on Lục Lam" };

                        const videoLabel = {
                          vi: 'Xem video sản phẩm',
                          en: 'Watch product video',
                          ja: '商品動画を見る',
                          ko: '제품 영상 보기',
                          zh: '观看产品视频',
                          zht: '觀看產品影片',
                        }[lang] || 'Watch product video';

                        return (
                          <div 
                            key={idx} 
                            onClick={(e) => {
                              if ((e.target as HTMLElement).closest('button, a')) return;
                              setExpandedTea(isExpanded ? null : idx);
                            }}
                            className={`bg-zinc-950/65 rounded-xl p-3 border hover:border-amber-500/40 shadow-md transition-all duration-300 cursor-pointer ${
                              isExpanded ? 'ring-1 ring-amber-500/30 border-amber-500/30 bg-zinc-950/90' : 'border-zinc-800/80'
                            }`}
                          >
                            <div className="flex gap-3.5 items-center">
                              {item.image ? (
                                <Picture
                                  src={item.image}
                                  alt={item.name} 
                                  width={48}
                                  height={48}
                                  loading="lazy"
                                  decoding="async"
                                  className={`w-12 h-12 lg:w-24 lg:h-24 rounded-lg lg:rounded-xl object-cover shrink-0 border border-zinc-800 transition-transform duration-300 ${isExpanded ? 'scale-105 border-amber-500/30' : ''}`}
                                  referrerPolicy="no-referrer"
                                  onError={useFallbackImage}
                                />
                              ) : (
                                <span className="text-2xl shrink-0" role="img" aria-label="menu emoji">{item.emoji}</span>
                              )}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-baseline gap-2">
                                  <h5 className="text-[10.5px] font-bold text-white tracking-wide truncate lg:overflow-visible lg:text-clip lg:whitespace-normal pr-1">{item.name}</h5>
                                  <span className="text-[10px] font-bold text-amber-400 shrink-0">{item.price}</span>
                                </div>
                                <p className={`text-[9px] text-zinc-400 leading-normal font-light ${isExpanded ? '' : 'line-clamp-1 lg:line-clamp-2'}`}>
                                  {item.desc}
                                </p>
                              </div>
                              <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90 text-amber-400' : ''}`} />
                            </div>

                            {/* Expanded details section */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-zinc-800/60 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                {/* Extra info */}
                                <div className="text-[9px] text-zinc-300 leading-relaxed space-y-1.5">
                                  {lang === 'ko' && (
                                    <div className="bg-amber-950/10 p-2 rounded border border-amber-500/10 text-amber-200/90">
                                      ✨ <strong>Takashimaya 백화점 B2층</strong> 매장 및 <strong>Lục Lam 공식 온라인 몰</strong>에서 만나보실 수 있습니다.
                                    </div>
                                  )}
                                  {lang === 'vi' && (
                                    <div className="bg-amber-950/10 p-2 rounded border border-amber-500/10 text-amber-200/90">
                                      ✨ Sản phẩm chính hãng tại <strong>Tầng B2 Takashimaya</strong> và <strong>Lục Lam Store</strong>.
                                    </div>
                                  )}
                                  {lang !== 'ko' && lang !== 'vi' && (
                                    <div className="bg-amber-950/10 p-2 rounded border border-amber-500/10 text-amber-200/90">
                                      ✨ Official product available at <strong>Takashimaya B2 Floor</strong> and <strong>Lục Lam Webstore</strong>.
                                    </div>
                                  )}
                                </div>

                                {/* Direct CTA Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                  <a
                                    href={links.taka}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[9px] font-bold bg-[#800020] text-white hover:bg-[#990026] border border-[#a31a3b] transition-all shadow-md active:scale-95"
                                  >
                                    <span className="text-[10px]">🏢</span>
                                    <span>{ctaLabels.taka}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                                  </a>
                                  <a
                                    href={links.luclam}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[9px] font-bold bg-[#0b433f] text-amber-100 hover:bg-[#0e544f] border border-emerald-800 transition-all shadow-md active:scale-95"
                                  >
                                    <span className="text-[10px]">🍃</span>
                                    <span>{ctaLabels.luclam}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                                  </a>
                                </div>

                                {/* Only offered once a video has been assigned in the
                                    editor. The place modal already knows how to embed
                                    TikTok, so products reuse it rather than repeating
                                    that logic here. */}
                                {productVideo && (
                                  <button
                                    onClick={() => handleOpenDetail('product', idx, undefined, item)}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-[9px] font-bold bg-zinc-800/80 text-amber-200 hover:bg-zinc-700/80 border border-amber-500/25 transition-all shadow-md active:scale-95"
                                  >
                                    <span className="text-[10px]">▶</span>
                                    <span>{videoLabel}</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shimming Branch Locator */}
                  <div className={`space-y-3 pt-2 ${activeLuclamTab === 'stores' ? '' : 'hidden'}`}>
                    {/* Same shape as the page headers: a localised title beside a
                        short fixed badge. The badge is pinned so the title wraps
                        instead of both being squeezed into broken words. */}
                    <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 border-l-2 border-amber-500 pl-2">
                      <h4 className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                        {lang === 'vi' ? 'Hệ Thống Cửa Hàng Lục Lam' : lang === 'ko' ? '룩람 오프라인 매장' : lang === 'ja' ? 'Lục Lam 店舗ネットワーク' : 'Lục Lam Branch Locator'}
                      </h4>
                      <span className="text-[7px] font-mono bg-amber-950 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold shrink-0 whitespace-nowrap">{STORES.length} BRANCHES</span>
                    </div>
                  
                    {/* One panel per city, every one of them read from STORES.
                  
                        This list was hardcoded, and it drifted from the same list in the
                        structured data and on page 10: the locator carried 259 Trần Phú
                        and no Hội An, the schema carried Hội An and no 259. Both were
                        published, so a reader and an assistant got different answers to
                        the same question. There is one list now, and adding a shop to it
                        adds the shop here, in the schema, in the FAQ and in llms.txt at
                        once.
                  
                        Addresses stay in Vietnamese in every language — a visitor shows
                        one to a driver or types it into a map. */}
                    <div className="space-y-2 text-zinc-800">
                      {STORES_BY_CITY.map((group) => {
                        const flagged = group.stores.find((store) => store.flag);
                        const many = group.stores.length > 1;
                        return (
                          <div key={group.city} className="bg-[#0c2b27]/40 rounded-xl lg:rounded-2xl lg:break-inside-avoid p-3 lg:p-4 border border-amber-500/10 space-y-2 shadow-inner">
                            <div className="flex flex-wrap justify-between items-start gap-x-2 gap-y-1">
                              <span className="text-[8px] bg-[#0b433f] border border-emerald-400/20 text-white font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0">
                                {group.cityShort}{many ? ` (${group.stores.length})` : ''}
                              </span>
                              {flagged && (
                                <span className="text-[8px] text-amber-400 font-bold italic animate-pulse shrink-0 whitespace-nowrap">{flagged.flag}</span>
                              )}
                            </div>
                  
                            <div className={many ? 'divide-y divide-zinc-800/60 space-y-2.5' : ''}>
                              {group.stores.map((store, index) => (
                                <div key={store.id} className={`space-y-1.5 ${index > 0 ? 'pt-2.5' : ''}`}>
                                  <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1">
                                    <h5 className="text-[10.5px] font-bold text-amber-200 tracking-wide">
                                      {many ? `${index + 1}. ` : ''}{storeName(store)}
                                    </h5>
                                    <a
                                      href={storeMapUrl(store)}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-[8px] text-amber-400 hover:underline font-bold shrink-0 whitespace-nowrap"
                                    >
                                      <span>Directions</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                  {store.photo && (
                                    <Picture
                                      src={store.photo.src}
                                      alt={storeName(store)}
                                      onError={useFallbackImage}
                                      width={store.photo.width}
                                      height={store.photo.height}
                                      loading="lazy"
                                      decoding="async"
                                      className="w-full h-24 lg:h-44 object-cover rounded-lg lg:rounded-xl border border-zinc-800/80 my-1"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  {/* Hours ride on the address line rather than
                                      taking one of their own. Five shops instead
                                      of four already cost this section 118px of
                                      height, measured, and it overflows its
                                      screen before the extra line is counted. */}
                                  <p className="text-[8.5px] text-zinc-400 font-light">
                                    {`${store.street}, ${store.locality}`}
                                    {store.hours && (
                                      <span className="text-emerald-300/90 tabular-nums"> · {store.hours.opens}–{store.hours.closes}</span>
                                    )}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* International Instagram Portals */}
                  <div className={`space-y-3 pt-2 ${activeLuclamTab === 'offers' ? '' : 'hidden'}`}>
                    <h4 className="text-[11px] font-bold text-amber-400 tracking-wider uppercase border-l-2 border-amber-500 pl-2">
                      {lang === 'vi' ? 'Đánh Giá Từ Du Khách Quốc Tế' : lang === 'ko' ? '글로벌 여행자 리뷰 포털' : lang === 'ja' ? 'グローバル旅行者の口コミ' : 'Global Traveler Review Portals'}
                    </h4>
                    <p className="text-[9px] text-zinc-400 font-light leading-snug">
                      {lang === 'vi' ? 'Khám phá trải nghiệm thực tế từ các cộng đồng du lịch Nhật Bản, Hàn Quốc, và Trung Quốc trên Instagram.' : lang === 'ko' ? '인스타그램에서 각국(일본, 한국, 중국) 여행자들의 실시간 생생한 룩람 리뷰를 만나보세요.' : 'Discover authentic reviews from Japan, Korea, and China travel communities on Instagram.'}
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                      <a 
                        href="https://www.instagram.com/luclam_vietnam.review_japan/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-2.5 text-center flex flex-col items-center justify-between gap-2 shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <span className="text-2xl animate-bounce">🇯🇵</span>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] font-bold text-white block leading-tight">Review Japan</span>
                          <span className="text-[7.5px] text-zinc-500 block font-mono">@luclam_japan</span>
                        </div>
                        <span className="text-[8.5px] text-amber-400 font-semibold flex items-center gap-0.5 mt-1 border-t border-zinc-800 pt-1 w-full justify-center">
                          <span>Feed</span>
                          <ExternalLink className="w-2 h-2" />
                        </span>
                      </a>

                      <a 
                        href="https://www.instagram.com/luclam_vietnam.review_korea/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-2.5 text-center flex flex-col items-center justify-between gap-2 shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <span className="text-2xl animate-bounce">🇰🇷</span>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] font-bold text-white block leading-tight">Review Korea</span>
                          <span className="text-[7.5px] text-zinc-500 block font-mono">@luclam_korea</span>
                        </div>
                        <span className="text-[8.5px] text-amber-400 font-semibold flex items-center gap-0.5 mt-1 border-t border-zinc-800 pt-1 w-full justify-center">
                          <span>Feed</span>
                          <ExternalLink className="w-2 h-2" />
                        </span>
                      </a>

                      <a 
                        href="https://www.instagram.com/luclam_vietnam.review_china/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 rounded-xl p-2.5 text-center flex flex-col items-center justify-between gap-2 shadow-md transition-all hover:-translate-y-0.5"
                      >
                        <span className="text-2xl animate-bounce">🇨🇳</span>
                        <div className="space-y-0.5">
                          <span className="text-[8.5px] font-bold text-white block leading-tight">Review China</span>
                          <span className="text-[7.5px] text-zinc-500 block font-mono">@luclam_china</span>
                        </div>
                        <span className="text-[8.5px] text-amber-400 font-semibold flex items-center gap-0.5 mt-1 border-t border-zinc-800 pt-1 w-full justify-center">
                          <span>Feed</span>
                          <ExternalLink className="w-2 h-2" />
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Elegant Golden Coupon / Voucher */}
                  <div className={`space-y-3 pt-2 ${activeLuclamTab === 'offers' ? '' : 'hidden'}`}>
                    <div className="relative bg-[#0d2b27] rounded-2xl border-2 border-dashed border-amber-500/30 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
                      {/* Left-right notched holes */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#0b1513] -translate-y-1/2 border-r border-amber-500/20 z-10"></div>
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#0b1513] -translate-y-1/2 border-l border-amber-500/20 z-10"></div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1">
                          <span className="text-[8px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t.luclam.voucherBadge}
                          </span>
                          <span className="text-[10px] font-serif font-black text-amber-400 tracking-wide shrink-0 whitespace-nowrap ml-auto">LỤC LAM VOUCHER</span>
                        </div>

                        <h4 className="text-xs font-bold text-amber-100">{t.luclam.voucherHeading}</h4>
                        <p className="text-[9.5px] text-zinc-300 leading-relaxed font-light">
                          {t.luclam.voucherDesc}
                        </p>
                      </div>

                      <div className="my-3 border-t border-dashed border-amber-500/20"></div>

                      <div className="space-y-3 relative z-20">
                        <div className="bg-black/60 rounded-lg p-2.5 border border-zinc-800 text-center flex justify-between items-center">
                          <div className="text-left">
                            <span className="text-[7px] text-zinc-500 block uppercase font-bold">Voucher Code</span>
                            <span className="text-xs font-mono font-bold tracking-wider text-amber-400">{t.luclam.voucherCode}</span>
                          </div>
                          
                          {/* shrink-0: the bars are the decorative barcode, and
                              a squeezed row would thin them to nothing. */}
                          <div className="flex gap-0.5 shrink-0">
                            <div className="w-0.5 h-6 bg-amber-500/80"></div>
                            <div className="w-1 h-6 bg-amber-500/80"></div>
                            <div className="w-0.5 h-6 bg-amber-500/80"></div>
                            <div className="w-1.5 h-6 bg-amber-500/80"></div>
                            <div className="w-0.5 h-6 bg-amber-500/80"></div>
                            <div className="w-1 h-6 bg-amber-500/80"></div>
                            <div className="w-0.5 h-6 bg-amber-500/80"></div>
                          </div>
                        </div>

                        <button
                          id="btn-claim-voucher"
                          onClick={() => {
                            if (!voucherClaimed) {
                              setVoucherClaimed(true);
                              try {
                                localStorage.setItem('saigon_guide_voucher', 'true');
                              } catch (e) {
                                console.warn('localStorage disabled:', e);
                              }
                            }
                          }}
                          className={`w-full py-2 px-4 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 ${
                            voucherClaimed 
                              ? 'bg-emerald-600 text-white shadow-none cursor-default' 
                              : 'bg-amber-500 text-black hover:bg-amber-400 active:translate-y-0.5 shadow-md shadow-amber-500/15'
                          }`}
                        >
                          {voucherClaimed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t.luclam.voucherClaimed}</span>
                            </>
                          ) : (
                            <>
                              <Ticket className="w-3.5 h-3.5" />
                              <span>{t.luclam.voucherBtn}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 pt-3 border-t border-zinc-800 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-500 uppercase">Lục Lam Hospitality Oasis</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 10: USEFUL INFO (Safety, Cash & SIM)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between page-section p-6 overflow-y-auto">
                <div className="space-y-4 lg:columns-2 lg:gap-6 lm-spread">
                  <PageHeading number="10" title={t.pages.info} kicker="Security & Backup" />

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.info.intro}
                  </p>

                  {/* Three blocks, one screen. Together they came to 2396px against 1544px
                      of column, so the page scrolled 573px; apart, the largest is 1029. */}
                  <SectionTabs
                    label={t.info.title}
                    active={activeInfoTab}
                    onChange={setActiveInfoTab}
                    tabs={[
                      { id: 'info', emoji: '🚨', label: t.pages.info },
                      { id: 'contact', emoji: '🍵', label: t.contact.heading },
                      { id: 'faq', emoji: '❓', label: t.faqHeading },
                    ] as const}
                  />

                  <div className={`space-y-4 pt-1 ${activeInfoTab === 'info' ? '' : 'hidden'}`}>
                    {t.info.categories.map((cat, idx) => {
                      const icons = [
                        <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
                        <DollarSign className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
                        <Smartphone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      ];
                      return (
                        <div key={idx} className="space-y-2">
                          <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                            {icons[idx]}
                            <span>{cat.title}</span>
                          </h4>

                          <div className="space-y-2">
                            {cat.items.map((item, iidx) => (
                              <div key={iidx} className="bg-white rounded-xl lg:rounded-2xl lg:break-inside-avoid p-3 lg:p-4 border border-zinc-200/60 shadow-sm space-y-1">
                                <h5 className="text-[9px] font-bold text-[#0b433f] flex justify-between items-center">
                                  <span>{item.label}</span>
                                  {idx === 0 && (
                                    <span className="text-[8px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100 font-normal">Emergency</span>
                                  )}
                                </h5>
                                <p className="text-[9px] text-zinc-500 leading-normal font-light">
                                  {item.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* The questions, as text a reader can actually see.

                      The FAQPage markup for these has been shipping for a while
                      and described nothing: the questions appeared in no page,
                      and this app removes the prerendered block on mount
                      (see the effect near the top of this file), so a crawler
                      that runs JavaScript — Googlebot and most assistant
                      crawlers do — found the claim with no content behind it.

                      <details> rather than a wall of text: nine answers would
                      bury the safety and SIM information above, and the content
                      stays in the DOM either way, which is what a crawler
                      reads. */}
                  <div className={`space-y-2 pt-1 ${activeInfoTab === 'faq' ? '' : 'hidden'}`}>
                    <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-[#0b433f] shrink-0" />
                      <span>{t.faqHeading}</span>
                    </h4>

                    <div className="space-y-1.5">
                      {faqFor(lang, t).map((entry, idx) => (
                        <details
                          key={idx}
                          className="group bg-white rounded-xl lg:rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden"
                        >
                          <summary className="text-[9px] font-bold text-[#0b433f] p-3 cursor-pointer list-none flex justify-between items-center gap-2 marker:hidden">
                            <span>{entry.q}</span>
                            {/* Xoay khi mo, giong het the san pham tra. Mot mui ten chi sang
                                phai tren mot muc dang mo la noi rang "bam de mo"
                                trong khi no da mo roi. */}
                            <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-90 group-open:text-[#0b433f]" />
                          </summary>
                          <p className="text-[9px] text-zinc-500 leading-normal font-light px-3 pb-3">
                            {entry.a}
                          </p>
                        </details>
                      ))}
                    </div>
                  </div>

                  {/* Lục Lam's own details. The Organization structured data on
                      this page names every shop, a phone number and a
                      registration number; Google expects structured data to
                      describe what the page actually shows, so this is where a
                      reader sees the same facts.

                      tel: and mailto: rather than plain text — a visitor on a
                      phone taps to call. The addresses stay in Vietnamese in
                      every language: they get shown to a driver or typed into a
                      map, and a translated street name serves neither. */}
                  <div className={`space-y-2 pt-1 ${activeInfoTab === 'contact' ? '' : 'hidden'}`}>
                    <h4 className="text-[10px] font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-[#b85233] shrink-0" />
                      <span>{t.contact.heading}</span>
                    </h4>

                    <div className="bg-white rounded-xl lg:rounded-2xl lg:break-inside-avoid p-3 lg:p-4 border border-zinc-200/60 shadow-sm space-y-1.5">
                      <p className="text-[9px] font-bold text-[#0b433f]">{COMPANY.legalName}</p>
                      <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-[9px] leading-normal">
                        <span className="text-zinc-400 uppercase tracking-wide">{t.contact.phone}</span>
                        <a href={`tel:${COMPANY.telephone}`} className="text-[#0b433f] underline underline-offset-2 break-all">
                          {COMPANY.telephoneDisplay}
                        </a>
                        <span className="text-zinc-400 uppercase tracking-wide">{t.contact.email}</span>
                        <a href={`mailto:${COMPANY.email}`} className="text-[#0b433f] underline underline-offset-2 break-all">
                          {COMPANY.email}
                        </a>
                        <span className="text-zinc-400 uppercase tracking-wide">{t.contact.office}</span>
                        <span className="text-zinc-600 font-light">
                          {`${COMPANY.headOffice.street}, ${COMPANY.headOffice.ward}, ${COMPANY.headOffice.city}`}
                        </span>
                        <span className="text-zinc-400 uppercase tracking-wide">{t.contact.licence}</span>
                        <span className="text-zinc-600 font-light tabular-nums">{COMPANY.registration}</span>
                      </div>
                    </div>

                    <h5 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider pt-1">
                      {t.contact.stores}
                    </h5>
                    <div className="space-y-1.5">
                      {/* The branch name leads, because three of the five shops
                          are in Đà Nẵng and the city alone no longer tells them
                          apart. Hours come from the shop, not from one shared
                          constant: Hội An opens at 07:00 and the rest at
                          09:30. */}
                      {STORES.map((store) => (
                        <div key={store.id} className="bg-white rounded-xl lg:break-inside-avoid p-2.5 border border-zinc-200/60 shadow-sm">
                          <p className="text-[9px] font-bold text-[#0b433f]">{storeName(store)}</p>
                          <p className="text-[9px] text-zinc-500 leading-normal font-light">
                            {`${store.street}, ${store.locality}, ${store.region}`}
                            {store.hours && (
                              <span className="text-zinc-400 tabular-nums"> · {store.hours.opens}–{store.hours.closes}</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Peace of Mind Guarantee</span>
                </div>
              </section>

            </div>


            {/* ==========================================================================
                MOBILE VIEWPORT BOTTOM TABS NAVIGATOR (Syncs scroll snaps)
                ========================================================================== */}
            <nav className="lg:hidden border-t border-zinc-200/80 bg-white/95 backdrop-blur-sm flex overflow-x-auto shrink-0 select-none max-w-full pb-1 pt-1.5 px-3 gap-1 z-30 scrollbar-none">
              {pagesList.map((pageName, idx) => {
                const navIcons = [
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />,
                  <Heart className="w-3.5 h-3.5 shrink-0" />,
                  <Map className="w-3.5 h-3.5 shrink-0" />,
                  <Navigation className="w-3.5 h-3.5 shrink-0" />,
                  <Star className="w-3.5 h-3.5 shrink-0" />,
                  <Utensils className="w-3.5 h-3.5 shrink-0" />,
                  <Compass className="w-3.5 h-3.5 shrink-0" />,
                  <Grid className="w-3.5 h-3.5 shrink-0" />,
                  <Coffee className="w-3.5 h-3.5 shrink-0" />,
                  <Info className="w-3.5 h-3.5 shrink-0" />
                ];
                return (
                  <button
                    key={pageName}
                    id={`mobile-tab-btn-${idx}`}
                    onClick={() => navigateToPage(idx)}
                    className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all shrink-0 min-w-[72px] ${
                      currentPage === idx 
                        ? 'text-[#b85233] bg-[#b85233]/5 font-bold' 
                        : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/50'
                    }`}
                  >
                    {navIcons[idx]}
                    <span className="text-[8px] tracking-tight leading-normal mt-1 uppercase font-semibold">
                      {t.pages[pageName]}
                    </span>
                  </button>
                );
              })}
            </nav>



          </div>
          {/* Place Detail Overlay Modal */}
          {selectedPlace && (
            <PlaceDetailModal
              isOpen={!!selectedPlace}
              onClose={() => setSelectedPlace(null)}
              place={selectedPlace}
              media={selectedPlace.media}
              lang={lang}
              isCreator={isCreator}
              onUpdateMedia={(placeId, type, url) => {
                const nextMedia = {
                  ...customMedia,
                  [placeId]: {
                    ...(customMedia[placeId] || { img: '', video: '' }),
                    [type]: url
                  }
                };
                handleUpdateCustomMedia(nextMedia);
                // Dynamic instant update of modal state so preview updates immediately
                setSelectedPlace((prev: any) => {
                  if (prev && prev.id === placeId) {
                    return {
                      ...prev,
                      media: {
                        ...prev.media,
                        [type]: url
                      }
                    };
                  }
                  return prev;
                });
              }}
              onOpenEditor={(placeId) => {
                setShowEditor(true);
                setActiveEditPlaceId(placeId);
              }}
            />
          )}

        </div>

        {/* Creator Studio panel on desktop (side-by-side) */}
        {isCreator && showEditor && (
          <div className="hidden lg:block w-[460px] h-[840px] bg-zinc-950 rounded-[32px] overflow-hidden border border-zinc-800 shadow-2xl shrink-0">
            <React.Suspense fallback={
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-sm p-8 space-y-4">
                <div className="w-8 h-8 rounded-full border-2 border-t-amber-500 border-zinc-800 animate-spin" />
                <span>Loading Creator Studio...</span>
              </div>
            }>
              <CreatorStudio
                lang={lang}
                onLangChange={handleLangChange}
                overrides={overrides}
                onUpdateOverrides={handleUpdateOverrides}
                customMedia={customMedia}
                onUpdateCustomMedia={handleUpdateCustomMedia}
                onForceRefresh={() => setRefreshKey(prev => prev + 1)}
                activeEditPlaceId={activeEditPlaceId}
                onSetActiveEditPlaceId={setActiveEditPlaceId}
                onDeactivateCreator={handleDeactivateCreator}
              />
            </React.Suspense>
          </div>
        )}

      </main>

      {/* Creator Studio sliding drawer overlay for Mobile / Small Screens */}
      {isCreator && showEditor && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end"
          onClick={() => setShowEditor(false)}
        >
          <div
            className="w-full h-[85%] bg-zinc-950 rounded-t-[28px] overflow-hidden shadow-2xl flex flex-col border-t border-zinc-800"
            role="dialog"
            aria-modal="true"
            aria-label="Creator Studio"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="h-1.5 w-12 bg-zinc-700 rounded-full mx-auto my-3 shrink-0"></div>
            <div className="flex-1 overflow-hidden">
              <React.Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-400 font-mono text-sm p-8 space-y-4">
                  <div className="w-8 h-8 rounded-full border-2 border-t-amber-500 border-zinc-800 animate-spin" />
                  <span>Loading Creator Studio...</span>
                </div>
              }>
                <CreatorStudio
                  lang={lang}
                  onLangChange={handleLangChange}
                  overrides={overrides}
                  onUpdateOverrides={handleUpdateOverrides}
                  customMedia={customMedia}
                  onUpdateCustomMedia={handleUpdateCustomMedia}
                  onClose={() => setShowEditor(false)}
                  onForceRefresh={() => setRefreshKey(prev => prev + 1)}
                  activeEditPlaceId={activeEditPlaceId}
                  onSetActiveEditPlaceId={setActiveEditPlaceId}
                  onDeactivateCreator={handleDeactivateCreator}
                />
              </React.Suspense>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating Toggle Editor Button */}
      {isCreator && (
        <button
          onClick={() => setShowEditor(!showEditor)}
          className="lg:hidden fixed bottom-20 right-4 z-40 bg-[#b85233] text-white p-3.5 rounded-full shadow-2xl active:scale-95 transition-transform flex items-center justify-center cursor-pointer"
          title="Open Creator Studio"
        >
          <Settings className={`w-5 h-5 ${showEditor ? 'animate-spin-slow text-amber-200' : ''}`} />
        </button>
      )}

    </div>
  );
}
