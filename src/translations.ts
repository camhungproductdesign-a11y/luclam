export type Language = 'ja' | 'vi' | 'zh' | 'zht' | 'en' | 'ko';

export const translations = {
  ja: {
    title: 'サイゴン・ポケットガイド',
    subtitle: 'サイゴン散策＆限定おもてなしガイド',
    faq: [
      { q: 'ルクラムはホーチミン市のどこにありますか？', a: 'ルクラムは{{address}}にあります。' },
      { q: 'ルクラムの営業時間は？', a: '年中無休、{{hours}}です。' },
      { q: 'サイゴンでの移動はどうすれば安全ですか？', a: '配車アプリ（{{apps}}）なら料金が事前に表示されます。流しのタクシーなら{{taxis}}が安心で、メーターが動いているか確認してください。' },
      { q: 'サイゴンでの移動費用はどれくらいですか？', a: 'バイクの短距離で約{{fareBike}}、車なら{{fareCar}}ほどです。天候や時間帯で変わります。' },
      { q: 'ベンタイン市場はどこにありますか？', a: 'ホーチミン市1区ベンタイン坊にあります。' },
      { q: 'ルクラムではどんなお茶を扱っていますか？', a: '{{teas}}。価格は{{priceFrom}}からです。' },
      { q: 'このガイドは何語で読めますか？', a: '{{languages}}。' },
      { q: 'バイクの多い道路はどう渡ればいいですか？', a: 'ゆっくり一定の速度で歩き、立ち止まったり走ったりしないでください。運転者は歩行者の進路を見て、後ろを回って避けてくれます。' },
      { q: 'ルクラムの店舗はどこにありますか？', a: '{{storeCount}}店舗あります：{{stores}}。お問い合わせは{{phone}}または{{email}}へ。' },
    ],
    contact: {
      heading: 'ルクラムへのお問い合わせ',
      stores: '店舗一覧',
      phone: '電話',
      email: 'メール',
      office: '本社',
      licence: '事業登録番号',
    },
    faqHeading: 'よくある質問',
    brand: 'LỤC LAM',
    author: 'ルックラム (Lục Lam)',
    pages: {
      cover: 'カバー',
      welcome: 'はじめに',
      atmosphere: '街の雰囲気',
      transport: '安全な移動',
      stay: '泊まる＆整える',
      food: '名物グルメ',
                culture: '文化 ＆ チェックイン',
shopping: 'お買い物',
      luclam: 'Lục Lam体験',
      info: '便利情報'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: 'サイゴン散策＆限定おもてなしガイド',
      badge: 'EAT LIKE A LOCAL • SAIGON VIBES',
      scanMe: 'SCAN ME'
    },
    welcome: {
      heading: '活気に満ちた街、\n深い歴史、\nそして心あたたまる人々。',
      p1: 'サイゴン（ホーチミン市）は、ベトナムの経済と文化の中心地。フランス植民地時代の建築、美味しいローカルフード、そして絶え間ないエネルギーが融合する、魅力あふれる都市です。',
      p2: 'このガイドでは、初めての方にもリピーターにも役立つ情報を、コンパクトにまとめました。さあ、サイゴンの街を歩き、食べて、感じて、あなただけの旅を始めましょう。',
      highlight: 'サイゴンが、あなたを待っています。',
      videoTitle: '\\\\ 旅の動画 //',
      videoDesc: 'サイゴンの魅力を動画でチェック！街の雰囲気やおすすめスポットを紹介しています。',
      coffeeTitle: '塩コーヒー & ココナッツコーヒー',
      features: [
        { title: 'フレンドリーな人々', desc: 'サイゴンの人々は明るく親切。道を尋ねても、笑顔で助けてくれます。' },
        { title: '美食の街', desc: 'フォーやバインミー、コーヒーまで。食の楽しみは尽きません。' },
        { title: '歴史と文化', desc: 'コロニアル建築や戦争の歴史、寺院や市場など、見どころがたくさん。' },
        { title: '便利な移動', desc: 'バイクタクシーや配車アプリ、公共交通機関で、スムーズに移動できます。' }
      ],
      advice: [
        '日差しが強いので、帽子や日焼け止めをお忘れなく。',
        '水分補給をこまめにして、快適な旅をお楽しみください。'
      ]
    },
    atmosphere: {
      description: 'サイゴンはコントラストに満ちた街。歴史が息づくフランス統治時代の建築、活気あふれるローカルの暮らし、そして多文化が交差する独特の空気感。3つのエリアを巡って、サイゴンの多彩な表情を感じてみてください。',
      offlineMapTitle: 'オフラインでも使えるおすすめマップ',
      tipsTitle: '旅のヒント',
      tipsDesc: '朝はカフェ巡り、昼は散策、夜は屋台やルーフトップで乾杯！時間帯によって変わる街の表情を楽しもう。',
      districts: [
        {
          id: 'd1',
          name: '第1区 (District 1) - 歴史と華やかさの中心',
          description: 'サイゴンの心臓部。フランス植民地時代の美しい建物（大聖堂、中央郵便局、市民劇場）が並び、高級ブティック、シックなカフェ、そして活気あふれるベンタイン市場が共存するエリアです。散策の起点に最適。',
          highlights: ['ドンコイ通り散策', '大聖堂と中央郵便局', 'ベンタイン市場で食べ歩き']
        },
        {
          id: 'd5',
          name: '第5区 (District 5) - 中華街（チョロン）の活気',
          description: '伝統的な中国文化が色濃く残る、活気あふれるエリア。古い寺院（温陵会館、天后宮）、中国語の看板、漢方薬の香り、そして美味しい中華風ベトナムグルメが魅力です。路地裏のディープな魅力を体感できます。',
          highlights: ['天后宮（ティエンハウ寺）', '漢方薬通り (Hai Thuong Lan Ong)', 'ビンタイ市場の活気']
        },
        {
          id: 'd3',
          name: '第3区 (District 3) - 緑あふれるレトロな街並み',
          description: '第1区に隣接しながらも、静かで並木道が美しいエリア。古いフランス風の洋館がカフェやレストランにリノベーションされており、落ち着いたおしゃれな雰囲気が漂います。現地の若者にも大人気。',
          highlights: ['戦争証跡博物館', 'ロマンチックな古い洋館カフェ', 'タンディン教会（ピンクの教会）']
        }
      ],
      mapLabels: {
        title: 'サイゴン歴史・散策簡易マップ',
        sub: 'タップすると各エリアの詳細が表示されます',
        airport: 'タンソンニャット国際空港',
        d3: '第3区 (レトロ洋館)',
        d1: '第1区 (中心街・歴史)',
        d5: '第5区 (中華街)',
        river: 'サイゴン川'
      },
      transportTip: 'GrabやXanh SMなどのアプリを使うと安全です。'
    },
    transport: {
      heading: '安全な移動ガイド',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: 'サイゴン名物の「バイクの波」に圧倒されるかもしれませんが、賢くアプリを活用すれば、初心者でも安全かつ快適に移動できます。',
      categories: [
        {
          id: 'apps',
          title: '配車アプリ（超おすすめ）',
          description: '料金が事前に確定し、目的地を地図で指定できるため、言葉が通じなくても絶対にぼったくられません。',
          options: [
            { name: 'Grab', desc: '東南アジア最大の定番アプリ。車（GrabCar）もバイク（GrabBike）も瞬時に呼べます。決済用のクレジットカードを日本で登録しておくのがベスト。' },
            { name: 'Xanh SM', desc: 'ベトナム発の100%電気自動車（EV）配車アプリ。車内がとても清潔で静か。ドライバーの教育も行き届いており、非常に快適。' }
          ]
        },
        {
          id: 'taxis',
          title: '信頼できる大手タクシー',
          description: '流しのタクシーを利用する場合は、必ず以下の大手2社を選び、メーターが動いていることを確認してください。',
          options: [
            { name: 'Vinasun Taxi', desc: '白い車体に赤と緑のライン。サイゴンで最も古く信頼できるタクシー。ドライバーは制服を着用しています。' },
            { name: 'Mai Linh Taxi', desc: '緑一色の車体が目印。ベトナム全国で展開する大手。メーターの不正がほぼありません。' }
          ]
        },
        {
          id: 'crossing',
          title: '道路の渡り方（鉄則）',
          description: '無数のバイクが走る道路を渡るのはスリリングですが、以下のルールを守れば安全に渡れます。',
          options: [
            { name: 'ゆっくり一定の速度で歩く', desc: '急に走ったり立ち止まったりしてはいけません。バイクの運転手はあなたの動きを予測して、背後をすり抜けていきます。' },
            { name: '目を合わせてアピール', desc: '近づいてくるバイクの運転手と視線を合わせ、ゆっくりと手を少し下に向けて進む意思を示すとスムーズです。' }
          ]
        }
      ],
      safetyTips: [
        'スマホ歩きは厳禁：ひったくりのターゲットになりやすいので、地図を見るときは道路から離れた店の中などで立ち止まって確認しましょう。',
        'バッグの持ち方：ショルダーバッグは道路側とは反対側に斜めがけし、手で押さえるように持ちましょう。'
      ],
      popupDetails: [
        {
          title: 'Grabの使い方アドバイス',
          text: 'アプリを入手したら、旅行前に日本国内でSMS認証とクレジットカード登録を済ませておくことを強くおすすめします。ベトナム到着後すぐ、空港からホテルへの移動にも使えて非常に便利です。'
        },
        {
          title: '伝統タクシーの偽物に注意',
          text: '空港や観光地周辺には「Vinasun」や「Mai Linh」に非常によく似たロゴや名前の偽タクシーが潜んでいます。車体番号がしっかり書かれているか、ドライバーが制服を着ているか、メーターがあるかを必ず確認し、不安ならGrabを使いましょう。'
        },
        {
          title: '横断時のパニックは禁物',
          text: 'バイクの大群が向かってくると恐怖で立ち止まったり、引き返したくなりますが、これが一番危険です。川の流れを渡るように、ゆっくりと同じペースで進み続けると、バイクが自然にあなたを避けて通っていきます。'
        }
      ],
      options: [
        { name: 'Grab Bike (バイク便)', desc: '最も安く、渋滞をすり抜けて最速で移動できる手段。ヘルメットが支給されます。', payment: 'アプリ / 現金', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (普通車)', desc: '快適でエアコンが効いた安全な移動手段。最大4〜7名まで乗車可能。', payment: 'アプリ / 現金', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: 'メトロ (都市鉄道)', desc: 'サイゴン初の都市鉄道。1区から隣接エリアを快適に結びます。', payment: 'カード / 現金', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: '一般タクシー', desc: 'ビナサンやマイリンなど。メーター制で信頼性が高く、街頭で拾うのに適しています。', payment: '現金 / カード', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: '料金の目安 (VND)',
      tableHeaders: ['移動手段', '1-2 km', '3-5 km', '5-10 km', '支払方法'],
      tableNote: '※価格は時間帯や天候によって変動します。',
      pointsTitle: '移動のポイント',
      points: [
        'GrabやXanh SMアプリを事前にダウンロードする',
        'クレジットカードを連携しておくとキャッシュレスで便利',
        '流しのタクシーはVinasunかMai Linhのみ選ぶ'
      ],
      rideApps: 'おすすめ配車アプリ'
    },
    stay: {
      heading: '泊まる ＆ 整える',
      subheading: 'Rejuvenate Your Senses',
      intro: '活気あふれる街を歩いた後は、静かで心地よい空間へ。上質なホテルやスパで、心と体を心地よく整えましょう。',
      categories: [
        {
          title: 'ブティックホテル',
          subtitle: '都会のオアシス',
          bullets: [
            'クラシカルなフランス風建築で古き良き時代を体感',
            'ルーフトッププールで美しい夜景を眺め、涼むひととき',
            '温かなおもてなしと洗練されたアート空間に包まれる'
          ]
        },
        {
          title: 'スパ ＆ ハーバル洗髪',
          subtitle: '心身の疲れを癒やす',
          bullets: [
            '天然ハーブを使った心地よい伝統的なベトナム式マッサージ',
            '大人気のハーバル・ヘアウォッシュ（首肩マッサージ付）',
            'アロマが香る静寂な空間で、旅の疲れをリセット'
          ]
        },
        {
          title: '隠れ家カフェ ＆ お茶',
          subtitle: '静かな自分時間',
          bullets: [
            '緑に囲まれた路地裏やレトロなアパートのカフェでひと休み',
            '本格ベトナムコーヒーや爽やかなハーブティーを堪能',
            '旅の思い出をノートに綴ったり、ゆったり語らう時間'
          ]
        }
      ],
      tips: [
        'ホテルは早めの予約を。スパは口コミを確認し、事前予約するとスムーズです。',
        'こまめな水分補給を。休息をはさむことで旅がさらに楽しくなります。'
      ],
      leftImgDesc: 'ブティックホテルで優雅な滞在を',
      rightStack: [
        'ハーバル洗髪でスッキリ',
        '伝統マッサージで疲労回復',
        '隠れ家カフェでティータイム'
      ]
    },
    food: {
      title: 'サイゴン・グルメガイド',
      intro: 'サイゴン最高のグルメ体験を完璧にまとめたハンドブック。正確な営業時間と洗練された統一デザインでお届けします。',
      categories: [
        {
          title: 'サイゴン・フォー',
          emoji: '🍜',
          quote: '「サイゴン風フォーは、牛骨をじっくり煮込んだ甘みのある豊かなスープが特徴。ハーブや甘辛い黒醤油・チリソースを加えて自分好みに仕上げます。」',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (第3区)',
              sub: 'ミシュラン・ビブグルマン受賞の老舗ブランド',
              desc: '世界中から観光客が訪れる伝説のフォー専門店。半世紀以上の歴史を持ちます。',
              addr: '260C Pasteur, Phường 8, District 3',
              hours: '06:00 - 22:30',
              price: '90,000 - 115,000 VND / 杯'
            },
            {
              name: 'Phở Việt Nam (第1区)',
              sub: 'ミシュラン・セレクテッド選出店',
              desc: '毎朝店内で自家製の新鮮な生麺を製造。和牛を使用した熱々の「石鍋フォー」が名物です。',
              addr: '14 Phạm Hồng Thái, Phường Bến Thành, District 1',
              hours: '06:00 - 翌03:00',
              price: '90,000 - 350,000 VND / 杯'
            },
            {
              name: 'Phở Dậu (第3区)',
              sub: '半世紀以上にわたり守られる古き良き北部の味',
              desc: 'ハーブやもやしを入れないクラシックな北部風フォー。澄んだ牛骨スープに懐かしいナムディン地方の伝統を感じられます。',
              addr: 'Cư xá 288, Hẻm 288M1 Nam Kỳ Khởi Nghĩa, District 3',
              hours: '06:00 - 12:00 (午前のみ)',
              price: '80,000 - 110,000 VND / 杯'
            },
            {
              name: 'Phở Lệ (第5区)',
              sub: 'ミシュラン・セレクテッド選出の名店',
              desc: '濃厚でコクのある南部スタイルのスープ。柔らかい牛肉と歯ごたえの良いつみれ（ボウル）が絶品。',
              addr: '413-415 Nguyễn Trãi, Phường 7, District 5',
              hours: '06:00 - 00:00 (深夜)',
              price: '85,000 - 110,000 VND / 杯'
            },
            {
              name: 'Phở Phú Vương (第1区)',
              sub: '澄んだハーブスープが自慢の老舗フォー店',
              desc: 'レア肉、スジ、バラ肉などトッピングが豊富。天然ハーブの香りがほんのり漂う澄んだスープが人気。',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, District 1',
              hours: '06:00 - 23:00',
              price: '75,000 - 100,000 VND / 杯'
            }
          ]
        },
        {
          title: 'サイゴン・バインミー',
          emoji: '🥖',
          quote: '「外側はパリパリ、中はふんわりとしたフランスパンに、濃厚なレバーパテ、バター、ベトナムハム、紅白なますを挟んだ世界的人気サンドイッチ。」',
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (第1区)',
              sub: 'サイゴンで最高峰の「バインミーの王様」',
              desc: '圧倒的なボリューム（約0.5kg）！何層にも重なるハムや特製パテ、バターが絶妙。二人で分けるのがおすすめ。',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, District 1',
              hours: '11:00 - 21:00',
              price: '65,000 - 70,000 VND / 個'
            },
            {
              name: 'Bánh Mì Bảy Hổ (第1区)',
              sub: 'ミシュラン・ビブグルマン受賞',
              desc: '創業80年以上の老舗屋台。家伝のレシピでじっくり蒸し上げたクリーミーなパテと、自家製チャーシューが絶品。',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, District 1',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20,000 - 35,000 VND / 個'
            },
            {
              name: 'Bánh Mì Hồng Hoa (第1区)',
              sub: 'ミシュラン・セレクテッド選出',
              desc: 'ベンタイン市場近くの名店。焼きたてのサクサクパンに、自家製チャーシューやカリカリ豚皮（ローストポーク）を贅沢にサンド。',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, District 1',
              hours: '05:30 - 21:30',
              price: '30,000 - 50,000 VND / 個'
            },
            {
              name: 'Bánh Mì Như Lan (第1区)',
              sub: '50年以上の歴史を誇る伝説の老舗ブランド',
              desc: 'サクサクのパンに自家製パテ、ベトナムハム、焼豚がたっぷり。ビテクスコ・タワーのすぐ近く。',
              addr: '50 Hàm Nghi, P. Bến Nghé, District 1',
              hours: '05:00 - 23:00',
              price: '35,000 - 60,000 VND / 個'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (第3区)',
              sub: '1958年創業・鉄板バインミーの発祥地',
              desc: '熱々の小鉄板に目玉焼き、パテ、ハム、玉ねぎが乗ったスタイル。路地の小さな椅子で味わうノスタルジックな朝食。',
              addr: '53 Cao Thắng, Phường 3, District 3',
              hours: '06:00 - 11:00 (午前のみ)',
              price: '50,000 - 70,000 VND / 個'
            }
          ]
        },
        {
          title: 'サイゴン・コーヒー',
          emoji: '☕',
          quote: '「ニューヨークタイムズ誌で『世界で最も美味しいコーヒー』の一つに選ばれた、濃厚なロブスタコーヒーと甘い練乳、クラッシュアイスの調和。」',
          restaurants: [
            {
              name: 'Cộng Cà Phê',
              sub: 'ノスタルジックな古き良きベトナムのテーマ',
              desc: '一番人気は濃厚でクリーミーな「ココナッツミルクコーヒー」。リ・トゥ・チョン通り店やブイビエン通り店が有名。',
              addr: '市内に複数店舗あり（第1区中心など）',
              hours: '07:00 - 23:00 (店舗により異なる)',
              price: '40,000 - 75,000 VND'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng',
              sub: '70年間24時間眠らない伝説の「ネットフィルター」コーヒー',
              desc: '布フィルターと炭火の土窯を使った独自の製法。サイゴンっ子に混ざって、歩道の小さな椅子で頂きます。',
              addr: '330/2 Phan Đình Phùng, P.1, Phu Nhuan Dist',
              hours: '24/7 (24時間営業)',
              price: '15,000 - 25,000 VND'
            },
            {
              name: 'Cà Phê Vy (第1区)',
              sub: '通りを行き交うバイクを眺めるストリートカフェ',
              desc: '歩道にずらりと並ぶ低い木の椅子に座り、サイゴンの風を感じながら飲む、昔ながらの極濃滴下フィルターコーヒー。',
              addr: '90 Nguyễn Du, P. Bến Nghé, District 1',
              hours: '06:00 - 23:00',
              price: '30,000 - 50,000 VND'
            },
            {
              name: 'Cheo Leo Café (第3区)',
              sub: '1938年創業・サイゴン最古のネルドリップ風カフェ',
              desc: '路地裏の古民家で近現代史を見守ってきた老舗。布フィルターと素焼きの壺で淹れる伝統コーヒーが魅力。',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, District 3',
              hours: '05:15 - 22:00',
              price: '20,000 - 35,000 VND'
            },
            {
              name: 'The Workshop Coffee (第1区)',
              sub: 'サイゴン初の本格スペシャルティコーヒー専門店',
              desc: 'レトロアパートの2階にあるインダストリアルデザインの空間。世界中のシングルオリジン豆を手淹れで楽しめます。',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, District 1',
              hours: '08:00 - 21:00',
              price: '65,000 - 120,000 VND'
            }
          ]
        },
        {
          title: 'コム・タム',
          emoji: '🍛',
          quote: '「かつて農家が食べた割れ米のご飯に、炭火焼きの豚あばら肉をのせた南部名物。甘酸っぱいヌクマムをかけて食べます。」',
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (フーニュアン区)',
              sub: 'ミシュラン・ビブグルマン受賞の超有名店',
              desc: 'お皿からはみ出るほどの特大骨付きハニージンジャー炭火焼きポークが自慢。外はカリッと、中は非常にジューシー。',
              addr: '84 Đặng Văn Ngữ, Phường 10, Phu Nhuan Dist',
              hours: '07:00 - 21:30',
              price: '70,000 - 140,000 VND'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (第1区)',
              sub: '1975年以前から愛され続ける老舗ブランド',
              desc: 'メニューが非常に豊富。五香粉（ウーシャンフェン）をまぶして香り高く焼き上げた薄切りリブは日本人好みの味。',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, District 1',
              hours: '06:00 - 21:00',
              price: '60,000 - 110,000 VND'
            },
            {
              name: 'Cơm Tấm Mộc (第1区)',
              sub: 'オフィス街で絶大な支持を得る、上品でモダンな割れ米食堂',
              desc: '上品で温かみのある空間で、伝統的な味を提供。ここの名物メニューであるハニー炭焼きポークは、しっとり柔らかく上品な甘さが特徴。',
              addr: '85 Lý Tự Trọng, Bến Thành, District 1',
              hours: '08:00 - 21:30',
              price: '45,000 - 90,000 VND'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (第1区)',
              sub: 'ジューシーな厚切り炭火焼きポークで有名な名店',
              desc: '極厚の豚ロース肉を秘伝のタレに漬け込み、炭火で香ばしく焼き上げた最高峰のコムタム。',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, District 1',
              hours: '06:30 - 15:00',
              price: '120,000 - 180,000 VND'
            },
            {
              name: 'Cơm Tấm Kiều Giang (第1区)',
              sub: '深夜まで営業する伝統のコムタム店',
              desc: 'ハチミツ漬けの香ばしい豚肉、蒸しエッグケーキ、豚皮の千切りが揃う夜食に最適なコムタム。',
              addr: '139 Nguyễn Trãi, P. Bến Thành, District 1',
              hours: '06:00 - 翌02:00',
              price: '50,000 - 95,000 VND'
            }
          ]
        },
        {
          title: '複合フードコート',
          emoji: '🏢',
          quote: '「高級デパ地下、歴史ある100年市場、そしてアート溢れるレトロアパートメントまで、多様で活気に満ちたサイゴンのグルメスポットを体験。」',
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (B2)',
              sub: '日本・アジアの上質なグルメが集う大人気フードコート',
              desc: '中島水産、梅光軒ラーメン、とんかつ伊東、山崎製パン、麻布茶房抹茶のほか、地元人気カフェKatinatやMaison Marouが揃います。',
              addr: '65 Lê Lợi, P. Bến Nghé, District 1',
              hours: '09:30 - 21:30 (週末22:00まで)',
              price: '30,000 - 250,000 VND'
            },
            {
              name: 'ベンタイン市場フードコート (第1区)',
              sub: 'サイゴンの象徴！伝統屋台料理が集結する聖地',
              desc: 'ブンマム（麺類）、生春巻き、チェー（デザート）、シーフードまで何でも揃う。午後7時以降はナイトマーケット。',
              addr: 'Lê Lợi Street, P. Bến Thành, District 1',
              hours: '07:00 - 19:00 (19:00以降はナイトマーケット)',
              price: '40,000 - 200,000 VND'
            },
            {
              name: 'グエンフエ通り42番地カフェアパート (第1区)',
              sub: '古いアパートをリノベーションした個性派アートビル',
              desc: '歩行者天国を見下ろすレトロな団地に、おしゃれなカフェやブティック、レストランがひしめき、宝探し気分を味わえます。',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, District 1',
              hours: '08:00 - 22:30 (店舗により異なる)',
              price: '40,000 - 300,000 VND'
            },
            {
              name: 'Phố Ẩm Thực Vĩnh Khánh (第4区)',
              sub: 'サイゴン最大の夜間シーフード＆屋台街',
              desc: '活気溢れる屋外ストリート。ネギ油で焼き上げた貝料理や各種海鮮料理、鍋料理が夜遅くまで楽しめます。',
              addr: 'Đường Vĩnh Khánh, Phường 8, District 4',
              hours: '16:00 - 翌01:00',
              price: '50,000 - 300,000 VND'
            },
            {
              name: 'Phố Đi Bộ Bùi Viện (第1区)',
              sub: '眠らない街サイゴンのナイトライフ＆屋台中心地',
              desc: '国際色豊かなレストラン、ストリートフードの串焼き、路上クラフトビールやライブ音楽が眩しい不夜城。',
              addr: 'Phố Bùi Viện, P. Phạm Ngũ Lão, District 1',
              hours: '18:00 - 翌04:00',
              price: '30,000 - 250,000 VND'
            }
          ]
        }
      ]
    },
    culture: {
    title: '文化 ＆ チェックイン',
    intro: 'コロニアル様式の美しい建築、ベトナム戦争の歴史を伝える博物館、静謐で厳かな寺院、都会のオアシスである緑豊かな公園、端正な地下鉄駅から近代的な高層地平線まで。サイゴンの多様な魅力を満喫できる観光スポット。',
    categories: {
      heritage: '歴史・遺産',
      spiritual: '寺院・教会',
      modern: '現代都市と体験',
      nature: '自然・郊外'
    },
    items: [
      {
        category: 'heritage',
        name: 'サイゴン中央郵便局',
        sub: '130年以上の歴史を誇るコロニアル建築の最高傑作',
        desc: 'エッフェル塔の設計者ギュスターヴ・エッフェルが手がけた美しいアーチ状の鉄骨天井とアンティークな木製電話ボックスが特徴。郵便局として今も実際に機能しています。',
        addr: '2 Công xã Paris, Bến Nghé, Quận 1',
        hours: '07:30 - 18:00',
        price: '入場無料',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '統一会堂 (旧大統領官邸)',
        sub: '歴史が動いた決定的な瞬間を見守った建物',
        desc: '建築家ゴ・ベト・トゥが設計したモダニズム建築の傑作。1975年4月30日のベトナム戦争終結の舞台となった、歴史的に極めて重要なスポットです。',
        addr: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1',
        hours: '08:00 - 16:30',
        price: '65,000 VND',
        emoji: '🏰'
      },
      {
        category: 'heritage',
        name: 'ホーチミン市人民委員会庁舎',
        sub: 'フランス・ルネサンス様式の壮麗な宮殿風建築',
        desc: 'グエンフエ歩行者天国の起点にそびえる、優美なアーチと時計塔が印象的な建物。夜はライトアップされ、まるでヨーロッパの街角のようなロマンチックな雰囲気に。',
        addr: '86 Lê Thánh Tôn, Bến Nghé, Quận 1',
        hours: '外観見学のみ / 24時間可能',
        price: '無料',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '市民劇場 (サイゴン・オペラハウス)',
        sub: 'フランス植民地時代の美しいクラシック劇場',
        desc: '豪華な彫刻レリーフで装飾されたアール・ヌーヴォー様式の劇場。世界的に評価の高いアクロバット劇「À Ố Show」などの観劇スポットとして有名です。',
        addr: '7 Công trường Lam Sơn, Bến Nghé, Quận 1',
        hours: '公演スケジュールによる',
        price: '公演チケット代が必要',
        emoji: '🎭'
      },
      {
        category: 'heritage',
        name: '戦争証跡博物館',
        sub: '戦争の真実と平和の尊さを学び、未来へつなぐ場所',
        desc: 'ベトナム戦争に関する生々しい写真や記録、戦闘機や重兵器が展示されている世界的な博物館。悲劇から立ち上がった人々の力強さと平和の大切さを伝えます。',
        addr: '28 Võ Văn Tần, Võ Thị Sáu, Quận 3',
        hours: '07:30 - 17:30',
        price: '40,000 VND',
        emoji: '🛡️'
      },
      {
        category: 'heritage',
        name: 'ベトナム歴史博物館',
        sub: '南部の古代文化から王朝までの貴重な遺産',
        desc: '動植物園に隣接する美しいインドシナ様式の洋館。先史時代からオケオ文化、チャンパ王国、最後の王朝であるグエン朝までの貴重なコレクションを展示。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '08:00 - 11:30 | 13:00 - 17:00',
        price: '40,000 VND',
        emoji: '📜'
      },
      {
        category: 'heritage',
        name: 'ホーチミン市美術博物館',
        sub: 'レトロな黄色い洋館に宿る美の空間',
        desc: 'かつての華僑の大富豪「フア・ボン・ホア」の豪邸。美しいステンドグラスの窓、開放的な回廊、サイゴン最古の稼働式エレベーターなど、写真映えスポットとしても大人気。',
        addr: '97A Phó Đức Chính, Nguyễn Thái Bình, Quận 1',
        hours: '08:00 - 17:00',
        price: '30,000 VND',
        emoji: '🎨'
      },
      {
        category: 'spiritual',
        name: 'サイゴン大聖堂 (聖母マリア教会)',
        sub: '街のシンボルである厳かな赤レンガの大聖堂',
        desc: '南仏マルセイユから運ばれたコケの生えない赤レンガで作られた、荘厳なネオ・ロマネスク様式の大聖堂。左右にそびえるツインタワーが印象的な美しい教会。',
        addr: '1 Công xã Paris, Bến Nghé, Quận 1',
        hours: '大規模修復中 (外観見学のみ)',
        price: '無料',
        emoji: '⛪'
      },
      {
        category: 'spiritual',
        name: 'タンディン教会',
        sub: '絵本から飛び出したような、ピンクのかわいい教会',
        desc: '鮮やかなパステルピンクに彩られた、ゴシック様式とバロック様式が美しく融合した教会。世界中の旅行者を魅了するインスタ映え必至の人気撮影スポット。',
        addr: '289 Hai Bà Trưng, Võ Thị Sáu, Quận 3',
        hours: '08:00 - 17:30',
        price: '無料',
        emoji: '💒'
      },
      {
        category: 'spiritual',
        name: '玉皇殿 (ジェイド・エンペラー・パゴダ)',
        sub: 'オバマ元大統領も訪れた、子宝や縁結びの霊験あらたかな古刹',
        desc: '1909年に創建された中国風の寺院。美しい道教や仏教の彫像が立ち並び、2016年にはアメリカのオバマ元大統領が参拝したことで世界的に有名になりました。',
        addr: '73 Mai Thị Lựu, Đa Kao, Quận 1',
        hours: '07:00 - 18:00',
        price: '無料',
        emoji: '🛕'
      },
      {
        category: 'spiritual',
        name: '永厳寺 (ビンギエム寺)',
        sub: '南部最大級の敷地を誇る、格調高い仏教寺院',
        desc: '見事な彫刻が施された高さ40メートルの七重の石塔が有名。ベトナム北部の伝統的な伽藍配置を近代的なコンクリート技術で再現した名刹です。',
        addr: '339 Nam Kỳ Khởi Nghĩa, Võ Thị Sáu, Quận 3',
        hours: '07:00 - 20:00',
        price: '無料',
        emoji: '⛩️'
      },
      {
        category: 'spiritual',
        name: '天后宮 (チョロンのバ・ティエン・ハウ寺)',
        sub: '中華街（チョロン）にひっそり佇む、最古の中国寺院',
        desc: '海の守護神「天后聖母」を祀るお寺。屋根に施された緻密な陶器の人形レリーフや、天井から無数に吊り下げられた巨大な渦巻き線香が幻想的な空間を作り出しています。',
        addr: '710 Nguyễn Trãi, Phường 11, Quận 5',
        hours: '06:30 - 16:30',
        price: '無料',
        emoji: '🏮'
      },
      {
        category: 'modern',
        name: 'ランドマーク 81',
        sub: 'ベトナムの発展を象徴する最高峰の超高層ビル',
        desc: '力強く結束する「竹の束」をイメージした、ベトナムで最も高いビル。高級モール、おしゃれなレストラン、そしてはるか雲の上からサイゴンの街を一望できる展望台が入っています。',
        addr: '720A Điện Biên Phủ, Phường 22, Bình Thạnh',
        hours: '09:00 - 22:00',
        price: 'モール入場無料',
        emoji: '🏙️'
      },
      {
        category: 'modern',
        name: 'ベンタイン地下鉄駅',
        sub: '最先端のインフラが織りなす未来的な地下空間',
        desc: '明るい自然光を取り入れる巨大な円形のトップライト（天窓）が特徴の最新地下中央駅。近未来的な写真を撮影できる新しいフォトスポットとして話題です。',
        addr: 'Quảng trường Quách Thị Trang, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '乗車運賃が必要',
        emoji: '🚇'
      },
      {
        category: 'modern',
        name: 'グエンフエ歩行者天国（夜間）',
        sub: '夜風が心地よく流れる広大な歩行者天国',
        desc: '夜になると美しく輝く音楽噴水、ライトアップされたフランス風建築、そして近くのバクダン港から吹く心地よい川風を浴びながら歩ける憩いの広場。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '24時間オープン (18:00以降が最適)',
        price: '無料',
        emoji: '🌃'
      },
      {
        category: 'modern',
        name: 'グエンフエ・ストリートパフォーマンス',
        sub: '若手アーティストと音楽が集まるストリートカルチャーの拠点',
        desc: '週末の夜、アコースティックバンドの生演奏や、ブレイクダンス、伝統芸能のストリートパフォーマンスなどが各所で繰り広げられる、サイゴン市民の熱気あふれる空間。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '毎週土曜・日曜の夜',
        price: '無料',
        emoji: '🎸'
      },
      {
        category: 'modern',
        name: 'ブイビエン歩行者天国',
        sub: '一晩中エネルギッシュな熱気が冷めない不夜城',
        desc: '世界中からバックパッカーが集まる賑やかな通り。重低音の効いたEDM音楽が響き渡り、様々な国の観光客とお手頃な価格のビールを片手に楽しく国際交流ができるスポット。',
        addr: 'Đường Bùi Viện, Phạm Ngũ Lão, Quận 1',
        hours: '19:00 - 02:00 (週末が最も盛況)',
        price: '入場無料',
        emoji: '🍻'
      },
      {
        category: 'modern',
        name: 'ホーティキー夜間花市場',
        sub: '24時間眠らない、カラフルで甘い香りに満ちた花の世界',
        desc: '市内最大の生花問屋市場。深夜から早朝にかけて最も賑わい、色とりどりのバラや百合が並ぶ光景は圧巻。隣接する路地はローカルに大人気の食べ歩きB級グルメ街。',
        addr: 'Hẻm 52 Hồ Thị Kỷ, Phường 1, Quận 10',
        hours: '24時間営業 (深夜00:00 - 03:00が最も華やか)',
        price: '無料',
        emoji: '🌸'
      },
      {
        category: 'modern',
        name: '金竜水上人形劇場',
        sub: 'ベトナム北部の豊かな水田地帯に生まれた伝統芸能',
        desc: '伝統的な民族楽器の生の調べに合わせて、カラフルな木彫りの人形たちが水の上をユーモラスに飛び跳ねます。ベトナム独自の温かみ溢れる水上エンターテインメント。',
        addr: '55B Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '公演スケジュールによる (夕方17:00以降)',
        price: '約150,000 VND',
        emoji: '🎭'
      },
      {
        category: 'modern',
        name: 'バイクで行く市内探検ツアー',
        sub: 'サイゴンの圧倒的な生活の鼓動をダイレクトに体験',
        desc: 'ローカルライダーの背中に乗って細い路地をすり抜け、溢れかえるバイクの波と一体になる体験。ストリートの喧騒と美しい夜風を一度に浴びる、最もリアルな旅。',
        addr: 'ホーチミン市中心部全域',
        hours: '終日・夜間（フレキシブル）',
        price: 'ツアー会社による',
        emoji: '🛵'
      },
      {
        category: 'modern',
        name: '2階建てオープントップバスツアー',
        sub: '開放的な2階席から歴史的な名所を360度パノラマ観賞',
        desc: '風を感じながら、美しい中央郵便局やライトアップされた高層ビル群のパノラマ夜景を快適に巡る観光バス。サイゴンの美しさを俯瞰できる快適なツアー。',
        addr: '乗車場所：サイゴン中央郵便局前、Quận 1',
        hours: '09:00 - 22:30',
        price: '150,000 - 300,000 VND',
        emoji: '🚌'
      },
      {
        category: 'nature',
        name: 'クチの地下トンネル',
        sub: 'ジャングルの地下に作られた、全長250kmを超える巨大な要塞',
        desc: '戦時中にすべて手掘りで建設された地下都市迷宮。病院、司令部、台所などが地下に配置されており、ベトナムの人々の驚くべき知恵と強靭な精神力を伝えます。',
        addr: 'Tỉnh lộ 15, Phú Mỹ Hưng, Huyện Củ Chi (中心部から約60km)',
        hours: '07:00 - 17:00',
        price: '35,000 VND (ベトナム人) | 125,000 VND (外国人)',
        emoji: '🌴'
      },
      {
        category: 'nature',
        name: 'カンザー・マングローブ保全林',
        sub: 'ユネスコが認定した、壮大な汽水域の「緑の肺」',
        desc: '果てしなく広がる神秘的なマングローブの原生林、愛嬌たっぷりの野生ザルが迎えてくれるモンキーアイランド、ワニの生息地など、ダイナミックな自然生態系を体験。',
        addr: 'Đường Rừng Sác, xã An Thới Đông, Huyện Cần Giờ',
        hours: '07:30 - 17:00',
        price: '各スポットによる',
        emoji: '🐊'
      },
      {
        category: 'nature',
        name: 'サイゴン動植物園',
        sub: '160年以上の歴史を誇る、世界有数の歴史ある植物園',
        desc: '1864年に設立された、緑に囲まれた憩いのオアシス。数百年の巨大な大木が木陰を作り、珍しい熱帯植物や様々な野生動物がのんびりと暮らしています。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '07:00 - 18:30',
        price: '60,000 VND',
        emoji: '🦁'
      },
      {
        category: 'nature',
        name: 'タオダン公園',
        sub: 'District 1 都心部うっそうとした美しい森',
        desc: '樹齢を重ねた巨大な黒檀の木々がそびえ立つ広大な公園。早朝には、鳥愛好家たちが自慢の小鳥のケージを吊り下げ、さえずりを競わせる伝統的なお茶会が見られます。',
        addr: 'Đường Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '無料',
        emoji: '🌳'
      },
      {
        category: 'nature',
        name: '9月23日公園',
        sub: 'バックパッカー街とベンタイン市場を繋ぐ心地よい芝生広場',
        desc: '緑豊かな歩道と広大な芝生、センスマーケットが一体となった公園。地元の学生と外国人旅行者が楽しく言葉を交わすカルチャースポット。',
        addr: 'Đường Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1',
        hours: '24時間オープン',
        price: '無料',
        emoji: '🍃'
      }
    ]
  },

    shopping: {
      title: 'お買い物 ＆ お土産',
      intro: 'お土産探しの定番スポット。活気あふれる巨大市場から、ハイセンスな伝統工芸品、ベトナム独自の最新デザイナーズブランドまで。',
      items: [
        {
          name: 'ベンタイン市場 (Chợ Bến Thành)',
          sub: 'サイゴンのシンボルであり何でも揃う巨大市場',
          desc: '100年以上の歴史を持つ、街のシンボル。アオザイの仕立て、高品質なコーヒー豆やカシューナッツ、漆器や刺繍小物といった伝統工芸品が所狭しと並びます。価格交渉（値切り）もショッピングの醍醐味！',
          addr: 'Đường Lê Lợi, Phường Bến Thành, Quận 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: 'チョロン・ビンタイ市場 (Chợ Bình Tây)',
          sub: '中華街（チョロン）に眠るディープな卸売市場',
          desc: '壮麗な東洋風の建築が美しい、ベトナム最大級の問屋市場。日用品、漢方、調味料、安価なおもちゃやサンダル、手芸品などが大量に取引されています。ローカルのエネルギーが凄まじい、ディープで活気あふれるスポット。',
          addr: '57A Tháp Mười, Phường 2, Quận 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground (ザ・ニュー・プレイグラウンド)',
          sub: 'ベトナムの若者カルチャー＆ローカルブランド発信地',
          desc: '地下に広がる、コンクリート打ちっぱなしの近未来的な若者向けショッピングモール。ベトナム人若手デザイナーによる個性派ストリートファッションブランド（Local Brands）やトレンドのアクセサリーがずらり。人とは違うお土産に。',
          addr: '26 Lý Tự Trọng, Bến Nghé, Quận 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Lục Lam 伝統文化休憩所',
      subtitle: 'Lục Lam 伝統文化休憩所',
      intro: 'ベトナムの香り高い手作りハーブティー、自家焙煎コーヒー、そして優しい伝統のお菓子でおもてなし。伝統と安らぎが調和する、旅人のオアシス。',
      aboutHeading: 'Lục Lam（ルックラム）について',
      aboutText: '都会の喧騒から離れた路地にひっそりと佇むルックラムは、ベトナム全国から厳選したオーガニック草本茶、手作りのお茶菓子、そして温かい職人魂の工芸品を集めた伝統文化スペースです。レトロなインドシナ様式のインテリアに囲まれながら、ベトナムに古くから伝わる伝統健康法や、ゆったりとした時間をご堪能ください。',
      menuHeading: '名物・おすすめセレクション',
      menuItems: [
        {
          name: 'Red Lava (レッドラヴァ ハーブティー)',
          desc: 'ハイビスカス（ローゼル）、鮮やかなオレンジ、シナモンのブレンド。甘酸っぱく香り高いビタミンCたっぷりのハーブティー。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Velvet Rose (ベルベットローズ ティー)',
          desc: '厳選されたフレンチローズとジャスミンの優雅なハーモニー。華やかな香りで心を潤し、美肌効果をもたらす人気ティー。',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Violet Jasmine (バイオレットジャスミン ティー)',
          desc: '高山オーガニック緑茶に天然ジャスミンの花香を熟成。澄んだ高貴な香りが心身を爽やかに包み込みます。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Golden Peach (ゴールデンピーチ ハーブティー)',
          desc: '芳醇な黄桃の甘香と天然ハチミツ、ハーブの優しくフルーティーな調和。心満たされる爽快な味わい。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Zen Relaxing (ゼンリラクシング ティー)',
          desc: 'カモミール、ハスの実の芯、ラベンダーの優しいハーモニー。旅の緊張をほぐし、心地よい眠りへと誘います。',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: '旅行者様限定・特別クーポン',
      voucherDesc: 'お会計時にスタッフにこの画面を提示するか、QRコードをスキャンすると、お会計から10%OFF、または温かいお茶をご注文の方に「伝統緑豆ケーキセット」を無料プレゼントいたします！',
      voucherBadge: '独占O2O款待特典',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: 'クーポンを適用する',
      voucherClaimed: '適用済み！スタッフにお見せください。'
    },
    info: {
      title: '旅の便利 ＆ 安心情報',
      intro: '不測の事態に備えた緊急連絡先、最もお得な両替スポット、通信やお金に関する知恵袋をまとめました。安全第一。',
      categories: [
        {
          title: '救急・医療＆ツーリストサポート',
          items: [
            { label: 'FVインターナショナル病院 (FV Hospital)', detail: 'Q1 Bitexcoタワー3階。多言語対応(英・仏・日)の24時間救急外来。電話: (028) 3822 7878' },
            { label: 'ファミリー・メディカル・プラクティス', detail: '34 Lê Duẩn, Quận 1。高い医療技術を誇る国際総合クリニック。日本語通訳あり。電話: (028) 3822 7848' },
            { label: '観光警察 (Tourist Police)', detail: '24-26 Pasteur, Quận 1。トラブル時の相談窓口。電話: (028) 3824 4103' }
          ]
        },
        {
          title: 'おすすめ両替スポット (優良レート)',
          items: [
            { label: 'Tiệm Vàng Hà Tâm (ハタム金製品店)', detail: '2 Nguyễn An Ninh, Q1（ベンタイン市場西門の目の前）。サイゴンで最も両替レートが良いことで世界的に超有名な金製品店。常に大行列ですが対応は迅速。' },
            { label: 'Tiệm Vàng Mai Vân (マイヴァン金製品店)', detail: 'ハタムの向かいに位置する。こちらも非常に良いレートで、ハタムが混みすぎている時の最適解。' }
          ]
        },
        {
          title: 'SIMカードとATM決済',
          items: [
            { label: 'SIMカード / eSIM', detail: '空港のViettelまたはVinaphoneカウンターが最速で確実。eSIMをお持ちなら「Viettel」が地方でも圧倒的につながりやすいため強く推奨。' },
            { label: 'ATMキャッシングと手数料', detail: 'Vietcombank、Techcombank、HSBCなどのATMで日本のクレジットカードからベトナムドンを引き出せます。暗証番号の入力と、カードの取り忘れに厳重注意。' }
          ]
        }
      ]
    }
  },
  vi: {
    title: 'Cẩm Nang Bỏ Túi Sài Gòn',
    subtitle: 'Hướng dẫn dạo phố & ưu đãi độc quyền',
    faq: [
      { q: 'Lục Lam ở đâu tại Thành phố Hồ Chí Minh?', a: 'Lục Lam nằm tại {{address}}.' },
      { q: 'Lục Lam mở cửa mấy giờ?', a: 'Mở cửa tất cả các ngày, từ {{hours}}.' },
      { q: 'Đi lại ở Sài Gòn thế nào cho an toàn?', a: 'Dùng ứng dụng gọi xe ({{apps}}) vì giá hiện trước khi đặt. Nếu bắt taxi dọc đường, hãy chọn {{taxis}} và đảm bảo đồng hồ tính tiền được bật.' },
      { q: 'Đi lại ở Sài Gòn tốn khoảng bao nhiêu?', a: 'Khoảng {{fareBike}} cho một chặng ngắn bằng xe máy, {{fareCar}} nếu đi ô tô. Giá thay đổi theo thời tiết và giờ cao điểm.' },
      { q: 'Chợ Bến Thành nằm ở đâu?', a: 'Chợ Bến Thành thuộc Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh.' },
      { q: 'Lục Lam bán những loại trà nào?', a: '{{teas}}. Giá từ {{priceFrom}}.' },
      { q: 'Cẩm nang này có những ngôn ngữ nào?', a: '{{languages}}.' },
      { q: 'Làm sao qua đường giữa dòng xe máy?', a: 'Đi chậm và đều bước, không dừng lại cũng không chạy. Người lái xe máy quan sát quỹ đạo của bạn và sẽ lách qua phía sau.' },
      { q: 'Lục Lam có những cửa hàng nào?', a: 'Có {{storeCount}} cửa hàng: {{stores}}. Gọi {{phone}} hoặc email {{email}} để được hỗ trợ.' },
    ],
    contact: {
      heading: 'Liên hệ Lục Lam',
      stores: 'Hệ thống cửa hàng',
      phone: 'Điện thoại',
      email: 'Email',
      office: 'Trụ sở',
      licence: 'Giấy phép kinh doanh',
    },
    faqHeading: 'Frequently asked questions',
    brand: 'LỤC LAM',
    author: 'Lục Lam',
    pages: {
      cover: 'Trang bìa',
      welcome: 'Lời mở đầu',
      atmosphere: 'Bầu không khí',
      transport: 'Di chuyển',
      stay: 'Nghỉ ngơi',
      food: 'Ẩm thực',
                culture: 'Văn Hóa & Điểm Check-In',
shopping: 'Mua sắm',
      luclam: 'Trạm Lục Lam',
      info: 'Thông tin'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: 'Cẩm nang dạo phố & ưu đãi độc quyền thương hiệu Lục Lam',
      badge: 'ĂN NHƯ NGƯỜI BẢN ĐỊA • SÀI GÒN PHỐ',
      scanMe: 'QUÉT MÃ'
    },
    welcome: {
      heading: 'Thành phố sôi động,\nLịch sử hào hùng,\nCon người nồng hậu.',
      p1: 'Sài Gòn (Thành phố Hồ Chí Minh) là trung tâm kinh tế và văn hóa năng động bậc nhất Việt Nam. Nơi đây là sự giao thoa hài hòa giữa kiến trúc Pháp cổ kính, ẩm thực đường phố trứ danh và nhịp sống không ngừng nghỉ.',
      p2: 'Cuốn cẩm nang nhỏ này được thiết kế tinh gọn nhằm giúp cả du khách lần đầu ghé thăm lẫn những người bạn quay trở lại có một chuyến đi an toàn, trọn vẹn và giàu trải nghiệm cảm xúc nhất.',
      highlight: 'Sài Gòn luôn chào đón bạn với vòng tay rộng mở!',
      videoTitle: '\\\\ Video Hành Trình //',
      videoDesc: 'Khám phá vẻ đẹp Sài Gòn qua những thước phim chân thực, sống động nhất!',
      coffeeTitle: 'Cà Phê Muối & Cà Phê Dừa',
      features: [
        { title: 'Con người thân thiện', desc: 'Người Sài Gòn hào sảng, hiếu khách. Họ sẵn sàng chỉ đường tận tình với nụ cười ấm áp.' },
        { title: 'Thiên đường ẩm thực', desc: 'Từ Phở, Bánh mì đến ly cà phê sữa đá đậm đà, ẩm thực Sài Gòn làm say lòng mọi du khách.' },
        { title: 'Bản sắc văn hóa', desc: 'Những công trình kiến trúc cổ kính đan xen cao ốc hiện đại và các di tích lịch sử ý nghĩa.' },
        { title: 'Di chuyển linh hoạt', desc: 'Hệ thống taxi công nghệ, xe ôm và xe buýt phong phú giúp bạn dễ dàng len lỏi mọi ngóc ngách.' }
      ],
      advice: [
        'Thời tiết khá nắng, hãy luôn mang theo mũ, kính râm và kem chống nắng.',
        'Nhớ uống đủ nước và nghỉ ngơi để hành trình luôn tràn đầy năng lượng.'
      ]
    },
    atmosphere: {
      description: 'Sài Gòn là thành phố của những sự tương phản tuyệt vời. Nơi kiến trúc thuộc địa Pháp cổ kính đứng cạnh những tòa nhà chọc trời, nơi hẻm nhỏ yên bình ẩn sau đại lộ tấp nập. Hãy cùng khám phá 3 khu vực đặc sắc nhất để cảm nhận trọn vẹn hơi thở phố thị.',
      offlineMapTitle: 'Bản Đồ Offline Khuyên Dùng',
      tipsTitle: 'Gợi Ý Hành Trình',
      tipsDesc: 'Sáng nhâm nhi cà phê hẻm, chiều tản bộ qua các công trình lịch sử, tối hòa mình vào thế giới ẩm thực đường phố sôi động. Sài Gòn mỗi khung giờ đều mang một vẻ đẹp riêng.',
      districts: [
        {
          id: 'd1',
          name: 'Quận 1 - Trái tim hoa lệ & lịch sử',
          description: 'Trung tâm sầm uất nhất của thành phố. Nơi tập trung các công trình kiến trúc thời Pháp thuộc tinh tế (Nhà thờ Đức Bà, Bưu điện trung tâm, Nhà hát Thành phố), các trung tâm mua sắm cao cấp và chợ Bến Thành nhộn nhịp. Điểm bắt đầu hoàn hảo cho hành trình dạo phố.',
          highlights: ['Dạo bước đường Đồng Khởi', 'Check-in Bưu điện Thành phố', 'Khám phá ẩm thực chợ Bến Thành']
        },
        {
          id: 'd5',
          name: 'Quận 5 - Sắc màu văn hóa Hoa (Chợ Lớn)',
          description: 'Khu vực mang đậm bản sắc văn hóa truyền thống của cộng đồng người Hoa tại Sài Gòn. Nổi tiếng với những ngôi chùa cổ kính trầm mặc (Chùa Bà Thiên Hậu, Hội quán Ôn Lăng), các tiệm thuốc bắc gia truyền dọc phố Hải Thượng Lãn Ông và thế giới ẩm thực phong phú mang hương vị đặc trưng.',
          highlights: ['Viếng Chùa Bà Thiên Hậu', 'Dạo phố thuốc bắc cổ kính', 'Thưởng thức sủi cảo Hà Tôn Quyền']
        },
        {
          id: 'd3',
          name: 'Quận 3 - Góc phố xanh & nét hoài cổ',
          description: 'Nằm sát cạnh Quận 1 nhưng Quận 3 mang nhịp sống bình yên hơn với những con đường rợp bóng cây cổ thụ. Nơi đây sở hữu nhiều căn biệt thự Pháp cổ được cải tạo thành quán cà phê nghệ thuật, nhà hàng tinh tế. Điểm đến yêu thích của giới trẻ Sài Thành.',
          highlights: ['Bảo tàng Chứng tích Chiến tranh', 'Thưởng thức cà phê biệt thự cổ', 'Chiêm ngưỡng Nhà thờ Tân Định màu hồng']
        }
      ],
      mapLabels: {
        title: 'BẢN ĐỒ DẠO PHỐ SÀI GÒN',
        sub: 'Nhấp chọn khu vực để xem thông tin chi tiết',
        airport: 'Sân bay Tân Sơn Nhất',
        d3: 'Quận 3 (Hoài cổ & Cà phê)',
        d1: 'Quận 1 (Trung tâm hoa lệ)',
        d5: 'Quận 5 (Khu Chợ Lớn sầm uất)',
        river: 'Sông Sài Gòn'
      },
      transportTip: 'Sử dụng các ứng dụng như Grab hoặc Xanh SM để di chuyển an toàn.'
    },
    transport: {
      heading: 'Hướng Dẫn Di Chuyển An Toàn',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: 'Giao thông Sài Gòn với hàng triệu chiếc xe máy có thể làm bạn choáng ngợp lúc ban đầu, nhưng với những mẹo nhỏ dưới đây, bạn sẽ dễ dàng làm chủ mọi cung đường một cách an toàn.',
      categories: [
        {
          id: 'apps',
          title: 'Ứng dụng đặt xe (Khuyên dùng)',
          description: 'Giá cước hiển thị rõ ràng, định vị GPS chuẩn xác giúp tránh hoàn toàn tình trạng nói thách hay đi lòng vòng.',
          options: [
            { name: 'Grab', desc: 'Ứng dụng phổ biến nhất Đông Nam Á. Bạn có thể đặt xe máy (GrabBike) hoặc ô tô (GrabCar) chỉ trong vài giây. Rất tiện lợi nếu liên kết thẻ thanh toán quốc tế trước chuyến đi.' },
            { name: 'Xanh SM', desc: 'Hãng taxi thuần điện (EV) đầu tiên tại Việt Nam. Xe cực kỳ sạch sẽ, không mùi, chạy êm ái và tài xế được đào tạo bài bản, lịch sự.' }
          ]
        },
        {
          id: 'taxis',
          title: 'Hãng Taxi truyền thống uy tín',
          description: 'Nếu đón xe trên đường, hãy chọn đúng hai thương hiệu lớn dưới đây và luôn đảm bảo đồng hồ tính tiền (meter) được bật.',
          options: [
            { name: 'Taxi Vinasun', desc: 'Xe màu trắng với sọc đỏ và xanh lá. Thương hiệu lâu đời và uy tín nhất Sài Gòn, tài xế mặc đồng phục chỉn chu.' },
            { name: 'Taxi Mai Linh', desc: 'Xe sơn màu xanh lá cây đặc trưng nổi bật. Hệ thống phủ sóng toàn quốc, dịch vụ chuyên nghiệp và minh bạch.' }
          ]
        },
        {
          id: 'crossing',
          title: 'Bí quyết qua đường Sài Gòn',
          description: 'Sang đường giữa dòng xe máy cuồn cuộn là một trải nghiệm đầy kích thích, hãy tuân thủ nguyên tắc vàng này để qua đường an toàn.',
          options: [
            { name: 'Đi đều bước và không dừng đột ngột', desc: 'Hãy di chuyển chậm rãi, giữ tốc độ đều. Người lái xe máy sẽ chủ động quan sát quỹ đạo di chuyển của bạn để lách tránh phía sau.' },
            { name: 'Giao tiếp bằng mắt & ra hiệu', desc: 'Quan sát các phương tiện đang tới gần, hướng mắt về phía tài xế và dùng tay ra hiệu nhẹ nhàng để họ biết bạn đang bước tới.' }
          ]
        }
      ],
      safetyTips: [
        'Tuyệt đối không vừa đi vừa sử dụng điện thoại ngoài đường để tránh bị cướp giật. Nếu cần xem bản đồ, hãy nép sát vào lề đường, đứng trước cửa hàng lớn.',
        'Luôn đeo túi chéo bên phía người đối diện lòng đường, ôm sát túi trước ngực khi di chuyển bằng xe máy hoặc đi bộ.'
      ],
      popupDetails: [
        {
          title: 'Lời khuyên khi dùng Grab',
          text: 'Hãy tải ứng dụng và hoàn tất xác thực số điện thoại cùng liên kết thẻ tín dụng trước khi bạn khởi hành. Khi vừa đáp xuống sân bay, bạn có thể gọi xe ngay lập tức để về khách sạn với giá cả minh bạch nhất.'
        },
        {
          title: 'Cảnh giác taxi nhái',
          text: 'Tại khu vực sân bay và các điểm du lịch lớn, có rất nhiều xe taxi "nhái" thương hiệu Vinasun hoặc Mai Linh với logo và màu sơn gần như giống hệt. Hãy nhìn kỹ số tổng đài in trên xe và thẻ nhân viên của tài xế trước khi lên xe.'
        },
        {
          title: 'Tuyệt đối không hoảng loạn khi qua đường',
          text: 'Khi thấy dòng xe lao tới, phản xạ tự nhiên là dừng lại hoặc chạy lùi. Việc này cực kỳ nguy hiểm vì tài xế không thể phán đoán hướng đi của bạn. Hãy cứ tiếp tục bước đi chậm rãi và tự tin.'
        }
      ],
      options: [
        { name: 'Grab Bike (Xe ôm)', desc: 'Cách nhanh nhất và tiết kiệm nhất để di chuyển qua những con phố đông đúc. Được trang bị mũ bảo hiểm.', payment: 'App / Tiền mặt', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (Ô tô)', desc: 'Di chuyển an toàn, mát mẻ và thoải mái. Thích hợp cho nhóm từ 4-7 người.', payment: 'App / Tiền mặt', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: 'Metro (Đường sắt đô thị)', desc: 'Tuyến đường sắt đô thị đầu tiên của Sài Gòn, kết nối Quận 1 với các khu vực lân cận.', payment: 'Thẻ / Tiền mặt', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: 'Taxi truyền thống', desc: 'Các hãng lớn uy tín như Vinasun, Mai Linh. Thích hợp khi bắt trực tiếp trên đường.', payment: 'Tiền mặt / Thẻ', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: 'Bảng giá ước tính (VND)',
      tableHeaders: ['Phương tiện', '1-2 km', '3-5 km', '5-10 km', 'Thanh toán'],
      tableNote: '* Giá cước thực tế có thể thay đổi tùy thuộc vào thời tiết và giờ cao điểm.',
      pointsTitle: 'Mẹo Di Chuyển',
      points: [
        'Tải trước ứng dụng Grab và Xanh SM',
        'Liên kết thẻ tín dụng để thanh toán không tiền mặt',
        'Chỉ chọn xe của Vinasun hoặc Mai Linh khi bắt trực tiếp'
      ],
      rideApps: 'Ứng dụng đặt xe khuyên dùng'
    },
    stay: {
      heading: 'Nghỉ ngơi & Chăm sóc',
      subheading: 'Rejuvenate Your Senses',
      intro: 'Sau chuyến dạo phố sôi động, hãy dành thời gian phục hồi cơ thể và tâm hồn tại những góc trú ẩn yên bình của thành phố.',
      categories: [
        {
          title: 'Khách sạn Boutique',
          subtitle: 'Ốc đảo phố thị',
          bullets: [
            'Cảm nhận nét hoài cổ tại các khách sạn kiến trúc Pháp cổ kính',
            'Đắm mình trong hồ bơi vô cực ngắm trọn vẹn cảnh đêm hoa lệ',
            'Tận hưởng dịch vụ tận tâm và thiết kế nghệ thuật tinh tế'
          ]
        },
        {
          title: 'Spa & Gội đầu dưỡng sinh',
          subtitle: 'Hồi phục năng lượng',
          bullets: [
            'Thư giãn cơ thể với các bài massage ấn huyệt cổ truyền',
            'Trải nghiệm gội đầu dưỡng sinh & massage cổ vai gáy cực hot',
            'Thư thái trong không gian tĩnh lặng phảng phất hương tinh dầu'
          ]
        },
        {
          title: 'Cà phê & Trà ẩn mình',
          subtitle: 'Khoảng lặng bình yên',
          bullets: [
            'Thư giãn tại các quán cà phê ẩn mình trong hẻm nhỏ xanh mát',
            'Thưởng thức ly cà phê sữa đá hay tách trà thảo mộc thanh mát',
            'Ghi chép hành trình hoặc trò chuyện ấm cúng cùng bạn bè'
          ]
        }
      ],
      tips: [
        'Nên đặt khách sạn sớm. Với spa, hãy xem đánh giá uy tín và đặt lịch trước để tránh phải chờ đợi.',
        'Luôn bù nước cho cơ thể. Nghỉ ngơi chất lượng giúp hành trình khám phá Sài Gòn trọn vẹn hơn.'
      ],
      leftImgDesc: 'Nghỉ dưỡng tinh tế tại khách sạn boutique',
      rightStack: [
        'Gội đầu thảo dược thư giãn',
        'Massage cổ truyền phục hồi thể lực',
        'Thưởng trà tại quán ẩn mình'
      ]
    },
    food: {
      title: 'Cẩm Nang Ẩm Thực Sài Gòn',
      intro: 'Toàn bộ cẩm nang ẩm thực Sài Gòn đã được tổng hợp, bổ sung giờ hoạt động chính xác và tinh chỉnh giao diện đồng bộ, dễ nhìn.',
      categories: [
        {
          title: 'Phở Sài Gòn',
          emoji: '🍜',
          quote: '“Phở Sài Gòn đặc trưng bởi vị ngọt đậm đà của nước hầm xương bò kèm đĩa rau thơm phong phú như húng quế, ngò gai và dùng kèm tương đen, tương đỏ.”',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (Quận 3)',
              sub: 'Thương hiệu lâu đời lọt danh sách Michelin Bib Gourmand',
              desc: 'Cực kỳ nổi tiếng với du khách quốc tế nhờ hương vị nước dùng bò đậm đà ngọt xương chuẩn vị Nam Bộ kết hợp đĩa rau thơm và quẩy giòn rụm.',
              addr: '260C Pasteur, Phường 8, Quận 3',
              hours: '06:00 - 22:30',
              price: '90.000đ - 115.000đ / tô'
            },
            {
              name: 'Phở Việt Nam (Quận 1)',
              sub: 'Đạt danh hiệu Michelin Selected',
              desc: 'Tự làm bánh phở tươi tại chỗ; nổi tiếng với Phở thố đá kết hợp bò Wagyu giữ nước dùng nóng hổi thơm ngon.',
              addr: '14 Phạm Hồng Thái, Phường Bến Thành, Quận 1',
              hours: '06:00 - 03:00 (sáng hôm sau)',
              price: '90.000đ - 350.000đ / tô'
            },
            {
              name: 'Phở Dậu (Quận 3)',
              sub: 'Hương vị Nam Định xưa suốt hơn nửa thế kỷ',
              desc: 'Phở Bắc cổ điển không rau giá, nước dùng bò trong thanh nguyên bản mang hương vị Nam Định xưa suốt hơn nửa thế kỷ.',
              addr: 'Cư xá 288, Hẻm 288M1 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu, Quận 3',
              hours: '06:00 - 12:00 (Chỉ bán buổi sáng)',
              price: '80.000đ - 110.000đ / tô'
            },
            {
              name: 'Phở Lệ (Quận 5)',
              sub: 'Đạt chuẩn Michelin Selected',
              desc: 'Nước dùng béo thơm phong cách miền Nam; thịt bò tái nạm mềm thơm và bò viên giòn dai nổi tiếng.',
              addr: '413-415 Nguyễn Trãi, Phường 7, Quận 5',
              hours: '06:00 - 00:00 (Nửa đêm)',
              price: '85.000đ - 110.000đ / tô'
            },
            {
              name: 'Phở Phú Vương (Quận 1)',
              sub: 'Phở gia truyền thơm nức vị thảo mộc',
              desc: 'Thực đơn phong phú với tái, nạm, gầu, gân, bò viên. Nước dùng thanh ngọt đượm hương thảo mộc tự nhiên.',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, Quận 1',
              hours: '06:00 - 23:00',
              price: '75.000đ - 100.000đ / tô'
            }
          ]
        },
        {
          title: 'Bánh Mì Sài Gòn',
          emoji: '🥖',
          quote: '“Bánh mì Sài Gòn nổi tiếng thế giới nhờ lớp vỏ giòn rụm kết hợp hài hòa cùng pate gan béo ngậy, bơ tươi, các loại thịt nguội và đồ chua.”',
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (Quận 1)',
              sub: 'Vua bánh mì Sài Gòn',
              desc: 'Ổ siêu to (gần 0.5kg) ngập nhân chả, thịt nguội, patê béo ngậy; thích hợp ăn đôi.',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, Quận 1',
              hours: '11:00 - 21:00',
              price: '65.000đ - 70.000đ / ổ'
            },
            {
              name: 'Bánh Mì Bảy Hổ (Quận 1)',
              sub: 'Đạt chuẩn Michelin Bib Gourmand',
              desc: 'Xe bánh mì cổ hơn 80 năm nổi tiếng với patê và xá xíu gia truyền làm nóng tại chỗ, vị thanh nhẹ.',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, Quận 1',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20.000đ - 35.000đ / ổ'
            },
            {
              name: 'Bánh Mì Hồng Hoa (Quận 1)',
              sub: 'Đạt chuẩn Michelin Selected',
              desc: 'Gần chợ Bến Thành. Bánh mì nướng giòn liên tục; nhân đa dạng từ thịt nguội, xá xíu đến heo quay da giòn.',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, Quận 1',
              hours: '05:30 - 21:30',
              price: '30.000đ - 50.000đ / ổ'
            },
            {
              name: 'Bánh Mì Như Lan (Quận 1)',
              sub: 'Thương hiệu ẩm thực lâu đời hơn 50 năm',
              desc: 'Bánh mì vỏ giòn xốp kết hợp pate béo ngậy, chả lụa, xá xíu tươi ngon, nằm ngay sát tháp Bitexco.',
              addr: '50 Hàm Nghi, P. Bến Nghé, Quận 1',
              hours: '05:00 - 23:00',
              price: '35.000đ - 60.000đ / ổ'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (Quận 3)',
              sub: 'Nơi khởi nguồn bánh mì chảo từ năm 1958',
              desc: 'Món ăn sáng hoài cổ phục vụ chảo ốp la nóng hổi kèm patê, chả lụa, xúc xích và hành tây ăn cùng bánh mì giòn.',
              addr: '53 Cao Thắng, Phường 3, Quận 3',
              hours: '06:00 - 11:00 (Chỉ bán buổi sáng)',
              price: '50.000đ - 70.000đ / phần'
            }
          ]
        },
        {
          title: 'Cà Phê Sài Gòn',
          emoji: '☕',
          quote: '“Từng được tờ New York Times bình chọn là một trong những món cà phê ngon nhất thế giới, Cà phê sữa đá Sài Gòn quyện hòa giữa vị đắng đậm đà và sữa đặc béo ngậy.”',
          restaurants: [
            {
              name: 'Cộng Cà Phê',
              sub: 'Phong cách hoài cổ thời bao cấp',
              desc: 'Món ăn khách nhất: Cà phê cốt dừa béo ngậy. Chi nhánh: 26 Lý Tự Trọng | 127 Bùi Viện | Bờ kè Trường Sa.',
              addr: 'Nhiều chi nhánh tại trung tâm Quận 1',
              hours: '07:00 - 23:00 (Tùy chi nhánh)',
              price: '40.000đ - 75.000đ'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng',
              sub: 'Quán không ngủ mở cửa 24/7 suốt hơn 70 năm',
              desc: 'Khách trải nghiệm xem pha cà phê bằng vợt trên bếp than củi và ngồi ghế súp vỉa hè đầy độc đáo.',
              addr: '330/2 Phan Đình Phùng, P.1, Q. Phú Nhuận',
              hours: 'Mở cả ngày (24/7)',
              price: '15.000đ - 25.000đ'
            },
            {
              name: 'Cà Phê Vy (Quận 1)',
              sub: 'Cà phê ngắm phố điển hình',
              desc: 'Khách ngồi ghế đẩu gỗ tràn ra vỉa hè; vị cà phê đậm đặc chuẩn gu Sài Gòn xưa.',
              addr: '90 Nguyễn Du, P. Bến Nghé, Quận 1',
              hours: '06:00 - 23:00',
              price: '30.000đ - 50.000đ'
            },
            {
              name: 'Cheo Leo Café (Quận 3)',
              sub: 'Quán cà phê vợt cổ nhất Sài Gòn từ năm 1938',
              desc: 'Ẩn mình trong căn nhà cổ góc hẻm, lưu giữ phong cách pha cà phê bằng siêu đất và màng lọc vải truyền thống.',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, Quận 3',
              hours: '05:15 - 22:00',
              price: '20.000đ - 35.000đ'
            },
            {
              name: 'The Workshop Coffee (Quận 1)',
              sub: 'Tiệm cà phê Specialty đầu tiên tại Sài Gòn',
              desc: 'Tầng 2 chung cư cổ với phong cách thiết kế công nghiệp, chuyên các dòng hạt cà phê hảo hạng thủ công.',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, Quận 1',
              hours: '08:00 - 21:00',
              price: '65.000đ - 120.000đ'
            }
          ]
        },
        {
          title: 'Cơm Tấm Sài Gòn',
          emoji: '🍛',
          quote: '“Từ món ăn tiết kiệm của người nông dân làm từ hạt gạo gãy, Cơm Tấm đã vươn mình thành đặc sản biểu tượng của Sài Gòn với miếng sườn nướng mật ong thơm phức.”',
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (Phú Nhuận)',
              sub: 'Đạt chuẩn Michelin Bib Gourmand',
              desc: 'Sườn nướng mật ong siêu to khổng lồ che kín đĩa cơm, cháy cạnh thơm phức và mọng nước.',
              addr: '84 Đ. Đặng Văn Ngữ, P.10, Q. Phú Nhuận',
              hours: '07:00 - 21:30',
              price: '70.000đ - 140.000đ'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (Quận 1)',
              sub: 'Thương hiệu lâu đời từ trước năm 1975',
              desc: 'Thực đơn phong phú hàng chục món; sườn cắt mỏng dễ ăn, ướp ngũ vị hương rất thơm. Không gian rộng rãi.',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, Quận 1',
              hours: '06:00 - 21:00',
              price: '60.000đ - 110.000đ'
            },
            {
              name: 'Cơm Tấm Mộc (Quận 1)',
              sub: 'Thương hiệu cơm tấm văn phòng hiện đại, chuẩn vị và sạch sẽ',
              desc: 'Không gian mộc mạc tinh tế mang hương vị truyền thống chuẩn gu. Món sườn nướng mật ong mềm thơm, đậm đà được trình bày vô cùng sạch sẽ, ngon mắt.',
              addr: '85 Lý Tự Trọng, Bến Thành, Quận 1',
              hours: '08:00 - 21:30',
              price: '45.000đ - 90.000đ'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (Quận 1)',
              sub: 'Nổi tiếng với miếng sườn cốt lết tảng dày giòn ngọt',
              desc: 'Khúc sườn nướng than mọng nước, tẩm ướp đậm đà khó cưỡng, được đánh giá là một trong những đĩa cơm tấm đỉnh nhất.',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, Quận 1',
              hours: '06:30 - 15:00',
              price: '120.000đ - 180.000đ'
            },
            {
              name: 'Cơm Tấm Đêm Kiều Giang (Quận 1)',
              sub: 'Điểm hẹn cơm tấm đêm đậm đà truyền thống',
              desc: 'Phục vụ sườn nướng ướp mật ong, chả trứng, bì giòn thơm phức, là lựa chọn ẩm thực ăn đêm chất lượng.',
              addr: '139 Nguyễn Trãi, P. Bến Thành, Quận 1',
              hours: '06:00 - 02:00 (sáng hôm sau)',
              price: '50.000đ - 95.000đ'
            }
          ]
        },
        {
          title: 'Khu Tổ Hợp Ẩm Thực',
          emoji: '🏢',
          quote: '“Trải nghiệm các khu tổ hợp ẩm thực sầm uất đa dạng, từ trung tâm thương mại cao cấp, ngôi chợ biểu tượng trăm tuổi đến các căn chung cư nghệ thuật.”',
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (B2)',
              sub: 'Tổ hợp ẩm thực hội tụ Á - Âu - Nhật',
              desc: 'Sushi Nakajima Suisan, mì Baikohken Udon, Tonkatsu Ito, Yamazaki, kem matcha Azabu Sabo; Home Food, Blue Chilli, Katinat, Maison Marou.',
              addr: '65 Lê Lợi, P. Bến Nghé, Quận 1',
              hours: '09:30 - 21:30 (Cuối tuần 22:00)',
              price: '30.000đ - 250.000đ'
            },
            {
              name: 'Khu ẩm thực Chợ Bến Thành (Quận 1)',
              sub: 'Thánh địa ẩm thực truyền thống biểu tượng',
              desc: 'Đầy đủ các đặc sản từ bún mắm, gỏi cuốn, chè đến hải sản tươi sống. Sau 19:00 chuyển thành chợ đêm náo nhiệt.',
              addr: 'Đường Lê Lợi, P. Bến Thành, Quận 1',
              hours: '07:00 - 19:00 (Chợ đêm sau 19:00)',
              price: '40.000đ - 200.000đ'
            },
            {
              name: 'Chung cư 42 Nguyễn Huệ (Quận 1)',
              sub: 'Khu tổ hợp đứng độc đáo đầy tính nghệ thuật',
              desc: 'Hành lang chung cư cũ cải tạo thành hàng chục quán cà phê view ôm trọn phố đi bộ, tiệm trà và nhà hàng đầy phong cách.',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, Quận 1',
              hours: '08:00 - 22:30 (Tùy từng tiệm)',
              price: '40.000đ - 300.000đ'
            },
            {
              name: 'Phố Ẩm Thực Vĩnh Khánh (Quận 4)',
              sub: 'Phố ốc & hải sản đêm sôi động nhất Sài Gòn',
              desc: 'Trải nghiệm văn hóa ăn nhậu vỉa hè với vô số món ốc xào bơ tỏi, nướng mỡ hành, lẩu hải sản phục vụ xuyên đêm.',
              addr: 'Đường Vĩnh Khánh, Phường 8, Quận 4',
              hours: '16:00 - 01:00 (sáng hôm sau)',
              price: '50.000đ - 300.000đ'
            },
            {
              name: 'Phố Đi Bộ Bùi Viện (Quận 1)',
              sub: 'Trung tâm giải trí & ẩm thực đường phố không ngủ',
              desc: 'Nơi tập trung các món nướng xiên que, bia hơi vỉa hè, âm nhạc sống động và hàng loạt nhà hàng đa quốc gia.',
              addr: 'Phố Bùi Viện, P. Phạm Ngũ Lão, Quận 1',
              hours: '18:00 - 04:00 (sáng hôm sau)',
              price: '30.000đ - 250.000đ'
            }
          ]
        }
      ]
    },
    culture: {
    title: 'Văn Hóa & Điểm Check-In',
    intro: 'Khám phá chiều sâu lịch sử qua những công trình Pháp cổ kính, bảo tàng ý nghĩa, nét đẹp tâm linh linh thiêng, những công viên xanh mát và nhịp đập sôi động của Sài Gòn hiện đại.',
    categories: {
      heritage: 'Di sản & Lịch sử',
      spiritual: 'Tâm linh & Tôn giáo',
      modern: 'Đô thị & Trải nghiệm',
      nature: 'Thiên nhiên & Công viên'
    },
    items: [
      {
        category: 'heritage',
        name: 'Bưu điện Trung tâm Sài Gòn',
        sub: 'Kiến trúc Phục Hưng tuyệt mỹ hơn 130 năm tuổi',
        desc: 'Thiết kế bởi Gustave Eiffel với mái vòm sắt uốn cong tinh xảo và các bốt điện thoại gỗ cổ kính. Nơi lưu giữ ký ức bưu chính đô thị xưa giữa lòng Sài Gòn.',
        addr: '2 Công xã Paris, Bến Nghé, Quận 1',
        hours: '07:30 - 18:00',
        price: 'Miễn phí',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: 'Dinh Độc Lập',
        sub: 'Chứng nhân lịch sử thống nhất đất nước',
        desc: 'Công trình kiến trúc hiện đại độc đáo thiết kế bởi KTS Ngô Viết Thụ. Nơi đây từng là phủ tổng thống chế độ cũ và ghi dấu khoảnh khắc lịch sử trưa ngày 30/4/1975.',
        addr: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1',
        hours: '08:00 - 16:30',
        price: '65,000 VND',
        emoji: '🏰'
      },
      {
        category: 'heritage',
        name: 'Ủy ban Nhân dân TP.HCM',
        sub: 'Tòa đô sảnh mang phong cách Phục Hưng Pháp',
        desc: 'Tọa lạc tại đầu phố đi bộ Nguyễn Huệ, công trình nổi bật với kiến trúc vòm lộng lẫy và tháp chuông đài các. Buổi tối tòa nhà được thắp sáng rực rỡ bởi hệ thống đèn nghệ thuật.',
        addr: '86 Lê Thánh Tôn, Bến Nghé, Quận 1',
        hours: 'Tham quan bên ngoài / 24/7',
        price: 'Miễn phí',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: 'Nhà hát Thành phố',
        sub: 'Cái nôi nghệ thuật cổ điển Pháp',
        desc: 'Nhà hát cổ kính được trang trí hoa văn đắp nổi cầu kỳ theo phong cách "mỹ thuật mới" (Flamboyant). Là trung tâm biểu diễn các chương trình nghệ thuật đỉnh cao như À Ố Show.',
        addr: '7 Công trường Lam Sơn, Bến Nghé, Quận 1',
        hours: 'Tùy lịch biểu diễn',
        price: 'Vé theo chương trình',
        emoji: '🎭'
      },
      {
        category: 'heritage',
        name: 'Bảo tàng Chứng tích Chiến tranh',
        sub: 'Góc nhìn chân thực về chiến tranh Việt Nam',
        desc: 'Bảo tàng lịch sử chuyên đề trưng bày hàng ngàn tư liệu, hiện vật độc bản và vũ khí quân sự hạng nặng, truyền tải thông điệp mạnh mẽ về hòa bình và nghị lực vượt qua đau thương.',
        addr: '28 Võ Văn Tần, Võ Thị Sáu, Quận 3',
        hours: '07:30 - 17:30',
        price: '40,000 VND',
        emoji: '🛡️'
      },
      {
        category: 'heritage',
        name: 'Bảo tàng Lịch sử TP.HCM',
        sub: 'Dòng chảy lịch sử phương Nam hàng ngàn năm',
        desc: 'Công trình kiến trúc Đông Dương độc đáo nằm kề Thảo Cầm Viên. Nơi trưng bày bộ sưu tập hiện vật quý giá từ thời tiền sử, văn hóa Óc Eo, Chămpa đến triều Nguyễn.',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '08:00 - 11:30 | 13:00 - 17:00',
        price: '40,000 VND',
        emoji: '📜'
      },
      {
        category: 'heritage',
        name: 'Bảo tàng Mỹ thuật TP.HCM',
        sub: 'Không gian nghệ thuật lãng mạn và cổ kính',
        desc: 'Từng là dinh thự của gia tộc đại phú hào gốc Hoa Hứa Bổn Hòa (Chú Hỏa). Tòa dinh thự màu vàng nổi tiếng với những ô cửa kính màu châu Âu, hành lang lộng gió và thang máy cổ nhất Sài Gòn.',
        addr: '97A Phó Đức Chính, Nguyễn Thái Bình, Quận 1',
        hours: '08:00 - 17:00',
        price: '30,000 VND',
        emoji: '🎨'
      },
      {
        category: 'spiritual',
        name: 'Nhà thờ Đức Bà Sài Gòn',
        sub: 'Vương cung thánh đường uy nghiêm cổ kính',
        desc: 'Biểu tượng tôn giáo lịch sử xây dựng bằng gạch đỏ Marseille không bám rêu mốc, kết hợp tháp chuông đôi cao vút. Một kiệt tác kiến trúc Romanesque đặc trưng giữa lòng thành phố.',
        addr: '1 Công xã Paris, Bến Nghé, Quận 1',
        hours: 'Đang trùng tu (Tham quan bên ngoài)',
        price: 'Miễn phí',
        emoji: '⛪'
      },
      {
        category: 'spiritual',
        name: 'Nhà thờ Tân Định',
        sub: 'Nhà thờ màu hồng cổ tích lãng mạn',
        desc: 'Công trình nổi bật với màu sơn hồng tươi tắn độc nhất vô nhị, giao thoa giữa kiến trúc Gothic và Baroque cổ kính. Điểm check-in thơ mộng siêu nổi tiếng thu hút du khách toàn cầu.',
        addr: '289 Hai Bà Trưng, Võ Thị Sáu, Quận 3',
        hours: '08:00 - 17:30',
        price: 'Miễn phí',
        emoji: '💒'
      },
      {
        category: 'spiritual',
        name: 'Chùa Ngọc Hoàng',
        sub: 'Ngôi chùa cầu con và cầu duyên linh thiêng',
        desc: 'Ngôi chùa cổ kính mang đậm kiến trúc Trung Hoa với những bức tượng điêu khắc bằng bồi giấy tinh xảo. Từng đón tiếp Tổng thống Mỹ Barack Obama ghé thăm và dâng hương năm 2016.',
        addr: '73 Mai Thị Lựu, Đa Kao, Quận 1',
        hours: '07:00 - 18:00',
        price: 'Miễn phí',
        emoji: '🛕'
      },
      {
        category: 'spiritual',
        name: 'Chùa Vĩnh Nghiêm',
        sub: 'Danh lam Phật giáo quy mô bậc nhất Nam Bộ',
        desc: 'Sở hữu ngôi tháp đá 7 tầng khổng lồ chạm khắc tinh xảo. Chùa mang kiến trúc Phật giáo truyền thống miền Bắc nhưng được xây dựng bằng vật liệu bê tông cốt thép hiện đại bền bỉ.',
        addr: '339 Nam Kỳ Khởi Nghĩa, Võ Thị Sáu, Quận 3',
        hours: '07:00 - 20:00',
        price: 'Miễn phí',
        emoji: '⛩️'
      },
      {
        category: 'spiritual',
        name: 'Chùa Bà Thiên Hậu (Chợ Lớn)',
        sub: 'Nét văn hóa tâm linh lâu đời của người Hoa Gia Định',
        desc: 'Tọa lạc tại khu phố cổ Chợ Lớn nhộn nhịp. Chùa cuốn hút bởi những mảng phù điêu gốm tinh xảo trên mái, những vòng hương lớn treo lơ lửng giữa khoảng giếng trời bảng lảng khói bay.',
        addr: '710 Nguyễn Trãi, Phường 11, Quận 5',
        hours: '06:30 - 16:30',
        price: 'Miễn phí',
        emoji: '🏮'
      },
      {
        category: 'modern',
        name: 'Landmark 81',
        sub: 'Đỉnh cao vươn tầm thế giới của Việt Nam',
        desc: 'Tòa nhà cao nhất Việt Nam mô phỏng hình ảnh bó tre truyền thống kiên cường. Tích hợp trung tâm mua sắm sầm uất, các nhà hàng sang trọng và đài quan sát ngắm toàn cảnh Sài Gòn từ mây xanh.',
        addr: '720A Điện Biên Phủ, Phường 22, Bình Thạnh',
        hours: '09:00 - 22:00',
        price: 'Vào TTTM miễn phí',
        emoji: '🏙️'
      },
      {
        category: 'modern',
        name: 'Ga Metro Bến Thành',
        sub: 'Biểu tượng hạ tầng giao thông đô thị hiện đại',
        desc: 'Trạm ga ngầm trung tâm được thiết kế hiện đại với giếng trời khổng lồ lấy ánh sáng tự nhiên (Toplight). Điểm check-in tương lai độc đáo thể hiện nhịp sống Sài Gòn thế kỷ 21.',
        addr: 'Quảng trường Quách Thị Trang, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: 'Theo giá vé tàu',
        emoji: '🚇'
      },
      {
        category: 'modern',
        name: 'Phố đi bộ Nguyễn Huệ về đêm',
        sub: 'Quảng trường rực rỡ và lộng gió bên sông',
        desc: 'Mỗi tối quảng trường đi bộ biến thành một bức tranh đầy màu sắc với nhạc nước, ánh sáng và gió sông mát rượi từ phía bến Bạch Đằng thổi vào.',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '24/7 (Sôi động từ 18:00)',
        price: 'Miễn phí',
        emoji: '🌃'
      },
      {
        category: 'modern',
        name: 'Biểu diễn đường phố Nguyễn Huệ',
        sub: 'Tụ điểm giao lưu nghệ thuật của giới trẻ Sài Thành',
        desc: 'Nơi tụ hội của các ban nhạc tự do, nhóm nhảy đường phố và những màn trình diễn nghệ thuật ngẫu hứng đầy sức sống, mang đậm hơi thở phóng khoáng của thế hệ trẻ.',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: 'Tối thứ Bảy & Chủ Nhật hàng tuần',
        price: 'Miễn phí',
        emoji: '🎸'
      },
      {
        category: 'modern',
        name: 'Phố Tây Bùi Viện',
        sub: 'Thiên đường giải trí về đêm không ngủ',
        desc: 'Con phố ẩm thực và vui chơi giải trí sôi động nhất về đêm. Những âm điệu EDM cuồng nhiệt hòa quyện cùng ly bia mát lạnh bên bạn bè quốc tế tạo nên một trải nghiệm vô cùng phóng khoáng.',
        addr: 'Đường Bùi Viện, Phạm Ngũ Lão, Quận 1',
        hours: '19:00 - 02:00 (Sầm uất nhất cuối tuần)',
        price: 'Miễn phí vào phố',
        emoji: '🍻'
      },
      {
        category: 'modern',
        name: 'Chợ hoa đêm Hồ Thị Kỷ',
        sub: 'Thế giới hoa rực rỡ sắc màu không bao giờ tắt đèn',
        desc: 'Khu chợ đầu mối hoa tươi lớn nhất thành phố hoạt động nhộn nhịp nhất về đêm và rạng sáng. Bạn có thể dạo bước ngắm hàng trăm loài hoa khoe sắc và thưởng thức thiên đường ăn vặt nức tiếng kề bên.',
        addr: 'Hẻm 52 Hồ Thị Kỷ, Phường 1, Quận 10',
        hours: 'Mở cửa cả ngày (Đẹp nhất từ 00:00 - 03:00)',
        price: 'Miễn phí',
        emoji: '🌸'
      },
      {
        category: 'modern',
        name: 'Nhà hát Múa rối nước Rồng Vàng',
        sub: 'Nghệ thuật múa rối nước dân gia độc đáo',
        desc: 'Thưởng thức những vở diễn cổ truyền đặc sắc trên mặt nước trong tiếng nhạc cụ dân tộc réo rắt. Trải nghiệm văn hóa lúa nước Việt Nam đầy sinh động và thú vị.',
        addr: '55B Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: 'Theo suất diễn (Thường từ 17:00)',
        price: 'Khoảng 150,000 VND',
        emoji: '🎭'
      },
      {
        category: 'modern',
        name: 'Đi xe máy khám phá thành phố',
        sub: 'Trải nghiệm nhịp sống Sài Gòn chân thực nhất',
        desc: 'Ngồi sau xe máy luồn lách qua những con hẻm nhỏ hẹp, ngắm nhìn dòng xe cộ hối hả và cảm nhận làn gió mát lạnh lướt qua dưới ánh đèn đường. Đó là cách chân thực nhất để chạm vào linh hồn phố thị.',
        addr: 'Khắp các quận trung tâm Sài Gòn',
        hours: 'Linh hoạt cả ngày và đêm',
        price: 'Thay đổi tùy theo dịch vụ tour',
        emoji: '🛵'
      },
      {
        category: 'modern',
        name: 'Xe buýt 2 tầng ngắm phố thị',
        sub: 'Trải nghiệm ngắm toàn cảnh thành phố từ tầng cao',
        desc: 'Hành trình xe buýt mui trần đưa bạn lướt qua những công trình biểu tượng rực rỡ dưới ánh đèn đêm, mang lại một góc nhìn toàn cảnh lãng mạn và thảnh thơi tuyệt đối.',
        addr: 'Điểm đón đầu: Bưu điện Trung tâm, Quận 1',
        hours: '09:00 - 22:30',
        price: '150,000 - 300,000 VND',
        emoji: '🚌'
      },
      {
        category: 'nature',
        name: 'Địa đạo Củ Chi',
        sub: 'Mê cung kỳ vĩ trong lòng đất',
        desc: 'Hệ thống phòng thủ ngầm dài hơn 250km được đào hoàn toàn bằng tay trong thời kỳ kháng chiến. Một kỳ tích kiên cường đầy tự hào nằm ở ngoại thành yên bình.',
        addr: 'Tỉnh lộ 15, Phú Mỹ Hưng, Huyện Củ Chi (Cách trung tâm 60km)',
        hours: '07:00 - 17:00',
        price: '35,000 VND (VN) | 125,000 VND (Quốc tế)',
        emoji: '🌴'
      },
      {
        category: 'nature',
        name: 'Khu sinh thái rừng ngập mặn Cần Giờ',
        sub: 'Lá phổi xanh nguyên sinh ven biển',
        desc: 'Khu dự trữ sinh quyển thế giới hoang sơ với những cánh rừng đước ngập mặn bạt ngàn, đảo khỉ ngộ nghĩnh tinh nghịch và khu bảo tồn cá sấu đầm lầy kịch tính.',
        addr: 'Đường Rừng Sác, xã An Thới Đông, Huyện Cần Giờ',
        hours: '07:30 - 17:00',
        price: 'Thay đổi tùy điểm tham quan',
        emoji: '🐊'
      },
      {
        category: 'nature',
        name: 'Thảo Cầm Viên Sài Gòn',
        sub: 'Sở thú lâu đời nhất Việt Nam hơn 160 năm tuổi',
        desc: 'Vườn bách thảo thanh bình nằm giữa trung tâm với hàng ngàn cây cổ thụ rợp bóng mát cùng thế giới động vật trù phú. Điểm dã ngoại xanh mát tuyệt vời cho mọi lứa tuổi.',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '07:00 - 18:30',
        price: '60,000 VND',
        emoji: '🦁'
      },
      {
        category: 'nature',
        name: 'Công viên Tao Đàn',
        sub: 'Khu rừng nguyên sinh thu nhỏ giữa lòng quận 1',
        desc: 'Lá phổi xanh rợp bóng những hàng sao đen trăm tuổi thẳng tắp. Buổi sáng nơi đây rộn ràng tiếng chim hót líu lo và buổi trà đàm, tập dưỡng sinh thư thái của các cụ già neo bóng thời gian.',
        addr: 'Đường Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: 'Miễn phí',
        emoji: '🌳'
      },
      {
        category: 'nature',
        name: 'Công viên 23/9',
        sub: 'Không gian xanh đón gió mát lành của khu phố Tây',
        desc: 'Nằm nối liền chợ Bến Thành và phố Phạm Ngũ Lão. Công viên sở hữu bãi cỏ xanh trải dài, khu chợ ngầm Sense Market độc dáo và là nơi giao lưu ngôn ngữ rộn ràng giữa sinh viên và du khách.',
        addr: 'Đường Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1',
        hours: 'Mở cửa cả ngày',
        price: 'Miễn phí',
        emoji: '🍃'
      }
    ]
  },

    shopping: {
      title: 'Mua Sắm & Quà Lưu Niệm',
      intro: 'Từ những ngôi chợ truyền thống sầm uất gắn liền với lịch sử thành phố cho đến các tổ hợp mua sắm nội địa cực chất của giới trẻ.',
      items: [
        {
          name: 'Chợ Bến Thành',
          sub: 'Biểu tượng thương mại hơn 100 năm tuổi',
          desc: 'Ngôi chợ mang tính biểu tượng lịch sử. Nơi bạn tìm thấy mọi thứ từ đồ lưu niệm thủ công mỹ nghệ, nón lá, cà phê hạt, trà sen cho đến các sạp vải vóc may mặc. Hãy thử tài mặc cả (thương lượng giá) khi mua sắm tại đây!',
          addr: 'Đường Lê Lợi, Phường Bến Thành, Quận 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: 'Chợ Bình Tây (Chợ Lớn)',
          sub: 'Khu chợ sỉ cổ kính mang nét Trung Hoa xưa',
          desc: 'Ngôi chợ có lối kiến trúc Á Đông cổ kính, độc đáo với mái ngói chồng diềm tại trung tâm Chợ Lớn. Nơi đây chuyên bán sỉ các mặt hàng khô, gia vị, bánh kẹo, đồ lưu niệm với mức giá cực kỳ cạnh tranh và nhịp sống giao thương hối hả.',
          addr: '57A Tháp Mười, Phường 2, Quận 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground',
          sub: 'Tổ hợp thời trang local brand dưới lòng đất',
          desc: 'Thánh địa mua sắm cực chất của giới trẻ Sài Gòn, quy tụ hàng chục thương hiệu thiết kế thời trang đường phố (Local Brands) Việt Nam độc đáo nhất. Phong cách cá tính, hiện đại và vô cùng sáng tạo.',
          addr: '26 Lý Tự Trọng, Bến Nghé, Quận 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Trạm Dừng Chân Văn Hóa Lục Lam',
      subtitle: 'Trạm Dừng Chân Lục Lam',
      intro: 'Nơi giao thoa giữa tinh hoa trà thảo mộc Việt Nam, cà phê hạt mộc chất lượng và nghệ thuật thủ công truyền thống. Một khoảng lặng an yên giữa lòng Sài Gòn nhộn nhịp.',
      aboutHeading: 'Về Lục Lam',
      aboutText: 'Ẩn mình tĩnh lặng giữa lòng phố thị, Lục Lam là trạm dừng chân văn hóa kết tinh từ tình yêu dành cho thảo mộc Việt, cà phê sạch và thủ công mỹ nghệ nước nhà. Với phong cách thiết kế Đông Dương (Indochine) hoài cổ, chúng tôi mong muốn mang lại trải nghiệm thư thái, nuôi dưỡng các giác quan và giới thiệu vẻ đẹp hiếu khách của con người Việt Nam đến bạn bè quốc tế.',
      menuHeading: 'Sản phẩm trứ danh',
      menuItems: [
        {
          name: 'Trà Red Lava (Nham Thạch Đỏ)',
          desc: 'Sự kết hợp rực rỡ giữa hoa atiso đỏ (hibiscus), cam lát sấy và quế thơm. Vị chua thanh, nồng nã, giàu vitamin C giúp xua tan mệt mỏi hành trình.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Trà Velvet Rose (Hồng Nhung)',
          desc: 'Nụ hoa hồng Pháp chọn lọc kết hợp cùng nụ nhài và cúc la mã. Hương thơm nồng nàn quyến rũ, nuôi dưỡng làn da và giúp tâm trí thư thái.',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Trà Violet Jasmine (Lài Tím)',
          desc: 'Trà xanh hữu cơ ướp hoa lài tự nhiên tinh khiết. Hương hoa thanh tao quyến rũ giúp tâm trí nhẹ nhàng, tươi mát sảng khoái.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Trà Golden Peach (Đào Hoàng Kim)',
          desc: 'Thảo mộc vị đào hoàng kim dịu ngọt hòa quyện cùng mật ong thiên nhiên. Vị ngọt hậu thanh mát, đượm hương trái cây nhiệt đới.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Trà Zen Relaxing (Thư Giãn Định Tâm)',
          desc: 'Sự kết hợp dịu nhẹ giữa hoa cúc La Mã, tâm sen và oải hương. Liệu pháp tự nhiên giảm căng thẳng, xoa dịu thần kinh và mang lại giấc ngủ an lành.',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: 'Quà Tặng Đặc Quyền Cho Du Khách',
      voucherDesc: 'Quét mã QR hoặc xuất trình màn hình điện thoại này cho nhân viên khi thanh toán để nhận ngay ưu đãi: GIẢM 10% TRÊN TỔNG HÓA ĐƠN hoặc TẶNG 1 SET BÁNH ĐẬU XANH TRUYỀN THỐNG khi thưởng trà tại tiệm.',
      voucherBadge: 'Đặc Quyền O2O',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: 'Nhận Ưu Đãi Ngay',
      voucherClaimed: 'Đã áp dụng! Hãy đưa mã này cho nhân viên thu ngân.'
    },
    info: {
      title: 'Thông Tin Hữu Ích & Thiết Yếu',
      intro: 'Các thông tin liên lạc khẩn cấp, cơ sở y tế uy tín, điểm đổi ngoại tệ có tỉ giá tốt nhất và các mẹo thanh toán để bạn yên tâm dạo bước.',
      categories: [
        {
          title: 'Hỗ trợ khẩn cấp & Y tế du lịch',
          items: [
            { label: 'Bệnh viện Quốc tế FV (fv hospital)', detail: 'Lầu 3, Bitexco Financial Tower, 2 Hải Triều, Q1. Cấp cứu đa ngôn ngữ (Anh/Pháp/Nhật) 24/7. SĐT: (028) 3822 7878' },
            { label: 'Family Medical Practice', detail: '34 Lê Duẩn, Bến Nghé, Quận 1. Phòng khám quốc tế chất lượng cao hàng đầu, có phiên dịch viên tiếng Nhật/Trung. SĐT: (028) 3822 7848' },
            { label: 'Cảnh sát Du lịch (Tourist Police)', detail: '24-26 Pasteur, Quận 1. Tiếp nhận và xử lý các vấn đề của du khách quốc tế. SĐT: (028) 3824 4103' }
          ]
        },
        {
          title: 'Địa điểm đổi ngoại tệ uy tín (Tỉ giá tốt)',
          items: [
            { label: 'Tiệm Vàng Hà Tâm (Khu vực Bến Thành)', detail: '2 Nguyễn An Ninh, Phường Bến Thành, Quận 1. Địa chỉ đổi ngoại tệ vô cùng nổi tiếng với tỉ giá tốt nhất Sài Gòn, giao dịch nhanh chóng và chuyên nghiệp.' },
            { label: 'Tiệm Vàng Mai Vân', detail: 'Nằm đối diện tiệm Hà Tâm. Tỉ giá cạnh tranh tương đương, là lựa chọn thay thế lý tưởng khi tiệm Hà Tâm quá đông đúc.' }
          ]
        },
        {
          title: 'SIM điện thoại & Rút tiền ATM',
          items: [
            { label: 'Mạng di động khuyến nghị', detail: 'Nên chọn nhà mạng Viettel hoặc Vinaphone. Bạn có thể mua sim vật lý tại quầy sân bay hoặc cài đặt eSIM của Viettel để có sóng khỏe nhất toàn quốc.' },
            { label: 'Rút tiền và thanh toán thẻ', detail: 'Hầu hết các cửa hàng ở trung tâm đều chấp nhận thẻ Visa/Mastercard. Bạn có thể rút tiền Việt tại các ATM của Vietcombank, Techcombank, HSBC.' }
          ]
        }
      ]
    }
  },
  zh: {
    title: '西贡口袋指南',
    subtitle: '西贡漫步与独家款待指南',
    faq: [
      { q: '绿蓝（Lục Lam）在胡志明市的哪里？', a: '绿蓝位于{{address}}。' },
      { q: '绿蓝的营业时间是？', a: '每天营业，{{hours}}。' },
      { q: '在西贡怎样出行才安全？', a: '使用打车应用（{{apps}}），下单前就能看到价格。路边拦车请选择{{taxis}}，并确认打表。' },
      { q: '在西贡出行大概要花多少钱？', a: '摩托车短途约{{fareBike}}，汽车约{{fareCar}}。价格随天气和高峰时段浮动。' },
      { q: '滨城市场在哪里？', a: '位于胡志明市第一郡滨城坊。' },
      { q: '绿蓝有哪些茶？', a: '{{teas}}。价格自{{priceFrom}}起。' },
      { q: '这本指南有哪些语言版本？', a: '{{languages}}。' },
      { q: '摩托车很多的路口该怎么过？', a: '保持匀速慢慢走，不要停下也不要跑。骑手会预判你的路线，从你身后绕过去。' },
      { q: '在哪里可以买到绿蓝的茶？', a: '共{{storeCount}}家门店：{{stores}}。可拨打{{phone}}或发送邮件至{{email}}。' },
    ],
    contact: {
      heading: '联系绿蓝',
      stores: '门店一览',
      phone: '电话',
      email: '邮箱',
      office: '总部',
      licence: '营业执照号',
    },
    faqHeading: '자주 묻는 질문',
    brand: 'LỤC LAM',
    author: 'Lục Lam',
    pages: {
      cover: '封面',
      welcome: '前言',
      atmosphere: '街头氛围',
      transport: '安全出行',
      stay: '住宿与调理',
      food: '特色美食',
                culture: '文化底蕴 ＆ 地标打卡',
shopping: '特色购物',
      luclam: 'Lục Lam 体验',
      info: '实用信息'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: '西贡漫步与 Lục Lam 品牌独家款待指南',
      badge: '像本地人一样品味西贡 • 街头市井',
      scanMe: '扫码获取'
    },
    welcome: {
      heading: '充满活力的都市、\n悠久的历史、\n以及极其热情的人民。',
      p1: '西贡（胡志明市）是越南最具活力和魅力的经济与文化中心。这里的法国殖民时期建筑、举世闻名的街头美食、与永不停歇的都市活力完美交融。',
      p2: '这本精美的口袋指南旨在帮助首次到访及重温西贡的朋友，以最安全、充实且充满情怀的方式探索这座城市，收获一段令人难忘的难忘旅程。',
      highlight: '西贡伸出双臂，随时热烈欢迎您的到来！',
      videoTitle: '\\\\ 旅途影像 //',
      videoDesc: '通过精美真实的镜头，抢先领略西贡散步的独特魅力与风情！',
      coffeeTitle: '海盐咖啡 & 椰子咖啡',
      features: [
        { title: '热情的本地人', desc: '西贡人性格豪爽且乐于助人，总是带着温暖的微笑为您指路。' },
        { title: '美食的天堂', desc: '从经典的越南粉、法包到浓郁的冰奶咖啡，每一口都是西贡专属的极致味觉。' },
        { title: '历史与文化底蕴', desc: '古典的法式殖民建筑与现代摩天大楼交错，展现独特的历史沧桑感。' },
        { title: '便捷的交通网络', desc: '打车应用、摩托车及公交工具应有尽有，带您轻松穿梭大街小巷。' }
      ],
      advice: [
        '西贡阳光充沛，请务必准备帽子、太阳镜和防晒霜。',
        '请注意勤补水、适度休息，让您的漫步旅程始终保持活力。'
      ]
    },
    atmosphere: {
      description: '西贡是一座拥有奇妙对比的城市。古老的法式古典建筑与现代摩天大楼相邻，宁静的小巷隐藏在繁华的林荫大道后面。跟随我们推荐的三大特色街区，深度感受西贡最真实、最多彩的市井温度。',
      offlineMapTitle: '推荐离线地图',
      tipsTitle: '散步贴士',
      tipsDesc: '清晨在深巷咖啡馆消磨时光，午后漫步游览历史遗迹，夜晚沉浸于活力四射的街头大排档。西贡的每一个小时都有其独特的魅力。',
      districts: [
        {
          id: 'd1',
          name: '第1区 - 繁华心脏与浪漫法式历史',
          description: '西贡当之无愧的中心地带。这里汇集了最精致的法国殖民建筑群（红教堂、百年中央邮局、西贡歌剧院），与国际名牌精品街、极具情调的高档餐厅以及著名的滨城市场完美融合，是漫步的最佳起点。',
          highlights: ['漫步浪漫的同起街', '打卡百年中央邮局', '探访热闹非凡的滨城市场']
        },
        {
          id: 'd5',
          name: '第5区 - 华人文化区（堤岸 / Chợ Lớn）',
          description: '西贡华人社群世代繁衍的文化圣地，保留着极富年代感的中式传统风貌。这里拥有香火缭绕的古老寺庙（天后宫、温陵会馆）、挂满中文招牌的药材街，以及融合了闽粤风味的地道中式越式特色美食。',
          highlights: ['参拜天后宫（妈祖庙）', '漫步香气弥漫的药材街', '品尝哈尊权街的特色水饺']
        },
        {
          id: 'd3',
          name: '第3区 - 绿荫街区与复古文艺慢生活',
          description: '紧邻第1区，却拥有一份难得的宁静。一条条绿树成荫、落叶纷飞的幽静街道上，隐蔽着大量由旧式法式别墅改造而成的特色设计咖啡馆和艺术餐厅，是深受本地文艺青年和留学生喜爱的避暑宝地。',
          highlights: ['参观战争遗迹博物馆', '探访隐秘法式别墅咖啡馆', '打卡梦幻少女心的粉红教堂']
        }
      ],
      mapLabels: {
        title: '西贡漫步地图',
        sub: '点击相应区域即可查看详细攻略',
        airport: '新山一国际机场',
        d3: '第3区 (复古文艺与咖啡)',
        d1: '第1区 (浪漫繁华中心)',
        d5: '第5区 (堤岸华人生活圈)',
        river: '西贡河'
      },
      transportTip: '使用 Grab 或 Xanh SM 等应用出行更安全。'
    },
    transport: {
      heading: '安全出行指南',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: '西贡街头成百上千辆摩托车汇成的“铁流”可能会在最初让您望而生畏，但掌握了以下精妙的出行诀窍后，您就能像本地人一样安心、安全地畅游全城。',
      categories: [
        {
          id: 'apps',
          title: '手机打车应用（强烈推荐）',
          description: '价格透明、路线实时GPS定位，即使语言不通也完全不用担心被绕路或遭遇“宰客”。',
          options: [
            { name: 'Grab', desc: '东南亚最主流的打车神器。支持摩托打车（GrabBike）和汽车打车（GrabCar）。强烈建议出行前在手机上绑定好双币信用卡，实现无感付。' },
            { name: 'Xanh SM', desc: '越南首家全电动车（EV）高档打车服务。天蓝色车身，车内干净无异味，行驶平稳安静，司机均经过严格礼仪培训，体验极佳。' }
          ]
        },
        {
          id: 'taxis',
          title: '正规靠谱的传统出租车',
          description: '如果您需要在街头直接招手拦车，请认准以下两家知名的大型正规出租车品牌，并务必确认司机在起步时开启计价器（meter）。',
          options: [
            { name: 'Vinasun Taxi', desc: '白色车身，带有红绿条纹。西贡历史最悠久、最受信任的品牌，司机均穿着整齐的统一制服。' },
            { name: 'Mai Linh Taxi', desc: '醒目的全绿色车身。全越南连锁的大品牌，计价器管理严格，极少发生绕路和计价猫腻。' }
          ]
        },
        {
          id: 'crossing',
          title: '西贡过街的“黄金法则”',
          description: '在密集的摩托车洪流中过马路是一门充满惊险与默契的艺术，遵守以下原则即可化险为夷。',
          options: [
            { name: '保持匀速，切忌突然停下或奔跑', desc: '请保持缓慢、稳定的步速前进。摩托车司机会根据您的均速，提前预判您的轨迹并非常自然地从您身后绕行。' },
            { name: '眼神交流与轻柔手势', desc: '看着正朝您驶来的司机，并用手掌轻轻向下挥动示意，传达“我正在通过”的明确信号，车辆便会减速避让。' }
          ]
        }
      ],
      safetyTips: [
        '严禁在街头边走边玩手机，这极易成为飞车党的抢劫目标。若要查阅地图，请寻找店铺林立的安全人行道内侧，并面朝里站立。',
        '斜挎包请务必挂在马路内侧（远离车道的一侧），在步行或乘摩托车时，将挎包紧紧护在胸前。'
      ],
      popupDetails: [
        {
          title: 'Grab 使用建议',
          text: '建议在出发前完成Grab的安装、短信验证以及信用卡绑定。一旦抵达机场，您就可以立刻一键叫车直达酒店，享受公开透明的资费标准。'
        },
        {
          title: '提防山寨出租车',
          text: '在机场和各大景区周边，常停靠着山寨“Vinasun”或“Mai Linh”的克隆车，其涂装和文字相似度高达90%。上车前请仔细核对车身印刷的电话号码和司机的工牌。'
        },
        {
          title: '过马路切忌恐慌张望',
          text: '当迎面驶来大批车流时，突然大叫停下或者慌忙往回跑是最危险的。这会打乱摩托车司机的预判。请深吸一口气，保持自信匀速向前，车流会自然避开您。'
        }
      ],
      options: [
        { name: 'Grab Bike (摩托车)', desc: '最快且最省钱的出行方式，可以轻松穿过拥堵的街道。司机会提供头盔。', payment: 'App / 现金', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (汽车)', desc: '安全、凉爽且舒适的选择。适合4-7人的团体。', payment: 'App / 现金', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: '地铁 (城市轨道交通)', desc: '西贡首条城市轨道交通线，连接第1区和周边区域。', payment: '刷卡 / 现金', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: '传统出租车', desc: '如 Vinasun 和 Mai Linh 等正规大品牌，适合在路边直接招手拦车。', payment: '现金 / 刷卡', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: '估算价格表 (VND)',
      tableHeaders: ['出行方式', '1-2 公里', '3-5 公里', '5-10 公里', '支付方式'],
      tableNote: '* 实际价格可能会根据天气和高峰时段而有所变动。',
      pointsTitle: '出行要点',
      points: [
        '提前下载 Grab 和 Xanh SM 应用',
        '绑定信用卡以进行无现金支付',
        '招手拦车时只选择 Vinasun 或 Mai Linh'
      ],
      rideApps: '推荐打车应用'
    },
    stay: {
      heading: '住宿 ＆ 调理放松',
      subheading: 'Rejuvenate Your Senses',
      intro: '探索完活力西贡后，在宁静舒适的城市避风港中调理身心。享受高品质精品住宿与舒适水疗体验。',
      categories: [
        {
          title: '精品美学酒店',
          subtitle: '都市中的绿洲',
          bullets: [
            '入住经典百年法式建筑，感受复古印支风情',
            '在无边天台泳池畔，俯瞰璀璨霓虹与迷人夜景',
            '享受贴心的本土款待，体验充满艺术感的设计'
          ]
        },
        {
          title: '水疗 ＆ 草本洗头',
          subtitle: '彻底放松身心',
          bullets: [
            '体验纯天然新鲜草本的传统越式穴位按摩',
            '尝试风靡本地的草本洗头（含肩颈按摩）',
            '在幽静芳香的避世空间内，忘忘旅途劳顿'
          ]
        },
        {
          title: '避世茶饮 ＆ 咖啡',
          subtitle: '独享安静时光',
          bullets: [
            '探访隐于幽静小巷或老公寓里的复古咖啡馆',
            '品尝正宗越式冰奶咖啡或清热草本凉茶',
            '写下旅行手记，或与好友在此温馨畅聊'
          ]
        }
      ],
      tips: [
        '精品酒店建议提早预订。去水疗店前建议参考好评并提前约好。',
        '天气炎热请及时补水。良好的休息能让西贡之行更加愉快。'
      ],
      leftImgDesc: '在设计感精品酒店享受优雅居住',
      rightStack: [
        '草本洗发彻底放松头部',
        '传统草本按摩恢复活力',
        '深巷茶馆享受闲适时光'
      ]
    },
    food: {
      title: '西贡美食掌中宝',
      intro: '为您全方位盘点西贡最顶尖、最地道的代表性美食。更新了精准的营业时间，并优化了界面呈现。',
      categories: [
        {
          title: '西贡河粉',
          emoji: '🍜',
          quote: '“西贡河粉以清甜浓郁的牛骨汤底著称，食用时会搭配九层塔、刺芹等丰富香草，并蘸上特制甜面酱（黑酱）和辣酱。”',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (和粉-巴斯德)',
              sub: '荣获米其林必比登推介的半世纪老字号',
              desc: '名扬海内外的传奇粉店，拥有半世纪以上的历史，极其受国际游客喜爱。',
              addr: '260C Pasteur, Phường 8, 3区',
              hours: '06:00 - 22:30',
              price: '90,000 - 115,000 VND / 碗'
            },
            {
              name: 'Phở Việt Nam (越南粉-1区)',
              sub: '荣获米其林入选餐厅 (Michelin Selected)',
              desc: '坚持在店内手工现做新鲜河粉；其招牌“石锅和牛河粉”能锁住滚烫的汤汁与和牛的鲜嫩。',
              addr: '14 Phạm Hồng Thái, Phường Bến Thành, 1区',
              hours: '06:00 - 次日03:00',
              price: '90,000 - 350,000 VND / 碗'
            },
            {
              name: 'Phở Dậu (阿豆河粉)',
              sub: '半个多世纪历史的古法北越风味',
              desc: '经典的北越风味河粉，不加蔬菜和豆芽，主打清澈透明、原汁原味的传统牛骨清汤。',
              addr: 'Cư xá 288, Hẻm 288M1 Nam Kỳ Khởi Nghĩa, 3区',
              hours: '06:00 - 12:00 (仅限上午)',
              price: '80,000 - 110,000 VND / 碗'
            },
            {
              name: 'Phở Lệ (丽河粉)',
              sub: '荣获米其林入选餐厅 (Michelin Selected)',
              desc: '汤底浓郁香甜的南部风格河粉；牛肉鲜嫩多汁，自制牛肉丸香脆弹牙。',
              addr: '413-415 Nguyễn Trãi, Phường 7, 5区',
              hours: '06:00 - 24:00 (深夜)',
              price: '85,000 - 110,000 VND / 碗'
            },
            {
              name: 'Phở Phú Vương (富王河粉)',
              sub: '草本清香、祖传牛骨汤底名店',
              desc: '提供生牛肉、熟牛肉、牛腩、牛筋和牛肉丸等丰富搭配。汤底清甜回甘。',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, 1区',
              hours: '06:00 - 23:00',
              price: '75,000 - 100,000 VND / 碗'
            }
          ]
        },
        {
          title: '越南法包',
          emoji: '🥖',
          quote: '“西贡法包风靡全球，金黄酥脆的面包涂满香浓猪肝酱和优质黄油，夹入各式冷肉扎肉，再搭配酸甜爽口的腌萝卜防腻。”',
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (黄华法包)',
              sub: '西贡最豪华丰盛的法包至尊王者',
              desc: '号称“法包之王”。重达近0.5公斤，塞满了秘制猪肝酱、香浓黄油、多层扎肉和叉烧，建议两人分享。',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, 1区',
              hours: '11:00 - 21:00',
              price: '65,000 - 70,000 VND / 个'
            },
            {
              name: 'Bánh Mì Bảy Hổ (七虎法包)',
              sub: '荣获米其林必比登推介的八十年老摊',
              desc: '传承三代的80年传奇街头小车，以古法现热的招牌细腻猪肝酱和自制叉烧而闻名，口感清香不腻。',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, 1区',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20,000 - 35,000 VND / 个'
            },
            {
              name: 'Bánh Mì Hồng Hoa (红华法包)',
              sub: '荣获米其林入选餐厅 (Michelin Selected)',
              desc: '临近市中心及百年来最著名的边青市场。面包现烤现卖，表皮极酥脆，夹入香脆烤乳猪肉或经典冷肉。',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, 1区',
              hours: '05:30 - 21:30',
              price: '30,000 - 50,000 VND / 个'
            },
            {
              name: 'Bánh Mì Như Lan (如兰法包)',
              sub: '50余年历史的西贡传统美食地标',
              desc: '酥脆面包搭配秘制肝酱、扎肉和叉烧，紧邻Bitexco金融塔，深受当地人喜爱。',
              addr: '50 Hàm Nghi, P. Bến Nghé, 1区',
              hours: '05:00 - 23:00',
              price: '35,000 - 60,000 VND / 个'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (和马铁板法包)',
              sub: '1958年创办的西贡铁板法包鼻祖',
              desc: '小铁板上盛着现煎煎蛋、扎肉、猪肝酱和洋葱，蘸着酥脆法包在巷弄矮凳上享用怀旧早餐。',
              addr: '53 Cao Thắng, Phường 3, 3区',
              hours: '06:00 - 11:00 (仅限上午)',
              price: '50,000 - 70,000 VND / 份'
            }
          ]
        },
        {
          title: '西贡咖啡',
          emoji: '☕',
          quote: '“曾被《纽约时报》评为全球最美味的咖啡之一，西贡冰奶咖啡将浓烈苦涩的罗布斯塔豆与甜美醇厚的炼乳完美融合，冰凉沁脾。”',
          restaurants: [
            {
              name: 'Cộng Cà Phê (共咖啡)',
              sub: '主打复古怀旧风格的经典咖啡店',
              desc: '最畅销招牌：香浓清凉的“椰奶冰沙咖啡”。特色分店：李自重路26号（07:00-23:00）或碧文街127号。',
              addr: '市中心1区拥有多间地标性分店',
              hours: '07:00 - 23:00 (各分店有所不同)',
              price: '40,000 - 75,000 VND'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng (网滤咖啡)',
              sub: '70年历史、24小时不打烊的陶罐网滤咖啡',
              desc: '体验传统的陶罐、木炭火和布袋滤泡的原始技艺。坐在街边矮凳上，品味最经典的人文烟火。',
              addr: '330/2 Phan Đình Phùng, P.1, 富润区',
              hours: '24小时全天候营业',
              price: '15,000 - 25,000 VND'
            },
            {
              name: 'Cà Phê Vy (维咖啡)',
              sub: '街边矮凳、看摩托车流的西贡街头日常',
              desc: '坐在马路边的矮木凳上，慢悠悠地喝一杯南越特有的滴漏冰黑或奶咖啡，融入当地人的市井风情。',
              addr: '90 Nguyễn Du, P. Bến Nghé, 1区',
              hours: '06:00 - 23:00',
              price: '30,000 - 50,000 VND'
            },
            {
              name: 'Cheo Leo Café (招寮咖啡)',
              sub: '1938年开业、西贡最古老的网滤布袋咖啡馆',
              desc: '隐匿于老巷子里，保留着用陶罐和棉布袋滤泡咖啡的古法，见证西贡岁月变迁。',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, 3区',
              hours: '05:15 - 22:00',
              price: '20,000 - 35,000 VND'
            },
            {
              name: 'The Workshop Coffee',
              sub: '西贡首家精品手冲咖啡概念店',
              desc: '位于老公寓二楼的工业风空间，专业提供来自全球及越南产区的优质单品手冲咖啡。',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, 1区',
              hours: '08:00 - 21:00',
              price: '65,000 - 120,000 VND'
            }
          ]
        },
        {
          title: '碎米饭',
          emoji: '🍛',
          quote: '“碎米饭起初是农民将废弃碎米蒸煮的简易餐食，如今已升爽为西贡经典美食，配以蜜汁炭烤猪排，淋上鱼露，香气四溢。”',
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (巴贤碎米饭)',
              sub: '荣获米其林必比登推介的至尊排骨饭',
              desc: '西贡最知名的碎米饭品牌。那块比脸还大的秘制蜜汁烤猪排在炭火上烤得外脆里嫩、鲜美多汁。',
              addr: '84 Đặng Văn Ngữ, Phường 10, 富润区',
              hours: '07:00 - 21:30',
              price: '70,000 - 140,000 VND'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (顺桥碎米饭)',
              sub: '1975年以前便享誉西贡的黄金老字号',
              desc: '西贡老底子饭店，配菜极其繁多。蜜汁五香粉腌制的排骨薄厚适中、炭香四溢。餐厅宽敞整洁。',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, 1区',
              hours: '06:00 - 21:00',
              price: '60,000 - 110,000 VND'
            },
            {
              name: 'Cơm Tấm Mộc (一区)',
              sub: '深受白领与老饕喜爱的摩登雅致碎米饭食堂',
              desc: '在现代而又不失温馨的木质怀旧空间里，品味高标准、干净卫生的传统碎米饭。招牌蜜汁烤排骨肉质鲜嫩多汁、呈色红润诱人。',
              addr: '85 Lý Tự Trọng, Bến Thành, 1区',
              hours: '08:00 - 21:30',
              price: '45,000 - 90,000 VND'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (阮文居碎米饭)',
              sub: '以厚切多汁炭烤大排骨闻名的顶级碎米饭',
              desc: '炭火现烤的厚切大排骨鲜嫩多汁，腌制极其入味，被公认为西贡最顶级的碎米饭之一。',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, 1区',
              hours: '06:30 - 15:00',
              price: '120,000 - 180,000 VND'
            },
            {
              name: 'Cơm Tấm Kiều Giang (桥江夜宵碎米饭)',
              sub: '营业至深夜的经典宵夜碎米饭老店',
              desc: '蜜汁炭烤猪排搭配蒸蛋饼和猪皮丝，是深夜品尝地道西贡美味的最佳选择。',
              addr: '139 Nguyễn Trãi, P. Bến Thành, 1区',
              hours: '06:00 - 次日02:00',
              price: '50,000 - 95,000 VND'
            }
          ]
        },
        {
          title: '美食复合体',
          emoji: '🏢',
          quote: '“探索西贡热闹喧嚣的美食聚集地，从高档百货的地下食阁、百年地标集市，到创意艺术复古公寓。”',
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (地下B2层)',
              sub: '融合亚洲及日本高端美食的地下食阁',
              desc: '云集中岛水产、Baikohken拉面、Tonkatsu伊东、Yamazaki面包及麻布茶房抹茶；亦有本土Katinat咖啡与Marou巧克力。',
              addr: '65 Lê Lợi, P. Bến Nghé, 1区',
              hours: '09:30 - 21:30 (周末延长至22:00)',
              price: '30,000 - 250,000 VND'
            },
            {
              name: '边青市场美食街 (1区)',
              sub: '最具西贡烟火气的传统美食和小吃圣地',
              desc: '西贡最著名百年市场，网罗鱼露米粉、春卷、甜品（Che）和海鲜。19:00后转化为热闹非凡的户外夜市。',
              addr: 'Lê Lợi Street, P. Bến Thành, 1区',
              hours: '07:00 - 19:00 (19:00后转为夜市)',
              price: '40,000 - 200,000 VND'
            },
            {
              name: '阮惠街42号咖啡公寓 (1区)',
              sub: '复古民居改装的垂直艺术餐饮楼',
              desc: '由旧公寓改造，每一层走廊都藏着各种文艺咖啡馆、精品茶室和设计感餐厅，坐拥步行街无敌景观。',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, 1区',
              hours: '08:00 - 22:30 (各店不同)',
              price: '40,000 - 300,000 VND'
            },
            {
              name: '永庆美食街 Phố Ẩm Thực Vĩnh Khánh (4区)',
              sub: '西贡最热闹的夜间海鲜与海鲜宵夜街',
              desc: '充满烟火气的露天美食街，以蒜蓉黄油炒贝类、烤海鲜和热气腾腾的海鲜火锅著称。',
              addr: 'Đường Vĩnh Khánh, Phường 8, 4区',
              hours: '16:00 - 次日01:00',
              price: '50,000 - 300,000 VND'
            },
            {
              name: '范五老/碧文步行街 Phố Đi Bộ Bùi Viện (1区)',
              sub: '不夜城西贡的夜生活与街头烧烤中心',
              desc: '充满多元文化氛围，汇聚街头烤串、精酿啤酒、现场音乐和来自世界各地的风味美食。',
              addr: 'Phố Bùi Viện, P. Phạm Ngũ Lão, 1区',
              hours: '18:00 - 次日04:00',
              price: '30,000 - 250,000 VND'
            }
          ]
        }
      ]
    },
    culture: {
    title: '文化底蕴 ＆ 地标打卡',
    intro: '穿越西贡的历史长河。探寻古典优雅的法式百年建筑、庄严肃穆的历史博物馆、神圣灵验的古刹教堂、绿意盎然的都心公园，以及现代摩登的繁华夜生活。',
    categories: {
      heritage: '历史与遗产',
      spiritual: '宗教与建筑',
      modern: '都市与体验',
      nature: '自然与郊外'
    },
    items: [
      {
        category: 'heritage',
        name: '西贡百年中央邮局',
        sub: '历经130余年的古典法式建筑奇迹',
        desc: '由巴黎埃菲尔铁塔的工程师古斯塔夫·埃菲尔设计。精美的钢拱天顶和古典木质电话亭，至今仍在提供邮政服务，是经典的婚纱摄影和打卡圣地。',
        addr: '2 Công xã Paris, Bến Nghé, Quận 1',
        hours: '07:30 - 18:00',
        price: '免费开放',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '统一宫 (前总统府)',
        sub: '见证越南国家统一的关键历史地标',
        desc: '由著名建筑师吴曰树设计的现代化标志建筑。这里曾是南越总统府，陈列着历史悠久的会议厅、地下防空洞，并保留了1975年4月30日冲入大门的坦克纪念。',
        addr: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1',
        hours: '08:00 - 16:30',
        price: '65,000 VND',
        emoji: '🏰'
      },
      {
        category: 'heritage',
        name: '胡志明市人民委员会大厅',
        sub: '华丽典雅的法国文艺复兴风格大理石宫殿',
        desc: '坐落在阮惠步行街尽头，拥有精致巍峨的钟楼、华丽的浮雕拱门以及庄严的胡志明主席铜像。入夜后，在景观灯光映衬下显得格外浪漫。',
        addr: '86 Lê Thánh Tôn, Bến Nghé, Quận 1',
        hours: '仅限外观欣赏 / 24小时',
        price: '免费',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '胡志明市大剧院 (市立歌剧院)',
        sub: '法国古典主义艺术与巴洛克歌剧大厅',
        desc: '优雅的古典式外墙缀以繁复精美的欧式浮雕。这里是上演备受赞誉的本地杂技奇观À Ố Show（À Ố 秀）的殿堂级艺术场所。',
        addr: '7 Công trường Lam Sơn, Bến Nghé, Quận 1',
        hours: '视演出时间而定',
        price: '演出票价',
        emoji: '🎭'
      },
      {
        category: 'heritage',
        name: '战争证迹博物馆',
        sub: '回溯越南战争历史，呼唤和平的重磅级展馆',
        desc: '胡志明市访问量最高的博物馆。展出海量战时照片、美军重型战斗机、装甲车以及反思战争痛苦的历史物证，传递深刻的和平祈愿。',
        addr: '28 Võ Văn Tần, Võ Thị Sáu, Quận 3',
        hours: '07:30 - 17:30',
        price: '40,000 VND',
        emoji: '🛡️'
      },
      {
        category: 'heritage',
        name: '越南历史博物馆',
        sub: '漫步南部千年的吴哥与占婆历史长卷',
        desc: '位于植物园旁的红砖印支风格大楼。馆内收藏了从石器时代、东山文化、占婆艺术到阮朝皇室的极珍贵文物。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '08:00 - 11:30 | 13:00 - 17:00',
        price: '40,000 VND',
        emoji: '📜'
      },
      {
        category: 'heritage',
        name: '胡志明市美术馆',
        sub: '融合中法美学，古典浪漫的黄色豪门宅邸',
        desc: '原为西贡华人巨富黄文华家族的奢华府邸。耀眼的黄色楼体保留了彩绘玻璃窗、宏伟的旋转楼梯及西贡最古老的欧式木质电梯。',
        addr: '97A Phó Đức Chính, Nguyễn Thái Bình, Quận 1',
        hours: '08:00 - 17:00',
        price: '30,000 VND',
        emoji: '🎨'
      },
      {
        category: 'spiritual',
        name: '西贡圣母大教堂 (红教堂)',
        sub: '庄严宏微的罗马复兴式标志双塔大教堂',
        desc: '建于19世纪末，外墙红砖全部从法国马赛进口，历经百年依然艳丽如新、不染苔藓。两座尖顶钟楼巍然耸立，是市中心的精神地标。',
        addr: '1 Công xã Paris, Bến Nghé, Quận 1',
        hours: '正在修缮中（仅限外观欣赏）',
        price: '免费',
        emoji: '⛪'
      },
      {
        category: 'spiritual',
        name: '新定教堂 (粉红教堂)',
        sub: '令人惊艳的少女心粉红色梦幻大教堂',
        desc: '外墙涂装了亮丽的粉红色，完美融合了哥特式高耸尖顶与巴洛克浪漫装饰。这是全城最受情侣和摄影师追捧的粉红童话仙境。',
        addr: '289 Hai Bà Trưng, Võ Thị Sáu, Quận 3',
        hours: '08:00 - 17:30',
        price: '免费',
        emoji: '💒'
      },
      {
        category: 'spiritual',
        name: '玉皇殿 (福海寺)',
        sub: '奥巴马总统曾亲临祭拜，求子求姻缘极为灵验的百年古刹',
        desc: '建于1909年的中式道教和佛教融合寺庙。殿内雕梁画栋，供奉纸扎神像。2016年，时任美国总统奥巴马特意到此焚香祈福。',
        addr: '73 Mai Thị Lựu, Đa Kao, Quận 1',
        hours: '07:00 - 18:00',
        price: '免费',
        emoji: '🛕'
      },
      {
        category: 'spiritual',
        name: '永严寺',
        sub: '南部极负盛名、规模空前的巍峨汉传佛寺',
        desc: '寺内立有一座雕刻极为复杂的40米高七层观音石塔。其建筑布局继承了越南北方的典型格局，并开创性地采用了耐久的现代钢筋水泥结构。',
        addr: '339 Nam Kỳ Khởi Nghĩa, Võ Thị Sáu, Quận 3',
        hours: '07:00 - 20:00',
        price: '免费',
        emoji: '⛩️'
      },
      {
        category: 'spiritual',
        name: '天后宫 (堤岸天后庙)',
        sub: '喧嚣堤岸里的幽静华人民俗灯笼庙宇',
        desc: '坐落在热闹的第五郡华人街，已有数百年历史。屋顶布满了雕工精细的陶偶壁画，天井下方悬挂着无数巨大的圆盘塔香，烟雾缭绕，神圣而宁静。',
        addr: '710 Nguyễn Trãi, Phường 11, Quận 5',
        hours: '06:30 - 16:30',
        price: '免费',
        emoji: '🏮'
      },
      {
        category: 'modern',
        name: '地标塔 81 (Landmark 81)',
        sub: '越南第一摩天高度，傲视群雄的竹笋摩天大楼',
        desc: '设计灵感来自传统文化中不屈不挠的“竹林”。楼内汇聚了顶奢购物中心、精致高级餐厅以及可穿云俯瞰西贡万家灯火的云霄观景台。',
        addr: '720A Điện Biên Phủ, Phường 22, Bình Thạnh',
        hours: '09:00 - 22:00',
        price: '商场免费进入',
        emoji: '🏙️'
      },
      {
        category: 'modern',
        name: '滨城地铁站',
        sub: '未来感爆棚的西贡轨道交通中央地底枢纽',
        desc: '中央换乘大厅上方设计了一个巨大的环形采光天窗，将自然日光倾泻入地底深处。科幻感十足，是彰显21世纪都市生命力的最新打卡地。',
        addr: 'Quảng trường Quách Thị Trang, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '视购票区间而定',
        emoji: '🚇'
      },
      {
        category: 'modern',
        name: '阮惠步行街之夜',
        sub: '临河而建、流光溢彩的开阔漫步广场',
        desc: '每当夜幕低垂，步行街便化身流动的画卷。五彩缤纷的音乐喷泉、百年法式大厅的景观灯光与西贡河吹拂而来的习习凉风，让这里惬意非凡。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '24/7 (傍晚18点后最热闹)',
        price: '免费',
        emoji: '🌃'
      },
      {
        category: 'modern',
        name: '阮惠步行街街头表演',
        sub: '青春澎湃、创意灵动的西贡年轻艺术沙龙',
        desc: '周末晚间，这里是自由乐队、街舞团体和民间艺人即兴秀场。活力四射的节拍折射出越南当代青年蓬勃自由的生命气场。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '每周六、周日晚间',
        price: '免费',
        emoji: '🎸'
      },
      {
        category: 'modern',
        name: '范五老街-碧文步行街',
        sub: '喧嚣疯狂、霓虹璀璨的“不夜西街”',
        desc: '西贡最著名的深夜娱乐街。激昂震耳的电音舞曲、街头杂耍的喷火杂技和各国背包客手中冰爽的啤酒，编织出了一幅极具都市活力的深夜夜色。',
        addr: 'Đường Bùi Viện, Phạm Ngũ Lão, Quận 1',
        hours: '19:00 - 02:00 (周末最佳)',
        price: '街区免费进入',
        emoji: '🍻'
      },
      {
        category: 'modern',
        name: '胡氏纪夜间花市',
        sub: '百花齐放、热烈温婉的深夜花卉童话世界',
        desc: '全市最大的生花批发集散地，深夜时分最为灿烂。步入鲜花拥簇的狭窄街巷，空气中交织着玫瑰、百合的浓郁芬芳。隔壁就是名扬胡志明市的特色美食街。',
        addr: 'Hẻm 52 Hồ Thị Kỷ, Phường 1, Quận 10',
        hours: '24小时（凌晨0点至3点最震撼）',
        price: '免费',
        emoji: '🌸'
      },
      {
        category: 'modern',
        name: '金龙水上木偶戏院',
        sub: '传承千年的水稻文明水上傀儡木偶戏',
        desc: '在后台传统丝竹乐器的现场伴奏和凄婉高亢的唱腔中，色彩斑斓的木偶在水池中腾空跃起，惟妙惟肖地演绎古老的民间传说和农耕趣事。',
        addr: '55B Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '视场次安排（通常17:00起）',
        price: '约150,000 VND',
        emoji: '🎭'
      },
      {
        category: 'modern',
        name: '骑摩托车穿梭探寻城市',
        sub: '像真正的本地人一样探索西贡的市井烟火',
        desc: '跨上机车后座，在震耳欲聋的摩托车洪流中，穿过蛛网般的深巷窄门，看两旁流动的夜排档与招牌。这是触碰这座城市最真实温度的极速方式。',
        addr: '胡志明市中心各大街区',
        hours: '全天、晚间均可（时间灵活）',
        price: '依线路与导游服务而异',
        emoji: '🛵'
      },
      {
        category: 'modern',
        name: '敞篷双层观光巴士',
        sub: '以360度全景视野领略法式地标的迷人夜色',
        desc: '坐上露天双层巴士的二楼高座，微风拂面下，舒适平稳地滑过百年邮局、大剧院和阮惠大道，带您以开阔轻松的宏观视角领略西贡繁华。',
        addr: '起点：中央邮局，Quận 1',
        hours: '09:00 - 22:30',
        price: '150,000 - 300,000 VND',
        emoji: '🚌'
      },
      {
        category: 'nature',
        name: '古芝地道',
        sub: '纯手工挖掘、全长超250公里的神奇地底防卫长城',
        desc: '这是一项令人叹为观止的历史奇迹。地道结构复杂、隐藏于葱绿的郊外树林下，内部设有地底医院、战壕指挥所，展现出惊人的生存智慧与不屈毅力。',
        addr: 'Tỉnh lộ 15, Phú Mỹ Hưng, Huyện Củ Chi (距市中心约60公里)',
        hours: '07:00 - 17:00',
        price: '35,000 VND (本国) | 125,000 VND (外国游客)',
        emoji: '🌴'
      },
      {
        category: 'nature',
        name: '芹蒢红树林生态景区',
        sub: '被誉为西贡“绿色之肺”的沿海湿地自然保护区',
        desc: '世界级的红树林生物圈保护区。您可以乘船穿越神秘幽静的红树密林、近距离与野生顽皮的猴群互动，并在保护区内一探沼泽鳄鱼的凶猛野性。',
        addr: 'Đường Rừng Sác, xã An Thới Đông, Huyện Cần Giờ',
        hours: '07:30 - 17:00',
        price: '视各子景区门票而定',
        emoji: '🐊'
      },
      {
        category: 'nature',
        name: '西贡动植物园',
        sub: '拥有逾160年历史、全越最古老的绿色生态动植物乐园',
        desc: '建于1864年。步入园中，上千棵合抱之木蔽日遮天，各种珍稀热带植物、猛兽鸟禽在绿荫深处怡然自得，是备受喜爱的都心幽静避暑绿洲。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '07:00 - 18:30',
        price: '60,000 VND',
        emoji: '🦁'
      },
      {
        category: 'nature',
        name: '陶丹公园',
        sub: 'District 1 都心腹地天然氧吧百年巨树绿肺',
        desc: '繁茂葱茏的巨木高耸入云。清晨时分，这里是悠闲鸟友的茶叙圣地。百鸟鸣啭竞相啼唱，大爷们打太极练瑜伽，彰显出一派与世无争的怡然之美。',
        addr: 'Đường Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '免费开放',
        emoji: '🌳'
      },
      {
        category: 'nature',
        name: '9月23日公园',
        sub: '背包客街区旁绿浪起伏、舒爽惬意的绿色活动长廊',
        desc: '无缝连接滨城市场与范五老街。拥有宽阔起伏的高大草坪、新潮的地下商场Sense Market，每天都在上演本地学生和异国游客的热切互动。',
        addr: 'Đường Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1',
        hours: '24小时开放',
        price: '免费',
        emoji: '🍃'
      }
    ]
  },

    shopping: {
      title: '特色购物 ＆ 伴手礼',
      intro: '在这里开启您的西贡淘货之旅。从商品包罗万象的百年老市场，到独具匠心传统手工工坊，以及最受青年喜爱的越南原创潮牌。',
      items: [
        {
          name: '滨城市场 (Chợ Bến Thành)',
          sub: '西贡的百年商业象征，伴手礼的天堂',
          desc: '拥有百年历史，是西贡最重要的地标。商铺内堆满了传统刺绣、奥黛定制、优质滴漏咖啡豆、松脆腰果和椰子糖。在这里买伴手礼是一场充满乐趣的“讨价还价（砍价）”心理博弈！',
          addr: 'Đường Lê Lợi, Phường Bến Thành, Quận 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: '堤岸平西市场 (Chợ Bình Tây)',
          sub: '华人区（Chợ Lớn）深处的复古风批发大市场',
          desc: '一座具有华丽东方飞檐建筑风格的传统大市场。这里是本地干货、中式草药、香料、生活杂货的源头批发地。市井气息扑面而来，非常适合想要探寻深度本地风情的探险家。',
          addr: '57A Tháp Mười, Phường 2, Quận 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground (新潮汇聚地)',
          sub: '地下混凝土潮玩空间与越南原创潮牌圣地',
          desc: '一处备受西贡酷女孩和男孩喜爱的地下“潮流圣地”。这里聚集了数十个越南最顶尖、极具设计感的原创街头潮流服饰品牌（Local Brands）以及前卫配饰。是挑选独一无二酷炫礼物的绝佳地。',
          addr: '26 Lý Tự Trọng, Bến Nghé, Quận 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Lục Lam 传统文化驿站',
      subtitle: 'Lục Lam 传统文化驿站',
      intro: '融合了精湛手作草本茶、匠心纯咖啡及精美传统手工艺术品。在这个温馨怀旧的慢空间中，体会纯粹的越南好客款待。',
      aboutHeading: '关于 Lục Lam',
      aboutText: '隐蔽在西贡古雅里弄中的 Lục Lam，是一座源于对越南草本文化、精品手冲咖啡和传统器物热爱的文化歇脚点。在充满19世纪印度支那（Indochine）风情的光影与香气里，我们为您奉上调理身心的古法茶饮，让您在繁华都市中独享一份安宁。',
      menuHeading: '经典推荐与名物茶歇',
      menuItems: [
        {
          name: 'Red Lava (红熔岩草本茶)',
          desc: '精选红宝石洛神花（玫瑰茄）、鲜橙片与桂皮的完美融汇。酸甜馥郁，富含天然维C与抗氧化成分，舒缓旅途劳顿。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Velvet Rose (丝绒玫瑰茶)',
          desc: '严选法国粉玫瑰花蕾，搭配清雅茉莉与甘菊。花香缭绕优雅，滋润肌肤并舒缓身心压力。',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Violet Jasmine (紫罗兰茉莉茶)',
          desc: '高山有机绿茶吸融鲜采茉莉花香，辅以紫罗兰天然芳草。清甜回甘，令人神清气爽。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Golden Peach (金桃草本茶)',
          desc: '多汁黄桃果香与天然野蜂蜜及草本精香揉合。口感甘甜清爽，是暖心夏日的沁凉首选。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Zen Relaxing (禅意舒缓茶)',
          desc: '天然洋甘菊、莲子芯与薰衣草的精妙拼配。有助于安神定志、平抚焦虑，引导您进入甜美梦乡。',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: '旅行者独家尊享礼遇',
      voucherDesc: '结账时只需向店员展示本手机屏幕，或扫描下方的专属QR码，即可获得店员特别款待：全单立享10%（9折）专属折扣，或享用热茶时获赠一份传统手作绿豆糕！',
      voucherBadge: '独享 O2O 专属款待',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: '立即应用优惠券',
      voucherClaimed: '已成功应用！请将此屏幕出示给收银员。'
    },
    info: {
      title: '实用信息 ＆ 旅途保障',
      intro: '西贡漫步的安心保障。汇集了官方紧急求助、高品质医疗设施、极佳汇率外币兑换点以及现金、移动SIM卡指南。',
      categories: [
        {
          title: '紧急救援 ＆ 涉外医疗支持',
          items: [
            { label: 'FV 国际医院 (FV Hospital - 1区诊所)', detail: '1区金融塔 (Bitexco Tower) 3层。提供24小时英/法/日/中多语言国际化紧急救治服务。电话: (028) 3822 7878' },
            { label: 'Family Medical Practice (家庭医疗联合诊所)', detail: '1区 34 Lê Duẩn。越南极受信任的高端外籍诊所，拥有高水平医疗团队，可提供中文、日语随同翻译。电话: (028) 3822 7848' },
            { label: '西贡旅游警察 (Tourist Police)', detail: '24-26 Pasteur, 1区。专门协助外籍旅客处理遗失或紧急警务投诉。电话: (028) 3824 4103' }
          ]
        },
        {
          title: '推荐换汇金店 (全城极优汇率)',
          items: [
            { label: '哈塔姆金店 (Tiệm Vàng Hà Tâm)', detail: '2 Nguyễn An Ninh, 1区（滨城市场西门正对面）。这家金店因提供全西贡极佳的外币兑换汇率而闻名全球。店门口总是排起长龙，但换汇非常迅速。' },
            { label: '迈万金店 (Tiệm Vàng Mai Vân)', detail: '正对哈塔姆金店。汇率与哈塔姆相当，是当哈塔姆金店由于排队人数过多时的完美备选。' }
          ]
        },
        {
          title: '移动SIM卡与ATM提取现金',
          items: [
            { label: '推荐SIM卡运营商', detail: '推荐在机场落地后购买Viettel或Vinaphone的卡。如果您选择eSIM，强烈推荐Viettel，因其在偏远地区也拥有极强的4G覆盖信号。' },
            { label: '信用卡和ATM提取本币', detail: '绝大多数市中心便利店和餐厅都支持Visa/Master。您也可以在Vietcombank、Techcombank的ATM上直接用国内双币种信用卡提取越南盾，取卡时请勿遗忘卡片。' }
          ]
        }
      ]
    }
  },
  zht: {
    title: '西貢口袋指南',
    subtitle: '西貢漫步與獨家款待指南',
    faq: [
      { q: '綠藍（Lục Lam）在胡志明市的哪裡？', a: '綠藍位於{{address}}。' },
      { q: '綠藍的營業時間是？', a: '每天營業，{{hours}}。' },
      { q: '在西貢怎樣出行才安全？', a: '使用叫車應用程式（{{apps}}），下單前就能看到價格。路邊攔車請選擇{{taxis}}，並確認跳表。' },
      { q: '在西貢出行大概要花多少錢？', a: '機車短途約{{fareBike}}，汽車約{{fareCar}}。價格隨天氣和尖峰時段浮動。' },
      { q: '濱城市場在哪裡？', a: '位於胡志明市第一郡濱城坊。' },
      { q: '綠藍有哪些茶？', a: '{{teas}}。價格自{{priceFrom}}起。' },
      { q: '這本指南有哪些語言版本？', a: '{{languages}}。' },
      { q: '機車很多的路口該怎麼過？', a: '保持等速慢慢走，不要停下也不要跑。騎士會預判你的路線，從你身後繞過去。' },
      { q: '在哪裡可以買到綠藍的茶？', a: '共{{storeCount}}家門市：{{stores}}。可撥打{{phone}}或寄信至{{email}}。' },
    ],
    contact: {
      heading: '聯絡綠藍',
      stores: '門市一覽',
      phone: '電話',
      email: '信箱',
      office: '總部',
      licence: '營業執照號',
    },
    faqHeading: '常见问题',
    brand: 'LỤC LAM',
    author: 'Lục Lam',
    pages: {
      cover: '封面',
      welcome: '前言',
      atmosphere: '街頭氛圍',
      transport: '安全出行',
      stay: '住宿與調理',
      food: '特色美食',
                culture: '文化底蘊 ＆ 地標打卡',
shopping: '特色購物',
      luclam: 'Lục Lam 體驗',
      info: '實用信息'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: '西貢漫步與 Lục Lam 品牌獨家款待指南',
      badge: '像本地人一樣品味西貢 • 街頭市井',
      scanMe: '掃碼獲取'
    },
    welcome: {
      heading: '充滿活力的都市、\n悠久的歷史、\n以及極其熱情的人民。',
      p1: '西貢（胡志明市）是越南最具活力和魅力的經濟與文化中心。這裡的法國殖民時期建築、舉世聞名的街頭美食、與永不停歇的都市活力完美交融。',
      p2: '這本精美的口袋指南旨在幫助首次到訪及重溫西貢的朋友，以最安全、充實且充滿情懷的方式探索這座城市，收獲一段令人難忘的難忘旅程。',
      highlight: '西貢伸出雙臂，隨時熱烈歡迎您的到來！',
      videoTitle: '\\\\ 旅途影像 //',
      videoDesc: '通過精美真實的鏡頭，搶先領略西貢散步的獨特魅力與風情！',
      coffeeTitle: '海鹽咖啡 & 椰子咖啡',
      features: [
        { title: '熱情的本地人', desc: '西貢人性格豪爽且樂於助人，總是帶著溫暖的微笑為您指路。' },
        { title: '美食的天堂', desc: '從經典的越南粉、法包到濃郁的冰奶咖啡，每一口都是西貢專屬的極致味覺。' },
        { title: '歷史與文化底蘊', desc: '古典的法式殖民建築與現代摩天大樓交錯，展現獨特的歷史滄桑感。' },
        { title: '便捷的交通網絡', desc: '打車應用、摩托車及公交工具應有盡有，帶您輕松穿梭大街小巷。' }
      ],
      advice: [
        '西貢陽光充沛，請務必准備帽子、太陽鏡和防曬霜。',
        '請注意勤補水、適度休息，讓您的漫步旅程始終保持活力。'
      ]
    },
    atmosphere: {
      description: '西貢是一座擁有奇妙對比的城市。古老的法式古典建築與現代摩天大樓相鄰，寧靜的小巷隱藏在繁華的林蔭大道後面。跟隨我們推薦的三大特色街區，深度感受西貢最真實、最多彩的市井溫度。',
      offlineMapTitle: '推薦離線地圖',
      tipsTitle: '散步貼士',
      tipsDesc: '清晨在深巷咖啡館消磨時光，午後漫步游覽歷史遺跡，夜晚沉浸於活力四射的街頭大排檔。西貢的每一個小時都有其獨特的魅力。',
      districts: [
        {
          id: 'd1',
          name: '第1區 - 繁華心臟與浪漫法式歷史',
          description: '西貢當之無愧的中心地帶。這裡匯集了最精致的法國殖民建築群（紅教堂、百年中央郵局、西貢歌劇院），與國際名牌精品街、極具情調的高檔餐廳以及著名的濱城市場完美融合，是漫步的最佳起點。',
          highlights: ['漫步浪漫的同起街', '打卡百年中央郵局', '探訪熱鬧非凡的濱城市場']
        },
        {
          id: 'd5',
          name: '第5區 - 華人文化區（堤岸 / Chợ Lớn）',
          description: '西貢華人社群世代繁衍的文化聖地，保留著極富年代感的中式傳統風貌。這裡擁有香火繚繞的古老寺廟（天后宮、溫陵會館）、掛滿中文招牌的藥材街，以及融合了閩粵風味的地道中式越式特色美食。',
          highlights: ['參拜天后宮（媽祖廟）', '漫步香氣彌漫的藥材街', '品嘗哈尊權街的特色水餃']
        },
        {
          id: 'd3',
          name: '第3區 - 綠蔭街區與復古文藝慢生活',
          description: '緊鄰第1區，卻擁有一份難得的寧靜。一條條綠樹成蔭、落葉紛飛的幽靜街道上，隱蔽著大量由舊式法式別墅改造而成的特色設計咖啡館和藝術餐廳，是深受本地文藝青年和留學生喜愛的避暑寶地。',
          highlights: ['參觀戰爭遺跡博物館', '探訪隱秘法式別墅咖啡館', '打卡夢幻少女心的粉紅教堂']
        }
      ],
      mapLabels: {
        title: '西貢漫步地圖',
        sub: '點擊相應區域即可查看詳細攻略',
        airport: '新山一國際機場',
        d3: '第3區 (復古文藝與咖啡)',
        d1: '第1區 (浪漫繁華中心)',
        d5: '第5區 (堤岸華人生活圈)',
        river: '西貢河'
      },
      transportTip: '使用 Grab 或 Xanh SM 等應用出行更安全。'
    },
    transport: {
      heading: '安全出行指南',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: '西貢街頭成百上千輛摩托車匯成的「鐵流」可能會在最初讓您望而生畏，但掌握了以下精妙的出行訣竅後，您就能像本地人一樣安心、安全地暢游全城。',
      categories: [
        {
          id: 'apps',
          title: '手機打車應用（強烈推薦）',
          description: '價格透明、路線實時GPS定位，即使語言不通也完全不用擔心被繞路或遭遇「宰客」。',
          options: [
            { name: 'Grab', desc: '東南亞最主流的打車神器。支持摩托打車（GrabBike）和汽車打車（GrabCar）。強烈建議出行前在手機上綁定好雙幣信用卡，實現無感付。' },
            { name: 'Xanh SM', desc: '越南首家全電動車（EV）高檔打車服務。天藍色車身，車內干淨無異味，行駛平穩安靜，司機均經過嚴格禮儀培訓，體驗極佳。' }
          ]
        },
        {
          id: 'taxis',
          title: '正規靠譜的傳統出租車',
          description: '如果您需要在街頭直接招手攔車，請認准以下兩家知名的大型正規出租車品牌，並務必確認司機在起步時開啟計價器（meter）。',
          options: [
            { name: 'Vinasun Taxi', desc: '白色車身，帶有紅綠條紋。西貢歷史最悠久、最受信任的品牌，司機均穿著整齊的統一制服。' },
            { name: 'Mai Linh Taxi', desc: '醒目的全綠色車身。全越南連鎖的大品牌，計價器管理嚴格，極少發生繞路和計價貓膩。' }
          ]
        },
        {
          id: 'crossing',
          title: '西貢過街的「黃金法則」',
          description: '在密集的摩托車洪流中過馬路是一門充滿驚險與默契的藝術，遵守以下原則即可化險為夷。',
          options: [
            { name: '保持勻速，切忌突然停下或奔跑', desc: '請保持緩慢、穩定的步速前進。摩托車司機會根據您的均速，提前預判您的軌跡並非常自然地從您身後繞行。' },
            { name: '眼神交流與輕柔手勢', desc: '看著正朝您駛來的司機，並用手掌輕輕向下揮動示意，傳達「我正在通過」的明確信號，車輛便會減速避讓。' }
          ]
        }
      ],
      safetyTips: [
        '嚴禁在街頭邊走邊玩手機，這極易成為飛車黨的搶劫目標。若要查閱地圖，請尋找店鋪林立的安全人行道內側，並面朝裡站立。',
        '斜挎包請務必掛在馬路內側（遠離車道的一側），在步行或乘摩托車時，將挎包緊緊護在胸前。'
      ],
      popupDetails: [
        {
          title: 'Grab 使用建議',
          text: '建議在出發前完成Grab的安裝、短信驗證以及信用卡綁定。一旦抵達機場，您就可以立刻一鍵叫車直達酒店，享受公開透明的資費標准。'
        },
        {
          title: '提防山寨出租車',
          text: '在機場和各大景區周邊，常停靠著山寨「Vinasun」或「Mai Linh」的克隆車，其涂裝和文字相似度高達90%。上車前請仔細核對車身印刷的電話號碼和司機的工牌。'
        },
        {
          title: '過馬路切忌恐慌張望',
          text: '當迎面駛來大批車流時，突然大叫停下或者慌忙往回跑是最危險的。這會打亂摩托車司機的預判。請深吸一口氣，保持自信勻速向前，車流會自然避開您。'
        }
      ],
      options: [
        { name: 'Grab Bike (摩托車)', desc: '最快且最省錢的出行方式，可以輕鬆穿過擁堵的街道。司機會提供頭盔。', payment: 'App / 現金', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (汽車)', desc: '安全、涼爽且舒適的選擇。適合4-7人的團體。', payment: 'App / 現金', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: '地鐵 (城市軌道交通)', desc: '西貢首條城市軌道交通線，連接第1區和周邊區域。', payment: '刷卡 / 現金', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: '傳統出租車', desc: '如 Vinasun 和 Mai Linh 等正規大品牌，適合在路邊直接招手攔車。', payment: '現金 / 刷卡', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: '估算價格表 (VND)',
      tableHeaders: ['出行方式', '1-2 公里', '3-5 公里', '5-10 公里', '支付方式'],
      tableNote: '* 實際價格可能會根據天氣和高峰時段而有所變動。',
      pointsTitle: '出行要點',
      points: [
        '提前下載 Grab 和 Xanh SM 應用',
        '綁定信用卡以進行無現金支付',
        '招手攔車時只選擇 Vinasun 或 Mai Linh'
      ],
      rideApps: '推薦打車應用'
    },
    stay: {
      heading: '住宿 ＆ 調理放松',
      subheading: 'Rejuvenate Your Senses',
      intro: '探索完活力西貢後，在寧靜舒適的城市避風港中調理身心。享受高品質精品住宿與舒適水療體驗。',
      categories: [
        {
          title: '精品美學酒店',
          subtitle: '都市中的綠洲',
          bullets: [
            '入住經典百年法式建築，感受復古印支風情',
            '在無邊天台泳池畔，俯瞰璀璨霓虹與迷人夜景',
            '享受貼心的本土款待，體驗充滿藝術感的設計'
          ]
        },
        {
          title: '水療 ＆ 草本洗頭',
          subtitle: '徹底放松身心',
          bullets: [
            '體驗純天然新鮮草本的傳統越式穴位按摩',
            '嘗試風靡本地的草本洗頭（含肩頸按摩）',
            '在幽靜芳香的避世空間內，忘忘旅途勞頓'
          ]
        },
        {
          title: '避世茶飲 ＆ 咖啡',
          subtitle: '獨享安靜時光',
          bullets: [
            '探訪隱於幽靜小巷或老公寓裡的復古咖啡館',
            '品嘗正宗越式冰奶咖啡或清熱草本涼茶',
            '寫下旅行手記，或與好友在此溫馨暢聊'
          ]
        }
      ],
      tips: [
        '精品酒店建議提早預訂。去水療店前建議參考好評並提前約好。',
        '天氣炎熱請及時補水。良好的休息能讓西貢之行更加愉快。'
      ],
      leftImgDesc: '在設計感精品酒店享受優雅居住',
      rightStack: [
        '草本洗發徹底放松頭部',
        '傳統草本按摩恢復活力',
        '深巷茶館享受閒適時光'
      ]
    },
    food: {
      title: '西貢美食掌中寶',
      intro: '為您全方位盤點西貢最頂尖、最地道的代表性美食。更新了精准的營業時間，並優化了界面呈現。',
      categories: [
        {
          title: '西貢河粉',
          emoji: '🍜',
          quote: '「西貢河粉以清甜濃郁的牛骨湯底著稱，食用時會搭配九層塔、刺芹等豐富香草，並蘸上特制甜面醬（黑醬）和辣醬。」',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (和粉-巴斯德)',
              sub: '榮獲米其林必比登推介的半世紀老字號',
              desc: '名揚海內外的傳奇粉店，擁有半世紀以上的歷史，極其受國際游客喜愛。',
              addr: '260C Pasteur, Phường 8, 3區',
              hours: '06:00 - 22:30',
              price: '90,000 - 115,000 VND / 碗'
            },
            {
              name: 'Phở Việt Nam (越南粉-1區)',
              sub: '榮獲米其林入選餐廳 (Michelin Selected)',
              desc: '堅持在店內手工現做新鮮河粉；其招牌「石鍋和牛河粉」能鎖住滾燙的湯汁與和牛的鮮嫩。',
              addr: '14 Phạm Hồng Thái, Phường Bến Thành, 1區',
              hours: '06:00 - 次日03:00',
              price: '90,000 - 350,000 VND / 碗'
            },
            {
              name: 'Phở Dậu (阿豆河粉)',
              sub: '半個多世紀歷史的古法北越風味',
              desc: '經典的北越風味河粉，不加蔬菜和豆芽，主打清澈透明、原汁原味的傳統牛骨清湯。',
              addr: 'Cư xá 288, Hẻm 288M1 Nam Kỳ Khởi Nghĩa, 3區',
              hours: '06:00 - 12:00 (僅限上午)',
              price: '80,000 - 110,000 VND / 碗'
            },
            {
              name: 'Phở Lệ (麗河粉)',
              sub: '榮獲米其林入選餐廳 (Michelin Selected)',
              desc: '湯底濃郁香甜的南部風格河粉；牛肉鮮嫩多汁，自制牛肉丸香脆彈牙。',
              addr: '413-415 Nguyễn Trãi, Phường 7, 5區',
              hours: '06:00 - 24:00 (深夜)',
              price: '85,000 - 110,000 VND / 碗'
            },
            {
              name: 'Phở Phú Vương (富王河粉)',
              sub: '草本清香、祖傳牛骨湯底名店',
              desc: '提供生牛肉、熟牛肉、牛腩、牛筋和牛肉丸等豐富搭配。湯底清甜回甘。',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, 1區',
              hours: '06:00 - 23:00',
              price: '75,000 - 100,000 VND / 碗'
            }
          ]
        },
        {
          title: '越南法包',
          emoji: '🥖',
          quote: '「西貢法包風靡全球，金黃酥脆的面包涂滿香濃豬肝醬和優質黃油，夾入各式冷肉扎肉，再搭配酸甜爽口的醃蘿卜防膩。」',
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (黃華法包)',
              sub: '西貢最豪華豐盛的法包至尊王者',
              desc: '號稱「法包之王」。重達近0.5公斤，塞滿了秘制豬肝醬、香濃黃油、多層扎肉和叉燒，建議兩人分享。',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, 1區',
              hours: '11:00 - 21:00',
              price: '65,000 - 70,000 VND / 個'
            },
            {
              name: 'Bánh Mì Bảy Hổ (七虎法包)',
              sub: '榮獲米其林必比登推介的八十年老攤',
              desc: '傳承三代的80年傳奇街頭小車，以古法現熱的招牌細膩豬肝醬和自制叉燒而聞名，口感清香不膩。',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, 1區',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20,000 - 35,000 VND / 個'
            },
            {
              name: 'Bánh Mì Hồng Hoa (紅華法包)',
              sub: '榮獲米其林入選餐廳 (Michelin Selected)',
              desc: '臨近市中心及百年來最著名的邊青市場。面包現烤現賣，表皮極酥脆，夾入香脆烤乳豬肉或經典冷肉。',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, 1區',
              hours: '05:30 - 21:30',
              price: '30,000 - 50,000 VND / 個'
            },
            {
              name: 'Bánh Mì Như Lan (如蘭法包)',
              sub: '50餘年歷史的西貢傳統美食地標',
              desc: '酥脆麵包搭配秘製肝醬、扎肉和叉燒，緊鄰Bitexco金融塔，深受當地人喜愛。',
              addr: '50 Hàm Nghi, P. Bến Nghé, 1區',
              hours: '05:00 - 23:00',
              price: '35,000 - 60,000 VND / 個'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (和馬鐵板法包)',
              sub: '1958年創辦的西貢鐵板法包鼻祖',
              desc: '小鐵板上盛著現煎煎蛋、扎肉、豬肝醬和洋蔥，蘸著酥脆法包在巷弄矮凳上享用懷舊早餐。',
              addr: '53 Cao Thắng, Phường 3, 3區',
              hours: '06:00 - 11:00 (僅限上午)',
              price: '50,000 - 70,000 VND / 份'
            }
          ]
        },
        {
          title: '西貢咖啡',
          emoji: '☕',
          quote: '「曾被《紐約時報》評為全球最美味的咖啡之一，西貢冰奶咖啡將濃烈苦澀的羅布斯塔豆與甜美醇厚的煉乳完美融合，冰涼沁脾。」',
          restaurants: [
            {
              name: 'Cộng Cà Phê (共咖啡)',
              sub: '主打復古懷舊風格的經典咖啡店',
              desc: '最暢銷招牌：香濃清涼的「椰奶冰沙咖啡」。特色分店：李自重路26號（07:00-23:00）或碧文街127號。',
              addr: '市中心1區擁有多間地標性分店',
              hours: '07:00 - 23:00 (各分店有所不同)',
              price: '40,000 - 75,000 VND'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng (網濾咖啡)',
              sub: '70年歷史、24小時不打烊的陶罐網濾咖啡',
              desc: '體驗傳統的陶罐、木炭火和布袋濾泡的原始技藝。坐在街邊矮凳上，品味最經典的人文煙火。',
              addr: '330/2 Phan Đình Phùng, P.1, 富潤區',
              hours: '24小時全天候營業',
              price: '15,000 - 25,000 VND'
            },
            {
              name: 'Cà Phê Vy (維咖啡)',
              sub: '街邊矮凳、看摩托車流的西貢街頭日常',
              desc: '坐在馬路邊的矮木凳上，慢悠悠地喝一杯南越特有的滴漏冰黑或奶咖啡，融入當地人的市井風情。',
              addr: '90 Nguyễn Du, P. Bến Nghé, 1區',
              hours: '06:00 - 23:00',
              price: '30,000 - 50,000 VND'
            },
            {
              name: 'Cheo Leo Café (招寮咖啡)',
              sub: '1938年開業、西貢最古老的網濾布袋咖啡館',
              desc: '隱匿於老巷子裡，保留著用陶罐和棉布袋濾泡咖啡的古法，見證西貢歲月變遷。',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, 3區',
              hours: '05:15 - 22:00',
              price: '20,000 - 35,000 VND'
            },
            {
              name: 'The Workshop Coffee',
              sub: '西貢首家精品手沖咖啡概念店',
              desc: '位於老公寓二樓的工業風空間，專業提供來自全球及越南產區的優質單品手沖咖啡。',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, 1區',
              hours: '08:00 - 21:00',
              price: '65,000 - 120,000 VND'
            }
          ]
        },
        {
          title: '碎米飯',
          emoji: '🍛',
          quote: '「碎米飯起初是農民將廢棄碎米蒸煮的簡易餐食，如今已升華為西貢經典美食，配以蜜汁炭烤豬排，淋上魚露，香氣四溢。」',
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (巴賢碎米飯)',
              sub: '榮獲米其林必比登推介的至尊排骨飯',
              desc: '西貢最知名的碎米飯品牌。那塊比臉還大的秘制蜜汁烤豬排在炭火上烤得外脆裡嫩、鮮美多汁。',
              addr: '84 Đặng Văn Ngữ, Phường 10, 富潤區',
              hours: '07:00 - 21:30',
              price: '70,000 - 140,000 VND'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (順橋碎米飯)',
              sub: '1975年以前便享譽西貢的黃金老字號',
              desc: '西貢老底子飯店，配菜極其繁多。蜜汁五香粉醃制的排骨薄厚適中、炭香四溢。餐廳寬敞整潔。',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, 1區',
              hours: '06:00 - 21:00',
              price: '60,000 - 110,000 VND'
            },
            {
              name: 'Cơm Tấm Mộc (一區)',
              sub: '深受白領與老饕喜愛的摩登雅致碎米飯食堂',
              desc: '在現代而又不失溫馨的木質懷舊空間裡，品味高標准、干淨衛生的傳統碎米飯。招牌蜜汁烤排骨肉質鮮嫩多汁、呈色紅潤誘人。',
              addr: '85 Lý Tự Trọng, Bến Thành, 1區',
              hours: '08:00 - 21:30',
              price: '45,000 - 90,000 VND'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (阮文居碎米飯)',
              sub: '以厚切多汁炭烤大排骨聞名的頂級碎米飯',
              desc: '炭火現烤的厚切大排骨鮮嫩多汁，醃製極其入味，被公認為西貢最頂級的碎米飯之一。',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, 1區',
              hours: '06:30 - 15:00',
              price: '120,000 - 180,000 VND'
            },
            {
              name: 'Cơm Tấm Kiều Giang (橋江夜宵碎米飯)',
              sub: '營業至深夜的經典宵夜碎米飯老店',
              desc: '蜜汁炭烤豬排搭配蒸蛋餅和豬皮絲，是深夜品嚐地道西貢美味的最佳選擇。',
              addr: '139 Nguyễn Trãi, P. Bến Thành, 1區',
              hours: '06:00 - 次日02:00',
              price: '50,000 - 95,000 VND'
            }
          ]
        },
        {
          title: '美食復合體',
          emoji: '🏢',
          quote: '「探索西貢熱鬧喧囂的美食聚集地，從高檔百貨的地下食閣、百年地標集市，到創意藝術復古公寓。」',
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (地下B2層)',
              sub: '融合亞洲及日本高端美食的地下食閣',
              desc: '雲集中島水產、Baikohken拉面、Tonkatsu伊東、Yamazaki面包及麻布茶房抹茶；亦有本土Katinat咖啡與Marou巧克力。',
              addr: '65 Lê Lợi, P. Bến Nghé, 1區',
              hours: '09:30 - 21:30 (周末延長至22:00)',
              price: '30,000 - 250,000 VND'
            },
            {
              name: '邊青市場美食街 (1區)',
              sub: '最具西貢煙火氣的傳統美食和小吃聖地',
              desc: '西貢最著名百年市場，網羅魚露米粉、春卷、甜品（Che）和海鮮。19:00後轉化為熱鬧非凡的戶外夜市。',
              addr: 'Lê Lợi Street, P. Bến Thành, 1區',
              hours: '07:00 - 19:00 (19:00後轉為夜市)',
              price: '40,000 - 200,000 VND'
            },
            {
              name: '阮惠街42號咖啡公寓 (1區)',
              sub: '復古民居改裝的垂直藝術餐飲樓',
              desc: '由舊公寓改造，每一層走廊都藏著各種文藝咖啡館、精品茶室和設計感餐廳，坐擁步行街無敵景觀。',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, 1區',
              hours: '08:00 - 22:30 (各店不同)',
              price: '40,000 - 300,000 VND'
            },
            {
              name: '永慶美食街 Phố Ẩm Thực Vĩnh Khánh (4區)',
              sub: '西貢最熱鬧的夜間海鮮與海鮮宵夜街',
              desc: '充滿煙火氣的露天美食街，以蒜蓉黃油炒貝類、烤海鮮和熱氣騰騰的海鮮火鍋著稱。',
              addr: 'Đường Vĩnh Khánh, Phường 8, 4區',
              hours: '16:00 - 次日01:00',
              price: '50,000 - 300,000 VND'
            },
            {
              name: '范五老/碧文步行街 Phố Đi Bộ Bùi Viện (1區)',
              sub: '不夜城西貢的夜生活與街頭燒烤中心',
              desc: '充滿多元文化氛圍，匯聚街頭烤串、精釀啤酒、現場音樂和來自世界各地的風味美食。',
              addr: 'Phố Bùi Viện, P. Phạm Ngũ Lão, 1區',
              hours: '18:00 - 次日04:00',
              price: '30,000 - 250,000 VND'
            }
          ]
        }
      ]
    },
    culture: {
    title: '文化底蘊 ＆ 地標打卡',
    intro: '穿越西貢的歷史長河。探尋古典優雅的法式百年建築、莊嚴肅穆的歷史博物館、神聖靈驗的古剎教堂、綠意盎然的都心公園，以及現代摩登的繁華夜生活。',
    categories: {
      heritage: '歷史與遺產',
      spiritual: '宗教與建築',
      modern: '都市與體驗',
      nature: '自然與郊外'
    },
    items: [
      {
        category: 'heritage',
        name: '西貢百年中央郵局',
        sub: '歷經130余年的古典法式建築奇跡',
        desc: '由巴黎埃菲爾鐵塔的工程師古斯塔夫·埃菲爾設計。精美的鋼拱天頂和古典木質電話亭，至今仍在提供郵政服務，是經典的婚紗攝影和打卡聖地。',
        addr: '2 Công xã Paris, Bến Nghé, Quận 1',
        hours: '07:30 - 18:00',
        price: '免費開放',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '統一宮 (前總統府)',
        sub: '見證越南國家統一的關鍵歷史地標',
        desc: '由著名建築師吳曰樹設計的現代化標志建築。這裡曾是南越總統府，陳列著歷史悠久的會議廳、地下防空洞，並保留了1975年4月30日沖入大門的坦克紀念。',
        addr: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, Quận 1',
        hours: '08:00 - 16:30',
        price: '65,000 VND',
        emoji: '🏰'
      },
      {
        category: 'heritage',
        name: '胡志明市人民委員會大廳',
        sub: '華麗典雅的法國文藝復興風格大理石宮殿',
        desc: '坐落在阮惠步行街盡頭，擁有精致巍峨的鐘樓、華麗的浮雕拱門以及莊嚴的胡志明主席銅像。入夜後，在景觀燈光映襯下顯得格外浪漫。',
        addr: '86 Lê Thánh Tôn, Bến Nghé, Quận 1',
        hours: '僅限外觀欣賞 / 24小時',
        price: '免費',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: '胡志明市大劇院 (市立歌劇院)',
        sub: '法國古典主義藝術與巴洛克歌劇大廳',
        desc: '優雅的古典式外牆綴以繁復精美的歐式浮雕。這裡是上演備受贊譽的本地雜技奇觀À Ố Show（À Ố 秀）的殿堂級藝術場所。',
        addr: '7 Công trường Lam Sơn, Bến Nghé, Quận 1',
        hours: '視演出時間而定',
        price: '演出票價',
        emoji: '🎭'
      },
      {
        category: 'heritage',
        name: '戰爭證跡博物館',
        sub: '回溯越南戰爭歷史，呼喚和平的重磅級展館',
        desc: '胡志明市訪問量最高的博物館。展出海量戰時照片、美軍重型戰斗機、裝甲車以及反思戰爭痛苦的歷史物證，傳遞深刻的和平祈願。',
        addr: '28 Võ Văn Tần, Võ Thị Sáu, Quận 3',
        hours: '07:30 - 17:30',
        price: '40,000 VND',
        emoji: '🛡️'
      },
      {
        category: 'heritage',
        name: '越南歷史博物館',
        sub: '漫步南部千年的吳哥與佔婆歷史長卷',
        desc: '位於植物園旁的紅磚印支風格大樓。館內收藏了從石器時代、東山文化、佔婆藝術到阮朝皇室的極珍貴文物。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '08:00 - 11:30 | 13:00 - 17:00',
        price: '40,000 VND',
        emoji: '📜'
      },
      {
        category: 'heritage',
        name: '胡志明市美術館',
        sub: '融合中法美學，古典浪漫的黃色豪門宅邸',
        desc: '原為西貢華人巨富黃文華家族的奢華府邸。耀眼的黃色樓體保留了彩繪玻璃窗、宏偉的旋轉樓梯及西貢最古老的歐式木質電梯。',
        addr: '97A Phó Đức Chính, Nguyễn Thái Bình, Quận 1',
        hours: '08:00 - 17:00',
        price: '30,000 VND',
        emoji: '🎨'
      },
      {
        category: 'spiritual',
        name: '西貢聖母大教堂 (紅教堂)',
        sub: '莊嚴宏微的羅馬復興式標志雙塔大教堂',
        desc: '建於19世紀末，外牆紅磚全部從法國馬賽進口，歷經百年依然豔麗如新、不染苔蘚。兩座尖頂鐘樓巍然聳立，是市中心的精神地標。',
        addr: '1 Công xã Paris, Bến Nghé, Quận 1',
        hours: '正在修繕中（僅限外觀欣賞）',
        price: '免費',
        emoji: '⛪'
      },
      {
        category: 'spiritual',
        name: '新定教堂 (粉紅教堂)',
        sub: '令人驚豔的少女心粉紅色夢幻大教堂',
        desc: '外牆涂裝了亮麗的粉紅色，完美融合了哥特式高聳尖頂與巴洛克浪漫裝飾。這是全城最受情侶和攝影師追捧的粉紅童話仙境。',
        addr: '289 Hai Bà Trưng, Võ Thị Sáu, Quận 3',
        hours: '08:00 - 17:30',
        price: '免費',
        emoji: '💒'
      },
      {
        category: 'spiritual',
        name: '玉皇殿 (福海寺)',
        sub: '奧巴馬總統曾親臨祭拜，求子求姻緣極為靈驗的百年古剎',
        desc: '建於1909年的中式道教和佛教融合寺廟。殿內雕梁畫棟，供奉紙扎神像。2016年，時任美國總統奧巴馬特意到此焚香祈福。',
        addr: '73 Mai Thị Lựu, Đa Kao, Quận 1',
        hours: '07:00 - 18:00',
        price: '免費',
        emoji: '🛕'
      },
      {
        category: 'spiritual',
        name: '永嚴寺',
        sub: '南部極負盛名、規模空前的巍峨漢傳佛寺',
        desc: '寺內立有一座雕刻極為復雜的40米高七層觀音石塔。其建築布局繼承了越南北方的典型格局，並開創性地采用了耐久的現代鋼筋水泥結構。',
        addr: '339 Nam Kỳ Khởi Nghĩa, Võ Thị Sáu, Quận 3',
        hours: '07:00 - 20:00',
        price: '免費',
        emoji: '⛩️'
      },
      {
        category: 'spiritual',
        name: '天后宮 (堤岸天后廟)',
        sub: '喧囂堤岸裡的幽靜華人民俗燈籠廟宇',
        desc: '坐落在熱鬧的第五郡華人街，已有數百年歷史。屋頂布滿了雕工精細的陶偶壁畫，天井下方懸掛著無數巨大的圓盤塔香，煙霧繚繞，神聖而寧靜。',
        addr: '710 Nguyễn Trãi, Phường 11, Quận 5',
        hours: '06:30 - 16:30',
        price: '免費',
        emoji: '🏮'
      },
      {
        category: 'modern',
        name: '地標塔 81 (Landmark 81)',
        sub: '越南第一摩天高度，傲視群雄的竹筍摩天大樓',
        desc: '設計靈感來自傳統文化中不屈不撓的「竹林」。樓內匯聚了頂奢購物中心、精致高級餐廳以及可穿雲俯瞰西貢萬家燈火的雲霄觀景台。',
        addr: '720A Điện Biên Phủ, Phường 22, Bình Thạnh',
        hours: '09:00 - 22:00',
        price: '商場免費進入',
        emoji: '🏙️'
      },
      {
        category: 'modern',
        name: '濱城地鐵站',
        sub: '未來感爆棚的西貢軌道交通中央地底樞紐',
        desc: '中央換乘大廳上方設計了一個巨大的環形采光天窗，將自然日光傾瀉入地底深處。科幻感十足，是彰顯21世紀都市生命力的最新打卡地。',
        addr: 'Quảng trường Quách Thị Trang, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '視購票區間而定',
        emoji: '🚇'
      },
      {
        category: 'modern',
        name: '阮惠步行街之夜',
        sub: '臨河而建、流光溢彩的開闊漫步廣場',
        desc: '每當夜幕低垂，步行街便化身流動的畫卷。五彩繽紛的音樂噴泉、百年法式大廳的景觀燈光與西貢河吹拂而來的習習涼風，讓這裡愜意非凡。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '24/7 (傍晚18點後最熱鬧)',
        price: '免費',
        emoji: '🌃'
      },
      {
        category: 'modern',
        name: '阮惠步行街街頭表演',
        sub: '青春澎湃、創意靈動的西貢年輕藝術沙龍',
        desc: '周末晚間，這裡是自由樂隊、街舞團體和民間藝人即興秀場。活力四射的節拍折射出越南當代青年蓬勃自由的生命氣場。',
        addr: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1',
        hours: '每周六、周日晚間',
        price: '免費',
        emoji: '🎸'
      },
      {
        category: 'modern',
        name: '范五老街-碧文步行街',
        sub: '喧囂瘋狂、霓虹璀璨的「不夜西街」',
        desc: '西貢最著名的深夜娛樂街。激昂震耳的電音舞曲、街頭雜耍的噴火雜技和各國背包客手中冰爽的啤酒，編織出了一幅極具都市活力的深夜夜色。',
        addr: 'Đường Bùi Viện, Phạm Ngũ Lão, Quận 1',
        hours: '19:00 - 02:00 (周末最佳)',
        price: '街區免費進入',
        emoji: '🍻'
      },
      {
        category: 'modern',
        name: '胡氏紀夜間花市',
        sub: '百花齊放、熱烈溫婉的深夜花卉童話世界',
        desc: '全市最大的生花批發集散地，深夜時分最為燦爛。步入鮮花擁簇的狹窄街巷，空氣中交織著玫瑰、百合的濃郁芬芳。隔壁就是名揚胡志明市的特色美食街。',
        addr: 'Hẻm 52 Hồ Thị Kỷ, Phường 1, Quận 10',
        hours: '24小時（凌晨0點至3點最震撼）',
        price: '免費',
        emoji: '🌸'
      },
      {
        category: 'modern',
        name: '金龍水上木偶戲院',
        sub: '傳承千年的水稻文明水上傀儡木偶戲',
        desc: '在後台傳統絲竹樂器的現場伴奏和淒婉高亢的唱腔中，色彩斑斕的木偶在水池中騰空躍起，惟妙惟肖地演繹古老的民間傳說和農耕趣事。',
        addr: '55B Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '視場次安排（通常17:00起）',
        price: '約150,000 VND',
        emoji: '🎭'
      },
      {
        category: 'modern',
        name: '騎摩托車穿梭探尋城市',
        sub: '像真正的本地人一樣探索西貢的市井煙火',
        desc: '跨上機車後座，在震耳欲聾的摩托車洪流中，穿過蛛網般的深巷窄門，看兩旁流動的夜排檔與招牌。這是觸碰這座城市最真實溫度的極速方式。',
        addr: '胡志明市中心各大街區',
        hours: '全天、晚間均可（時間靈活）',
        price: '依線路與導游服務而異',
        emoji: '🛵'
      },
      {
        category: 'modern',
        name: '敞篷雙層觀光巴士',
        sub: '以360度全景視野領略法式地標的迷人夜色',
        desc: '坐上露天雙層巴士的二樓高座，微風拂面下，舒適平穩地滑過百年郵局、大劇院和阮惠大道，帶您以開闊輕松的宏觀視角領略西貢繁華。',
        addr: '起點：中央郵局，Quận 1',
        hours: '09:00 - 22:30',
        price: '150,000 - 300,000 VND',
        emoji: '🚌'
      },
      {
        category: 'nature',
        name: '古芝地道',
        sub: '純手工挖掘、全長超250公里的神奇地底防衛長城',
        desc: '這是一項令人嘆為觀止的歷史奇跡。地道結構復雜、隱藏於蔥綠的郊外樹林下，內部設有地底醫院、戰壕指揮所，展現出驚人的生存智慧與不屈毅力。',
        addr: 'Tỉnh lộ 15, Phú Mỹ Hưng, Huyện Củ Chi (距市中心約60公里)',
        hours: '07:00 - 17:00',
        price: '35,000 VND (本國) | 125,000 VND (外國游客)',
        emoji: '🌴'
      },
      {
        category: 'nature',
        name: '芹蒢紅樹林生態景區',
        sub: '被譽為西貢「綠色之肺」的沿海濕地自然保護區',
        desc: '世界級的紅樹林生物圈保護區。您可以乘船穿越神秘幽靜的紅樹密林、近距離與野生頑皮的猴群互動，並在保護區內一探沼澤鱷魚的凶猛野性。',
        addr: 'Đường Rừng Sác, xã An Thới Đông, Huyện Cần Giờ',
        hours: '07:30 - 17:00',
        price: '視各子景區門票而定',
        emoji: '🐊'
      },
      {
        category: 'nature',
        name: '西貢動植物園',
        sub: '擁有逾160年歷史、全越最古老的綠色生態動植物樂園',
        desc: '建於1864年。步入園中，上千棵合抱之木蔽日遮天，各種珍稀熱帶植物、猛獸鳥禽在綠蔭深處怡然自得，是備受喜愛的都心幽靜避暑綠洲。',
        addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1',
        hours: '07:00 - 18:30',
        price: '60,000 VND',
        emoji: '🦁'
      },
      {
        category: 'nature',
        name: '陶丹公園',
        sub: 'District 1 都心腹地天然氧吧百年巨樹綠肺',
        desc: '繁茂蔥蘢的巨木高聳入雲。清晨時分，這裡是悠閒鳥友的茶敘聖地。百鳥鳴囀競相啼唱，大爺們打太極練瑜伽，彰顯出一派與世無爭的怡然之美。',
        addr: 'Đường Nguyễn Thị Minh Khai, Bến Thành, Quận 1',
        hours: '06:00 - 22:00',
        price: '免費開放',
        emoji: '🌳'
      },
      {
        category: 'nature',
        name: '9月23日公園',
        sub: '背包客街區旁綠浪起伏、舒爽愜意的綠色活動長廊',
        desc: '無縫連接濱城市場與范五老街。擁有寬闊起伏的高大草坪、新潮的地下商場Sense Market，每天都在上演本地學生和異國游客的熱切互動。',
        addr: 'Đường Phạm Ngũ Lão, Phường Phạm Ngũ Lão, Quận 1',
        hours: '24小時開放',
        price: '免費',
        emoji: '🍃'
      }
    ]
  },

    shopping: {
      title: '特色購物 ＆ 伴手禮',
      intro: '在這裡開啟您的西貢淘貨之旅。從商品包羅萬象的百年老市場，到獨具匠心傳統手工工坊，以及最受青年喜愛的越南原創潮牌。',
      items: [
        {
          name: '濱城市場 (Chợ Bến Thành)',
          sub: '西貢的百年商業象征，伴手禮的天堂',
          desc: '擁有百年歷史，是西貢最重要的地標。商鋪內堆滿了傳統刺繡、奧黛定制、優質滴漏咖啡豆、松脆腰果和椰子糖。在這裡買伴手禮是一場充滿樂趣的「討價還價（砍價）」心理博弈！',
          addr: 'Đường Lê Lợi, Phường Bến Thành, Quận 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: '堤岸平西市場 (Chợ Bình Tây)',
          sub: '華人區（Chợ Lớn）深處的復古風批發大市場',
          desc: '一座具有華麗東方飛簷建築風格的傳統大市場。這裡是本地干貨、中式草藥、香料、生活雜貨的源頭批發地。市井氣息撲面而來，非常適合想要探尋深度本地風情的探險家。',
          addr: '57A Tháp Mười, Phường 2, Quận 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground (新潮匯聚地)',
          sub: '地下混凝土文創潮流空間與越南原創潮牌聖地',
          desc: '一處備受西貢酷女孩和男孩喜愛的地下「潮流聖地」。這裡聚集了數十個越南最頂尖、極具設計感的原創街頭潮流服飾品牌（Local Brands）以及前衛配飾。是挑選獨一無二酷炫禮物的絕佳地。',
          addr: '26 Lý Tự Trọng, Bến Nghé, Quận 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Lục Lam 傳統文化驛站',
      subtitle: 'Lục Lam 傳統文化驛站',
      intro: '融合了精湛手作草本茶、匠心純咖啡及精美傳統手工藝術品。在這個溫馨懷舊的慢空間中，體會純粹的越南好客款待。',
      aboutHeading: '關於 Lục Lam',
      aboutText: '隱蔽在西貢古雅裡弄中的 Lục Lam，是一座源於對越南草本文化、精品手沖咖啡和傳統器物熱愛的文化歇腳點。在充滿19世紀印度支那（Indochine）風情的光影與香氣裡，我們為您奉上調理身心的古法茶飲，讓您在繁華都市中獨享一份安寧。',
      menuHeading: '經典推薦與名物茶歇',
      menuItems: [
        {
          name: 'Red Lava (紅熔岩草本茶)',
          desc: '精選紅寶石洛神花（玫瑰茄）、鮮橙片與桂皮的完美融匯。酸甜馥鬱，富含天然維C與抗氧化成分，舒緩旅途勞頓。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Velvet Rose (絲絨玫瑰茶)',
          desc: '嚴選法國粉玫瑰花蕾，搭配清雅茉莉與甘菊。花香繚繞優雅，滋潤肌膚並舒緩身心壓力。',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Violet Jasmine (紫羅蘭茉莉茶)',
          desc: '高山有機綠茶吸融鮮採茉莉花香，輔以紫羅蘭天然芳草。清甜回甘，令人神清氣爽。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Golden Peach (金桃草本茶)',
          desc: '多汁黃桃果香與天然野蜂蜜及草本精香揉合。口感甘甜清爽，是暖心夏日的沁涼首選。',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Zen Relaxing (禪意舒緩茶)',
          desc: '天然洋甘菊、蓮子芯與薰衣草的精妙複配。有助於安神定志、平撫焦慮，引導您進入甜美夢鄉。',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: '旅行者獨家尊享禮遇',
      voucherDesc: '結賬時只需向店員展示本手機屏幕，或掃描下方的專屬QR碼，即可獲得店員特別款待：全單立享10%（9折）專屬折扣，或享用熱茶時獲贈一份傳統手作綠豆糕！',
      voucherBadge: '獨享 O2O 專屬款待',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: '立即應用優惠券',
      voucherClaimed: '已成功應用！請將此屏幕出示給收銀員。'
    },
    info: {
      title: '實用信息 ＆ 旅途保障',
      intro: '西貢漫步的安心保障。匯集了官方緊急求助、高品質醫療設施、極佳匯率外幣兌換點以及現金、移動SIM卡指南。',
      categories: [
        {
          title: '緊急救援 ＆ 涉外醫療支持',
          items: [
            { label: 'FV 國際醫院 (FV Hospital - 1區診所)', detail: '1區金融塔 (Bitexco Tower) 3層。提供24小時英/法/日/中多語言國際化緊急救治服務。電話: (028) 3822 7878' },
            { label: 'Family Medical Practice (家庭醫療聯合診所)', detail: '1區 34 Lê Duẩn。越南極受信任的高端外籍診所，擁有高水平醫療團隊，可提供中文、日語隨同翻譯。電話: (028) 3822 7848' },
            { label: '西貢旅游警察 (Tourist Police)', detail: '24-26 Pasteur, 1區。專門協助外籍旅客處理遺失或緊急警務投訴。電話: (028) 3824 4103' }
          ]
        },
        {
          title: '推薦換匯金店 (全城極優匯率)',
          items: [
            { label: '哈塔姆金店 (Tiệm Vàng Hà Tâm)', detail: '2 Nguyễn An Ninh, 1區（濱城市場西門正對面）。這家金店因提供全西貢極佳的外幣兌換匯率而聞名全球。店門口總是排起長龍，但換匯非常迅速。' },
            { label: '邁萬金店 (Tiệm Vàng Mai Vân)', detail: '正對哈塔姆金店。匯率與哈塔姆相當，是當哈塔姆金店由於排隊人數過多時的完美備選。' }
          ]
        },
        {
          title: '移動SIM卡與ATM提取現金',
          items: [
            { label: '推薦SIM卡運營商', detail: '推薦在機場落地後購買Viettel或Vinaphone的卡。如果您選擇eSIM，強烈推薦Viettel，因其在偏遠地區也擁有極強的4G覆蓋信號。' },
            { label: '信用卡和ATM提取本幣', detail: '絕大多數市中心便利店和餐廳都支持Visa/Master。您也可以在Vietcombank、Techcombank的ATM上直接用國內雙幣種信用卡提取越南盾，取卡時請勿遺忘卡片。' }
          ]
        }
      ]
    }
  },
  en: {
    title: 'Saigon Pocket Guide',
    subtitle: 'Saigon strolls & exclusive hospitality guide',
    faq: [
      { q: 'Where is Lục Lam in Ho Chi Minh City?', a: 'Lục Lam is at {{address}}.' },
      { q: 'What are Lục Lam’s opening hours?', a: 'Open every day, {{hours}}.' },
      { q: 'How do I get around Saigon safely?', a: 'Use a ride-hailing app ({{apps}}) — the fare is shown before you book. For street taxis, {{taxis}} are the reliable brands; check the meter is running.' },
      { q: 'How much does getting around Saigon cost?', a: 'Around {{fareBike}} for a short motorbike trip and {{fareCar}} by car. Fares vary with weather and rush hour.' },
      { q: 'Where is Bến Thành Market?', a: 'Bến Thành Market is in Bến Thành Ward, District 1, Ho Chi Minh City.' },
      { q: 'What teas does Lục Lam sell?', a: '{{teas}}. Prices from {{priceFrom}}.' },
      { q: 'Which languages is this guide available in?', a: '{{languages}}.' },
      { q: 'How do I cross a street full of motorbikes?', a: 'Walk slowly at a steady pace, and do not stop or run. Riders read your path and steer around behind you.' },
      { q: 'Where can I buy Lục Lam tea?', a: '{{storeCount}} shops: {{stores}}. Call {{phone}} or email {{email}}.' },
    ],
    contact: {
      heading: 'Contact Lục Lam',
      stores: 'Our shops',
      phone: 'Phone',
      email: 'Email',
      office: 'Head office',
      licence: 'Business registration',
    },
    faqHeading: '常見問題',
    brand: 'LỤC LAM',
    author: 'Luc Lam',
    pages: {
      cover: 'Cover',
      welcome: 'Introduction',
      atmosphere: 'Atmosphere',
      transport: 'Safe Transport',
      stay: 'Stay & Care',
      food: 'Legends Food',
                culture: 'Culture & Landmarks',
shopping: 'Shop Local',
      luclam: 'Lục Lam Stop',
      info: 'Useful Info'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: 'Saigon strolls & exclusive hospitality guide by Lục Lam',
      badge: 'EAT LIKE A LOCAL • SAIGON VIBES',
      scanMe: 'SCAN ME'
    },
    welcome: {
      heading: 'Vibrant city,\nDeep history,\nWarmhearted souls.',
      p1: 'Saigon (Ho Chi Minh City) is the dynamic economic and cultural heart of Vietnam. It is a striking blend of historic French colonial architecture, world-famous street food, and non-stop energy.',
      p2: 'This pocket guide is meticulously crafted to help both first-time travelers and returning friends navigate and explore the city safely, deeply, and emotionally.',
      highlight: 'Saigon welcomes you with warm hearts!',
      videoTitle: '\\\\ Journey Reel //',
      videoDesc: 'Discover the ultimate charm of Saigon street strolls in this cinematic video compilation!',
      coffeeTitle: 'Salt Coffee & Coconut Coffee',
      features: [
        { title: 'Friendly Locals', desc: 'Saigonese are notoriously warm and helpful. Ask for directions, and you will receive genuine smiles.' },
        { title: 'Foodies’ Paradise', desc: 'From classic Pho and Banh Mi to robust iced filter coffee, eating is a non-stop pleasure.' },
        { title: 'Historic Heritage', desc: 'Beautiful old architecture sits alongside glistening skyscrapers and meaningful historical landmarks.' },
        { title: 'Smart Mobility', desc: 'Intuitive ridesharing, budget motorbikes, and local buses keep you mobile easily.' }
      ],
      advice: [
        'Saigon is sunny. Always pack a hat, sunglasses, and high-SPF sunscreen.',
        'Keep yourself fully hydrated and take quality breaks to sustain your energy.'
      ]
    },
    atmosphere: {
      description: 'Saigon is a city of stunning contrasts. Historic French colonial monuments stand side-by-side with sleek steel skyscrapers, and quiet alleyways hide right behind bustling leafy avenues. Explore these three signature districts to feel the true pulse of the city.',
      offlineMapTitle: 'Recommended Offline Map',
      tipsTitle: 'Travel Advice',
      tipsDesc: 'Sip alleyway coffee in the morning, tour colonial history in the afternoon, and dive into vibrant street food courts in the evening. Every hour reveals a new facet of Saigon.',
      districts: [
        {
          id: 'd1',
          name: 'District 1 - The Historic & Glamorous Center',
          description: 'The absolute beating heart of Saigon. Home to exquisite French colonial architecture (Notre Dame Cathedral, Central Post Office, Saigon Opera House) seamlessly combined with trendy cafes, premium boutiques, and the historic Ben Thanh Market. The perfect base for your stroll.',
          highlights: ['Stroll down high-fashion Dong Khoi Street', 'Snap historic photos at Central Post Office', 'Sample snacks in bustling Ben Thanh Market']
        },
        {
          id: 'd5',
          name: 'District 5 - The Chinese Heritage (Cholon / Chinatown)',
          description: 'A vibrant hub filled with centuries of Chinese-Vietnamese culture. Famous for its smoke-filled, magnificent temples (Thien Hau Pagoda, On Lang Assembly Hall), old Chinese-labeled medicine streets, and a spectacular culinary scene featuring South Chinese classics with a tropical twist.',
          highlights: ['Visit the spiritual Thien Hau Temple', 'Walk through the aromatic Herbal Medicine Street', 'Savor authentic dumplings on Ha Ton Quyen']
        },
        {
          id: 'd3',
          name: 'District 3 - Green Tree Canopies & Retro Vibe',
          description: 'Right next to District 1, but moving at a slightly gentler pace. Beautiful streets shaded by century-old trees host dozens of old French colonial villas converted into hip, cozy indie coffee shops, boutique eateries, and art spaces. A favorite hangout spot for local creative minds.',
          highlights: ['Tour the War Remnants Museum', 'Sip coffee inside a quiet renovated French villa', 'Marvel at the striking pink Tan Dinh Church']
        }
      ],
      mapLabels: {
        title: 'SAIGON STROLLING MAP',
        sub: 'Tap on a district to view detailed information',
        airport: 'Tan Son Nhat Airport',
        d3: 'District 3 (Retro & Cafe)',
        d1: 'District 1 (Glamorous Hub)',
        d5: 'District 5 (Chinatown Cholon)',
        river: 'Saigon River'
      },
      transportTip: 'Using apps like Grab or Xanh SM is much safer.'
    },
    transport: {
      heading: 'Safe Transport Guide',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: 'Saigon’s sea of millions of buzzing motorbikes might look terrifying at first glance. However, by using smart mobility applications, you can navigate easily and securely.',
      categories: [
        {
          id: 'apps',
          title: 'Ridesharing Apps (Highly Recommended)',
          description: 'Fares are calculated upfront and routes are GPS-tracked, eliminating language barriers and any chance of overcharging.',
          options: [
            { name: 'Grab', desc: 'The biggest app in Southeast Asia. Call motorbikes (GrabBike) or cars (GrabCar) in seconds. We strongly advise linking your credit card in the app before arriving.' },
            { name: 'Xanh SM', desc: 'Vietnam’s first all-electric (EV) taxi company. Sporting a signature baby blue color, these vehicles are spotless, odorless, quiet, and driven by extremely polite, well-trained drivers.' }
          ]
        },
        {
          id: 'taxis',
          title: 'Reputable Traditional Taxis',
          description: 'If hailing a cab on the street, ONLY choose these two premium operators, and ensure the driver turns on the taximeter.',
          options: [
            { name: 'Vinasun Taxi', desc: 'White cabs with red and green stripe details. Saigon’s most reliable traditional brand with drivers wearing tidy professional uniforms.' },
            { name: 'Mai Linh Taxi', desc: 'All-green cabs. A trusted nationwide company with strict meter control, meaning highly reliable pricing.' }
          ]
        },
        {
          id: 'crossing',
          title: 'How to Cross a Saigon Street',
          description: 'Crossing through an endless flow of motorbikes is an unforgettable adrenaline rush. Follow this golden rule to do it safely.',
          options: [
            { name: 'Walk slowly with a steady pace', desc: 'Do NOT run, stop, or turn back suddenly. Bike riders are actively anticipating your trajectory and will smoothly navigate around your back.' },
            { name: 'Make eye contact & signal', desc: 'Look at oncoming drivers to show you see them, and hold your hand slightly down to assert your intent to cross. They will slow down.' }
          ]
        }
      ],
      safetyTips: [
        'Never walk and use your phone on the street. It makes you a prime target for opportunistic bag-snatchers. Walk inside a shopfront before looking at your map.',
        'Wear cross-body bags slung away from the road, and hold your bag firmly against your chest when walking or riding.'
      ],
      popupDetails: [
        {
          title: 'Grab App Advice',
          text: 'Install Grab and link your payment card while you still have access to your home SMS network. This ensures you can seamlessly hail a ride immediately upon landing at the airport.'
        },
        {
          title: 'Spotting Fake Taxis',
          text: 'Scam taxis painted in similar green or white colors with slightly altered logos lurk around major transit hubs. Always verify the operator phone number printed on the car doors and look for official driver ID cards.'
        },
        {
          title: 'Avoid Panicking in the Street',
          text: 'Stopping dead in your tracks or jumping backward is the single biggest cause of street crossing incidents because it breaks the predictable flow for bike riders. Stay calm and walk steadily.'
        }
      ],
      options: [
        { name: 'Grab Bike (Motorbike)', desc: 'The fastest and cheapest way to navigate through busy streets. Driver provides a helmet.', payment: 'App / Cash', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (Car)', desc: 'Safe, cool, and comfortable transit option. Suitable for groups of 4-7 people.', payment: 'App / Cash', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: 'Metro (Urban Rail)', desc: 'Saigon\'s first urban railway line, connecting District 1 with neighboring areas.', payment: 'Card / Cash', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: 'Traditional Taxi', desc: 'Reputable brands like Vinasun and Mai Linh, ideal for hailing on the street.', payment: 'Cash / Card', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: 'Estimated Pricing (VND)',
      tableHeaders: ['Type', '1-2 km', '3-5 km', '5-10 km', 'Payment'],
      tableNote: '* Actual pricing may vary based on weather and peak hours.',
      pointsTitle: 'Transit Tips',
      points: [
        'Pre-download Grab and Xanh SM apps',
        'Link credit card for cashless convenience',
        'Only choose Vinasun or Mai Linh when hailing directly'
      ],
      rideApps: 'Recommended Ride Apps'
    },
    stay: {
      heading: 'Stay & Rejuvenate',
      subheading: 'Rejuvenate Your Senses',
      intro: 'After vibrant walks in the streets, refresh your mind and body at Saigon’s peaceful urban sanctuaries. Enjoy boutique hotels and wellness spa treatments.',
      categories: [
        {
          title: 'Boutique Hotels',
          subtitle: 'Urban Sanctuary',
          bullets: [
            'Settle into beautifully preserved Indochine architecture classics',
            'Cool down in infinity rooftop pools overlooking neon skyline views',
            'Experience heartfelt hospitality and artistic bespoke interiors'
          ]
        },
        {
          title: 'Spa & Herbal Wash',
          subtitle: 'Restore Core Energy',
          bullets: [
            'Nourish your body with traditional Vietnamese herbal massages',
            'Try the popular wellness herbal hairwash with neck massage',
            'Unwind in quiet aromatherapy spaces to escape travel fatigue'
          ]
        },
        {
          title: 'Hidden Cafes & Tea',
          subtitle: 'Cozy Rest Spots',
          bullets: [
            'Take a break in quiet cafes tucked away in green alleys',
            'Enjoy rich Vietnamese iced coffee or cooling herbal teas',
            'Write down your travel logs or chat warmly with friends'
          ]
        }
      ],
      tips: [
        'We suggest booking boutique hotels early. Check reviews and book your spa sessions in advance.',
        'Keep hydrated. Quality rest will make your Saigon exploration much better.'
      ],
      leftImgDesc: 'Elegant stay in charming boutique hotels',
      rightStack: [
        'Herbal wash to refresh your scalp',
        'Traditional massage to restore energy',
        'Artisan tea inside hidden spots'
      ]
    },
    food: {
      title: 'Saigon Food Guide',
      intro: 'A complete curated handbook of Saigon’s finest eats, featuring accurate opening hours and consistent UI styling.',
      categories: [
        {
          title: 'Saigon Pho',
          emoji: '🍜',
          quote: '"Saigon-style Pho is famous for its sweet, rich bone broth, served with abundant fresh herbs like basil and saw-tooth herb, and customizable with black hoisin and chili sauces."',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (District 3)',
              sub: 'A historic Michelin Bib Gourmand brand',
              desc: 'A legendary half-century-old noodle shop, extremely popular with international travelers.',
              addr: '260C Pasteur, Phường 8, District 3',
              hours: '06:00 - 22:30',
              price: '90,000 - 115,000 VND / bowl'
            },
            {
              name: 'Phở Việt Nam (District 1)',
              sub: 'Michelin Selected nominee',
              desc: 'Makes fresh rice noodles on-site; famous for its hot stone bowl Pho with Wagyu beef that keeps the broth piping hot.',
              addr: '14 Phạm Hồng Thái, Phường Bến Thành, District 1',
              hours: '06:00 - 03:00 (next day)',
              price: '90,000 - 350,000 VND / bowl'
            },
            {
              name: 'Phở Dậu (District 3)',
              sub: 'Classic northern flavors for over half a century',
              desc: 'Traditional Northern-style Pho without bean sprouts or herbs. Features a clear, deeply savory beef broth reflecting Nam Dinh heritage.',
              addr: 'Cư xá 288, Alley 288M1 Nam Kỳ Khởi Nghĩa, District 3',
              hours: '06:00 - 12:00 (Morning only)',
              price: '80,000 - 110,000 VND / bowl'
            },
            {
              name: 'Phở Lệ (District 5)',
              sub: 'Michelin Selected Southern-style Pho',
              desc: 'Rich, aromatic, and slightly sweet Southern beef broth paired with tender beef cuts and springy homemade beef balls.',
              addr: '413-415 Nguyễn Trãi, Phường 7, District 5',
              hours: '06:00 - 24:00 (Late night)',
              price: '85,000 - 110,000 VND / bowl'
            },
            {
              name: 'Phở Phú Vương (District 1)',
              sub: 'Herbal-aroma bone broth specialist',
              desc: 'Generous portions of brisket, rare beef, tendon, and meatballs served in a delicately fragrant bone broth.',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, District 1',
              hours: '06:00 - 23:00',
              price: '75,000 - 100,000 VND / bowl'
            }
          ]
        },
        {
          title: 'Saigon Banh Mi',
          emoji: '🥖',
          quote: "“Saigon’s Banh Mi is globally celebrated for its crispy baguette stuffed with rich liver pâté, fresh butter, assorted cold cuts, and pickled veggies.”",
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (District 1)',
              sub: 'The undisputed king of Saigon Banh Mi',
              desc: 'A huge portion (nearly 0.5kg) loaded with rich pâté, butter, and layers of cold cuts. Best shared by two.',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, District 1',
              hours: '11:00 - 21:00',
              price: '65,000 - 70,000 VND / loaf'
            },
            {
              name: 'Bánh Mì Bảy Hổ (District 1)',
              sub: 'Michelin Bib Gourmand awardee',
              desc: 'An 80-year-old traditional cart famous for its homemade pâté and fresh char siu prepared on the spot.',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, District 1',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20,000 - 35,000 VND / loaf'
            },
            {
              name: 'Bánh Mì Hồng Hoa (District 1)',
              sub: 'Highly recommended Michelin Selected',
              desc: 'Located near Ben Thanh Market. Constantly baking bread to stay crispy; fillings range from traditional cold cuts to roasted pork belly.',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, District 1',
              hours: '05:30 - 21:30',
              price: '30,000 - 50,000 VND / loaf'
            },
            {
              name: 'Bánh Mì Như Lan (District 1)',
              sub: 'Historic 50+ year Saigon culinary landmark',
              desc: 'Crispy baguette filled with house-made liver pâté, pork rolls, and char siu, located right next to Bitexco Tower.',
              addr: '50 Hàm Nghi, P. Bến Nghé, District 1',
              hours: '05:00 - 23:00',
              price: '35,000 - 60,000 VND / loaf'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (District 3)',
              sub: 'Pioneer of skillet-fried Banh Mi since 1958',
              desc: 'Sizzling skillet served with fried eggs, pate, sausage, and warm baguettes eaten on alleyway plastic stools.',
              addr: '53 Cao Thắng, Phường 3, District 3',
              hours: '06:00 - 11:00 (Morning only)',
              price: '50,000 - 70,000 VND / portion'
            }
          ]
        },
        {
          title: 'Saigon Coffee',
          emoji: '☕',
          quote: "“Once voted by The New York Times as one of the world’s best, Saigon’s Iced Milk Coffee perfectly balances bold robusta bitterness with sweet condensed milk.”",
          restaurants: [
            {
              name: 'Cộng Cà Phê',
              sub: 'Nostalgic retro subsidy-era theme',
              desc: 'Best seller: Coconut-rich iced coffee. Highlights: 26 Lý Tự Trọng | 127 Bùi Viện | Trường Sa canal view.',
              addr: 'Multiple locations in central Saigon',
              hours: '07:00 - 23:00 (Varies by store)',
              price: '40,000 - 75,000 VND'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng',
              sub: 'The iconic 24/7 "straining" coffee shop',
              desc: 'A 70-year heritage experience. Watch coffee brewed using cloth filters over a coal stove, and enjoy it on tiny plastic stools.',
              addr: '330/2 Phan Đình Phùng, P.1, Phu Nhuan Dist',
              hours: '24/7 (Open all day & night)',
              price: '15,000 - 25,000 VND'
            },
            {
              name: 'Cà Phê Vy (District 1)',
              sub: 'The ultimate street-watching coffee spot',
              desc: 'Sit on low wooden stools lining the pavement, enjoy the lively street vibe, and sip slow-dripped traditional coffee.',
              addr: '90 Nguyễn Du, P. Bến Nghé, District 1',
              hours: '06:00 - 23:00',
              price: '30,000 - 50,000 VND'
            },
            {
              name: 'Cheo Leo Café (District 3)',
              sub: 'Saigon\'s oldest filter coffee shop operating since 1938',
              desc: 'Hidden in a quiet alley, preserving vintage clay pot and cloth-filter coffee brewing techniques across generations.',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, District 3',
              hours: '05:15 - 22:00',
              price: '20,000 - 35,000 VND'
            },
            {
              name: 'The Workshop Coffee',
              sub: 'Saigon\'s premier specialty pour-over coffee bar',
              desc: 'Industrial-loft style studio on the 2nd floor, offering curated single-origin Vietnamese and global coffee beans.',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, District 1',
              hours: '08:00 - 21:00',
              price: '65,000 - 120,000 VND'
            }
          ]
        },
        {
          title: 'Com Tam',
          emoji: '🍛',
          quote: "“Originally a humble dish made from broken rice grains, Com Tam has evolved into Saigon’s signature comfort food, centered around a sweet-savory grilled pork chop.”",
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (Phu Nhuan)',
              sub: 'Michelin Bib Gourmand awardee',
              desc: 'Famous for its giant charcoal-grilled honey pork chop that completely covers the plate, perfectly charred and juicy.',
              addr: '84 Đặng Văn Ngữ, Phường 10, Phu Nhuan Dist',
              hours: '07:00 - 21:30',
              price: '70,000 - 140,000 VND'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (District 1)',
              sub: 'An iconic brand dating back to before 1975',
              desc: 'Huge menu with dozens of side dishes; pork ribs are cut thinner, seasoned with delicious five-spice powder in a spacious area.',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, District 1',
              hours: '06:00 - 21:00',
              price: '60,000 - 110,000 VND'
            },
            {
              name: 'Cơm Tấm Mộc',
              sub: 'A modern yet rustic broken rice spot loved by office workers and foodies',
              desc: 'Savor traditional broken rice in a clean, elegant wooden setting. Their signature honey-marinated pork ribs are exceptionally tender, juicy, and beautifully presented.',
              addr: '85 Lý Tự Trọng, Bến Thành, District 1',
              hours: '08:00 - 21:30',
              price: '45,000 - 90,000 VND'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (District 1)',
              sub: 'Renowned for thick-cut, juicy grilled pork chops',
              desc: 'Charcoal-grilled thick pork chops marinated to perfection, widely regarded as one of the finest broken rice plates in Saigon.',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, District 1',
              hours: '06:30 - 15:00',
              price: '120,000 - 180,000 VND'
            },
            {
              name: 'Cơm Tấm Kiều Giang (District 1)',
              sub: 'Classic late-night broken rice institution',
              desc: 'Serves honey-marinated grilled pork, steamed egg meatloaf, and crispy pork skin late into the night.',
              addr: '139 Nguyễn Trãi, P. Bến Thành, District 1',
              hours: '06:00 - 02:00 (next day)',
              price: '50,000 - 95,000 VND'
            }
          ]
        },
        {
          title: 'Food Complexes',
          emoji: '🏢',
          quote: "“Explore Saigon’s busy dining hubs, ranging from premium department store basement food halls, iconic centennial markets, to creative apartment blocks.”",
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (B2)',
              sub: 'Premium food hall featuring Asian & Japanese brands',
              desc: 'Nakajima Suisan Sushi, Baikohken Ramen, Tonkatsu Ito, Yamazaki bakery, Azabu Sabo matcha; local favorites Katinat and Maison Marou.',
              addr: '65 Lê Lợi, P. Bến Nghé, District 1',
              hours: '09:30 - 21:30 (Weekends until 22:00)',
              price: '30,000 - 250,000 VND'
            },
            {
              name: 'Ben Thanh Market Food Court (District 1)',
              sub: 'An iconic sanctuary for traditional street eats',
              desc: 'Sample every specialty imaginable: bun mam, fresh spring rolls, colorful sweet soups, and seafood. Shifts into a bustling night market.',
              addr: 'Lê Lợi Street, P. Bến Thành, District 1',
              hours: '07:00 - 19:00 (Night market after 19:00)',
              price: '40,000 - 200,000 VND'
            },
            {
              name: '42 Nguyen Hue Cafe Apartment (District 1)',
              sub: 'A unique vertical artistic hub in a vintage block',
              desc: 'Dozens of independent chic cafes, boutique tea shops, and stylish eateries nested in an old apartment overlooking the walking street.',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, District 1',
              hours: '08:00 - 22:30 (Varies by shop)',
              price: '40,000 - 300,000 VND'
            },
            {
              name: 'Vinh Khanh Food Street (District 4)',
              sub: 'Saigon\'s most vibrant late-night seafood hub',
              desc: 'Bustling open-air street dining famous for garlic butter snails, grilled seafood, and piping hot hotpots served late.',
              addr: 'Vĩnh Khánh Street, Ward 8, District 4',
              hours: '16:00 - 01:00 (next day)',
              price: '50,000 - 300,000 VND'
            },
            {
              name: 'Bui Vien Walking Street (District 1)',
              sub: 'Non-stop nightlife and global street food strip',
              desc: 'Lively pedestrian strip filled with street barbecue skewers, craft beers, live music, and international eateries.',
              addr: 'Bùi Viện Street, P. Phạm Ngũ Lão, District 1',
              hours: '18:00 - 04:00 (next day)',
              price: '30,000 - 250,000 VND'
            }
          ]
        }
      ]
    },
    culture: {
    title: 'Culture & Landmarks',
    intro: 'Discover Saigon’s historical depth through elegant French architecture, moving museums, sacred spiritual sites, peaceful parks, and the dynamic modern energy of the city.',
    categories: {
      heritage: 'Heritage & History',
      spiritual: 'Spiritual & Sacred',
      modern: 'Urban & Nightlife',
      nature: 'Nature & Suburbs'
    },
    items: [
      {
        category: 'heritage',
        name: 'Saigon Central Post Office',
        sub: 'A 130-year-old architectural masterpiece',
        desc: 'Designed by Gustave Eiffel, featuring a stunning vaulted iron ceiling and historic wooden telephone booths. A living testament to colonial-era mail services.',
        addr: '2 Cong xa Paris, Ben Nghe, District 1',
        hours: '07:30 - 18:00',
        price: 'Free admission',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: 'Independence Palace',
        sub: 'Historical symbol of national reunification',
        desc: 'A magnificent modernist building designed by architect Ngo Viet Thu. It served as the former presidential palace and witnessed the historic end of the war on April 30th, 1975.',
        addr: '135 Nam Ky Khoi Nghia, Ben Thanh, District 1',
        hours: '08:00 - 16:30',
        price: '65,000 VND',
        emoji: '🏰'
      },
      {
        category: 'heritage',
        name: 'Ho Chi Minh City Hall',
        sub: 'French Renaissance style government palace',
        desc: 'Located at the head of Nguyen Hue Walking Street, featuring elegant arches and a beautiful clock tower. The exterior is illuminated spectacularly with art lights at night.',
        addr: '86 Le Thanh Ton, Ben Nghe, District 1',
        hours: 'Exterior view only / 24/7',
        price: 'Free',
        emoji: '🏛️'
      },
      {
        category: 'heritage',
        name: 'Saigon Opera House',
        sub: 'The heart of French classical performing arts',
        desc: 'A classic theatre decorated with elaborate relief patterns in the Flamboyant style. It is the premier venue for award-winning local spectacles like the A O Show.',
        addr: '7 Cong truong Lam Son, Ben Nghe, District 1',
        hours: 'Depends on performance schedules',
        price: 'Ticketed',
        emoji: '🎭'
      },
      {
        category: 'heritage',
        name: 'War Remnants Museum',
        sub: 'A powerful look into the Vietnam War',
        desc: 'A highly visited museum presenting moving photographs, historical artifacts, and heavy military aircraft. It delivers a strong message of peace and resilience.',
        addr: '28 Vo Van Tan, Vo Thi Sau, District 3',
        hours: '07:30 - 17:30',
        price: '40,000 VND',
        emoji: '🛡️'
      },
      {
        category: 'heritage',
        name: 'HCMC Museum of History',
        sub: 'Thousands of years of Southern heritage',
        desc: 'A beautiful Indochina-style building next to the botanical gardens, housing a rich collection of artifacts from prehistoric times, Oc Eo culture, Champa, and the Nguyen Dynasty.',
        addr: '2 Nguyen Binh Khiem, Ben Nghe, District 1',
        hours: '08:00 - 11:30 | 13:00 - 17:00',
        price: '40,000 VND',
        emoji: '📜'
      },
      {
        category: 'heritage',
        name: 'HCMC Museum of Fine Arts',
        sub: 'Romantic and artistic colonial mansion',
        desc: 'The former yellow mansion of the wealthy Hui Bon Hoa family. It features European stained-glass windows, breezy corridors, and Saigon’s oldest working elevator.',
        addr: '97A Pho Duc Chinh, Nguyen Thai Binh, District 1',
        hours: '08:00 - 17:00',
        price: '30,000 VND',
        emoji: '🎨'
      },
      {
        category: 'spiritual',
        name: 'Saigon Notre-Dame Cathedral',
        sub: 'Historic neo-Romanesque basilica',
        desc: 'An iconic cathedral built with imported Marseille red bricks that remain moss-free. Features twin towering bell towers, standing as a historical masterpiece in the city center.',
        addr: '1 Cong xa Paris, Ben Nghe, District 1',
        hours: 'Under restoration (Exterior view only)',
        price: 'Free',
        emoji: '⛪'
      },
      {
        category: 'spiritual',
        name: 'Tan Dinh Pink Church',
        sub: 'A fairytale-like pink cathedral',
        desc: 'A whimsical church painted in a vibrant pastel pink, blending Gothic and Baroque details. One of the most photogenic check-in spots attracting global travelers.',
        addr: '289 Hai Ba Trung, Vo Thi Sau, District 3',
        hours: '08:00 - 17:30',
        price: 'Free',
        emoji: '💒'
      },
      {
        category: 'spiritual',
        name: 'Jade Emperor Pagoda',
        sub: 'Sacred temple visited by President Obama',
        desc: 'An atmospheric temple rich in Chinese Buddhist art with exquisite paper-mache statues. Visited by US President Barack Obama in 2016 to pay respects.',
        addr: '73 Mai Thi Luu, Da Kao, District 1',
        hours: '07:00 - 18:00',
        price: 'Free',
        emoji: '🛕'
      },
      {
        category: 'spiritual',
        name: 'Vinh Nghiem Pagoda',
        sub: 'One of the grandest Buddhist temples in Southern Vietnam',
        desc: 'Featuring a magnificent 7-story stone tower with elaborate carvings. It perfectly blends classic Northern Vietnamese Buddhist layout with modern concrete materials.',
        addr: '339 Nam Ky Khoi Nghia, Vo Thi Sau, District 3',
        hours: '07:00 - 20:00',
        price: 'Free',
        emoji: '⛩️'
      },
      {
        category: 'spiritual',
        name: 'Ba Thien Hau Temple (Cho Lon)',
        sub: 'A historic spiritual hub in Chinatown',
        desc: 'Located in busy Chinatown. Renowned for its detailed pottery figurines on the roof and large incense coils hanging under the sunlit atrium, filling the air with incense smoke.',
        addr: '710 Nguyen Trai, Ward 11, District 5',
        hours: '06:30 - 16:30',
        price: 'Free',
        emoji: '🏮'
      },
      {
        category: 'modern',
        name: 'Landmark 81',
        sub: 'Vietnam’s tallest skyscraper',
        desc: 'A soaring tower inspired by a traditional bundle of bamboo. Houses a premier luxury shopping mall, fine dining restaurants, and an observation deck offering city views from the clouds.',
        addr: '720A Dien Bien Phu, Ward 22, Binh Thanh District',
        hours: '09:00 - 22:00',
        price: 'Mall access free',
        emoji: '🏙️'
      },
      {
        category: 'modern',
        name: 'Ben Thanh Metro Station',
        sub: 'Futuristic urban transit hub',
        desc: 'A newly designed underground central station featuring a magnificent circular skylight (toplight). A great futuristic photo spot that shows Saigon’s 21st-century progress.',
        addr: 'Quach Thi Trang Square, Ben Thanh, District 1',
        hours: '06:00 - 22:00',
        price: 'Train fare applies',
        emoji: '🚇'
      },
      {
        category: 'modern',
        name: 'Nguyen Hue Walking Street at Night',
        sub: 'Vibrant waterfront pedestrian square',
        desc: 'Every evening, this wide pedestrian avenue transforms into a colorful space with glowing musical fountains, cool breezes from the river, and crowds of locals.',
        addr: 'Nguyen Hue, Ben Nghe, District 1',
        hours: '24/7 (Most lively after 18:00)',
        price: 'Free',
        emoji: '🌃'
      },
      {
        category: 'modern',
        name: 'Nguyen Hue Street Performances',
        sub: 'Creative hub for young local artists',
        desc: 'A gathering spot for acoustic bands, street dancers, and impromptu art performances that show the raw, expressive energy of Saigon’s younger generation.',
        addr: 'Nguyen Hue, Ben Nghe, District 1',
        hours: 'Saturday & Sunday evenings',
        price: 'Free',
        emoji: '🎸'
      },
      {
        category: 'modern',
        name: 'Bui Vien Walking Street',
        sub: 'Energetic, sleepless nightlife hub',
        desc: 'The city’s famous backpacker street that comes alive at night with loud EDM beats, bright neon lights, cheap draft beer, and a friendly global crowd.',
        addr: 'Bui Vien, Pham Ngu Lao, District 1',
        hours: '19:00 - 02:00 (Best on weekends)',
        price: 'Free entry',
        emoji: '🍻'
      },
      {
        category: 'modern',
        name: 'Ho Thi Ky Flower Market',
        sub: 'A colorful midnight flower wonderland',
        desc: 'The city’s largest wholesale flower market, most active during the early hours of the morning. Walk through pathways of colorful blooms and enjoy the adjacent street food lane.',
        addr: 'Alley 52 Ho Thi Ky, Ward 1, District 10',
        hours: 'Open 24/7 (Best visited between 00:00 - 03:00)',
        price: 'Free',
        emoji: '🌸'
      },
      {
        category: 'modern',
        name: 'Rong Vang Water Puppet Theatre',
        sub: 'Charming folk performance on water',
        desc: 'Watch traditional Vietnamese folk tales played by colorful wooden puppets dancing on water, accompanied by live classical instruments. A delightful cultural show.',
        addr: '55B Nguyen Thi Minh Khai, Ben Thanh, District 1',
        hours: 'According to showtimes (Usually 17:00 onwards)',
        price: 'Around 150,000 VND',
        emoji: '🎭'
      },
      {
        category: 'modern',
        name: 'Motorbike City Tour',
        sub: 'The ultimate, authentic Saigon experience',
        desc: 'Zip through historic back alleys and buzzing boulevards on the back of a scooter. Feel the evening breeze and immerse yourself directly in the pulse of local traffic.',
        addr: 'Across central districts',
        hours: 'Flexible (Day & Night tours available)',
        price: 'Varies by tour provider',
        emoji: '🛵'
      },
      {
        category: 'modern',
        name: 'Double-Decker Bus Tour',
        sub: 'Scenic open-air city sightseeing',
        desc: 'Hop onto an open-top bus for a relaxing, scenic ride through the illuminated city center, showcasing Saigon’s illuminated colonial landmarks and skyscrapers.',
        addr: 'Pick up: Central Post Office, District 1',
        hours: '09:00 - 22:30',
        price: '150,000 - 300,000 VND',
        emoji: '🚌'
      },
      {
        category: 'nature',
        name: 'Cu Chi Tunnels',
        sub: 'Incredible underground defense maze',
        desc: 'An immense 250km underground network hand-dug during the war. A legendary site located in a peaceful forest on the outskirts of the city.',
        addr: 'Provincial Road 15, Phu My Hung, Cu Chi District (60km from city center)',
        hours: '07:00 - 17:00',
        price: '35,000 VND (VN) | 125,000 VND (Foreigners)',
        emoji: '🌴'
      },
      {
        category: 'nature',
        name: 'Can Gio Mangrove Biosphere Reserve',
        sub: 'Pristine coastal green lung',
        desc: 'An UNESCO-protected biosphere reserve featuring massive mangrove forests, cheeky wild monkeys, and dramatic swamp crocodile sanctuaries.',
        addr: 'Rung Sac Road, An Thoi Dong, Can Gio District',
        hours: '07:30 - 17:00',
        price: 'Varies by sub-attraction',
        emoji: '🐊'
      },
      {
        category: 'nature',
        name: 'Saigon Zoo & Botanical Gardens',
        sub: 'Vietnam’s oldest zoo and green oasis',
        desc: 'Established in 1864, this lush green garden houses towering trees, tropical plants, and rare animals, offering a quiet escape right in the city center.',
        addr: '2 Nguyen Binh Khiem, Ben Nghe, District 1',
        hours: '07:00 - 18:30',
        price: '60,000 VND',
        emoji: '🦁'
      },
      {
        category: 'nature',
        name: 'Tao Dan Park',
        sub: 'A quiet forest sanctuary in District 1',
        desc: 'A dense green park shaded by century-old heritage trees. Popular in the early mornings for bird lovers gathering to let their birds sing over tea.',
        addr: 'Nguyen Thi Minh Khai, Ben Thanh, District 1',
        hours: '06:00 - 22:00',
        price: 'Free',
        emoji: '🌳'
      },
      {
        category: 'nature',
        name: 'September 23rd Park',
        sub: 'Breezy urban park linking local districts',
        desc: 'Connecting Ben Thanh Market and the backpacker district. Features lush grassy lawns, the subterranean Sense Market, and lively exchanges between locals and travelers.',
        addr: 'Pham Ngu Lao, Pham Ngu Lao Ward, District 1',
        hours: 'Open 24/7',
        price: 'Free',
        emoji: '🍃'
      }
    ]
  },

    shopping: {
      title: 'Shop Local Souvenirs',
      intro: 'Uncover Saigon’s best shopping spots, from traditional markets packing everything you need to modern designer clothing boutiques.',
      items: [
        {
          name: 'Ben Thanh Market',
          sub: 'A century-old icon and souvenir goldmine',
          desc: 'The absolute commercial symbol of Saigon. Explore hundreds of stalls filled with handcrafted lacquerware, embroidered silk, conical hats, premium local coffee, and nuts. Bartering (negotiating prices) is highly expected and part of the fun!',
          addr: 'Đường Lê Lợi, Phường Bến Thành, District 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: 'Binh Tay Market (Cholon)',
          sub: 'Chinatown’s wholesale market with ancient roof tiles',
          desc: 'A spectacular Chinese-influenced architecture wholesale market located in the heart of Cholon. It is filled with dried food, traditional herbs, kitchenware, spices, and clothing. A very deep, authentic local merchant vibe.',
          addr: '57A Tháp Mười, Phường 2, District 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground',
          sub: 'Hip underground mall for Vietnamese streetwear',
          desc: 'An edgy concrete-styled underground shopping center housing dozens of the most popular Vietnamese local designer clothing brands. Highly popular among cool local youth for its high-fashion, streetwear, and indie design aesthetics.',
          addr: '26 Lý Tự Trọng, Bến Nghé, District 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Lục Lam Cultural Rest Stop',
      subtitle: 'Lục Lam Cultural Rest Stop',
      intro: 'A cultural tea oasis blending artisan Vietnamese herbal teas, organic coffee, and handmade traditional delicacies. Find absolute peace in our cozy Indochine sanctuary.',
      aboutHeading: 'About Lục Lam',
      aboutText: 'Tucked away in a tranquil corner of Saigon, Lục Lam is a cultural stop born from our deep passion for organic Vietnamese tea, heritage coffee, and traditional handicraft. Set in a charming, nostalgic Indochine atmosphere, we offer a place to slow down, nourish your senses, and experience the timeless hospitality of Vietnam.',
      menuHeading: 'Our Signature Offerings',
      menuItems: [
        {
          name: 'Red Lava Herbal Tea',
          desc: 'Vibrant fusion of hibiscus flowers, dried orange slices, and cinnamon. Tangy, aromatic, rich in Vitamin C and antioxidants.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Velvet Rose Tea',
          desc: 'Selected French rosebuds harmonized with jasmine and chamomile. Elegant floral notes that soothe the spirit and nurture healthy skin.',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Violet Jasmine Tea',
          desc: 'Organic green tea infused with natural jasmine blossoms and purple botanical accents. Delicate floral aroma for peaceful relaxation.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Golden Peach Herbal Tea',
          desc: 'Succulent golden peach notes blended with natural wild honey and herbs. Naturally sweet and refreshing aftertaste.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Zen Relaxing Tea',
          desc: 'Soothing blend of chamomile flowers, lotus plumule, and lavender notes. Reduces stress and promotes peaceful, restorative sleep.',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: 'Exclusive Gift for Travelers',
      voucherDesc: 'Simply present this screen to our staff or scan the QR code at checkout to claim: 10% OFF YOUR TOTAL BILL or 1 COMPLIMENTARY TRADITIONAL PASTRIES SET with any tea order.',
      voucherBadge: 'O2O Privilege',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: 'Claim Exclusive Voucher',
      voucherClaimed: 'Applied! Present this coupon screen to the cashier.'
    },
    info: {
      title: 'Useful & Essential Info',
      intro: 'Essential traveler tools including official emergency contact lines, premium clinics, the best currency exchange counters, and payment tips.',
      categories: [
        {
          title: 'Emergency Contacts & International Medical',
          items: [
            { label: 'FV Hospital (District 1 Clinic)', detail: '3rd Floor, Bitexco Financial Tower, 2 Hải Triều, D1. Multilingual (EN/FR/JA/ZH) 24/7 emergency. Tel: (028) 3822 7878' },
            { label: 'Family Medical Practice', detail: '34 Lê Duẩn, Bến Nghé, District 1. Premium international clinic with English/Japanese/Chinese translators. Tel: (028) 3822 7848' },
            { label: 'Tourist Police (District 1)', detail: '24-26 Pasteur, District 1. Dedicated service for international tourist complaints and assistance. Tel: (028) 3824 4103' }
          ]
        },
        {
          title: 'Best Currency Exchange (Best Rates)',
          items: [
            { label: 'Ha Tam Gold Shop (Ben Thanh Area)', detail: '2 Nguyễn An Ninh, District 1 (Right opposite Ben Thanh Market West Gate). World-famous gold shop offering the best currency exchange rates in Saigon. Fast transactions.' },
            { label: 'Mai Van Gold Shop', detail: 'Located directly opposite Ha Tam Gold Shop. Offers highly competitive exchange rates, perfect fallback when Ha Tam is overcrowded.' }
          ]
        },
        {
          title: 'SIM Cards & ATM Withdrawals',
          items: [
            { label: 'Recommended Mobile Networks', detail: 'Buy a Viettel or Vinaphone physical SIM card at airport counters. If using eSIM, Viettel is highly recommended for superior coverage nationwide.' },
            { label: 'Credit Cards & ATMs', detail: 'Most downtown cafes and convenience stores accept Visa/Mastercard. Withdraw local VND securely from ATMs of Vietcombank, Techcombank, and HSBC.' }
          ]
        }
      ]
    }
  },
  ko: {
    title: '사이곤 포켓 가이드',
    subtitle: '사이곤 산책 & 독점 케어 가이드',
    faq: [
      { q: '룩람은 호찌민시 어디에 있나요?', a: '룩람은 {{address}}에 있습니다.' },
      { q: '룩람 영업시간은 어떻게 되나요?', a: '연중무휴, {{hours}}입니다.' },
      { q: '사이곤에서 안전하게 이동하려면?', a: '차량 호출 앱({{apps}})은 예약 전에 요금이 표시됩니다. 길에서 택시를 잡을 때는 {{taxis}}를 고르고, 미터기가 켜져 있는지 확인하세요.' },
      { q: '사이곤에서 이동 비용은 얼마인가요?', a: '오토바이 단거리는 약 {{fareBike}}, 승용차는 {{fareCar}} 정도입니다. 날씨와 혼잡 시간대에 따라 달라집니다.' },
      { q: '벤탄 시장은 어디에 있나요?', a: '호찌민시 1군 벤탄동에 있습니다.' },
      { q: '룩람에서는 어떤 차를 파나요?', a: '{{teas}}. 가격은 {{priceFrom}}부터입니다.' },
      { q: '이 가이드는 어떤 언어로 볼 수 있나요?', a: '{{languages}}.' },
      { q: '오토바이가 많은 길은 어떻게 건너나요?', a: '천천히 일정한 속도로 걷고, 멈추거나 뛰지 마세요. 운전자들이 보행자의 경로를 보고 뒤쪽으로 돌아 지나갑니다.' },
      { q: '룩람 매장은 어디에 있나요?', a: '매장 {{storeCount}}곳: {{stores}}. 문의는 {{phone}} 또는 {{email}}.' },
    ],
    contact: {
      heading: '룩람 연락처',
      stores: '매장 안내',
      phone: '전화',
      email: '이메일',
      office: '본사',
      licence: '사업자등록번호',
    },
    faqHeading: 'Câu hỏi thường gặp',
    brand: 'LỤC LAM',
    author: '룩람',
    pages: {
      cover: '커버',
      welcome: '소개',
      atmosphere: '도시 분위기',
      transport: '안전한 이동',
      stay: '머물기 & 힐링',
      food: '시그니처 미식',
      culture: '문화 & 필수 명소',
      shopping: '쇼핑',
      luclam: '룩람 체험',
      info: '유용한 정보'
    },
    cover: {
      heading: 'SAIGON',
      subheading: 'POCKET GUIDE',
      tagline: '사이곤 산책 & 독점 케어 가이드',
      badge: 'LOCAL VIBES • SAIGON POCKET GUIDE',
      scanMe: 'SCAN ME'
    },
    welcome: {
      heading: '역동적인 도시,\n깊은 역사,\n그리고 따뜻한 사람들.',
      p1: '사이곤(호치민시)은 베트남의 경제와 문화의 중심지입니다. 프랑스 식민지 시절의 건축물, 맛있는 로컬 푸드, 그리고 끊임없는 활력이 어우러진 매력적인 도시입니다.',
      p2: '이 가이드에는 첫 방문자와 재방문자 모두에게 유용한 정보를 압축하여 담았습니다. 사이곤의 거리를 걷고, 맛보고, 느끼며 자신만의 특별한 여정을 시작해보세요.',
      highlight: '사이곤이 당신을 기다립니다.',
      videoTitle: '\\\\ 여행 비디오 //',
      videoDesc: '비디오를 통해 사이곤의 매력을 만나보세요! 활기찬 도시 분위기와 주요 명소를 소개합니다.',
      coffeeTitle: '소금 커피 & 코코넛 커피',
      features: [
        { title: '친절한 현지인들', desc: '사이곤 사람들은 매우 밝고 친절합니다. 길을 물어보면 언제나 미소로 도와줄 것입니다.' },
        { title: '미식의 천국', desc: '쌀국수(포)부터 반미, 향긋한 커피까지, 매 순간 새로운 미식의 즐거움이 가득합니다.' },
        { title: '역사와 문화', desc: '유서 깊은 콜로니얼 건축물, 전쟁 박물관, 수많은 사찰과 시장 등 다채로운 볼거리가 가득합니다.' },
        { title: '안전한 이동', desc: '스마트폰 차량 호출 앱과 편리한 대중교통으로 초보자도 안심하고 여행할 수 있습니다.' }
      ],
      advice: [
        '햇빛이 강하므로 모자와 자외선 차단제를 꼭 챙기세요.',
        '중간중간 수분을 충분히 섭취하며 편안한 여행을 즐기세요.'
      ]
    },
    atmosphere: {
      description: '사이곤은 다채로운 대비의 도시입니다. 프랑스 통치 시절의 흔적이 깃든 아름다운 건축물과 활기찬 현지 시장, 다양한 문화가 어우러진 독특한 매력을 3가지 시그니처 구역을 통해 느껴보세요.',
      offlineMapTitle: '오프라인 추천 지도',
      tipsTitle: '여행 팁',
      tipsDesc: '아침에는 카페 투어, 낮에는 역사 탐방, 밤에는 길거리 야시장이나 루프탑 바에서 시원한 음료를 즐겨보세요!',
      districts: [
        {
          id: 'd1',
          name: '1구 (District 1) - 역사와 화려함의 중심지',
          description: '사이곤의 심장부로, 프랑스 식민지 풍의 건축물(노트르담 대성당, 중앙우체국, 오페라하우스)과 고급 트렌디 카페, 세련된 부티크숍, 그리고 유서 깊은 벤타인 시장이 함께 공존하는 도보 여행의 최적의 출발점입니다.',
          highlights: ['동khoi 패션 거리 거닐기', '중앙우체국에서 기념 사진 찍기', '벤타인 시장에서 먹거리 즐기']
        },
        {
          id: 'd5',
          name: '5구 (District 5) - 중국 전통문화의 향기 (차이나타운)',
          description: '백 년이 넘는 세월 동안 이어져 온 중국계 베트남인들의 문화와 역사가 깊게 스며있는 곳입니다. 향불이 피어오르는 고풍스러운 사원들(티엔하우 사원, 온랑 회관), 약재상 거리, 동양식 미식이 독특한 조화를 이룹니다.',
          highlights: ['신비로운 티엔하우 사원 방문', '향긋한 한방 약재상 거리 걷기', '하똔꾸옌 거리에서 전통 만두 맛보기']
        },
        {
          id: 'd3',
          name: '3구 (District 3) - 푸른 가로수와 빈티지 빌라의 조화',
          description: '1구 바로 옆에 위치하고 있지만, 훨씬 아늑하고 한적한 페이스를 자랑합니다. 백 년이 넘은 푸른 가로수길 사이로 오래된 프랑스식 빌라를 개조한 힙한 로컬 카페, 아기자기한 식당, 예술 공간이 가득해 현지 젊은이들이 가장 즐겨 찾는 아지트입니다.',
          highlights: ['전쟁증적박물관 관람', '프랑스식 빌라 개조 카페에서 커피 한잔', '핑크빛 탄딘 교회 감상']
        }
      ],
      mapLabels: {
        title: '사이곤 역사 & 도보 간이 지도',
        sub: '핀을 탭하면 상세 구역 정보를 확인할 수 있습니다',
        airport: '탄손누트 국제공항',
        d3: '3구 (빈티지 카페)',
        d1: '1구 (시내 중심 & 역사)',
        d5: '5구 (차이나타운)',
        river: '사이곤 강'
      },
      transportTip: '그랩(Grab)이나 싼SM(Xanh SM) 앱을 이용해 이동하면 안전합니다.'
    },
    transport: {
      heading: '안전하고 스마트한 이동 가이드',
      subheading: 'Saigon Strolls with Peace of Mind',
      intro: '사이곤 특유의 끊임없는 오토바이 물결에 놀랄 수 있지만, 차량 호출 앱을 이용하면 아주 쉽고 저렴하게 여행할 수 있습니다.',
      categories: [
        {
          id: 'apps',
          title: '스마트폰 차량 호출 앱 (적극 추천)',
          description: '요금이 사전에 고정되어 투명하고 목적지 설정이 간편해 의사소통 걱정 없이 안심하고 탑승할 수 있습니다.',
          options: [
            { name: 'Grab (그랩)', desc: '동남아시아 대표 앱. 차량(GrabCar)과 오토바이(GrabBike)를 모두 빠르게 부를 수 있으며, 신용카드를 연동해두면 더욱 편리합니다.' },
            { name: 'Xanh SM (싼 SM)', desc: '베트남의 프리미엄 100% 전기차(EV) 호출 서비스. 차량이 매우 청결하고 조용하며 기사가 아주 친절해 만족도가 매우 높습니다.' }
          ]
        },
        {
          id: 'taxis',
          title: '믿을 수 있는 브랜드 택시',
          description: '길거리에서 직접 택시를 잡을 때는 바가지 요금을 피하기 위해 반드시 다음 두 곳의 신뢰할 수 있는 대기업 브랜드 택시를 이용하세요.',
          options: [
            { name: 'Vinasun (비나선)', desc: '흰색 차체에 녹색/적색 스트라이프 디자인. 신뢰받는 정통 오리지널 택시 브랜드입니다.' },
            { name: 'Mai Linh (마이린)', desc: '대표적인 녹색 택시. 전국 어디서나 쉽게 볼 수 있으며 미터제 요금이 칼같이 적용됩니다.' }
          ]
        },
        {
          id: 'crossing',
          title: '사이곤에서 길 건너는 요령',
          description: '끝없이 밀려오는 오토바이 물결 사이로 길을 건너는 것은 짜릿한 경험입니다. 아래 두 가지 원칙만 지키면 안전하게 건널 수 있습니다.',
          options: [
            { name: '일정한 속도로 걷고, 갑자기 멈추지 않기', desc: '뛰거나 멈추거나 되돌아가지 마세요. 오토바이 운전자들은 보행자의 이동 경로를 미리 예측해 뒤쪽으로 부드럽게 피해 갑니다.' },
            { name: '눈을 마주치고 손으로 신호하기', desc: '다가오는 운전자를 바라보며 "보고 있다"는 신호를 주고, 손을 아래로 살짝 들어 건너겠다는 뜻을 전하세요. 속도를 줄여 줍니다.' }
          ]
        }
      ],
      safetyTips: [
        '길에서 휴대폰을 보며 걷지 마세요. 오토바이 날치기의 표적이 되기 가장 쉽습니다. 지도를 확인해야 한다면 큰 상점 안이나 입구 쪽으로 들어가서 보세요.',
        '크로스백은 차도 반대쪽으로 메고, 걷거나 오토바이를 탈 때는 가방을 가슴 쪽으로 바짝 끌어안으세요.'
      ],
      popupDetails: [
        {
          title: 'Grab 사용 팁',
          text: '앱 설치와 휴대폰 인증, 카드 등록은 한국에서 미리 끝내 두세요. 본인 명의로 문자(SMS)를 받을 수 있을 때 해두어야 합니다. 그래야 공항에 내리자마자 바로 차를 불러 투명한 요금으로 호텔까지 갈 수 있습니다.'
        },
        {
          title: '가짜 택시 주의',
          text: '공항과 주요 관광지 주변에는 Vinasun이나 Mai Linh의 색상과 로고를 거의 똑같이 흉내 낸 가짜 택시가 많습니다. 타기 전에 차 문에 적힌 대표 전화번호와 기사의 사원증을 반드시 확인하세요.'
        },
        {
          title: '길 건널 때 당황하지 않기',
          text: '오토바이가 몰려오면 멈추거나 뒤로 물러서고 싶어지지만, 이것이 사고의 가장 큰 원인입니다. 운전자가 보행자의 방향을 예측할 수 없게 되기 때문입니다. 당황하지 말고 침착하게 계속 걸으세요.'
        }
      ],
      options: [
        { name: 'Grab Bike (오토바이)', desc: '복잡한 도심을 가장 빠르고 저렴하게 이동하는 방법. 헬멧은 기사가 제공합니다.', payment: '앱 / 현금', fares: ['15k-25k', '25k-40k', '40k-70k'] },
        { name: 'Grab Car (승용차)', desc: '안전하고 시원하며 편안한 이동 수단. 4~7인 그룹에 적합합니다.', payment: '앱 / 현금', fares: ['40k-70k', '70k-120k', '120k-200k'] },
        { name: 'Metro (도시철도)', desc: '사이곤 최초의 도시철도 노선으로, 1군과 인근 지역을 연결합니다.', payment: '카드 / 현금', fares: ['7k-10k', '10k-15k', '15k-20k'] },
        { name: '일반 택시', desc: 'Vinasun, Mai Linh 등 신뢰할 수 있는 대형 브랜드. 길에서 직접 잡을 때 적합합니다.', payment: '현금 / 카드', fares: ['20k-40k', '50k-90k', '90k-150k'] }
      ],
      tableTitle: '예상 요금 (VND)',
      tableHeaders: ['이동 수단', '1-2 km', '3-5 km', '5-10 km', '결제'],
      tableNote: '* 실제 요금은 날씨와 혼잡 시간대에 따라 달라질 수 있습니다.',
      pointsTitle: '이동 팁',
      points: [
        'Grab과 Xanh SM 앱 미리 설치하기',
        '신용카드를 연동해 현금 없이 결제하기',
        '길에서 잡을 때는 Vinasun 또는 Mai Linh만 타기'
      ],
      rideApps: '추천 차량 호출 앱'
    },
    stay: {
      heading: '머물기 & 힐링',
      subheading: 'Rejuvenate Your Senses',
      intro: '활기찬 도심을 둘러본 후에는 조용하고 편안한 공간에서 휴식을 취하세요. 품격 있는 호텔과 스파에서 몸과 마음을 건강하게 채워보세요.',
      categories: [
        {
          title: '부티크 호텔',
          subtitle: '도심 속 오아시스',
          bullets: [
            '클래식한 프랑스풍 건축에서 경험하는 옛 사이곤의 정취',
            '루프탑 수영장에서 도시의 야경을 감상하며 즐기는 여유',
            '따뜻한 환대와 감각적인 아트 공간이 주는 특별함'
          ]
        },
        {
          title: '스파 & 헤어 케어',
          subtitle: '피로를 푸는 시간',
          bullets: [
            '천연 허브를 이용한 전통 베트남식 테라피 마사지',
            '인기 만점 허벌 헤어 워시와 어깨/목 케어',
            '아로마 향 가득한 조용한 공간에서 여행의 피로 회복'
          ]
        },
        {
          title: '숨은 카페 & 티 타임',
          subtitle: '나만의 잔잔한 휴식',
          bullets: [
            '골목 안 아늑한 카페에서 즐기는 여유로운 티타임',
            '진한 베트남 커피와 상큼한 허브티 맛보기',
            '여행 일기를 쓰거나 친구와 아늑하게 나누는 담소'
          ]
        }
      ],
      tips: [
        '인기 스파와 호텔은 사전 예약을 권장합니다.',
        '수분을 자주 섭취하고 중간 휴식을 취하면 여행이 한결 즐거워집니다.'
      ],
      leftImgDesc: '부티크 호텔에서의 세련된 휴식',
      rightStack: [
        '허벌 헤어 워시 힐링',
        '전통 마사지로 피로 회복',
        '아늑한 카페에서 차 한잔'
      ]
    },
    food: {
      title: '사이곤 필수 맛집 & 시그니처 미식',
      intro: '진한 국물의 소고기 쌀국수(Phở), 바삭함이 가득한 반미(Bánh mì), 그리고 달콤하고 고소한 코코넛 연유 커피(Cà phê sữa đá)까지 꼭 경험해야 할 원조 맛집 리스트.',
      categories: [
        {
          title: '포 (쌀국수)',
          emoji: '🍜',
          quote: '“진한 소고기 사골 육수, 상큼한 허브 향, 그리고 해선장과 칠리 소스의 조화가 일품인 사이곤 대표 쌀국수입니다.”',
          restaurants: [
            {
              name: 'Phở Hòa Pasteur (3구)',
              sub: '미슐랭 빕구르망에 빛나는 전통 쌀국수',
              desc: '깊고 진한 진국 육수에 푸짐한 소고기, 바삭한 꽈배기 빵(Quẩy)과 신선한 야채가 완벽한 조화를 이룹니다.',
              addr: '260C Pasteur, Phường 8, District 3',
              hours: '06:00 - 22:30',
              price: '90,000 - 115,000 VND / 그릇'
            },
            {
              name: 'Phở Việt Nam (1구)',
              sub: '미슐랭 셀렉티드 선정 석뚝배기 쌀국수',
              desc: '매일 직접 면을 뽑으며, 뜨거운 석뚝배기에 와규 소고기와 육수를 부어 마지막 한 모금까지 따뜻하게 즐길 수 있습니다.',
              addr: '14 Phạm Hồng Thái, P. Bến Thành, District 1',
              hours: '06:00 - 03:00 (익일 새벽)',
              price: '90,000 - 350,000 VND / 그릇'
            },
            {
              name: 'Phở Dậu (3구)',
              sub: '50년 역사를 자랑하는 고풍스러운 하노이풍 쌀국수',
              desc: '야채나 숙주 없이 깔끔하고 맑은 고기 육수의 원조 북부식 쌀국수 맛을 보존하고 있는 클래식 맛집.',
              addr: 'Cư xá 288, Hẻm 288M1 Nam Kỳ Khởi Nghĩa, District 3',
              hours: '06:00 - 12:00 (오전 영업)',
              price: '80,000 - 110,000 VND / 그릇'
            },
            {
              name: 'Phở Lệ (5구)',
              sub: '미슐랭 셀렉티드 선정 남부 스타일 쌀국수',
              desc: '진하고 감칠맛 넘치는 육수와 부드러운 소고기 딴, 양지, 쫄깃한 소고기 미트볼(Bò viên)이 일품입니다.',
              addr: '413-415 Nguyễn Trãi, Phường 7, District 5',
              hours: '06:00 - 24:00',
              price: '85,000 - 110,000 VND / 그릇'
            },
            {
              name: 'Phở Phú Vương (1구)',
              sub: '향긋한 천연 약재 향의 비법 육수',
              desc: '양지, 차돌, 소간, 소고기 볼 등 다양한 부위를 취향에 따라 선택할 수 있는 대중적 명가.',
              addr: '120 Nguyễn Thái Bình, P. Nguyễn Thái Bình, District 1',
              hours: '06:00 - 23:00',
              price: '75,000 - 100,000 VND / 그릇'
            }
          ]
        },
        {
          title: '반미 (바게트 샌드위치)',
          emoji: '🥖',
          quote: '“바삭한 바게트 속에 고소한 간 파테, 수제 햄, 싱싱한 야채와 매콤한 고추가 조화를 이루는 최고의 길거리 미식입니다.”',
          restaurants: [
            {
              name: 'Bánh Mì Huỳnh Hoa (1구)',
              sub: '사이곤 반미의 왕으로 불리는 전설의 맛집',
              desc: '묵직하고 푸짐한 양(약 0.5kg)! 고소한 수제 파테와 겹겹이 쌓인 차슈, 햄의 완벽한 풍미.',
              addr: '26 Lê Thị Riêng, P. Phạm Ngũ Lão, District 1',
              hours: '11:00 - 21:00',
              price: '65,000 - 70,000 VND / 개'
            },
            {
              name: 'Bánh Mì Bảy Hổ (1구)',
              sub: '미슐랭 빕구르망 선정 80년 전통 반미 노점',
              desc: '80년 넘게 이어온 비법 파테와 현장에서 구워내는 차슈가 깔끔하고 담백한 맛을 선사합니다.',
              addr: '19 Huỳnh Khương Ninh, P. Đa Kao, District 1',
              hours: '05:30 - 12:00 & 16:00 - 21:00',
              price: '20,000 - 35,000 VND / 개'
            },
            {
              name: 'Bánh Mì Hồng Hoa (1구)',
              sub: '미슐랭 셀렉티드 선정 갓 구운 바게트 반미',
              desc: '벤타인 시장 근처 위치. 바삭한 빵에 크리스피 크랙클링 크리스피 포크와 수제 차슈가 가득합니다.',
              addr: '54 Nguyễn Văn Tráng, P. Bến Thành, District 1',
              hours: '05:30 - 21:30',
              price: '30,000 - 50,000 VND / 개'
            },
            {
              name: 'Bánh Mì Như Lan (1구)',
              sub: '50년 전통의 사이곤 베이커리 대표 브랜드',
              desc: '비텍스코 타워 근처 위치. 바삭 고소한 빵과 짭조름한 햄, 파테, 야채의 클래식 조합.',
              addr: '50 Hàm Nghi, P. Bến Nghé, District 1',
              hours: '05:00 - 23:00',
              price: '35,000 - 60,000 VND / 개'
            },
            {
              name: 'Bánh Mì Chảo Hòa Mã (3구)',
              sub: '1958년 시작된 철판 반미(Bánh mì chảo)의 원조',
              desc: '뜨거운 미니 철판에 계란 후라이, 파테, 소시지를 얹고 바삭한 빵을 적셔 먹는 아침 별미.',
              addr: '53 Cao Thắng, Phường 3, District 3',
              hours: '06:00 - 11:00 (오전 영업)',
              price: '50,000 - 70,000 VND / 세트'
            }
          ]
        },
        {
          title: '사이곤 커피',
          emoji: '☕',
          quote: '“뉴욕타임스가 인정한 세계 최고의 커피 중 하나. 진한 로부스타 원두와 달콤한 연유, 시원한 얼음의 완벽한 조화.”',
          restaurants: [
            {
              name: 'Cộng Cà Phê (콩카페)',
              sub: '레트로 빈티지 감성의 시그니처 카페',
              desc: '가장 인기 있는 시그니처 메뉴: 시원하고 부드러운 코코넛 스무디 커피.',
              addr: '1구 중심가 및 시내 다수 매장',
              hours: '07:00 - 23:00',
              price: '40,000 - 75,000 VND'
            },
            {
              name: 'Cà Phê Vợt Phan Đình Phùng',
              sub: '70년 역사, 24시간 열려있는 융드립 융 필터 커피',
              desc: '숯불 옹기 항아리와 천 필터로 추출하는 전통 방식. 길거리 낮은 의자에 앉아 즐기는 현지 감성.',
              addr: '330/2 Phan Đình Phùng, P.1, Phu Nhuan Dist',
              hours: '24시간 연중무휴',
              price: '15,000 - 25,000 VND'
            },
            {
              name: 'Cà Phê Vy (1구)',
              sub: '길거리 목제 의자에 앉아 활기찬 오토바이를 구경하는 카페',
              desc: '사이곤 길거리 목제 의자에 앉아 진한 베트남 드립 핀 커피를 음미하는 완벽한 로컬 체험.',
              addr: '90 Nguyễn Du, P. Bến Nghé, District 1',
              hours: '06:00 - 23:00',
              price: '30,000 - 50,000 VND'
            },
            {
              name: 'Cheo Leo Café (3구)',
              sub: '1938년 개업한 사이곤에서 가장 오래된 융드립 카페',
              desc: '오래된 골목길 안에서 전통 옹기 항아리 방식으로 커피를 내려 세월의 깊은 맛을 전달합니다.',
              addr: '109-111 Nguyễn Thiện Thuật, P.2, District 3',
              hours: '05:15 - 22:00',
              price: '20,000 - 35,000 VND'
            },
            {
              name: 'The Workshop Coffee (1구)',
              sub: '사이곤 최초의 스페셜티 핸드드립 커피 전문점',
              desc: '빈티지 아파트 2층의 인더스트리얼 인테리어 공간에서 프리미엄 싱글 오리진 커피 제공.',
              addr: '27 Ngô Đức Kế, P. Bến Nghé, District 1',
              hours: '08:00 - 21:00',
              price: '65,000 - 120,000 VND'
            }
          ]
        },
        {
          title: '껌땀 (Broken Rice)',
          emoji: '🍛',
          quote: '“숯불에 노릇하게 구운 돼지갈비와 달콤 짭조름한 늑맘 소스를 더해 즐기는 사이곤 서민들의 영혼의 음식.”',
          restaurants: [
            {
              name: 'Cơm Tấm Ba Ghiền (푸뉴언구)',
              sub: '미슐랭 빕구르망 선정 대형 왕돼지갈비 덮밥',
              desc: '접시를 가득 채우는 특대형 숯불 돼지갈비. 불향 가득 겉은 바삭하고 속은 촉촉합니다.',
              addr: '84 Đặng Văn Ngữ, Phường 10, Phu Nhuan Dist',
              hours: '07:00 - 21:30',
              price: '70,000 - 140,000 VND'
            },
            {
              name: 'Cơm Tấm Thuận Kiều (1구)',
              sub: '1975년 이전부터 명성을 이어온 전통의 껌땀 노포',
              desc: '양념이 깊게 밴 돼지갈비와 다양한 전통 반찬을 정갈한 매장에서 맛볼 수 있습니다.',
              addr: '26 Tôn Thất Tùng, P. Bến Thành, District 1',
              hours: '06:00 - 21:00',
              price: '60,000 - 110,000 VND'
            },
            {
              name: 'Cơm Tấm Mộc (1구)',
              sub: '세련되고 위생적인 아늑한 공간의 껌땀 맛집',
              desc: '현대적이면서도 고풍스러운 나무 인테리어 속에서 깔끔하고 수준 높은 껌땀을 즐길 수 있습니다.',
              addr: '85 Lý Tự Trọng, Bến Thành, District 1',
              hours: '08:00 - 21:30',
              price: '45,000 - 90,000 VND'
            },
            {
              name: 'Cơm Tấm Nguyễn Văn Cừ (1구)',
              sub: '두툼하고 육즙 가득한 숯불 돼지갈비로 이름난 맛집',
              desc: '숯불로 구워낸 도톰한 돼지갈비가 일품으로 사이곤 최고급 껌땀 중 하나로 손꼽힙니다.',
              addr: '74 Nguyễn Văn Cừ, P. Nguyễn Cư Trinh, District 1',
              hours: '06:30 - 15:00',
              price: '120,000 - 180,000 VND'
            },
            {
              name: 'Cơm Tấm Kiều Giang (1구)',
              sub: '늦은 밤까지 즐길 수 있는 미식 심야 껌땀 명가',
              desc: '달콤한 숯불 돼지갈비와 계란 찜, 바삭한 돼지껍질 요리가 어우러진 야식 명소.',
              addr: '139 Nguyễn Trãi, P. Bến Thành, District 1',
              hours: '06:00 - 익일 02:00',
              price: '50,000 - 95,000 VND'
            }
          ]
        },
        {
          title: '미식 복합 공간 & 야시장',
          emoji: '🏢',
          quote: '“고급 백화점 지하 푸드코트부터 백년 역사의 벤타인 시장, 힙한 아파트 카페, 활기찬 야시장까지 다채로운 맛의 탐험.”',
          restaurants: [
            {
              name: 'Takashimaya & Saigon Centre (지하 B2)',
              sub: '아시아 & 일식 프리미엄 미식 브랜드 집결지',
              desc: '스시, 라멘, 돈까스, 베이커리 및 룩람 오프라인 매장과 Katinat, Marou 초콜릿 등이 입점.',
              addr: '65 Lê Lợi, P. Bến Nghé, District 1',
              hours: '09:30 - 21:30 (주말 22:00까지)',
              price: '30,000 - 250,000 VND'
            },
            {
              name: '벤타인 시장 푸드코트 (1구)',
              sub: '사이곤을 상징하는 대표 전통 먹거리 야시장 성지',
              desc: '분맘, 생봄롤, 체(Che) 디저트, 해산물 요리 등 다양한 로컬 음식 모음. 저녁 7시 이후 야시장 변신.',
              addr: 'Lê Lợi Street, P. Bến Thành, District 1',
              hours: '07:00 - 19:00 (19시 이후 야시장)',
              price: '40,000 - 200,000 VND'
            },
            {
              name: '응우옌후에 42번지 카페 아파트 (1구)',
              sub: '레트로 아파트를 개조한 힙한 카페 & 레스토랑 빌딩',
              desc: '층마다 독특한 감성의 아기자기한 카페, 차 전문점, 디자인 식당들이 입점해 보행자 거리를 조망합니다.',
              addr: '42 Nguyễn Huệ, P. Bến Nghé, District 1',
              hours: '08:00 - 22:30',
              price: '40,000 - 300,000 VND'
            },
            {
              name: '빈칸 해산물 야시장 Phố Ẩm Thực Vĩnh Khánh (4구)',
              sub: '사이곤에서 가장 활기찬 야간 해산물 요리 거리',
              desc: '마늘 버터 조개 구이, 버터 볶음 요리, 뜨끈한 해물 샤브샤브(Lẩu)를 즐기는 로컬 야시장.',
              addr: 'Vĩnh Khánh Street, Ward 8, District 4',
              hours: '16:00 - 익일 01:00',
              price: '50,000 - 300,000 VND'
            },
            {
              name: '부이비엔 여행자 거리 Phố Đi Bộ Bùi Viện (1구)',
              sub: '불야성을 이루는 사이곤의 밤문화 & 바베큐 거리',
              desc: '다채로운 길거리 꼬치 구이, 수제 맥주, 라이브 음악 및 글로벌 길거리 음식이 펼쳐지는 거리.',
              addr: 'Bùi Viện Street, P. Phạm Ngũ Lão, District 1',
              hours: '18:00 - 익일 04:00',
              price: '30,000 - 250,000 VND'
            }
          ]
        }
      ]
    },
    culture: {
      title: '문화유산 & 힙한 인스타 포토스팟',
      intro: '동양의 진주라고 불리는 사이곤의 매력적인 도심 속 인스타 인생샷 성지와 역사적 숨결이 고스란히 담긴 문화 보물들.',
      categories: {
        heritage: '역사·유산',
        spiritual: '사원·교회',
        modern: '현대 도시 & 야경',
        nature: '자연·외곽'
      },
      items: [
        {
          category: 'heritage',
          name: 'Saigon Central Post Office (사이곤 중앙 우체국)',
          sub: '130년 역사의 프렌치 고딕 르네상스 양식의 걸작',
          desc: '구스타프 에펠의 설계로 완공된 웅장한 아치형 철골 천장과 아치 창문이 특징. 지금도 실제로 우편물을 보낼 수 있는 활기찬 문화유산입니다.',
          addr: '2 Công xã Paris, Bến Nghé, District 1',
          hours: '07:30 - 18:00',
          price: '무료 입장',
          emoji: '🏛️'
        },
        {
          category: 'heritage',
          name: 'Independence Palace (통일궁)',
          sub: '역사적인 남북 통일의 상징적 건축물',
          desc: '건축가 응우옌 비엣 투가 설계한 모더니즘 건축의 명작. 1975년 4월 30일 전쟁 종식을 알린 종전의 역사 현장입니다.',
          addr: '135 Nam Kỳ Khởi Nghĩa, Bến Thành, District 1',
          hours: '08:00 - 16:30',
          price: '65,000 VND',
          emoji: '🏰'
        },
        {
          category: 'heritage',
          name: 'Ho Chi Minh City Hall (호치민 시청)',
          sub: '프랑스 르네상스 스타일의 화려한 정부 궁전',
          desc: '응우옌후에 보행자 거리 시작점에 위치한 우아한 아치와 시계탑 건축물. 야간 조명이 화려하게 켜지는 포토 스팟.',
          addr: '86 Lê Thánh Tôn, Bến Nghé, District 1',
          hours: '외관 관람 / 24시간',
          price: '무료',
          emoji: '🏛️'
        },
        {
          category: 'heritage',
          name: 'Saigon Opera House (사이곤 오페라 하우스)',
          sub: '프랑스 식민지 시절의 클래식 공연 예술 공간',
          desc: '아르누보 양식의 화려한 부조 장식이 돋보이는 고풍스러운 극장. À Ố Show 등 고품격 서커스 예술 공연 개최.',
          addr: '7 Công trường Lam Sơn, Bến Nghé, District 1',
          hours: '공연 일정에 따름',
          price: '공연 티켓 구매',
          emoji: '🎭'
        },
        {
          category: 'heritage',
          name: 'War Remnants Museum (전쟁증적박물관)',
          sub: '베트남 전쟁의 진실과 평화의 메시지',
          desc: '생생한 사진 기록과 군용 비행기, 탱크가 전시된 세계적인 박물관. 전쟁의 아픔과 평화의 소중함을 전달합니다.',
          addr: '28 Võ Văn Tần, Võ Thị Sáu, District 3',
          hours: '07:30 - 17:30',
          price: '40,000 VND',
          emoji: '🛡️'
        },
        {
          category: 'spiritual',
          name: 'Jade Emperor Pagoda (옥황사)',
          sub: '미국 오바마 대통령도 방문한 신비로운 한방 사원',
          desc: '1909년 중국 이주민들이 세운 고풍스러운 사원으로 향연기가 가득한 영험하고 신비로운 분위기를 자랑합니다.',
          addr: '73 Mai Thị Lựu, Đa Kao, District 1',
          hours: '07:00 - 18:00',
          price: '무료',
          emoji: '🛕'
        },
        {
          category: 'spiritual',
          name: 'Tan Dinh Church (탄딘 핑크 성당)',
          sub: '인스타 인생샷 성지 로맨틱 핑크 성당',
          desc: '화려한 동화 속 파스텔 핑크 빛 건물과 루마니아식 고딕 건축 양식이 조화를 이루어 인기 높은 촬영 명소.',
          addr: '289 Hai Bà Trưng, Phường 8, District 3',
          hours: '08:00 - 17:00 (외관 관람 자유)',
          price: '무료',
          emoji: '💒'
        },
        {
          category: 'modern',
          name: 'Saigon Waterbus (사이곤 수상버스)',
          sub: '강바람을 맞으며 사이곤 도심 마천루를 감상하는 크루즈',
          desc: '바찌에우 선착장에서 출발하여 사이곤 강변의 아름다운 랜드마크 81과 고층 빌딩 뷰를 가성비 높게 즐깁니다.',
          addr: 'Bach Dang Waterbus Station, District 1',
          hours: '07:00 - 19:30',
          price: '15,000 VND',
          emoji: '🚢'
        },
        {
          category: 'modern',
          name: 'Landmark 81 SkyView (랜드마크 81)',
          sub: '동남아 최고의 초고층 마천루 전망대',
          desc: '높이 461m의 최첨단 타워. 81층 스카이뷰 전망대에서 호치민 파노라마 도시 야경을 한눈에 담을 수 있습니다.',
          addr: '720A Điện Biên Phủ, Ward 22, Binh Thanh Dist',
          hours: '08:30 - 22:00',
          price: '420,000 VND',
          emoji: '🏙️'
        },
        {
          category: 'nature',
          name: 'Cu Chi Tunnels (구찌 터널)',
          sub: '250km에 달하는 정글 속 유서 깊은 지하 요새',
          desc: '전쟁 당시 손으로 직접 파낸 미로 같은 지하 도시. 병원, 주방, 지휘소가 갖춰져 있어 지혜를 보여줍니다.',
          addr: 'Phú Mỹ Hưng, Củ Chi (도심에서 약 60km)',
          hours: '07:00 - 17:00',
          price: '125,000 VND',
          emoji: '🌴'
        },
        {
          category: 'nature',
          name: 'Saigon Zoo & Botanical Gardens (사이곤 동식물원)',
          sub: '1864년 개원한 160년 역사의 도심 속 녹색 오아시스',
          desc: '거대한 열대 나무들과 울창한 숲이 울창한 그늘을 제공하여 여행 중 한적하게 산책하기 좋은 녹지 공간.',
          addr: '2 Nguyễn Bỉnh Khiêm, Bến Nghé, District 1',
          hours: '07:00 - 18:30',
          price: '60,000 VND',
          emoji: '🦁'
        }
      ]
    },
    shopping: {
      title: '쇼핑 & 기념품 가이드',
      intro: '다양한 매력의 명품 몰부터 트렌디한 로컬 스트리트 패션 빌딩, 현지 수공예품까지 한눈에 비교하는 사이곤 쇼핑 리스트.',
      items: [
        {
          name: 'Ben Thanh Market (벤타인 시장)',
          sub: '100년 역사의 사이곤을 상징하는 대표적 쇼핑 성지',
          desc: '아오자이 맞춤, 고급 원두, 견과류, 전통 자수 및 수공예품이 한자리에 모여 흥정의 흥미로움을 선사합니다.',
          addr: 'Đường Lê Lợi, Phường Bến Thành, District 1',
          hours: '06:00 - 22:00',
          emoji: '🛍️'
        },
        {
          name: 'Binh Tay Market (빈타이 도매 시장)',
          sub: '차이나타운(5구)에 숨겨진 동양풍 대형 도매 시장',
          desc: '화려한 중국식 지붕 건축이 돋보이며, 수공예품, 향신료, 도자기, 건어물이 빼곡히 들어찬 전통 시장.',
          addr: '57A Tháp Mười, Phường 2, District 6',
          hours: '06:00 - 19:00',
          emoji: '🏮'
        },
        {
          name: 'The New Playground (더 뉴 플레이그라운드)',
          sub: '베트남 유스 패션 & 스트리트 브랜드 지하 편집숍',
          desc: '지하 콘크리트 감성의 스트리트 매장. 현지 신진 디자이너 패션 의류와 인디 액세서리를 구입할 수 있습니다.',
          addr: '26 Lý Tự Trọng, Bến Nghé, District 1',
          hours: '10:00 - 21:30',
          emoji: '👟'
        }
      ]
    },
    luclam: {
      title: 'Lục Lam 문화적 오아시스',
      subtitle: 'Lục Lam 문화적 오아시스',
      intro: '베트남의 엄선된 유기농 허브차, 프리미엄 스페셜티 커피, 그리고 전통 공예품이 만나는 아늑한 문화 공간입니다.',
      aboutHeading: '룩람 소개',
      aboutText: '바쁜 도시 한가운데 숨겨진 평화로운 안식처, 룩람(Lục Lam)은 베트남 허브티, 청정 커피, 그리고 장인정신이 깃든 고유 공예품에 대한 깊은 사랑으로 탄생했습니다. 고풍스러운 인도차이나(Indochine) 풍 디자인 속에서 오감을 치유하고, 베트남의 따뜻한 환대 문화를 경험해 보세요.',
      menuHeading: '룩람 시그니처 프리미엄 티 (Takashimaya)',
      menuItems: [
        {
          name: 'Red Lava (레드 라바 허브티)',
          desc: '히비스커스 꽃과 오렌지, 시나몬이 빚어내는 정열적인 수색의 대표 허브티. 상큼한 비타민 C가 풍부하여 여행 피로를 풀어줍니다.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/frame_vu_ng_tet__12__bdc76c1b293c45c5ae8e8711482ea43a_large.png'
        },
        {
          name: 'Velvet Rose (벨벳 로즈 티)',
          desc: '우아한 프랑스 장미 꽃봉오리와 자스민의 은은한 조화. 마음을 평온하게 해주고 피부 미용에 탁월한 프리미엄 블렌딩.',
          price: '175,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/105_fbb0f752824b4b008cd70dabecbcdeb3_large.png'
        },
        {
          name: 'Violet Jasmine (바이올렛 자스민 티)',
          desc: '유기농 녹차에 천연 자스민 꽃향기를 머금은 감성 차. 깊고 청아한 꽃향기로 마음에 기분 좋은 청량감을 선사합니다.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/106_d09a9c06a44742e58bd5765025c6ded7_large.png'
        },
        {
          name: 'Golden Peach (골든 피치 허브티)',
          desc: '달콤한 황도 복숭아 향과 천연 꿀, 은은한 허브의 조화. 마신 뒤 은은하게 남아 피로를 잊게 해주는 머스트 해브 힐링 차.',
          price: '155,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/103_37d008a17e654d88822f5e985a659700_large.png'
        },
        {
          name: 'Zen Relaxing (젠 리랙싱 티)',
          desc: '카모마일, 연심(연꽃 씨앗 심), 은은한 라벤더가 선사하는 평온함. 여행 중 지친 신경을 이완시키고 꿀잠을 도와줍니다.',
          price: '185,000 VND',
          image: 'https://cdn.hstatic.net/products/200000432665/107_13b87a4b48264fef9e08be066a6e9d4d_large.png'
        }
      ],
      voucherHeading: '외국인 여행객 독점 특별 혜택',
      voucherDesc: '결제 시 카운터에 이 화면을 보여주시면 매장 이용 시 총 금액의 10% 할인 혜택 또는 무료 전통 녹두 케이크 세트를 선물로 드립니다.',
      voucherBadge: 'O2O 특별 혜택',
      voucherCode: 'LUCLAMVIP10',
      voucherBtn: '쿠폰 받기',
      voucherClaimed: '적용 완료! 직원에게 이 코드를 보여주세요.'
    },
    info: {
      title: '유용한 정보 & 안전한 여행 도구',
      intro: '공식 비상 연락처, 다국어 진료 가능 외국인 클리닉, 최고 우대율 환전소 등 즐겁고 걱정 없는 여행을 돕는 필수 도구 모음입니다.',
      categories: [
        {
          title: '비상 연락처 및 국제 병원',
          items: [
            { label: 'FV 병원 (FV Hospital - 1구 클리닉)', detail: 'Bitexco Financial Tower lầu 3, 2 Hải Triều, District 1. 영어/불어/일본어/중국어 소통 가능 소아과 및 내과 의사 24시간 근무. 연락처: (028) 3822 7878' },
            { label: 'Family Medical Practice', detail: '34 Lê Duẩn, Bến Nghé, District 1. 영어, 일본어, 중국어 번역 지원 가능 고품격 다국어 가정의학과 클리닉. 연락처: (028) 3822 7848' },
            { label: '관광경찰 (Tourist Police)', detail: '24-26 Pasteur, District 1. 외국인 관광객들의 불편 접수 및 보호 지원 서비스 제공. 연락처: (028) 3824 4103' }
          ]
        },
        {
          title: '지정 안심 환전소 (우대율 적용)',
          items: [
            { label: '하탐 금은방 (Ha Tam - 벤타인 시장 옆)', detail: '2 Nguyễn An Ninh, District 1. 벤타인 시장 서문 바로 앞에 자리하며, 사이곤 전역에서 가장 우대율이 좋은 것으로 매우 유명합니다.' },
            { label: '마이반 금은방 (Mai Van)', detail: '하탐 바로 건너편에 위치해 있으며 대등한 환전 환율을 제공합니다. 하탐이 붐빌 때 최고의 대안입니다.' }
          ]
        },
        {
          title: '현지 SIM 카드 및 ATM 안내',
          items: [
            { label: '추천 통신사', detail: '공항 카운터에서 Viettel 또는 Vinaphone 물리 유심을 권장합니다. eSIM의 경우 국토 전역에서 안정적이고 빠른 Viettel 브랜드가 최선입니다.' },
            { label: '신용카드 및 ATM 현금인출', detail: '도심지 대부분의 상점 및 카페에서 비자/마스터 카드 결제가 가능하며, 현금이 급할 시 Vietcombank, Techcombank, HSBC 등의 기기에서 안전하게 현지 통화로 인출이 가능합니다.' }
          ]
        }
      ]
    }
  }
};
