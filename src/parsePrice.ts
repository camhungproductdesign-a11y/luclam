/**
 * Prices are authored as "155,000 VND". Structured data needs a bare number and
 * a separate currency, so parse rather than pass the string through.
 *
 * Anything that does not parse cleanly gets no `offers` block at all. A wrong
 * price in structured data is worse than an absent one — search engines and
 * assistants repeat it as fact, and nobody sees the mistake on the page.
 *
 * This lived in scripts/prerender/render-head.ts, where only the generator
 * could reach it. The editor needs the same rule: a price it accepts but the
 * generator rejects is a price that silently vanishes from the Product schema,
 * with the page still showing it. One function means the warning in the
 * interface is the generator's own verdict rather than a guess at it.
 */
export function parsePrice(raw: string | undefined): { price: string; currency: string } | null {
  if (!raw) return null;

  const match = raw.match(/^\s*([\d.,]+)\s*(VND|VNĐ|đ)\s*$/i);
  if (!match) return null;

  const digits = match[1].replace(/[.,]/g, '');
  if (!/^\d+$/.test(digits)) return null;

  const value = Number(digits);
  if (!Number.isFinite(value) || value <= 0) return null;

  return { price: String(value), currency: 'VND' };
}

/**
 * How a price the operator has just typed compares with the one shipped in
 * translations.ts.
 *
 * `unparseable` is the dangerous one and the quiet one: the page keeps showing
 * the text, so nothing looks wrong, while the Product offer disappears.
 *
 * `jump` catches the slipped digit. 155,000 typed as 15,500 or 1,550,000 both
 * look plausible in a narrow field. Threshold is deliberately loose — a real
 * price change of 30% should pass without nagging — so anything it does flag
 * is worth a second look.
 */
export type PriceVerdict =
  | { kind: 'empty' }
  | { kind: 'unparseable' }
  | { kind: 'jump'; factor: number; from: number }
  | { kind: 'ok' };

export function checkPrice(entered: string, original: string | undefined): PriceVerdict {
  if (!entered.trim()) return { kind: 'empty' };

  const parsed = parsePrice(entered);
  if (!parsed) return { kind: 'unparseable' };

  const base = parsePrice(original);
  if (!base) return { kind: 'ok' };

  const now = Number(parsed.price);
  const before = Number(base.price);
  const factor = now > before ? now / before : before / now;

  if (factor >= 2) return { kind: 'jump', factor, from: before };
  return { kind: 'ok' };
}
