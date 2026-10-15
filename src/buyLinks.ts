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
 * Used for every product unless the editor has set menuItems[i].buyLuclam.
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
 * Where each tea can be bought at Takashimaya.
 *
 * These lived inside App.tsx, which meant nothing could read them without
 * importing React and the whole application with it — so `npm run smoke` could
 * not check whether they still led anywhere. They are the links most likely to
 * rot: they belong to Takashimaya, who retires pages on its own
 * schedule and tell nobody.
 *
 * Used when nothing has been set in the editor. Editable per product as
 * menuItems[i].buyTaka; these are only the starting values.
 */
export const DEFAULT_BUY_LINKS: Array<{ taka: string }> = [
  {
    taka: 'https://online.takashimaya-vn.com/chai-tra-red-lava-luc-lam-50g--s230800289',
  },
  {
    taka: 'https://online.takashimaya-vn.com/chai-tra-velvet-rose-luc-lam-50g--s230800295',
  },
  {
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
    taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
  },
  {
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
