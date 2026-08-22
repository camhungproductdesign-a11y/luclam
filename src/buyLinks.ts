/**
 * Where each tea can be bought.
 *
 * These lived inside App.tsx, which meant nothing could read them without
 * importing React and the whole application with it — so `npm run smoke` could
 * not check whether they still led anywhere. They are the links most likely to
 * rot: they belong to Shopify and Takashimaya, who retire pages on their own
 * schedule and tell nobody.
 *
 * Used when nothing has been set in the editor. Editable per product as
 * menuItems[i].buyLuclam / buyTaka; these are only the starting values.
 */
export const DEFAULT_BUY_LINKS: Array<{ luclam: string; taka: string }> = [
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
  luclam: 'https://luclam.vn/collections/all',
  taka: 'https://online.takashimaya-vn.com/c/luc-lam-tet',
};
