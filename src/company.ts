/**
 * Lục Lam's own details, as the company supplied them.
 *
 * One place, because these facts appear in the page copy, in the LocalBusiness
 * and Organization structured data, and in the FAQ answers. Three copies of a
 * phone number is three chances for one of them to be the old one — and a
 * wrong number in structured data is worse than an absent one, which is why
 * `telephone` sat empty until the company confirmed it.
 *
 * The addresses are proper nouns and stay in Vietnamese in every language: a
 * visitor shows them to a taxi driver or types them into a map, and a
 * translated street name is no use for either.
 */

export const COMPANY = {
  legalName: 'CÔNG TY TNHH TM DV SX LỤC LAM',
  brand: 'Lục Lam Art Of Tea',
  /** Giấy phép kinh doanh — the business registration number. */
  registration: '0316702365',
  telephone: '+842862817639',
  telephoneDisplay: '+84 28 6281 7639',
  email: 'luclamtea@gmail.com',
  website: 'https://luclam.vn',
  headOffice: {
    street: '261/18 Lê Đức Thọ',
    ward: 'Phường Gò Vấp',
    city: 'Thành phố Hồ Chí Minh',
    country: 'VN',
  },
} as const;

/**
 * The accounts this brand is the same entity as.
 *
 * Facebook was written out twice in render-head.ts and the three Instagram
 * feeds three times in App.tsx, so a moved account meant finding five string
 * literals. They belong with the rest of the company facts.
 *
 * `npm run smoke` deliberately does NOT status-check these, and the reason is
 * worth keeping: both networks answer 200 to any profile URL, real or not.
 * Measured — facebook.com/chac.chan.khong.ton.tai.9z8y7x and
 * instagram.com/chac_chan_khong_ton_tai_9z8y7x both return 200. A check over
 * them could never fail, and a check that can never fail is worse than none:
 * it reports these links as healthy forever. They have to be opened by eye.
 */
export const SOCIAL = {
  facebook: 'https://www.facebook.com/luclamartoftea',
  instagram: [
    'https://www.instagram.com/luclam_vietnam.review_japan/',
    'https://www.instagram.com/luclam_vietnam.review_korea/',
    'https://www.instagram.com/luclam_vietnam.review_china/',
  ],
} as const;

/** Everything the Organization markup claims is the same entity. */
export const SAME_AS: string[] = [SOCIAL.facebook, COMPANY.website];
export type Store = {
  id: string;
  /** What to call this branch in a list — the city, since that is how a visitor picks. */
  city: string;
  /** The same city cut down to fit a chip on the branch locator. */
  cityShort: string;
  /** The name over the door, where the shop has one of its own. */
  name?: string;
  street: string;
  locality: string;
  region: string;
  geo?: { latitude: number; longitude: number };
  /** Opening times, only where the company has confirmed them. */
  hours?: { opens: string; closes: string };
  /** A map link the company published; otherwise one is built from the address. */
  mapUrl?: string;
  /** A photograph of the shopfront, where there is one. */
  photo?: { src: string; width: number; height: number };
  /** A short flag beside the branch — a newly opened shop, say. */
  flag?: string;
};

/** The hours four of the five shops keep: Saigon and all three in Đà Nẵng. */
export const STANDARD_HOURS = { opens: '09:30', closes: '22:00' };

/** Hội An opens two and a half hours earlier and shuts at the same time. */
export const HOI_AN_HOURS = { opens: '07:00', closes: '22:00' };

/**
 * Every shop, and the only list of them.
 *
 * Page 09's branch locator used to carry its own hardcoded copy of this, and
 * the two drifted apart exactly as you would expect: the locator knew about
 * 259 Trần Phú and had never heard of Hội An, while the structured data knew
 * the opposite. Both were published, so an assistant reading the page and an
 * assistant reading the schema gave different answers about where to buy this
 * tea. Everything renders from here now.
 *
 * Every shop carries its own hours rather than borrowing one constant, because
 * they are not all the same: Hội An opens at 07:00 and the other four at 09:30.
 * `hours` stays optional so a shop whose times nobody has confirmed can be
 * listed without them — a guessed time is worse than an absent one, since an
 * assistant repeats it as fact and sends somebody to a shut door.
 */
export const STORES: Store[] = [
  {
    id: 'takashimaya',
    city: 'Thành phố Hồ Chí Minh',
    cityShort: 'Saigon',
    name: 'Lục Lam Takashimaya B2',
    street: 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa',
    locality: 'Bến Nghé, Quận 1',
    region: 'Thành phố Hồ Chí Minh',
    geo: { latitude: 10.7733, longitude: 106.7011 },
    hours: STANDARD_HOURS,
    mapUrl: 'https://maps.app.goo.gl/8tExfsHC1m2E4bxH7',
  },
  {
    id: 'hoian',
    city: 'Hội An',
    cityShort: 'Hội An',
    name: 'Lục Lam Hội An',
    street: '62 Nguyễn Thị Minh Khai',
    locality: 'Phường Minh An',
    region: 'Quảng Nam',
    hours: HOI_AN_HOURS,
  },
  {
    id: 'danang-tran-phu-202',
    city: 'Đà Nẵng',
    cityShort: 'Đà Nẵng',
    name: 'Lục Lam Flagship',
    street: '202 Trần Phú',
    locality: 'Phường Phước Ninh, Quận Hải Châu',
    region: 'Đà Nẵng',
    hours: STANDARD_HOURS,
    photo: { src: '/uploads/external/c561cd48f545.jpg', width: 800, height: 533 },
  },
  {
    id: 'danang-tran-phu-104',
    city: 'Đà Nẵng',
    cityShort: 'Đà Nẵng',
    name: 'Lục Lam Premium',
    street: '104 Trần Phú',
    locality: 'Quận Hải Châu',
    region: 'Đà Nẵng',
    hours: STANDARD_HOURS,
  },
  {
    id: 'danang-tran-phu-259',
    city: 'Đà Nẵng',
    cityShort: 'Đà Nẵng',
    name: 'Lục Lam New Concept',
    street: '259 Trần Phú',
    locality: 'Quận Hải Châu',
    region: 'Đà Nẵng',
    hours: STANDARD_HOURS,
    flag: 'New Concept Open!',
  },
];

export const fullAddress = (store: Store): string =>
  `${store.street}, ${store.locality}, ${store.region}`;

/** The shop's own name, or one built from the brand and the city. */
export const storeName = (store: Store): string =>
  store.name ?? `${COMPANY.brand} ${store.cityShort}`;

/**
 * Where to send someone for directions.
 *
 * A published short link when the company gave one, otherwise a Maps search
 * for the address — so every branch has a way to be found, including the ones
 * added later.
 */
export const storeMapUrl = (store: Store): string =>
  store.mapUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Lục Lam ${store.street}, ${store.locality}, ${store.region}`
  )}`;

/** The shops grouped by city, in the order the cities first appear above. */
export const STORES_BY_CITY: { city: string; cityShort: string; stores: Store[] }[] =
  STORES.reduce<{ city: string; cityShort: string; stores: Store[] }[]>((groups, store) => {
    const group = groups.find((g) => g.city === store.city);
    if (group) group.stores.push(store);
    else groups.push({ city: store.city, cityShort: store.cityShort, stores: [store] });
    return groups;
  }, []);