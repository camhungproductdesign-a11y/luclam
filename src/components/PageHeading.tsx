import { type ReactNode } from 'react';

/**
 * The rule across the top of each numbered page: "07 | Văn hóa & Điểm
 * check-in" on the left, an English eyebrow on the right.
 *
 * This was nine hand-copied `flex justify-between` rows, and it broke as soon
 * as a translated title ran long. justify-between leaves both children
 * shrinkable, so an overflowing row squeezes *both* of them — which is how a
 * string as short as "Heritage & Check-in" ended up split across two lines at
 * its hyphen, sitting beside a title split at its own. Neither element was too
 * long; they were competing for one line that could not hold them.
 *
 * So the eyebrow now yields whole instead of being compressed: whitespace-nowrap
 * refuses to break it mid-word, flex-wrap drops it to its own line once the two
 * no longer fit, and ml-auto keeps it against the right edge in either case.
 * The title — the part that actually carries meaning, and the only part that
 * changes length between six languages — gets the full width of the first line.
 *
 * Titles are read from translations and the eyebrows are hardcoded English on
 * every language, which is the existing design: the eyebrow is decoration, so
 * it is the right thing to sacrifice first.
 */

type Props = {
  /** The page number as it is printed, e.g. "07". */
  number: string;
  /** The localised page title. */
  title: string;
  /** The English eyebrow. Decorative — first to yield when space runs out. */
  kicker: string;
  icon?: ReactNode;
  /** `dark` is the Lục Lam page, which is amber on near-black rather than green on cream. */
  tone?: 'light' | 'dark';
  /**
   * A prop rather than an appended class: two `pt-*` utilities in one class
   * attribute are resolved by their order in the stylesheet, not the markup, so
   * "override by appending" silently picks whichever Tailwind emitted last.
   * The welcome page sits tighter to the block above it than the other eight.
   */
  padTop?: 'pt-2' | 'pt-4';
};

const PALETTE = {
  light: { rule: 'border-[#b85233]', label: 'text-[#0b433f]', kicker: 'text-zinc-500' },
  dark: { rule: 'border-amber-500/30', label: 'text-amber-400', kicker: 'text-amber-500/90' },
} as const;

export function PageHeading({
  number,
  title,
  kicker,
  icon,
  tone = 'light',
  padTop = 'pt-4',
}: Props) {
  const palette = PALETTE[tone];

  return (
    <div
      className={`flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b-[1.5px] ${palette.rule} pb-1.5 ${padTop}`}
    >
      <span
        className={`text-[11px] font-bold tracking-widest uppercase ${palette.label} ${
          icon ? 'flex items-center gap-1' : ''
        }`}
      >
        {icon}
        {icon ? (
          <span>
            {number} | {title}
          </span>
        ) : (
          <>
            {number} | {title}
          </>
        )}
      </span>
      <span className={`text-[11px] font-serif italic whitespace-nowrap ml-auto ${palette.kicker}`}>
        {kicker}
      </span>
    </div>
  );
}