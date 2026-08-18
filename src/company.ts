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

export type Store = {
  id: string;
  /** What to call this branch in a list — the city, since that is how a visitor picks. */
  city: string;
  street: string;
  locality: string;
  region: string;
  geo?: { latitude: number; longitude: number };
};

/**
 * The four shops. Only the Takashimaya one has confirmed opening hours, so only
 * it carries them; guessing the rest would put invented times in front of an
 * assistant that repeats them as fact.
 */
export const STORES: Store[] = [
  {
    id: 'takashimaya',
    city: 'Thành phố Hồ Chí Minh',
    street: 'Tầng B2, Takashimaya, 92-94 Nam Kỳ Khởi Nghĩa',
    locality: 'Bến Nghé, Quận 1',
    region: 'Thành phố Hồ Chí Minh',
    geo: { latitude: 10.7733, longitude: 106.7011 },
  },
  {
    id: 'hoian',
    city: 'Hội An',
    street: '62 Nguyễn Thị Minh Khai',
    locality: 'Phường Minh An',
    region: 'Quảng Nam',
  },
  {
    id: 'danang-tran-phu-202',
    city: 'Đà Nẵng',
    street: '202 Trần Phú',
    locality: 'Phường Phước Ninh, Quận Hải Châu',
    region: 'Đà Nẵng',
  },
  {
    id: 'danang-tran-phu-104',
    city: 'Đà Nẵng',
    street: '104 Trần Phú',
    locality: 'Quận Hải Châu',
    region: 'Đà Nẵng',
  },
];

/** Opening hours are only known for the flagship. */
export const FLAGSHIP_HOURS = { opens: '09:30', closes: '22:00' };

export const fullAddress = (store: Store): string =>
  `${store.street}, ${store.locality}, ${store.region}`;