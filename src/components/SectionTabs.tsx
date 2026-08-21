/**
 * The strip of pills that keeps a page to one screen.
 *
 * Pages 06 and 07 already showed one group at a time. Pages 03, 09 and 10 held
 * 19–39% more than their screen could take and scrolled instead — measured at
 * 1440x900, 461px, 702px and 573px of overflow. The device that fixes page 07
 * fixes them too, so it lives here rather than in four near-identical copies
 * that would drift apart the first time one of them was restyled.
 *
 * What this component deliberately does NOT do is decide what to render. The
 * caller keeps every panel mounted and hides the inactive ones, because the app
 * removes #static-content once React takes over: the rendered DOM is the only
 * place a crawler that runs JS can find this content, and unmounting a panel
 * would hide it from Google to win a layout argument. A hidden block costs no
 * height, so the screen fits either way. See the landmark list on page 07.
 */

type Tab<Id extends string> = {
  id: Id;
  label: string;
};

type Props<Id extends string> = {
  tabs: ReadonlyArray<Tab<Id>>;
  active: Id;
  onChange: (id: Id) => void;
  /** `dark` is the Lục Lam page — amber on near-black rather than green on cream. */
  tone?: 'light' | 'dark';
  /** Names the group for a screen reader, since the pills carry no heading. */
  label: string;
};

/**
 * Contrast is the reason the unselected pill is zinc-600 rather than the
 * zinc-500 these controls used elsewhere: on cream that measures 4.36:1 against
 * the 4.5:1 body text needs, and the desktop floor lifts this to 13px, which is
 * normal text. The dark palette borrows page 09's amber so a selected pill
 * reads as the same object on both grounds.
 */
const PALETTE = {
  light: {
    on: 'bg-[#0b433f] text-white border-[#0b433f] shadow-sm',
    off: 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300',
    ring: 'focus-visible:ring-[#0b433f]/50',
  },
  dark: {
    on: 'bg-amber-600 text-white border-amber-600 shadow-sm',
    off: 'bg-white/5 text-zinc-300 border-zinc-700 hover:border-amber-500/40',
    ring: 'focus-visible:ring-amber-500/60',
  },
} as const;

export function SectionTabs<Id extends string>({
  tabs,
  active,
  onChange,
  tone = 'light',
  label,
}: Props<Id>) {
  const palette = PALETTE[tone];

  return (
    /* A group of toggle buttons, not an ARIA tablist.
     *
     * It was role="tablist" with role="tab" on each pill and no aria-controls,
     * because the panels are siblings the caller owns and a wrong id would be
     * worse than none. That reasoning was right about the ids and wrong about
     * the conclusion: "tab" announces a relationship to a tabpanel, and
     * promising one that does not exist leaves a screen reader user hearing
     * "tab" with no way to find what it controls and no panel to jump to. Half
     * the pattern is worse than none of it.
     *
     * These are filter chips — pick one, the list below changes — so they are
     * buttons that say whether they are pressed, inside a group that says what
     * the choice is for. That is the whole truth about them, and it matches the
     * strips on pages 06 and 07, which were always plain buttons.
     */
    <div
      role="group"
      aria-label={label}
      className="lm-span flex gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-visible lg:flex-wrap pb-1 pt-0.5 no-scrollbar"
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.id)}
            className={`flex items-center px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all duration-300 shrink-0 border focus-visible:outline-none focus-visible:ring-2 ${palette.ring} ${
              selected ? palette.on : palette.off
            }`}
          >
            <span className="leading-none whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
