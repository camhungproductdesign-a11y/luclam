import React, { useState, useRef } from 'react';
import { findEmbedHeight, isTikTokOrigin } from '../embedHeight';
import { 
  X, 
  ArrowLeft,
  MapPin, 
  Clock, 
  DollarSign, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Navigation, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Star,
  Info,
  Sparkles,
  Compass,
  Upload,
  Settings
} from 'lucide-react';
import { useMediaUrl } from '../hooks/useMediaUrl';
import { detectEmbed, getEmbedDetails } from '../videoEmbed';
import { Picture } from './Picture';
import { saveMedia } from '../indexedDBStore';
import { creditFor } from '../mediaCredits';

interface PlaceMedia {
  img: string;
  video: string;
}

interface PlaceData {
  id: string; // e.g. food-0-0 or culture-2
  name: string;
  sub: string;
  desc: string;
  addr: string;
  hours: string;
  price?: string;
  emoji?: string;
}

interface PlaceDetailModalProps {
  place: PlaceData;
  media: PlaceMedia;
  isOpen: boolean;
  onClose: () => void;
  lang: string;
  onUpdateMedia?: (placeId: string, type: 'img' | 'video', url: string) => void;
  /**
   * The video this place carries as an override, if it has one — not the one
   * on screen, which may be the default.
   *
   * The modal is handed `media` already merged, so it cannot tell the two
   * apart, and a remove button shown against a default would set the override
   * to empty, fall straight back to that same default, and appear to do
   * nothing at all.
   */
  customVideo?: string;
  onOpenEditor?: (placeId: string) => void;
  isCreator?: boolean;
}

/**
 * Shown when a place has no usable photo. It replaces "Capturing Saigon
 * Vibes...", which was English for every reader and implied something was
 * still loading when in fact there was nothing to load.
 */
const NO_PHOTO_LABEL = {
  vi: 'Chưa có ảnh cho địa điểm này',
  en: 'No photo yet',
  ja: '写真はまだありません',
  ko: '사진이 아직 없습니다',
  zh: '暂无照片',
  zht: '暫無照片',
} as const;


export function PlaceDetailModal({ 
  place, 
  media, 
  isOpen, 
  onClose, 
  lang,
  onUpdateMedia,
  onOpenEditor,
  isCreator = false,
  customVideo,
}: PlaceDetailModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'info' | 'secret'>('about');
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');

  const resolvedImg = useMediaUrl(media.img);

  // A URL that exists but will not load is different from no URL at all, and
  // only the second case was handled — so a dead link rendered the browser's
  // broken-image glyph with the alt text sprawled across the hero.
  const [heroFailed, setHeroFailed] = useState(false);
  // null until TikTok's embed reports its own height; see the effect below.
  const [tiktokHeight, setTiktokHeight] = useState<number | null>(null);
  const lastHeroSrc = useRef(resolvedImg);
  if (lastHeroSrc.current !== resolvedImg) {
    lastHeroSrc.current = resolvedImg;
    if (heroFailed) setHeroFailed(false);
  }
  const resolvedVideo = useMediaUrl(media.video);
  const embedDetails = getEmbedDetails(resolvedVideo);
  const detected = detectEmbed(importUrl);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    setImportUrl('');
    setImportError('');
    setTiktokHeight(null);
  }, [place.id]);

  // Sizes the TikTok frame to the height the embed reports. See
  // src/embedHeight.ts for why the payload is read loosely.
  React.useEffect(() => {
    if (!isOpen || embedDetails.type !== 'tiktok') return;

    const onMessage = (event: MessageEvent) => {
      if (!isTikTokOrigin(event.origin)) return;
      const height = findEmbedHeight(event.data);
      if (height) setTiktokHeight(Math.ceil(height));
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isOpen, embedDetails.type, embedDetails.embedUrl]);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmbedImport = () => {
    const trimmedUrl = importUrl.trim();
    const read = detectEmbed(trimmedUrl);
    if (read.kind === 'tiktok-short') {
      setImportError(lang === 'vi'
        ? 'Link rút gọn của TikTok không đọc được id video. Mở link đó trong trình duyệt rồi sao chép địa chỉ đầy đủ (dạng .../video/123...).'
        : 'A shortened TikTok link hides the video id. Open it in a browser and copy the full address (the one containing /video/123...).');
      return;
    }
    if (!read.ok) {
      // Naming the accepted forms rather than only the rejected one. The old
      // message described the TikTok pattern and nothing else, which is how
      // an author ends up believing TikTok is all there is.
      setImportError(lang === 'vi'
        ? 'Chưa nhận ra link này. Nhận link TikTok, YouTube, hoặc link video trực tiếp (.mp4, .webm, .mov).'
        : 'Link not recognised. Accepts TikTok, YouTube, or a direct video link (.mp4, .webm, .mov).');
      return;
    }
    onUpdateMedia?.(place.id, 'video', trimmedUrl);
    setImportError('');
  };

  // Curate mock secret tips based on the place type
  const getSecretTip = () => {
    const isFood = place.id.startsWith('food');
    const isShopping = place.id.startsWith('shopping');
    
    if (isFood) {
      if (place.id.includes('food-0')) {
        return {
          ja: '現地流のコツ: スープを飲む前に、まずはそのままの味を一口。その後、ライムを絞り、生ハーブと唐辛子を少し加えて、自分好みの風味に整えるのが地元流です。中華揚げパン（Quẩy）を浸して食べるのもお忘れなく！',
          vi: 'Mẹo địa phương: Trước khi thêm gia vị, hãy nếm thử một ngụm nước dùng nguyên bản. Sau đó vắt thêm chanh, thêm vài cọng rau húng và vài lát ớt tươi. Đừng quên gọi thêm đĩa quẩy nóng giòn để nhúng nước dùng nhé!',
          en: 'Local Pro-Tip: Taste the broth on its own first. Then squeeze in some fresh lime, add the herbs, and a few slices of chilli. Always order a plate of savoury fried dough sticks (Quẩy) to dip into the rich broth!',
          zh: '行家建议：喝汤前先尝一口原汤。然后挤点青柠汁，加几叶新鲜罗勒和辣椒片。别忘了点一份热油条（Quẩy）泡汤吃，绝配！',
          zht: '行家建議：喝湯前先嚐一口原湯。然後擠點檸檬汁，加幾葉新鮮羅勒和辣椒片。別忘了點一份熱油條（Quẩy）泡湯吃，絕配！',
          ko: '현지인 꿀팁: 국물은 먼저 아무것도 넣지 말고 한 모금 그대로 맛보세요. 그다음 라임을 짜 넣고 허브잎과 고추 몇 조각을 더해 보세요. 국물에 찍어 먹는 튀김빵(Quẩy)도 꼭 같이 주문해 보세요!'
        }[lang] || place.desc;
      }
      if (place.id.includes('food-3')) { // Cafe
        return {
          ja: '現地流のコツ: 伝統的な「フィン（Phin）」フィルターから、コンデンスミルクの入ったグラスにコーヒーがゆっくりと滴り落ちるのを眺める時間こそが、サイゴン最大の贅沢。氷の入ったグラスに移してよくかき混ぜてからお召し上がりください。',
          vi: 'Mẹo địa phương: Hãy kiên nhẫn đợi từng giọt cà phê phin đậm đặc nhỏ giọt xuống ly sữa đặc. Trút toàn bộ hỗn hợp vào ly đá đầy, khuấy thật đều tay cho đến khi bọt nâu mịn nổi lên rồi thưởng thức.',
          en: 'Local Pro-Tip: The slow, patient drip of the coffee through the traditional Phin filter over sweet condensed milk is a Saigon ritual. Pour it over ice, stir vigorously until frothy, and sip slowly.',
          zh: '行家建议：耐心等待咖啡通过传统Phin滴滤器慢慢滴入炼乳中。然后倒入满是冰块的杯中，用力搅拌均匀，直到冒出细密泡沫再享用。',
          zht: '行家建議：耐心等待咖啡透過傳統滴滴壺（Phin）慢慢滴入煉乳中。然後倒入滿是冰塊的杯中，用力攪拌均勻，直到冒出細密泡沫再享用。',
          ko: '현지인 꿀팁: 전통 핀(Phin) 필터에서 커피가 연유 위로 한 방울씩 천천히 떨어지길 기다리는 시간, 그 여유가 사이공의 방식입니다. 얼음을 가득 채운 잔에 부은 뒤 고운 거품이 올라올 때까지 힘차게 저어 천천히 음미해 보세요.'
        }[lang] || place.desc;
      }
      return {
        ja: '現地流のコツ: 夕方5時〜7時頃は大変混雑しますが、これこそがサイゴンの最も賑やかな屋台の雰囲気を味わえる最高の時間帯です。気兼ねなく屋台の低いプラスチック椅子に腰かけてみましょう！',
        vi: 'Mẹo địa phương: Tầm 5h-7h tối là giờ cao điểm nhất, nhưng lại là lúc cảm nhận rõ rệt nhất không khí ẩm thực đường phố nhộn nhịp của Sài Gòn. Hãy thoải mái kéo một chiếc ghế nhựa và hòa mình vào đám đông!',
        en: 'Local Pro-Tip: 5 PM to 7 PM is peak rush hour, but it is the best time to experience Saigon’s energetic, sizzling street food culture. Sit down comfortably on a tiny plastic stool and enjoy!',
        zh: '行家建议：傍晚5点到7点是高峰期，但也是体验西贡最具活力、最热闹的街头美食文化的最佳时机。大大方方地拉张塑料矮凳，融入人群中吧！',
        zht: '行家建議：傍晚5點到7點是尖峰時段，但也是體驗西貢最具活力、最熱鬧的街頭美食文化的最佳時機。大大方方地拉張塑膠矮凳，融入人群中吧！',
        ko: '현지인 꿀팁: 저녁 5시에서 7시는 가장 붐비는 시간이지만, 사이공의 활기찬 길거리 음식 문화를 가장 생생하게 느낄 수 있는 때이기도 합니다. 플라스틱 간이 의자 하나 끌어다 편하게 앉아 즐겨 보세요!'
      }[lang] || place.desc;
    }

    if (isShopping) {
      return {
        ja: '現地流のコツ: 市場でお買い物をする際は、笑顔を絶やさずに優しく交渉するのがコツ。提示価格の40%〜50%から交渉を始め、お互いが納得できる楽しい取引を心がけましょう！朝一番の買い物は、幸運をもたらす「開運の客（Mở hàng）」としてとても喜ばれます。',
        vi: 'Mẹo địa phương: Khi mua sắm tại chợ truyền thống, hãy luôn mỉm cười và trả giá một cách vui vẻ. Nên bắt đầu từ khoảng 40%-50% giá người bán đưa ra. Nếu mua vào sáng sớm, bạn sẽ là khách mở hàng đầy may mắn!',
        en: 'Local Pro-Tip: When shopping at local markets, always wear a warm smile and negotiate politely. Open at around 40-50% of the asking price. Buying first thing in the morning makes you the lucky first customer, the "Mở hàng"!',
        zh: '行家建议：传统市场购物时，保持微笑并礼貌还价。可以先从开价的四至五折开始。清晨第一个购买，你会成为让老板非常开心的“开张幸客”（Mở hàng）！',
        zht: '行家建議：傳統市場購物時，保持微笑並禮貌還價。可以先從開價的四至五折開始。清晨第一個購買，你會成為讓老闆非常開心的「開張幸客」（Mở hàng）！',
        ko: '현지인 꿀팁: 재래시장에서는 늘 웃는 얼굴로 정중하게 흥정하세요. 처음 부른 값의 40~50% 선에서 시작하면 적당합니다. 아침 첫 손님이 되면 상인들이 행운을 부르는 ‘머항(Mở hàng)’ 손님이라며 유난히 반겨 줍니다!'
      }[lang] || place.desc;
    }

    // Default for Culture / Check-in
    return {
      ja: '現地流のコツ: 美しい写真を撮るなら、午前8時前、または午後4時以降の柔らかな「ゴールデンアワー」の光が最適です。また、寺院や歴史的建造物を訪れる際は、肩や膝が隠れる露出を控えた服装でお越しください。',
      vi: 'Mẹo địa phương: Để có những bức ảnh check-in nghệ thuật nhất, hãy ghé thăm trước 8h sáng hoặc sau 4h chiều để đón ánh sáng dịu. Hãy ăn mặc lịch sự che kín vai và đầu gối khi tham quan các ngôi đền, chùa cổ kính.',
      en: 'Local Pro-Tip: For the best photos, come before 8 AM or after 4 PM to catch the soft golden-hour light. Please keep shoulders and knees covered when visiting ancient, sacred temples.',
      zh: '行家建议：想要拍出最好看的打卡照，建议在上午8点前或下午4点后光线柔和时段前往。参拜古老庄严的寺庙和古迹时，请务必穿着得体，遮住肩膀和膝盖。',
      zht: '行家建議：想要拍出最好看的打卡照，建議在上午8點前或下午4點後光線柔和的時段前往。參拜古老莊嚴的寺廟和古蹟時，請務必穿著得體，遮住肩膀和膝蓋。',
      ko: '현지인 꿀팁: 인생샷을 남기려면 햇살이 부드러운 골든아워, 오전 8시 이전이나 오후 4시 이후에 방문하세요. 오래된 사찰과 유적을 둘러볼 때는 어깨와 무릎을 가린 단정한 옷차림을 지켜 주세요.'
    }[lang] || place.desc;
  };

  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const handleHeroClick = () => {
    if (!isCreator) return;
    if (heroFileInputRef.current) {
      heroFileInputRef.current.click();
    }
  };

  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const result = await saveMedia(file);
      const type = file.type.startsWith('video/') ? 'video' : 'img';
      if (onUpdateMedia) {
        onUpdateMedia(place.id, type, result.url);
      }
    } catch (err: any) {
      console.error('Failed to save media:', err);
      alert('Upload failed: ' + err.message);
    }
  };

  return (
    /* Two positions, because the sheet covers a different box on each layout.
       It used to be plain `absolute inset-0`, and the nearest positioned
       ancestor was nothing at all — the shell it sat in has no `relative` — so
       it fell back to the initial containing block and stretched across the
       whole browser window. On a phone that is the right answer by accident,
       which is why it went unnoticed; on desktop it spilled far outside the
       860px device mockup the rest of the app lives in.

       The sheet is now rendered inside that mockup. At lg and up `absolute`
       binds to it, so the sheet fills the phone screen and is clipped to its
       rounded corners. Below lg `fixed` reaches the viewport instead, keeping
       the full-screen cover the mobile layout already had, including over the
       lg:hidden header that sits outside the frame. Nothing on the way up sets
       transform, filter or contain, so `fixed` escapes as intended. */
    <div
      className="fixed lg:absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:justify-center lg:items-center lg:p-8"
      onClick={onClose}
    >
      
      {/* Scrollable Container styled as a premium mobile slide-up sheet */}
      <div
        className={`w-full h-[90%] ${embedDetails.type === 'tiktok' ? 'lg:w-[1080px] lg:h-full lg:max-h-[600px]' : 'lg:w-[920px] lg:h-auto lg:max-h-full'} lg:max-w-full bg-[#f6f3eb] rounded-t-[32px] lg:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative animate-in slide-in-from-bottom lg:zoom-in-95 duration-300`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-detail-title"
        onClick={(event) => event.stopPropagation()}
      >

        {/* The clip, in a pane of its own beside everything else.

            Stacked under the hero and the tabs it had only what those left:
            42% of it was visible at 1366x768 and 66% at 1600x900. Beside them
            it is whole at every size, and it stays on screen while the reader
            moves between tabs.

            No crop here, unlike the stacked version below lg. The crop hides
            TikTok's handle, caption and Watch-now bar by showing only the top
            of an over-tall iframe, and it holds only while the box is no
            taller than the video inside. Their embed draws that video at a
            fixed height whatever width the iframe is given — measured,
            276x491 cropped cleanly, 338x600 showed the bar, 420x747 showed
            the caption — so keeping the crop honest meant pinning the box at
            315x560 and living with black bands either side of it.

            So the pane is the embed's own width and its own height instead.
            No letterbox, and the chrome is part of what is shown. When the
            embed runs past the dialog the pane scrolls, and what scrolls is
            the caption: the clip is at the top and always whole.

            w-[340px] is TikTok's own embed width plus the padding. */}
        {embedDetails.type === 'tiktok' && (
          <aside className="hidden lg:block w-[340px] shrink-0 bg-black overflow-y-auto p-2.5">
            {/* Keyed on the URL, which is what makes replacing a video feel
                instant rather than broken.
            
                Without a key React keeps the same iframe element and only
                rewrites src, and rewriting src on an iframe is a navigation:
                the browser has to tear down a YouTube player that is mid-
                playback, still decoding and still holding connections, before
                it will show anything else. For seconds after the click the old
                video is what is on screen, so Import reads as a button that
                did nothing. It also pushes an entry onto session history, so
                Back starts walking through past embeds instead of leaving.
            
                A changed key makes React drop the old element and mount a
                fresh one. Nothing has to be torn down first. Verified on the
                DOM node itself: before this, the node survived an import
                unchanged; now a new URL produces a new node. */}
            <iframe
              key={embedDetails.embedUrl}
              src={embedDetails.embedUrl}
              className="w-full border-0 rounded-2xl block"
              style={{ height: tiktokHeight ?? 760 }}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              scrolling="no"
              title="TikTok Video Embed"
            />
          </aside>
        )}

        {/* Everything else, in a column beside it. */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Top visual bar for dragging effect */}
        <div className="lg:hidden absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full z-40"></div>

        {/* --- HERO MEDIA HEADER --- */}
        <div 
          onClick={isCreator ? handleHeroClick : undefined}
          className={`w-full h-[230px] lg:h-[330px] bg-zinc-950 relative overflow-hidden shrink-0 ${isCreator ? 'group/hero cursor-pointer' : ''}`}
          title={isCreator ? (lang === 'vi' ? 'Nhấp vào đây để tải lên ảnh hoặc video cho địa điểm này' : 'Click to upload custom photo or video') : undefined}
        >
          {/* Hidden File Input */}
          {isCreator && (
            <input 
              type="file" 
              ref={heroFileInputRef} 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={handleHeroFileChange} 
            />
          )}

          {/* Main Visual Display */}
          {resolvedImg && !heroFailed ? (
            <Picture
              src={resolvedImg}
              alt={place.name}
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              onError={() => setHeroFailed(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${isCreator ? 'group-hover/hero:scale-105' : ''}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 gap-2">
              <Compass className="w-12 h-12 text-[#b85233]/40" />
              <span className="text-xs font-serif italic">
                {NO_PHOTO_LABEL[lang as keyof typeof NO_PHOTO_LABEL] ?? NO_PHOTO_LABEL.en}
              </span>
            </div>
          )}

          {/* CC BY-SA requires the author to be credited wherever the image
              appears, whoever hosts it. */}
          {creditFor(resolvedImg) && (
            <p className="absolute bottom-1 right-2 max-w-[85%] truncate text-[9px] text-white/75 bg-black/50 px-1.5 py-0.5 rounded pointer-events-none">
              {creditFor(resolvedImg)}
            </p>
          )}

          {/* Upload Hover Overlay */}
          {isCreator && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/hero:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-300 z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide uppercase drop-shadow-md">
                {lang === 'vi' ? 'Nhấp Đổi Ảnh Bìa' : lang === 'ja' ? 'クリックして写真を変更' : 'Click to Change Photo'}
              </span>
              <span className="text-[9px] text-zinc-200 font-light drop-shadow-sm">
                {lang === 'vi' ? 'Hỗ trợ tải lên hình ảnh định dạng JPEG, PNG, WEBP' : 'Supports images (JPEG, PNG, WEBP)'}
              </span>
            </div>
          )}

          {/* Gradients to hold header controls and title safely */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/85 pointer-events-none"></div>

          {/* Top Header Floating Buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center gap-1.5 px-3 text-white hover:bg-black/80 transition-all cursor-pointer"
              aria-label={lang === 'vi' ? 'Quay lại' : 'Back'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[10px] font-bold">{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
            
            <div className="flex gap-2">
              {isCreator && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenEditor) {
                      onOpenEditor(place.id);
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-amber-400 hover:text-amber-300 hover:scale-105 transition-all cursor-pointer ring-1 ring-amber-500/30"
                  title={lang === 'vi' ? 'Chỉnh sửa thông tin địa điểm này' : 'Edit details of this place'}
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
                className={`w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 ${
                  isFavorited ? 'text-red-500 scale-110' : 'text-white hover:text-red-400'
                }`}
                title="Favorite Place"
              >
                <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyAddress();
                }}
                className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:text-emerald-400 hover:scale-105 transition-all cursor-pointer"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Place Title Banner Overlay */}
          <div className="absolute bottom-4 left-5 right-5 z-20 flex gap-3 items-end">
            <span className="text-3xl filter drop-shadow" role="img" aria-label="place emoji">
              {place.emoji || '📍'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-serif tracking-[0.2em] text-[#d16b4c] font-bold block filter drop-shadow">
                {place.sub}
              </span>
              <h2 id="place-detail-title" className="text-lg font-bold font-serif text-white leading-tight truncate filter drop-shadow">
                {place.name}
              </h2>
            </div>
          </div>
        </div>

        {/* --- DETAIL BODY TABS NAVIGATION --- */}
        <div className="flex border-b border-zinc-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0 shrink-0">
          {(['about', 'info', 'secret'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const tabName = {
              about: { vi: 'Mô tả', ja: '紹介', en: 'About', zh: '关于' }[lang] || 'About',
              info: { vi: 'Thông tin', ja: '詳細情報', en: 'Details', zh: '详情' }[lang] || 'Details',
              secret: { vi: 'Mẹo hay Sài Gòn', ja: '現地マル秘メモ', en: 'Local Tip', zh: '行家妙招' }[lang] || 'Local Tip'
            }[tab];
            const icon = {
              about: <Compass className="w-3.5 h-3.5" />,
              info: <Info className="w-3.5 h-3.5" />,
              secret: <Sparkles className="w-3.5 h-3.5" />
            }[tab];

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[11px] font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 border-b-[2.5px] cursor-pointer ${
                  isActive
                    ? 'text-[#0b433f] border-[#0b433f] bg-[#0b433f]/5'
                    : 'text-zinc-500 border-transparent hover:text-[#0b433f]'
                }`}
              >
                {icon}
                <span>{tabName}</span>
              </button>
            );
          })}
        </div>

        {/* --- MAIN SCROLLABLE CONTENT --- */}
        {/* lg:max-w-[680px]: the dialog is 920px because that is the measure
            every page uses, but prose wants a narrower one. At the full width a
            description ran about 110 characters to the line, against the 45-75
            that is worth aiming for. The frame keeps its width; the reading
            inside it does not have to. */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-7 space-y-5">
          
          {/* TAB 1: ABOUT DESCRIPTION */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Creator Studio Quick-Edit Alert Banner */}
              {isCreator && (
                <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl gap-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <div className="text-[10px] leading-tight">
                      <span className="font-bold block text-amber-900">Creator Studio</span>
                      <span className="text-zinc-600 font-light">Chỉnh sửa nội dung & ảnh tại đây</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenEditor) onOpenEditor(place.id);
                    }}
                    className="bg-[#b85233] hover:bg-[#a14327] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {lang === 'vi' ? 'Sửa Ngay' : 'Edit Now'}
                  </button>
                </div>
              )}

              {/* The words and the clip side by side above lg. Stacked, the
                  clip's 578px sat beneath a rating and a description in a
                  content area 514px tall, so two thirds of it was behind the
                  footer. Beside them it starts at the top and has the height
                  to itself. Below lg this wrapper does nothing. */}
              <div className="lg:flex lg:items-start lg:gap-6">
                <div className="space-y-3 lg:flex-1 lg:min-w-0">
                <div className="flex items-center gap-1 text-[#b85233]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-bold ml-1.5 text-zinc-600 font-mono">5.0 (Lục Lam Pick)</span>
                </div>
                
                <div className="p-1">
                  <p className="text-xs leading-relaxed text-zinc-700 font-light whitespace-pre-line">
                    {place.desc}
                  </p>
                </div>
                </div>

              {/* Dynamic Video Showcase Block */}
              {resolvedVideo && (
                <div className="mt-4 space-y-2 lg:hidden">
                  <div className="flex items-center gap-2 text-zinc-800 border-b border-zinc-100 pb-2">
                    <div className="w-6 h-6 bg-amber-500/10 rounded-md flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-amber-600 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                      {lang === 'vi' ? 'Video Trải Nghiệm Thực Tế' : lang === 'ja' ? '現地動画レビュー' : 'Live Experience Video'}
                    </span>
                  </div>
                  
                  {embedDetails.type === 'tiktok' ? (
                    /* Height, not an aspect ratio, and generous rather than
                       measured.

                       A TikTok embed is more than its video: below the clip come
                       the handle, the caption with its hashtags, the track name
                       and a call-to-action bar. Sizing the frame 9/16 fitted the
                       clip alone, so TikTok's own layout overflowed inside the
                       iframe and scrolled there — the scrollbar, the clipped
                       caption, the button sitting over the text.

                       Two boxes, and they are deliberately different sizes. The
                       outer one is the clip's own 9/16 and crops; the iframe
                       inside is given far more room than that.

                       A TikTok embed is the clip plus a caption, hashtags, a
                       track credit and a call-to-action bar, and it publishes no
                       height for the whole assembly. Matching the iframe to the
                       outer box made TikTok's layout overflow and scroll inside
                       itself; making the outer box tall enough for the assembly
                       left a blank slab under short captions, because caption
                       length decides the total and captions vary. Neither can be
                       fixed by a better number — the number is not knowable from
                       out here.

                       So the iframe gets 1000px, which is more than the assembly
                       ever needs, and therefore never scrolls; and the crop
                       shows the clip alone, which is what was wanted from this
                       and is always exactly 9/16. The chrome is still rendered,
                       just outside the visible box.

                       What the crop hides, the line below restores in our own
                       markup: the handle, linking to the original. That is
                       better than TikTok's own credit for this site, because
                       text we render is in the HTML a crawler reads, while
                       everything inside the iframe is invisible to it.

                       lazy because this is a third-party player: it stays
                       unfetched until scrolled into view, and the modal only
                       mounts on a click, so no page load carries it. */
                    <div className="w-full max-w-[325px] mx-auto space-y-1.5">
                      <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 bg-black">
                        <iframe
                          key={embedDetails.embedUrl}
                          src={embedDetails.embedUrl}
                          className="absolute inset-x-0 top-0 w-full border-0"
                          style={{ height: tiktokHeight ?? 1000 }}
                          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                          allowFullScreen
                          loading="lazy"
                          scrolling="no"
                          title="TikTok Video Embed"
                        />
                      </div>
                      {embedDetails.sourceUrl && (
                        <a
                          href={embedDetails.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-[9px] text-zinc-500 hover:text-zinc-800 transition-colors truncate"
                        >
                          {embedDetails.handle
                            ? `${embedDetails.handle} — ${lang === 'vi' ? 'xem trên TikTok' : lang === 'ja' ? 'TikTok で見る' : 'watch on TikTok'}`
                            : lang === 'vi'
                              ? 'Xem video gốc trên TikTok'
                              : lang === 'ja'
                                ? 'TikTok で元動画を見る'
                                : 'Watch the original on TikTok'}
                        </a>
                      )}
                    </div>
                  ) : embedDetails.type === 'youtube' ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 bg-black">
                      <iframe
                        key={embedDetails.embedUrl}
                        src={embedDetails.embedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="YouTube Video Embed"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 bg-black">
                      <video
                        key={resolvedVideo}
                        src={resolvedVideo}
                        controls
                        loop
                        autoPlay
                        muted
                        playsInline
                        className="w-full max-h-[400px] object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
              </div>

              {/* Open on arrival, by request — an author who has switched creator
                  mode on is usually here to change something, so the field is
                  ready rather than one click away. Still a <details>, so it can
                  be folded shut when it is in the way of reading.

                  defaultOpen rather than a bare `open` prop. `open` is a prop
                  React reconciles: it holds the value at true, so the moment
                  anything re-rendered this modal — typing in the field is enough,
                  since it drives importUrl state — a panel the author had just
                  folded shut would spring open again. Setting the attribute once
                  on mount and never touching it after leaves the element
                  uncontrolled, which is what a disclosure wants to be. */}
              {isCreator && (
                <details
                  ref={(node) => {
                    if (node && !node.dataset.defaulted) {
                      node.dataset.defaulted = 'yes';
                      node.open = true;
                    }
                  }}
                  className="group/embed mt-4 rounded-xl border border-amber-200 bg-amber-50"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-amber-900 marker:hidden">
                    <span className="flex-1">{lang === 'vi' ? 'Nhúng video' : 'Embed video'}</span>
                    <span aria-hidden="true" className="text-amber-700 transition-transform group-open/embed:rotate-90">▸</span>
                  </summary>

                  <div className="space-y-2 px-3 pb-3">
                    {/* Says what it takes before you can guess wrong, which is
                        the whole reason a field named after one platform was a
                        problem rather than a shorthand. */}
                    <p className="text-[10px] leading-relaxed text-amber-900/80">
                      {lang === 'vi'
                        ? 'Dán link TikTok, YouTube (kể cả Shorts), hoặc link video trực tiếp (.mp4, .webm, .mov).'
                        : 'Paste a TikTok, YouTube (Shorts included), or direct video link (.mp4, .webm, .mov).'}
                    </p>
                    <div className="flex gap-2">
                      <input
                        id="place-embed-url"
                        type="url"
                        value={importUrl}
                        onChange={(event) => {
                          setImportUrl(event.target.value);
                          if (importError) setImportError('');
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            handleEmbedImport();
                          }
                        }}
                        placeholder="https://…"
                        aria-invalid={Boolean(importError)}
                        aria-describedby={importError ? 'place-embed-error' : undefined}
                        className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[10px] text-zinc-800 outline-none focus:border-amber-500"
                      />
                      <button type="button" onClick={handleEmbedImport} className="rounded-lg bg-amber-700 px-3 py-2 text-[10px] font-bold text-white hover:bg-amber-800">
                        Import
                      </button>
                    </div>

                    {/* Undo, where the thing was done. Removing a video meant
                        leaving the place you were looking at, opening Creator
                        Studio, finding the same place in a list and clicking a
                        red link — and that link drops the place's image with the
                        video, because it deletes the whole entry rather than one
                        field.

                        Writing '' to the override is the surgical version: the
                        merge at handleOpenDetail reads `custom.video ||
                        fallback.video`, so an empty override is not "no video",
                        it is "whatever this place had before I touched it". When
                        that was nothing, nothing is what comes back. The image
                        override is untouched either way. */}
                    {customVideo && onUpdateMedia && (
                      <button
                        type="button"
                        onClick={() => { onUpdateMedia(place.id, 'video', ''); setImportUrl(''); setImportError(''); }}
                        className="text-[10px] font-medium text-red-700 hover:underline"
                      >
                        {lang === 'vi' ? 'Gỡ video đã nhúng' : 'Remove embedded video'}
                      </button>
                    )}

                    {/* What it read out of the link, before anything is saved.
                        Being told only "invalid" leaves you guessing; being told
                        "YouTube" tells you it landed. */}
                    {detected.ok && (
                      <p className="text-[10px] font-medium text-emerald-800">
                        {detected.kind === 'tiktok'
                          ? `TikTok${detected.handle ? ` · ${detected.handle}` : ''}`
                          : detected.kind === 'youtube'
                            ? 'YouTube'
                            : lang === 'vi' ? 'Video trực tiếp' : 'Direct video'}
                      </p>
                    )}
                    {importError && <p id="place-embed-error" role="alert" className="text-[10px] text-red-700">{importError}</p>}
                  </div>
                </details>
              )}

              {/* Elegant decorative line */}
              <div className="flex items-center justify-center gap-2 text-zinc-300 py-2">
                <span className="h-px bg-zinc-200 flex-1"></span>
                <span className="text-[10px] font-serif italic text-zinc-400">Pearl of the Orient</span>
                <span className="h-px bg-zinc-200 flex-1"></span>
              </div>
            </div>
          )}

          {/* TAB 2: PRACTICAL INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm divide-y divide-zinc-100">
                
                {/* Address Row */}
                <div className="pb-3 flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-[#b85233]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#b85233]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-zinc-400 font-bold block tracking-wide uppercase">
                      {lang === 'vi' ? 'Địa chỉ' : lang === 'ja' ? '住所' : lang === 'zh' ? '地址' : 'Address'}
                    </span>
                    <p className="text-xs text-zinc-700 font-medium leading-relaxed break-words">{place.addr}</p>
                    {/* A second "copy address" stood here, calling the same
                        handler and carrying the same label as the button in the
                        footer — both on screen at once, one of them below the
                        fold. The footer keeps it, because that bar is present on
                        every tab. */}
                  </div>
                </div>

                {/* Opening Hours Row */}
                <div className="py-3 flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-[#0b433f]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#0b433f]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] text-zinc-400 font-bold block tracking-wide uppercase">
                      {lang === 'vi' ? 'Giờ mở cửa' : lang === 'ja' ? '営業時間' : lang === 'zh' ? '营业时间' : 'Opening Hours'}
                    </span>
                    <p className="text-xs text-zinc-700 font-medium">{place.hours}</p>
                  </div>
                </div>

                {/* Price Range Row */}
                <div className="pt-3 flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] text-zinc-400 font-bold block tracking-wide uppercase">
                      {lang === 'vi' ? 'Khoảng giá' : lang === 'ja' ? '価格帯' : lang === 'zh' ? '价格范围' : 'Price Range'}
                    </span>
                    <p className="text-xs text-zinc-700 font-medium">{place.price || { vi: 'Miễn phí / Tự do', ja: '無料 / 自由拝観', zh: '免费 / 自由', en: 'Free Admission' }[lang] || 'Free'}</p>
                  </div>
                </div>

              </div>

              {/* The "Get Directions" card stood here. It opened the same URL
                  as the Open in Maps button in the footer, which is on screen on
                  every tab and never scrolls away — so this was a second, larger
                  copy of a control the reader could already see. */}
            </div>
          )}

          {/* TAB 3: LOCAL SECRET TIPS */}
          {activeTab === 'secret' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 shadow-sm relative overflow-hidden">
                <span className="absolute top-4 right-4 text-3xl opacity-15 rotate-12">💡</span>
                
                <h4 className="text-xs font-bold font-serif text-amber-900 flex items-center gap-1.5 mb-2.5">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                  <span>{lang === 'vi' ? 'Bí Quyết Trải Nghiệm' : lang === 'ja' ? 'ローカル極秘メモ' : 'The Saigon Secret'}</span>
                </h4>

                <p className="text-xs text-amber-950 font-light leading-relaxed whitespace-pre-line">
                  {getSecretTip()}
                </p>
              </div>

              {/* Instructions for whoever maintains the guide, not for its
                  readers — it points at a panel a visitor has no way to open.
                  The comment above this block used to call it a safety notice
                  for travellers, which is how it ended up shown to everyone.
                  Every other editing affordance in this file is already behind
                  isCreator; this one had been missed. */}
              {isCreator && (
                <div className="bg-zinc-100 rounded-2xl p-4 flex gap-3 text-[10px] text-zinc-600 leading-relaxed items-start">
                  <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <p>
                    {lang === 'vi'
                      ? 'Bạn có thể chỉnh sửa mô tả địa điểm này, hình ảnh và video hiển thị trực tiếp từ bảng Creator Studio ở góc màn hình!'
                      : lang === 'ja'
                      ? 'この場所の紹介文、写真、動画は、画面の隅にある「Creator Studio」から直接編集できます。'
                      : 'You can modify this description, photo, and playing video directly from the Creator Studio panel on the desktop layout!'}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* --- FOOTER CTA ACTION BAR --- */}
        <div className="p-4 border-t border-zinc-200/60 bg-white grid grid-cols-3 gap-2 sticky bottom-0 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Đóng' : 'Close'}</span>
          </button>
          <button 
            onClick={handleCopyAddress}
            className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-[#0b433f] text-xs font-bold py-3.5 rounded-xl border border-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (lang === 'vi' ? 'Đã sao chép!' : 'Copied!') : (lang === 'vi' ? 'Sao chép địa chỉ' : 'Copy Address')}</span>
          </button>
          
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.addr)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-[#b85233] hover:bg-[#a14327] text-white text-xs font-bold py-3.5 rounded-xl text-center shadow-md shadow-[#b85233]/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>{lang === 'vi' ? 'Dẫn đường Maps' : lang === 'ja' ? 'マップで開く' : 'Open in Maps'}</span>
          </a>
        </div>

        </div>
      </div>
    </div>
  );
}
