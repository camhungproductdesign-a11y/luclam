import React, { useState, useRef } from 'react';
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
  onOpenEditor?: (placeId: string) => void;
  isCreator?: boolean;
}

const getEmbedDetails = (url: string | undefined) => {
  if (!url) return { type: 'none' as const, embedUrl: '' };

  // TikTok Video Match
  const tiktokMatch = url.match(/tiktok\.com\/.*\/video\/(\d+)/i);
  if (tiktokMatch && tiktokMatch[1]) {
    return { type: 'tiktok' as const, embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` };
  }

  // YouTube match
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube' as const, embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}` };
  }

  // General fallback if it contains tiktok.com but different format
  if (url.includes('tiktok.com')) {
    const parts = url.split('/video/');
    if (parts.length > 1) {
      const id = parts[1].split('?')[0];
      if (/^\d+$/.test(id)) {
        return { type: 'tiktok' as const, embedUrl: `https://www.tiktok.com/embed/v2/${id}` };
      }
    }
  }

  return { type: 'direct' as const, embedUrl: url };
};

export function PlaceDetailModal({ 
  place, 
  media, 
  isOpen, 
  onClose, 
  lang,
  onUpdateMedia,
  onOpenEditor,
  isCreator = false
}: PlaceDetailModalProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'info' | 'secret'>('about');
  const [copied, setCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [tiktokError, setTiktokError] = useState('');

  const resolvedImg = useMediaUrl(media.img);
  const resolvedVideo = useMediaUrl(media.video);
  const embedDetails = getEmbedDetails(resolvedVideo);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    setTiktokUrl('');
    setTiktokError('');
  }, [place.id]);

  if (!isOpen) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(place.addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTikTokImport = () => {
    const trimmedUrl = tiktokUrl.trim();
    const match = trimmedUrl.match(/^https?:\/\/(?:www\.)?tiktok\.com\/.+\/video\/(\d+)(?:[/?#].*)?$/i);
    if (!match) {
      setTiktokError(lang === 'vi'
        ? 'Link không hợp lệ. Hãy dùng URL TikTok có dạng /video/{id}.'
        : 'Invalid link. Use a TikTok URL containing /video/{id}.');
      return;
    }
    onUpdateMedia?.(place.id, 'video', trimmedUrl);
    setTiktokError('');
  };

  // Curate mock secret tips based on the place type
  const getSecretTip = () => {
    const isFood = place.id.startsWith('food');
    const isShopping = place.id.startsWith('shopping');
    
    if (isFood) {
      if (place.id.includes('food-0')) {
        return {
          ja: 'プロのヒント: スープを飲む前に、まずはそのままの味を一口。その後、ライムを絞り、生ハーブとチリを少し加えて、自分好みの完璧な風味に整えるのが地元流。揚げパン（Quẩy）を浸して食べるのもお忘れなく！',
          vi: 'Mẹo địa phương: Trước khi thêm gia vị, hãy nếm thử một ngụm nước dùng nguyên bản. Sau đó vắt thêm chanh, thêm vài cọng rau húng và vài lát ớt tươi. Đừng quên gọi thêm đĩa quẩy nóng giòn để nhúng nước dùng nhé!',
          en: 'Local Pro-Tip: Taste the broth pure first. Then squeeze some fresh lime, add wild herbs, and a few chili slices. Always order a plate of savory Chinese donuts (Quẩy) to dip into the rich broth!',
          zh: '行家建议：喝汤前先尝一口原汤。然后挤点柠檬汁，加几叶新鲜罗勒和辣椒片。别忘了点一份热油条（Quẩy）泡汤吃，绝配！',
          zht: '行家建議：喝湯前先嚐一口原湯。然後擠點檸檬汁，加幾葉新鮮羅勒和辣椒片。別忘了點一份熱油條（Quẩy）泡湯吃，絕配！',
          ko: '현지인 꿀팁: 국물은 먼저 아무것도 넣지 말고 한 모금 그대로 맛보세요. 그다음 라임을 짜 넣고 허브잎과 고추 몇 조각을 더해 보세요. 국물에 찍어 먹는 튀김빵(Quẩy)도 꼭 같이 주문해 보세요!'
        }[lang] || place.desc;
      }
      if (place.id.includes('food-3')) { // Cafe
        return {
          ja: 'プロのヒント: 伝統的な「フィン（Phin）」フィルターから、コンデンスミルクの入ったグラスにコーヒーがゆっくりと滴り落ちるのを眺める時間こそが、サイゴン最大の贅沢。氷の入ったグラスに移してよくかき混ぜてからお召し上がりください。',
          vi: 'Mẹo địa phương: Hãy kiên nhẫn đợi từng giọt cà phê phin đậm đặc nhỏ giọt xuống ly sữa đặc. Trút toàn bộ hỗn hợp vào ly đá đầy, khuấy thật đều tay cho đến khi bọt nâu mịn nổi lên rồi thưởng thức.',
          en: 'Local Pro-Tip: The slow, patient drip of the coffee through the traditional Phin filter over sweet condensed milk is a Saigon ritual. Pour it over ice, stir vigorously until frothy, and sip slowly.',
          zh: '行家建议：耐心等待咖啡通过传统Phin滴滤器慢慢滴入炼乳中。然后倒入满是冰块的杯中，用力搅拌均匀，直到冒出细密泡沫再享用。',
          zht: '行家建議：耐心等待咖啡透過傳統滴滴壺（Phin）慢慢滴入煉乳中。然後倒入滿是冰塊的杯中，用力攪拌均勻，直到冒出細密泡沫再享用。',
          ko: '현지인 꿀팁: 전통 핀(Phin) 필터에서 커피가 연유 위로 한 방울씩 천천히 떨어지길 기다리는 시간, 그 여유가 사이공의 방식입니다. 얼음을 가득 채운 잔에 부은 뒤 고운 거품이 올라올 때까지 힘차게 저어 천천히 음미해 보세요.'
        }[lang] || place.desc;
      }
      return {
        ja: 'プロのヒント: 夕方5時〜7時頃は大変混雑しますが、これこそがサイゴンの最も賑やかでエネルギッシュなストリートフードの雰囲気を味わえる最高の時間帯です。気兼ねなく地元のプラスチック椅子に座りましょう！',
        vi: 'Mẹo địa phương: Tầm 5h-7h tối là giờ cao điểm nhất, nhưng lại là lúc cảm nhận rõ rệt nhất không khí ẩm thực đường phố nhộn nhịp của Sài Gòn. Hãy thoải mái kéo một chiếc ghế nhựa và hòa mình vào đám đông!',
        en: 'Local Pro-Tip: 5 PM to 7 PM is peak rush hour, but it is the best time to experience Saigon’s energetic, sizzling street food culture. Sit down comfortably on a tiny plastic stool and enjoy!',
        zh: '行家建议：傍晚5点到7点是高峰期，但也是体验西贡最具活力、最热闹的街头美食文化的最佳时机。大大方方地拉张塑料矮凳，融入人群中吧！',
        zht: '行家建議：傍晚5點到7點是尖峰時段，但也是體驗西貢最具活力、最熱鬧的街頭美食文化的最佳時機。大大方方地拉張塑膠矮凳，融入人群中吧！',
        ko: '현지인 꿀팁: 저녁 5시에서 7시는 가장 붐비는 시간이지만, 사이공의 활기찬 길거리 음식 문화를 가장 생생하게 느낄 수 있는 때이기도 합니다. 플라스틱 간이 의자 하나 끌어다 편하게 앉아 즐겨 보세요!'
      }[lang] || place.desc;
    }

    if (isShopping) {
      return {
        ja: 'プロのヒント: 市場でお買い物をする際は、笑顔を絶やさずに優しく交渉するのがコツ。提示価格の40%〜50%から交渉を始め、お互いが納得できる楽しい取引を心がけましょう！朝一番の買い物は、幸運をもたらす「開運の客（Mở hàng）」として歓迎されやすいです。',
        vi: 'Mẹo địa phương: Khi mua sắm tại chợ truyền thống, hãy luôn mỉm cười và trả giá một cách vui vẻ. Nên bắt đầu từ khoảng 40%-50% giá người bán đưa ra. Nếu mua vào sáng sớm, bạn sẽ là khách mở hàng đầy may mắn!',
        en: 'Local Pro-Tip: When shopping at local markets, always wear a warm smile and negotiate politely. Start bargaining around 40-50% off the initial quoted price. Buying first thing in the morning makes you the lucky "Mở hàng" opener!',
        zh: '行家建议：传统市场购物时，保持微笑并礼貌还价。可以先从开价的四至五折开始。清晨第一个购买，你会成为让老板非常开心的“开张幸客”（Mở hàng）！',
        zht: '行家建議：傳統市場購物時，保持微笑並禮貌還價。可以先從開價的四至五折開始。清晨第一個購買，你會成為讓老闆非常開心的「開張幸客」（Mở hàng）！',
        ko: '현지인 꿀팁: 재래시장에서는 늘 웃는 얼굴로 정중하게 흥정하세요. 처음 부른 값의 40~50% 선에서 시작하면 적당합니다. 아침 첫 손님이 되면 상인들이 행운을 부르는 ‘머항(Mở hàng)’ 손님이라며 유난히 반겨 줍니다!'
      }[lang] || place.desc;
    }

    // Default for Culture / Check-in
    return {
      ja: 'プロのヒント: 美しい写真を撮るなら、午前8時前、または午後4時以降の柔らかな「ゴールデンアワー」の光が最適です。また、寺院や歴史的建造物を訪れる際は、肩や膝を隠したマナーある服装でお越しください。',
      vi: 'Mẹo địa phương: Để có những bức ảnh check-in nghệ thuật nhất, hãy ghé thăm trước 8h sáng hoặc sau 4h chiều để đón ánh sáng dịu. Hãy ăn mặc lịch sự che kín vai và đầu gối khi tham quan các ngôi đền, chùa cổ kính.',
      en: 'Local Pro-Tip: For the absolute best photo captures, visit before 8 AM or after 4 PM to secure soft golden hour lighting. Please ensure shoulders and knees are covered when visiting ancient, sacred temples.',
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
    <div
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end"
      onClick={onClose}
    >
      
      {/* Scrollable Container styled as a premium mobile slide-up sheet */}
      <div
        className="w-full h-[90%] bg-[#f6f3eb] rounded-t-[32px] overflow-hidden shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        
        {/* Top visual bar for dragging effect */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full z-40"></div>

        {/* --- HERO MEDIA HEADER --- */}
        <div 
          onClick={isCreator ? handleHeroClick : undefined}
          className={`w-full h-[230px] bg-zinc-950 relative overflow-hidden shrink-0 ${isCreator ? 'group/hero cursor-pointer' : ''}`}
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
          {resolvedImg ? (
            <img
              src={resolvedImg}
              alt={place.name}
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-500 ${isCreator ? 'group-hover/hero:scale-105' : ''}`}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500">
              <Compass className="w-12 h-12 text-[#b85233]/40 animate-pulse mb-2" />
              <span className="text-xs font-serif italic">Capturing Saigon Vibes...</span>
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
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

              {/* Dynamic Video Showcase Block */}
              {resolvedVideo && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-800 border-b border-zinc-100 pb-2">
                    <div className="w-6 h-6 bg-amber-500/10 rounded-md flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 text-amber-600 fill-current" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                      {lang === 'vi' ? 'Video Trải Nghiệm Thực Tế' : lang === 'ja' ? '現地動画レビュー' : 'Live Experience Video'}
                    </span>
                  </div>
                  
                  {embedDetails.type === 'tiktok' ? (
                    <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 bg-black">
                      <iframe
                        src={embedDetails.embedUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        title="TikTok Video Embed"
                      />
                    </div>
                  ) : embedDetails.type === 'youtube' ? (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 bg-black">
                      <iframe
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

              {isCreator && (
                <div className="mt-4 space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <label htmlFor="place-tiktok-url" className="block text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    {lang === 'vi' ? 'Import / Thay video TikTok' : 'Import / Replace TikTok video'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="place-tiktok-url"
                      type="url"
                      value={tiktokUrl}
                      onChange={(event) => {
                        setTiktokUrl(event.target.value);
                        if (tiktokError) setTiktokError('');
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleTikTokImport();
                        }
                      }}
                      placeholder="https://www.tiktok.com/@creator/video/1234567890"
                      aria-invalid={Boolean(tiktokError)}
                      aria-describedby={tiktokError ? 'place-tiktok-error' : undefined}
                      className="min-w-0 flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[10px] text-zinc-800 outline-none focus:border-amber-500"
                    />
                    <button type="button" onClick={handleTikTokImport} className="rounded-lg bg-amber-700 px-3 py-2 text-[10px] font-bold text-white hover:bg-amber-800">
                      Import
                    </button>
                  </div>
                  {tiktokError && <p id="place-tiktok-error" role="alert" className="text-[10px] text-red-700">{tiktokError}</p>}
                </div>
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
                    <button 
                      onClick={handleCopyAddress}
                      className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-[#0b433f] font-semibold hover:underline cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-500" />
                          <span className="text-emerald-600">{lang === 'vi' ? 'Đã sao chép!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>{lang === 'vi' ? 'Sao chép địa chỉ' : 'Copy address'}</span>
                        </>
                      )}
                    </button>
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

              {/* Map Call-to-Action Card */}
              <div className="bg-gradient-to-tr from-[#0b433f] to-[#125e59] text-white rounded-2xl p-4 flex justify-between items-center shadow-md">
                <div className="space-y-1 pr-3">
                  <h4 className="text-xs font-bold font-serif">{lang === 'vi' ? 'Tìm đường đi' : lang === 'ja' ? 'ナビゲーション' : 'Get Directions'}</h4>
                  <p className="text-[10px] text-zinc-200 leading-normal font-light">
                    {lang === 'vi' ? 'Mở Google Maps và dẫn đường trực tiếp' : lang === 'ja' ? 'Googleマップでルート案内を開く' : 'Launch navigation with Google Maps'}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.addr)}`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="bg-white text-[#0b433f] rounded-full p-2.5 shadow hover:scale-105 active:scale-95 transition-transform"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
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

              {/* Safety notice for travelers */}
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
  );
}
