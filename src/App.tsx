import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  MapPin, 
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

// ==========================================================================
// Translation Data for Saigon Pocket Guide
// ==========================================================================
import { Language, translations } from './translations';
import { useMediaUrl } from './hooks/useMediaUrl';
import { withBasePath } from './basePath';
import { PlaceDetailModal } from './components/PlaceDetailModal';
const CreatorStudio = React.lazy(() =>
  import('./components/CreatorStudio').then((module) => ({ default: module.CreatorStudio }))
);
import { defaultMedia } from './defaultMedia';
import { authHeaders, UNAUTHORIZED_MESSAGE } from './adminToken';
import { pathFor, parsePath, TOPICS, type Topic } from './routes';

const supportedLanguages: Language[] = ['ja', 'vi', 'zh', 'zht', 'en', 'ko'];
const htmlLanguage: Record<Language, string> = {
  ja: 'ja', vi: 'vi', zh: 'zh-CN', zht: 'zh-TW', en: 'en', ko: 'ko'
};
const fallbackImage = withBasePath('/uploads/cover_benthanh.jpg');

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
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300 font-serif font-black text-xs">
        🇻🇳
      </div>
    );
  }
  return (
    <img 
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
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(TOPICS.indexOf(initialState.topic));
  const [highlightedCard, setHighlightedCard] = useState<string | null>(null);
  
  // Custom states for interactive elements
  const [showFeaturePopup, setShowFeaturePopup] = useState<number | null>(null);
  const [showTransportPopup, setShowTransportPopup] = useState<number | null>(null);
  const [voucherClaimed, setVoucherClaimed] = useState<boolean>(false);
  const [activeFoodTab, setActiveFoodTab] = useState<number>(0);
  const [activeCultureCategory, setActiveCultureCategory] = useState<'all' | 'heritage' | 'spiritual' | 'modern' | 'nature'>('all');
  const [benThanhMapTab, setBenThanhMapTab] = useState<'gate' | 'google'>('google');
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
          parsed.cover = { img: '/uploads/cover_benthanh.jpg', video: '' };
        }
        return parsed;
      }
      return { cover: { img: '/uploads/cover_benthanh.jpg', video: '' } };
    } catch (e) {
      return { cover: { img: '/uploads/cover_benthanh.jpg', video: '' } };
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
          localStorage.setItem('saigon_guide_is_creator', 'true');
          setIsCreator(true);
          setShowEditor(true);
          // Strip parameters for a clean experience
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
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
              loadedMedia.cover = { img: '/uploads/cover_benthanh.jpg', video: '' };
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
                loadedMedia.cover = { img: '/uploads/cover_benthanh.jpg', video: '' };
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
      const savedDark = localStorage.getItem('saigon_guide_dark');
      if (savedDark === 'true') {
        setDarkMode(true);
      }
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

  const handleDarkToggle = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    try {
      localStorage.setItem('saigon_guide_dark', String(nextDark));
    } catch (e) {
      console.warn('Failed to save dark mode:', e);
    }
  };

  const handleUpdateOverrides = async (newOverrides: any) => {
    setOverrides(newOverrides);
    try {
      localStorage.setItem('saigon_guide_overrides', JSON.stringify(newOverrides));
      // Save to server
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ overrides: newOverrides, customMedia })
      });
      if (response.status === 401) {
        alert(UNAUTHORIZED_MESSAGE);
      }
    } catch (e) {
      console.warn('Failed to save overrides:', e);
    }
  };

  const handleUpdateCustomMedia = async (newCustomMedia: Record<string, { img: string; video: string }>) => {
    setCustomMedia(newCustomMedia);
    try {
      localStorage.setItem('saigon_guide_custom_media', JSON.stringify(newCustomMedia));
      // Save to server
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ overrides, customMedia: newCustomMedia })
      });
      if (response.status === 401) {
        alert(UNAUTHORIZED_MESSAGE);
      }
    } catch (e) {
      console.warn('Failed to save custom media:', e);
    }
  };

  const handleBrandClick = () => {
    setBrandClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        const passcode = prompt("Nhập mã số Creator để kích hoạt chế độ chỉnh sửa (Creator Mode):");
        if (passcode === "luclam") {
          localStorage.setItem('saigon_guide_is_creator', 'true');
          setIsCreator(true);
          setShowEditor(true);
          alert("🎉 Đã kích hoạt Chế độ Creator trên thiết bị này!");
        } else if (passcode !== null) {
          alert("❌ Mã số không chính xác!");
        }
        return 0;
      }
      return next;
    });
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
  const getPlaceMedia = (placeId: string) => {
    const custom = customMedia[placeId];
    if (custom) return custom;
    return defaultMedia[placeId] || { img: '', video: '' };
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
      const pageWidth = phoneScreenRef.current.clientWidth;
      // The smooth scroll travels across every page in between, firing the
      // scroll handler the whole way. State and URL are already correct, so
      // flag the animation and let the handler stand down until it settles.
      programmaticScrollRef.current = true;
      phoneScreenRef.current.scrollTo({
        left: index * pageWidth,
        behavior: 'smooth'
      });
    }
  };

  // Sync state if user swipes inside the mockup (scroll listener)
  const handlePhoneScroll = () => {
    if (!phoneScreenRef.current) return;
    const pageWidth = phoneScreenRef.current.clientWidth;
    if (pageWidth <= 0) return;

    const index = Math.round(phoneScreenRef.current.scrollLeft / pageWidth);
    if (index < 0 || index >= pagesList.length) return;

    // Writing the URL on every frame of a scroll rewrites it once per page
    // crossed, and browsers throttle the History API for exactly that. Wait
    // until the scroll stops, then write once.
    if (scrollSettleRef.current) clearTimeout(scrollSettleRef.current);
    scrollSettleRef.current = setTimeout(() => {
      scrollSettleRef.current = null;
      programmaticScrollRef.current = false;
      if (!phoneScreenRef.current) return;

      const settled = Math.round(phoneScreenRef.current.scrollLeft / pageWidth);
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

  // Handle window resizing to keep page alignment in scroll mockup
  useEffect(() => {
    const handleResize = () => {
      if (phoneScreenRef.current) {
        const pageWidth = phoneScreenRef.current.clientWidth;
        phoneScreenRef.current.scrollLeft = currentPage * pageWidth;
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

  // Deep merge default translations with local overrides
  const deepMerge = (target: any, source: any): any => {
    if (!source) return target;
    const output = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target && !Array.isArray(source[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        const targetArr = [...target[key]];
        const sourceArr = source[key];
        for (let i = 0; i < sourceArr.length; i++) {
          if (sourceArr[i] instanceof Object && targetArr[i]) {
            targetArr[i] = deepMerge(targetArr[i], sourceArr[i]);
          } else {
            targetArr[i] = sourceArr[i];
          }
        }
        output[key] = targetArr;
      } else {
        output[key] = source[key];
      }
    }
    return output;
  };

  const t = deepMerge(deepMerge(translations['en'], translations[lang] || {}), overrides[lang] || {});


  return (
    <div className={`app-shell w-full flex flex-col md:flex-row transition-colors duration-500 overflow-hidden ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-[#0b1513] text-zinc-200'
    }`} id="saigon-guide-root">
      
      {/* ==========================================================================
          DESKTOP SIDEBAR NAVIGATION (Hidden on mobile)
          ========================================================================== */}
      <aside className="hidden lg:flex flex-col w-[340px] border-r border-zinc-800/50 p-8 shrink-0 bg-[#0f1f1b] relative z-10 justify-between">
        <div className="space-y-8">
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
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d16b4c]" />
              <span>{isCreator ? 'Theme & Editor / 画面モード' : 'Theme / 画面モード'}</span>
            </label>
            <button 
              id="btn-theme-toggle"
              onClick={handleDarkToggle}
              className="w-full flex items-center justify-between p-3 bg-black/30 hover:bg-black/50 border border-zinc-800/40 rounded-xl transition-all group text-left mb-2"
            >
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                )}
                <div>
                  <div className="text-xs font-medium text-zinc-200">
                    {darkMode ? 'Dark Mode / ダーク' : 'Light Mode / ライト'}
                  </div>
                  <div className="text-[10px] text-zinc-400">Tap to toggle style / 雰囲気切り替え</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            {/* Creator Studio Toggle */}
            {isCreator && (
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
            )}
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-4">
              Guide Contents
            </label>
            <ul className="space-y-1" id="desktop-nav-menu">
              {pagesList.map((pageName, idx) => (
                <li key={pageName}>
                  <button
                    id={`desktop-nav-item-${idx}`}
                    onClick={() => navigateToPage(idx)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      currentPage === idx
                        ? 'bg-[#b85233]/15 text-[#d16b4c] font-semibold border-l-4 border-[#b85233]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-xs opacity-75">0{idx + 1}</span>
                      <span className="text-sm">{t.pages[pageName]}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${
                      currentPage === idx ? 'bg-[#b85233] text-white' : 'bg-zinc-800 text-zinc-500'
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
        <div className="pt-6 border-t border-zinc-800/50 space-y-1 text-center">
          <p className="text-[11px] text-zinc-400">&copy; 2026 Lục Lam. All rights reserved.</p>
          <p className="text-[9px] text-zinc-600">Designed for Saigon Travelers with Premium UI</p>
        </div>
      </aside>

      {/* ==========================================================================
          MOBILE NAVIGATION TOP STICKY BAR (Visible on mobile/tablet)
          ========================================================================== */}
      <header className="lg:hidden shrink-0 flex items-center justify-between px-4 py-3 bg-[#0f1f1b] border-b border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span 
            onClick={handleBrandClick}
            className="text-lg font-serif font-bold text-[#d16b4c] select-none"
          >
            {t.brand}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-zinc-400 px-1.5 py-0.5 bg-zinc-800 rounded">
            {t.pages[pagesList[currentPage]]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Quick select language */}
          <select 
            id="mobile-lang-select"
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
          
          {/* Theme switch */}
          <button 
            id="btn-mobile-theme"
            onClick={handleDarkToggle}
            className="p-1.5 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-zinc-300"
            title="Toggle theme mode"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </header>

      {/* ==========================================================================
          MAIN AREA: THE INTERACTIVE MOBILE DEVICE MOCKUP / OR DIRECT LAYOUT
          ========================================================================== */}
      <main className="flex-1 flex items-center justify-center p-0 lg:p-8 relative overflow-y-auto">
        
        {/* Device Container Mockup frame on desktop */}
        <div className="w-full max-w-full lg:max-w-[430px] h-full lg:h-[860px] bg-zinc-900 border-0 lg:border-[12px] lg:border-zinc-800 lg:rounded-[55px] lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden transition-all duration-300">
          
          {/* Notch indicator on desktop */}
          <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[24px] bg-zinc-800 rounded-b-2xl z-40">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 absolute right-12 top-2"></div>
            <div className="w-12 h-1 bg-zinc-900 rounded absolute left-12 top-2.5"></div>
          </div>

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
              <section className="w-full h-full shrink-0 snap-start text-[#f6f3eb] flex flex-col justify-between p-6 relative overflow-y-auto overflow-x-hidden bg-zinc-950">
                
                {/* Full-bleed high-contrast premium Ben Thanh aerial photograph background */}
                <div className="absolute inset-0 transition-all duration-700">
                  <img 
                    src={withBasePath((customMedia.cover?.img && !customMedia.cover.img.includes('unsplash.com')) ? customMedia.cover.img : "/uploads/cover_benthanh.jpg")}
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
                
                {/* Minimal top bar border decoration */}
                <div className="pt-8 flex justify-between items-center border border-amber-500/30 pb-3 relative z-10 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-xl">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-amber-400 font-serif font-bold">{t.brand}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-200 font-serif font-semibold">2026 EDITION</span>
                  </div>
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
              <section className="[container-type:size] w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-5 overflow-y-auto">
                <div className="space-y-[clamp(0.65rem,2.4cqh,1.25rem)]">

                  {/* Minimal page header decoration */}
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-2">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      02 | {t.pages.welcome}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Welcome to Saigon</span>
                  </div>

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

                    {/* Right: Coffee & Croissant design visual reconstruction using styled UI */}
                    <div className="relative bg-[#e6e2d8] rounded-xl overflow-hidden min-h-[clamp(100px,15cqh,140px)] flex flex-col justify-end p-3 shadow-sm group">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                      
                      {/* Geometric Representation of coffee & croissant art elements */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-65 group-hover:scale-105 transition-transform">
                        <div className="w-16 h-16 rounded-full bg-amber-800/40 blur-sm absolute -top-2 -left-2"></div>
                        <div className="w-24 h-24 rounded-full bg-yellow-600/20 absolute -right-6 -bottom-6"></div>
                        
                        {/* Styled vectors */}
                        <Coffee className="w-14 h-14 text-amber-900/30 rotate-12" />
                      </div>

                      {/* Text indicator */}
                      <div className="relative z-20 space-y-0.5">
                        <span className="text-[8px] uppercase tracking-widest text-amber-400 block font-bold">SAIGON COFFEE</span>
                        <span className="text-[10px] font-serif text-white font-bold block">Ca Phe Sua Da</span>
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
                          <div 
                            key={idx} 
                            onClick={() => setShowFeaturePopup(showFeaturePopup === idx ? null : idx)}
                            className="relative flex flex-col items-center text-center cursor-pointer group"
                          >
                            <div className="w-10 h-10 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center text-[#0b433f] shadow-sm group-hover:bg-[#0b433f] group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                              {iconsList[idx]}
                            </div>
                            <span className="text-[8px] font-bold text-[#0b433f] leading-tight mt-1.5">
                              {feat.title.split(' ')[0]}
                            </span>

                            {/* Popup with full detail */}
                            {showFeaturePopup === idx && (
                              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-36 bg-zinc-900 text-white p-2.5 rounded-lg text-[9px] leading-normal text-left shadow-xl z-30 space-y-1 border border-zinc-700">
                                <strong className="block text-[#d16b4c] border-b border-zinc-800 pb-0.5 font-bold">{feat.title}</strong>
                                <p className="text-zinc-300">{feat.desc}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Tips Banner (Leaf/Warning/Advice style) */}
                <div className="mt-3 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  <div className="grid grid-cols-2 gap-2 divide-x divide-zinc-400/20">
                    <p className="pr-1.5">{t.welcome.advice[0]}</p>
                    <p className="pl-1.5">{t.welcome.advice[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 03: CITY GUIDE / DISTRICTS WITH MAP
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Minimal page header decoration */}
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      03 | {t.pages.atmosphere}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Explore Saigon Map</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.atmosphere.description}
                  </p>



                  {/* Bến Thành Market Stylized Map Guide */}
                  <div className="bg-[#fcfbf9] border border-zinc-300/80 rounded-2xl p-4 shadow-sm space-y-3 text-zinc-800">
                    <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🗺️</span>
                        <div>
                          <h3 className="text-xs font-bold text-[#0b433f] uppercase tracking-wider">
                            {lang === 'vi' ? 'Bản Đồ Chợ Bến Thành' : lang === 'ko' ? '벤탄 시장 지도' : lang === 'ja' ? 'ベンタイン市場 地図' : 'Bến Thành Market Map'}
                          </h3>
                          <p className="text-[9px] text-zinc-500 font-light">
                            {lang === 'vi' ? 'Đã đồng bộ trực tiếp với Google Maps' : lang === 'ko' ? '구글 지도와 실시간 동기화됨' : lang === 'ja' ? 'Googleマップと同期済み' : 'Synchronized directly with Google Maps'}
                          </p>
                        </div>
                      </div>

                      {/* Map Toggle Tabs */}
                      <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 shrink-0">
                        <button
                          onClick={() => setBenThanhMapTab('google')}
                          className={`px-2 py-0.5 text-[8px] font-bold rounded-md transition-all cursor-pointer ${
                            benThanhMapTab === 'google'
                              ? 'bg-white text-[#0b433f] shadow-sm border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          Google Maps
                        </button>
                        <button
                          onClick={() => setBenThanhMapTab('gate')}
                          className={`px-2 py-0.5 text-[8px] font-bold rounded-md transition-all cursor-pointer ${
                            benThanhMapTab === 'gate'
                              ? 'bg-white text-[#0b433f] shadow-sm border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          {lang === 'vi' ? 'Sơ đồ cổng' : lang === 'ko' ? '게이트 안내도' : 'Gate Layout'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      {benThanhMapTab === 'google' ? (
                        <div className="w-full aspect-square bg-zinc-100 rounded-xl overflow-hidden border border-zinc-200 shadow-inner relative group min-h-[160px]">
                          <iframe
                            title="Ben Thanh Market Live Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4851493033503!2d106.69634921102951!3d10.772590289329712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3f5080e7c5%3A0x7d6f59df04a80693!2zQ2jhu6MgQuG6v24gVGjDoG5o!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                          ></iframe>
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
                        <div className="relative aspect-square w-full max-w-[150px] mx-auto bg-amber-50/50 rounded-xl border border-amber-900/10 p-2 flex flex-col justify-between items-center shadow-inner">
                          
                          {/* North Gate (Cổng Bắc) */}
                          <div className="text-center w-full">
                            <span className="bg-[#0b433f] text-white text-[7px] font-bold px-1 py-0.5 rounded shadow">
                              {lang === 'vi' ? 'CỔNG BẮC' : lang === 'ko' ? '북문 (North)' : 'NORTH GATE'}
                            </span>
                            <span className="block text-[8px] text-zinc-500 mt-0.5">{lang === 'vi' ? 'Hoa tươi & Trái cây' : 'Flowers & Fruits'}</span>
                          </div>

                          {/* Middle Row with East and West Gates + Center Dome */}
                          <div className="flex justify-between items-center w-full my-1">
                            {/* West Gate (Cổng Tây) */}
                            <div className="text-center w-1/3">
                              <span className="bg-amber-600 text-white text-[7px] font-bold px-1 py-0.5 rounded shadow block">
                                {lang === 'vi' ? 'CỔNG TÂY' : lang === 'ko' ? '서문' : 'WEST'}
                              </span>
                              <span className="block text-[6px] text-zinc-500 mt-0.5 leading-none">{lang === 'vi' ? 'Quà lưu niệm' : 'Souvenirs'}</span>
                            </div>

                            {/* Center Dome (Gian trung tâm) */}
                            <div className="text-center w-1/3 flex flex-col items-center justify-center p-1 bg-[#b85233]/10 border border-[#b85233]/30 rounded-full aspect-square relative">
                              <span className="text-[8px] font-bold text-[#b85233] block">
                                {lang === 'vi' ? 'ẨM THỰC' : lang === 'ko' ? '푸드코트' : 'FOOD'}
                              </span>
                              <span className="text-[6px] text-zinc-500 block leading-none font-light">{lang === 'vi' ? 'Chè, Cà phê' : 'Food court'}</span>
                            </div>

                            {/* East Gate (Cổng Đông) */}
                            <div className="text-center w-1/3">
                              <span className="bg-amber-600 text-white text-[7px] font-bold px-1 py-0.5 rounded shadow block">
                                {lang === 'vi' ? 'CỔNG ĐÔNG' : lang === 'ko' ? '동문' : 'EAST'}
                              </span>
                              <span className="block text-[6px] text-zinc-500 mt-0.5 leading-none">{lang === 'vi' ? 'Bánh kẹo' : 'Sweets'}</span>
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
                  <div className="space-y-3">
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
                          className={`border rounded-xl p-3.5 transition-all duration-300 ${cardColors} ${
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
                <div className="mt-4 p-3 bg-[#f0ede4] rounded-xl border border-[#dcd7ca] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#b85233]"></div>
                  <div className="grid grid-cols-2 gap-3 pl-1">
                    <div className="space-y-0.5">
                      <strong className="block text-[#b85233] font-bold">{t.atmosphere.tipsTitle}</strong>
                      <p className="text-zinc-600 leading-tight font-light">{t.atmosphere.tipsDesc}</p>
                    </div>
                    <div className="space-y-0.5 border-l border-zinc-300/40 pl-3">
                      <strong className="block text-[#0b433f] font-bold">Transit</strong>
                      <p className="text-zinc-600 leading-tight font-light">{t.atmosphere.transportTip}</p>
                    </div>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 04: TRANSPORTATION
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Minimal page header decoration */}
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      04 | {t.pages.transport}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Transit in Ho Chi Minh</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.transport.intro}
                  </p>

                  {/* 4 Circles Transport Grid */}
                  <div className="grid grid-cols-4 gap-2">
                    {t.transport.options.map((opt, idx) => {
                      const iconsList = [
                        <span className="text-2xl font-bold">🛵</span>,
                        <span className="text-2xl font-bold">🚗</span>,
                        <span className="text-2xl font-bold">🚇</span>,
                        <span className="text-2xl font-bold">🚕</span>
                      ];
                      return (
                        <div 
                          key={idx}
                          onClick={() => setShowTransportPopup(showTransportPopup === idx ? null : idx)}
                          className="relative flex flex-col items-center text-center cursor-pointer group"
                        >
                          <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center hover:scale-105 hover:bg-zinc-100 transition-all">
                            {iconsList[idx]}
                          </div>
                          <span className="text-[8px] font-bold text-[#0b433f] leading-tight mt-1.5">
                            {opt.name.split(' ')[0]}
                          </span>

                          {/* Detail Popup */}
                          {showTransportPopup === idx && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-40 bg-zinc-900 text-white p-2.5 rounded-lg text-[9px] leading-normal text-left shadow-xl z-30 space-y-1 border border-zinc-700">
                              <strong className="block text-[#d16b4c] border-b border-zinc-800 pb-0.5 font-bold">{opt.name}</strong>
                              <p className="text-zinc-300">{opt.desc}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Estimated Pricing Table */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#0b433f] flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#b85233]" />
                      <span>{t.transport.tableTitle}</span>
                    </h4>
                    
                    <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <table className="w-full text-left border-collapse text-[9px]">
                        <thead>
                          <tr className="bg-[#0b433f] text-white">
                            {t.transport.tableHeaders.map((head, hidx) => (
                              <th key={hidx} className="p-2 border-r border-teal-800/50 last:border-0 font-medium">
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                          <tr className="hover:bg-[#b85233]/5 transition-colors">
                            <td className="p-2 font-semibold">Bike (Grab)</td>
                            <td className="p-2">15k-25k</td>
                            <td className="p-2">25k-40k</td>
                            <td className="p-2">40k-70k</td>
                            <td className="p-2 text-[8px] text-zinc-500">App/Cash</td>
                          </tr>
                          <tr className="hover:bg-[#b85233]/5 transition-colors">
                            <td className="p-2 font-semibold">Car (Grab)</td>
                            <td className="p-2">40k-70k</td>
                            <td className="p-2">70k-120k</td>
                            <td className="p-2">120k-200k</td>
                            <td className="p-2 text-[8px] text-zinc-500">App/Cash</td>
                          </tr>
                          <tr className="hover:bg-[#b85233]/5 transition-colors">
                            <td className="p-2 font-semibold">Metro</td>
                            <td className="p-2">7k-10k</td>
                            <td className="p-2">10k-15k</td>
                            <td className="p-2">15k-20k</td>
                            <td className="p-2 text-[8px] text-zinc-500">IC/Cash</td>
                          </tr>
                          <tr className="hover:bg-[#b85233]/5 transition-colors">
                            <td className="p-2 font-semibold">Taxi (Traditional)</td>
                            <td className="p-2">20k-40k</td>
                            <td className="p-2">50k-90k</td>
                            <td className="p-2">90k-150k</td>
                            <td className="p-2 text-[8px] text-zinc-500">Cash/Card</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <span className="text-[8px] text-zinc-400 italic block">{t.transport.tableNote}</span>
                  </div>

                  {/* 2-Column: Key points list + Ride Apps banner */}
                  <div className="grid grid-cols-12 gap-3">
                    
                    {/* Points checklist (7 cols) */}
                    <div className="col-span-7 space-y-2">
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
                    <div className="col-span-5 bg-white border border-[#b85233]/20 rounded-xl p-2.5 flex flex-col justify-between space-y-1.5">
                      <span className="text-[8px] font-bold uppercase text-[#b85233] block text-center">
                        {t.transport.rideApps}
                      </span>

                      {/* Grab logo row */}
                      <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded border border-zinc-100">
                        <div className="w-6 h-6 rounded bg-[#00b14f] text-white font-black text-[7px] flex items-center justify-center">
                          Grab
                        </div>
                        <div className="text-[7.5px] leading-tight">
                          <strong className="block text-zinc-800 font-bold">Grab</strong>
                          <span className="text-zinc-500 block">All-in-one</span>
                        </div>
                      </div>

                      {/* Xanh SM logo row */}
                      <div className="flex items-center gap-1.5 bg-zinc-50 p-1 rounded border border-zinc-100">
                        <div className="w-6 h-6 rounded bg-[#00afb9] text-white font-extrabold text-[7px] flex items-center justify-center leading-none">
                          Xanh
                        </div>
                        <div className="text-[7.5px] leading-tight">
                          <strong className="block text-zinc-800 font-bold">Xanh SM</strong>
                          <span className="text-zinc-500 block">Eco Taxi</span>
                        </div>
                      </div>


                    </div>

                  </div>

                </div>

                {/* Bottom row advice banner wrapper */}
                <div className="mt-5 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  <div className="grid grid-cols-2 gap-2 divide-x divide-zinc-400/20">
                    <p className="pr-1.5">{t.welcome.advice[0]}</p>
                    <p className="pl-1.5">{t.welcome.advice[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 05: STAY & REJUVENATE (CARE)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  
                  {/* Minimal page header decoration */}
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      05 | {t.pages.stay}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Wellness & Hotels</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.stay.intro}
                  </p>

                  {/* Collage-style grid visual representation of page 5 */}
                  <div className="grid grid-cols-12 gap-2 h-[220px]">
                    
                    {/* Left block (7 cols): Main colonial boutique hotel room artwork */}
                    <div className="col-span-7 bg-[#dfdacd] border border-zinc-300 rounded-xl relative overflow-hidden group shadow-sm">
                      <img 
                        src="/uploads/external/9734d76f9fad.jpg" 
                        alt="Boutique Hotel Room Saigon" 
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
                            <img 
                              src={rightImages[sidx]} 
                              alt="Wellness illustration" 
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
                  <div className="grid grid-cols-3 gap-2">
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
                          <div className="h-14 relative overflow-hidden bg-zinc-100">
                            <img 
                              src={catBanners[cidx]} 
                              alt={cat.title} 
                              width={400}
                              height={267}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between">
                              <span className="text-[8.5px] font-bold text-white leading-tight font-serif drop-shadow-sm">
                                {cat.title}
                              </span>
                              <div className="w-5 h-5 rounded-full bg-[#b85233] flex items-center justify-center shrink-0 shadow">
                                {iconsList[cidx]}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 flex-1 flex flex-col justify-between">
                            <span className="text-[6.5px] text-zinc-400 block tracking-wider uppercase mb-1">
                              {cat.subtitle.substring(0, 12)}
                            </span>

                            <ul className="space-y-1 text-[7.5px] text-zinc-600 leading-normal font-light">
                              {cat.bullets.map((bul, bidx) => (
                                <li key={bidx} className="flex gap-1 items-start">
                                  <span className="text-[#b85233]">•</span>
                                  <p className="line-clamp-2">{bul}</p>
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
                <div className="mt-4 p-3 bg-[#e6e2d8] rounded-xl border-l-4 border-[#0b433f] flex gap-3 text-[10px] text-zinc-700 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-[#0b433f] shrink-0 mt-0.5" />
                  <div className="grid grid-cols-2 gap-2 divide-x divide-zinc-400/20">
                    <p className="pr-1.5">{t.stay.tips[0]}</p>
                    <p className="pl-1.5">{t.stay.tips[1]}</p>
                  </div>
                </div>

              </section>

              {/* ==========================================================================
                  PAGE 06: FOOD (Legends Must-Eat)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto" id="food-page-section">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      06 | {t.pages.food}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Must-Eat Legends</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.food.intro}
                  </p>

                  {/* Horizontal scrollable category tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar" id="food-category-tabs">
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
                  {t.food.categories[activeFoodTab]?.quote && (
                    <div className="bg-amber-50/50 rounded-xl p-3 border-l-4 border-[#b85233]/70 shadow-sm" id="food-quote-card">
                      <p className="text-[10px] italic text-zinc-700 leading-relaxed font-serif">
                        {t.food.categories[activeFoodTab].quote}
                      </p>
                    </div>
                  )}

                  {/* Curated 3 Restaurants List for active Category */}
                  <div className="space-y-3 pt-1" id="food-restaurants-list">
                    {t.food.categories[activeFoodTab]?.restaurants.map((item: any, idx: number) => {
                      const placeId = `food-${activeFoodTab}-${idx}`;
                      const media = getPlaceMedia(placeId);
                      return (
                        <div 
                          key={idx} 
                          id={`food-restaurant-${idx}`}
                          onClick={() => handleOpenDetail('food', activeFoodTab, idx, item)}
                          className="bg-white rounded-2xl p-3 border border-zinc-200/80 shadow-sm hover:border-[#b85233]/40 transition-all duration-300 relative group overflow-hidden flex gap-3 cursor-pointer hover:shadow-md"
                        >
                          {/* Card Media Thumbnail Left */}
                          <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                            <ThumbnailPreview url={media.img || media.video} />
                          </div>

                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex justify-between items-start">
                              <h3 className="text-[11px] font-bold text-[#0b433f] leading-snug truncate pr-2">{item.name}</h3>
                              <span className="text-[9px] font-mono font-bold text-[#b85233] shrink-0">#{idx + 1}</span>
                            </div>
                            <span className="text-[8.5px] text-[#b85233] font-medium block">{item.sub}</span>
                            <p className="text-[9px] text-zinc-500 leading-normal font-light line-clamp-1 mt-1">
                              {item.desc}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-1 text-[8px] text-zinc-400">
                              <span className="truncate flex items-center gap-0.5 max-w-[65%]">
                                <MapPin className="w-2.5 h-2.5 text-[#b85233] shrink-0" />
                                <span className="truncate">{item.addr}</span>
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5 text-[#0b433f] shrink-0" />
                                <span>{item.hours}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Pocket Companion</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 07: CULTURE & LANDMARKS
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      07 | {t.pages.culture}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Heritage & Check-in</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.culture.intro}
                  </p>

                  {/* Category Selection Tabs */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
                    {(['all', 'heritage', 'spiritual', 'modern', 'nature'] as const).map((cat) => {
                      const isSelected = activeCultureCategory === cat;
                      const label = cat === 'all'
                        ? { vi: 'Tất cả', en: 'All', ja: 'すべて', zh: '全部', zht: '全部' }[lang]
                        : t.culture.categories[cat];
                      const emoji = {
                        all: '✨',
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
                    {t.culture.items
                      .filter(item => activeCultureCategory === 'all' || item.category === activeCultureCategory)
                      .map((item, idx) => {
                        const originalIdx = t.culture.items.findIndex((x: any) => x.name === item.name);
                        const placeId = `culture-${originalIdx >= 0 ? originalIdx : idx}`;
                        const media = getPlaceMedia(placeId);
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => handleOpenDetail('culture', originalIdx >= 0 ? originalIdx : idx, undefined, item)}
                            className="bg-white rounded-2xl p-3 border border-zinc-200/80 shadow-sm hover:border-[#0b433f]/40 transition-all duration-300 relative overflow-hidden flex gap-3 cursor-pointer hover:shadow-md"
                          >
                            <div className="absolute top-0 left-0 w-1 h-full bg-[#0b433f]"></div>

                            <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                              <ThumbnailPreview url={media.img || media.video} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-[11px] font-bold text-[#0b433f] leading-snug flex items-center gap-1.5 truncate">
                                <span role="img" aria-label="culture emoji" className="text-sm shrink-0">{item.emoji}</span>
                                <span className="truncate">{item.name}</span>
                              </h3>
                              <span className="text-[8.5px] text-[#b85233] font-medium block">{item.sub}</span>
                              <p className="text-[9px] text-zinc-500 leading-normal font-light line-clamp-1 mt-1">
                                {item.desc}
                              </p>

                              <div className="flex items-center gap-2 mt-1 text-[8px] text-zinc-400">
                                <span className="truncate flex items-center gap-0.5 max-w-[65%]">
                                  <MapPin className="w-2.5 h-2.5 text-[#b85233] shrink-0" />
                                  <span className="truncate">{item.addr}</span>
                                </span>
                                <span className="flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5 text-[#0b433f] shrink-0" />
                                  <span>{item.hours}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Heritage Route</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 08: SHOPPING & SOUVENIRS
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      08 | {t.pages.shopping}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Shop Local Vibes</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.shopping.intro}
                  </p>

                  <div className="space-y-3 pt-1">
                    {t.shopping.items.map((item, idx) => {
                      const placeId = `shopping-${idx}`;
                      const media = getPlaceMedia(placeId);

                      return (
                        <div 
                          key={idx}
                          onClick={() => handleOpenDetail('shopping', idx, undefined, item)}
                          className="bg-white rounded-2xl p-3 border border-zinc-200/80 shadow-sm hover:border-amber-600/40 transition-all duration-300 relative overflow-hidden flex gap-3 cursor-pointer hover:shadow-md"
                        >
                          <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200/50 relative">
                            <ThumbnailPreview url={media.img || media.video} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex gap-2 items-start">
                              <span className="text-base shrink-0" role="img" aria-label="shopping emoji">{item.emoji}</span>
                              <div className="min-w-0">
                                <h3 className="text-[11px] font-bold text-[#0b433f] leading-snug truncate">{item.name}</h3>
                                <span className="text-[8.5px] text-amber-700 font-medium block">{item.sub}</span>
                              </div>
                            </div>
                            <p className="text-[9px] text-zinc-500 leading-normal font-light line-clamp-1 mt-1">
                              {item.desc}
                            </p>

                            <div className="flex items-center gap-2 mt-1 text-[8px] text-zinc-400">
                              <span className="truncate flex items-center gap-0.5 max-w-[65%]">
                                  <MapPin className="w-2.5 h-2.5 text-[#b85233] shrink-0" />
                                  <span className="truncate">{item.addr}</span>
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5 text-[#0b433f] shrink-0" />
                                <span>{item.hours}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Shopping Companion</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 09: LỤC LAM TRẠM DỪNG CHÂN (Signature Experience)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#0b1513] text-[#f6f3eb] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b-[1.5px] border-amber-500/30 pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>09 | {t.pages.luclam}</span>
                    </span>
                    {/* English by design, like the eyebrow on the other eight
                        pages. This one was the only Vietnamese hold-out. */}
                    <span className="text-[11px] font-serif italic text-amber-500/90">Cultural Rest Stop</span>
                  </div>

                  {/* Stunning Shimmering Indochine Intro Card */}
                  <div className="bg-gradient-to-br from-[#0c2b27] via-[#081e1b] to-black rounded-2xl p-4.5 border border-amber-500/20 shadow-xl relative overflow-hidden">
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

                  {/* Premium Tea Menu List */}
                  <div className="space-y-3">
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
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  width={48}
                                  height={48}
                                  loading="lazy"
                                  decoding="async"
                                  className={`w-12 h-12 rounded-lg object-cover shrink-0 border border-zinc-800 transition-transform duration-300 ${isExpanded ? 'scale-105 border-amber-500/30' : ''}`}
                                  referrerPolicy="no-referrer"
                                  onError={useFallbackImage}
                                />
                              ) : (
                                <span className="text-2xl shrink-0" role="img" aria-label="menu emoji">{item.emoji}</span>
                              )}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-baseline gap-2">
                                  <h5 className="text-[10.5px] font-bold text-white tracking-wide truncate pr-1">{item.name}</h5>
                                  <span className="text-[10px] font-bold text-amber-400 shrink-0">{item.price}</span>
                                </div>
                                <p className={`text-[9px] text-zinc-400 leading-normal font-light ${isExpanded ? '' : 'line-clamp-1'}`}>
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
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center border-l-2 border-amber-500 pl-2">
                      <h4 className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
                        {lang === 'vi' ? 'Hệ Thống Cửa Hàng Lục Lam' : lang === 'ko' ? '룩람 오프라인 매장' : lang === 'ja' ? 'Lục Lam 店舗ネットワーク' : 'Lục Lam Branch Locator'}
                      </h4>
                      <span className="text-[7px] font-mono bg-amber-950 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">4 BRANCHES</span>
                    </div>

                    <div className="space-y-2 text-zinc-800">
                      {/* Saigon branch */}
                      <div className="bg-[#0c2b27]/40 rounded-xl p-3 border border-amber-500/10 space-y-1 shadow-inner">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] bg-[#0b433f] border border-emerald-400/20 text-white font-bold px-1.5 py-0.5 rounded">SAIGON</span>
                          <a 
                            href="https://maps.app.goo.gl/8tExfsHC1m2E4bxH7" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[8px] text-amber-400 hover:underline font-bold"
                          >
                            <span>Google Maps</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                        <h5 className="text-[10.5px] font-bold text-white tracking-wide">Lục Lam Takashimaya B2 Branch</h5>
                        <p className="text-[8.5px] text-zinc-400 font-light">B2 Floor, Takashimaya, 65 Lê Lợi, Bến Nghé, District 1, HCMC</p>
                      </div>

                      {/* Da Nang branches */}
                      <div className="bg-amber-950/20 rounded-xl p-3 border border-amber-500/15 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[8px] bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded">ĐÀ NẴNG (3 Locations)</span>
                          <span className="text-[8px] text-amber-400 font-bold italic animate-pulse">New Concept Open!</span>
                        </div>
                        
                        <div className="divide-y divide-zinc-800/60 space-y-2.5 pt-0.5">
                          {/* 1. Lục Lam Flagship */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-amber-200">1. Lục Lam Flagship</span>
                              <a 
                                href="https://www.google.com/maps/search/?api=1&query=Luc+Lam+202+Tran+Phu+Hai+Chau+Da+Nang" 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[8px] text-amber-400 hover:underline font-bold flex items-center gap-0.5"
                              >
                                <span>Directions</span>
                                <ExternalLink className="w-2 h-2" />
                              </a>
                            </div>
                            <img 
                              src="/uploads/external/c561cd48f545.jpg" 
                              alt="Lục Lam Flagship" 
                              width={800}
                              height={533}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-24 object-cover rounded-lg border border-zinc-800/80 my-1"
                              referrerPolicy="no-referrer"
                            />
                            <p className="text-[8.5px] text-zinc-400 font-light">202 Trần Phú, Hải Châu, Đà Nẵng</p>
                          </div>

                          {/* 2. Lục Lam Premium */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-amber-200">2. Lục Lam Premium</span>
                              <a 
                                href="https://www.google.com/maps/search/?api=1&query=Luc+Lam+104+Tran+Phu+Hai+Chau+Da+Nang" 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[8px] text-amber-400 hover:underline font-bold flex items-center gap-0.5"
                              >
                                <span>Directions</span>
                                <ExternalLink className="w-2 h-2" />
                              </a>
                            </div>
                            <p className="text-[8.5px] text-zinc-400 font-light">104 Trần Phú, Hải Châu, Đà Nẵng</p>
                          </div>

                          {/* 3. Lục Lam New Concept */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-amber-200">3. Lục Lam New Concept</span>
                              <a 
                                href="https://www.google.com/maps/search/?api=1&query=Luc+Lam+259+Tran+Phu+Hai+Chau+Da+Nang" 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[8px] text-amber-400 hover:underline font-bold flex items-center gap-0.5"
                              >
                                <span>Directions</span>
                                <ExternalLink className="w-2 h-2" />
                              </a>
                            </div>
                            <p className="text-[8.5px] text-zinc-400 font-light">259 Trần Phú, Hải Châu, Đà Nẵng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* International Instagram Portals */}
                  <div className="space-y-3 pt-2">
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
                  <div className="space-y-3 pt-2">
                    <div className="relative bg-[#0d2b27] rounded-2xl border-2 border-dashed border-amber-500/30 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
                      {/* Left-right notched holes */}
                      <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#0b1513] -translate-y-1/2 border-r border-amber-500/20 z-10"></div>
                      <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#0b1513] -translate-y-1/2 border-l border-amber-500/20 z-10"></div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {t.luclam.voucherBadge}
                          </span>
                          <span className="text-[10px] font-serif font-black text-amber-400 tracking-wide">LỤC LAM VOUCHER</span>
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
                          
                          <div className="flex gap-0.5">
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

                <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-500 uppercase">Lục Lam Hospitality Oasis</span>
                </div>
              </section>

              {/* ==========================================================================
                  PAGE 10: USEFUL INFO (Safety, Cash & SIM)
                  ========================================================================== */}
              <section className="w-full h-full shrink-0 snap-start bg-[#f6f3eb] text-[#2c3531] flex flex-col justify-between p-6 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b-[1.5px] border-[#b85233] pb-1.5 pt-4">
                    <span className="text-[11px] font-bold text-[#0b433f] tracking-widest uppercase">
                      10 | {t.pages.info}
                    </span>
                    <span className="text-[11px] font-serif italic text-zinc-500">Security & Backup</span>
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-600 font-light">
                    {t.info.intro}
                  </p>

                  <div className="space-y-4 pt-1">
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
                              <div key={iidx} className="bg-white rounded-xl p-3 border border-zinc-200/60 shadow-sm space-y-1">
                                <h5 className="text-[9px] font-bold text-[#0b433f] flex justify-between items-center">
                                  <span>{item.label}</span>
                                  {idx === 0 && (
                                    <span className="text-[8px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-100 font-normal">Emergency</span>
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
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200/40 text-center">
                  <span className="text-[8px] tracking-widest text-zinc-400 uppercase">Lục Lam Peace of Mind Guarantee</span>
                </div>
              </section>

            </div>

            {/* ==========================================================================
                MOBILE VIEWPORT BOTTOM TABS NAVIGATOR (Syncs scroll snaps)
                ========================================================================== */}
            <nav className="border-t border-zinc-200/80 bg-white/95 backdrop-blur-sm flex overflow-x-auto shrink-0 select-none max-w-full pb-1 pt-1.5 px-3 gap-1 z-30 scrollbar-none">
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

            {/* Sticky Floating Flag Language Selector (Horizontal on mobile, Vertical on desktop) */}
            <div 
              id="sticky-flag-selector"
              className="absolute bottom-[52px] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[35%] md:-translate-y-1/2 md:right-2 md:left-auto md:translate-x-0 z-[45] flex flex-row md:flex-col gap-1.5 md:gap-2 bg-black/75 backdrop-blur-md p-1.5 rounded-full md:rounded-2xl border border-zinc-800/80 shadow-2xl animate-in slide-in-from-right duration-500"
              title="Chọn ngôn ngữ / Select Language"
            >
              <div className="hidden md:block text-[8px] font-bold text-center text-zinc-400 uppercase py-0.5 tracking-wider select-none border-b border-zinc-800/60">
                Lang
              </div>
              {[
                { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
                { code: 'zht' as Language, label: '繁體中文', flag: '🇹🇼' },
                { code: 'zh' as Language, label: '简体中文', flag: '🇨🇳' },
                { code: 'ja' as Language, label: '日本語', flag: '🇯🇵' },
                { code: 'ko' as Language, label: '한국어', flag: '🇰🇷' }
              ].map(({ code, label, flag }) => {
                const isActive = lang === code;
                return (
                  <div key={code} className="relative group flex items-center justify-center">
                    <button
                      onClick={() => handleLangChange(code)}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-lg md:text-xl transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-amber-500/20 border-2 border-[#d16b4c] scale-110 shadow-lg shadow-amber-500/25 ring-2 ring-amber-500/10'
                          : 'bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/80 hover:scale-105 hover:border-zinc-700'
                      }`}
                      title={label}
                    >
                      <span className="leading-none drop-shadow-sm">{flag}</span>
                    </button>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 bg-zinc-950/95 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-zinc-800 shadow-xl whitespace-nowrap transition-all duration-200 z-50 hidden md:block">
                      <span className="mr-1.5">{flag}</span>
                      <span>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>


          </div>
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
  );
}
