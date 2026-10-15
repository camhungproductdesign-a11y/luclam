import type { Language } from './translations';

/**
 * Lục Lam's own storefront, one per landing language.
 *
 * The shop sells from pos.luclam.vn, which speaks the reader's language when
 * the path names it. Sending a Japanese reader to the Vietnamese collection
 * page made them translate a checkout to buy a gift. The keys are the site's
 * own language codes; the paths are the storefront's, which spell Chinese as
 * zh-CN and zh-TW.
 *
 * The bare storefront is where a product with no entry in DEFAULT_BUY_LINKS
 * lands; the five teas each go to their own page, see luclamProductUrl.
 */
export const STOREFRONT_BY_LANG: Record<Language, string> = {
  vi: 'https://pos.luclam.vn/vi',
  en: 'https://pos.luclam.vn/en',
  zh: 'https://pos.luclam.vn/zh-CN',
  zht: 'https://pos.luclam.vn/zh-TW',
  ja: 'https://pos.luclam.vn/ja',
  ko: 'https://pos.luclam.vn/ko',
};

/**
 * Where each tea can be bought, in menu order: Red Lava, Velvet Rose, Violet
 * Jasmine, Golden Peach, Zen Relaxing.
 *
 * `luclam` is the product's id on pos.luclam.vn, not a URL. The storefront
 * serves the same id under every language prefix, translated, so one id gives
 * all six readers their own page — see luclamProductUrl.
 *
 * These lived inside App.tsx, which meant nothing could read them without
 * importing React and the whole application with it — so `npm run smoke` could
 * not check whether they still led anywhere. The Takashimaya half is the most
 * likely to rot: Takashimaya retires pages on its own schedule and tells
 * nobody.
 *
 * Used when nothing has been set in the editor. Editable per product as
 * menuItems[i].buyLuclam / buyTaka; these are only the starting values.
 */
export const DEFAULT_BUY_LINKS: Array<{ luclam: string; taka: string }> = [
  {
    luclam: '562eefec-2d3d-482b-b11d-1ee551e7ecd4',
    taka: 'https://online.takashimaya-vn.com/chai-tra-red-lava-luc-lam-50g--s230800289',
  },
  {
    luclam: 'ad8217cd-998f-44c4-a013-68692136272a',
    taka: 'https://online.takashimaya-vn.com/chai-tra-velvet-rose-luc-lam-50g--s230800295',
  },
  {
    luclam: 'a02c9110-6a56-4722-8bc1-915d16999ada',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
    luclam: 'b73286be-2cb9-47f1-9675-ef4ae8fe8819',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
    luclam: 'f1282338-154c-47ee-a5bc-632d37abefcd',
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
];

/**
 * Used for any product without an entry above, and for a sixth product added
 * in the editor.
 *
 * The Takashimaya half pointed at www.takashimaya-vietnam.com, a domain that
 * no longer resolves at all — NXDOMAIN, not a redirect and not a 404, so every
 * reader who fell through to it met a browser error rather than a shop. It is
 * the Lục Lam category on the store that does exist. The search page there
 * answers 200 but renders no products, which is why it is not used here: a
 * status code alone would have called it healthy.
 */
export const FALLBACK_BUY_LINKS = {
  taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
};

/**
 * The tea's own page on pos.luclam.vn in the reader's language, or the
 * storefront's home page for a product the shop has not been given an id for
 * (a sixth tea added in the editor).
 */
export function luclamProductUrl(lang: Language, index: number): string {
  const id = DEFAULT_BUY_LINKS[index]?.luclam;
  return id ? `${STOREFRONT_BY_LANG[lang]}/products/${id}` : STOREFRONT_BY_LANG[lang];
}
