/**
 * Design tokens as literal Tailwind-compatible strings, replacing the
 * @theme-based CSS custom properties that used to live in `index.css`.
 *
 * WHY THIS FILE EXISTS (2026-09-17, tailwind-design-system pass, confirmed
 * by Jude: "change all to tailwindcss" — full site-wide migration off a
 * shared stylesheet). `index.css` is gone. Its `@theme` block auto-generated
 * utilities like `text-ink` / `bg-surface` / `border-line`, and its
 * `.plate-dark` / `.plate-light` classes re-pointed those same custom
 * properties per section so a component never had to know which plate it
 * was on. Inline Tailwind utilities can't re-point themselves off an
 * ancestor class the way a CSS custom property can, so every section now
 * has to pick its own literal color set depending on which plate it's on —
 * that's what `plate.dark` / `plate.light` below are for. Centralizing the
 * two literal palettes here (instead of retyping hex codes in eighteen
 * files) means there's exactly one source of truth for "ink-muted on a dark
 * plate," and a future palette change is one edit instead of a
 * grep-and-replace across the whole codebase.
 *
 * ⚠ CRITICAL — READ BEFORE ADDING A NEW CLASS STRING HERE: Tailwind v4's
 * JIT compiler scans literal source text for complete class name tokens; it
 * does not evaluate JavaScript. A dynamically-interpolated string like
 * `` `ease-[${ease}]` `` NEVER appears as literal text anywhere on disk, so
 * Tailwind never generates CSS for it — this is exactly the bug that broke
 * the About page's padding earlier this session (see About.tsx's own doc
 * comment), just in a more permanent form. Every export below is a
 * complete, literal, already-resolved class string. Components choose
 * BETWEEN whole strings (ternaries, template literals with no expressions
 * inside the bracket syntax) — they never build a new arbitrary value out
 * of pieces at runtime.
 *
 * EASE/DURATION: `--ease-fluid` / `--dur-hover` / `--dur-reveal` were plain
 * CSS custom properties (not Tailwind theme tokens), referenced elsewhere in
 * the old codebase as `ease-[var(--ease-fluid)]`. With index.css gone that
 * var() resolves to nothing. The literal value is baked into every class
 * string below instead.
 */

export const ease = 'cubic-bezier(0.32,0.72,0,1)' // --ease-fluid, literal

/** Fluid heading sizes — literal copies of index.css's old --text-h1 /
 *  --text-h2 custom properties. Used via inline `style={{ fontSize: ... }}`
 *  at call sites (a font-size clamp() isn't expressible as a static Tailwind
 *  utility without a lot of custom breakpoint duplication, and this was
 *  already how the old code consumed --text-h1/h2 — only the source of the
 *  value changed, not the pattern). */
export const textH1 = 'clamp(2.25rem, 6vw, 4.5rem)'
export const textH2 = 'clamp(1.75rem, 4vw, 3rem)'

/** Both --font-heading and --font-body pointed at the identical stack in
 *  index.css (Proxima Nova first — takes over the moment ROG's Adobe kit is
 *  on the domain — Figtree as the interim stand-in), so one export covers
 *  both. Applied via inline style at the App.tsx root rather than a
 *  `font-heading`/`font-body` utility class, since those utilities no
 *  longer exist without index.css's @theme block generating them. */
export const fontFamily = "'proxima-nova', 'Figtree', ui-sans-serif, system-ui, sans-serif"

interface PlateTokens {
  ink: string
  inkMuted: string
  inkSubtle: string
  bg: string
  surface: string
  border: string
  borderStrong: string
  ring: string
  ringStrong: string
  divide: string
  bgLine: string
}

export const plate: Record<'dark' | 'light', PlateTokens> = {
  dark: {
    ink: 'text-white',
    inkMuted: 'text-[#a6a6a6]',
    inkSubtle: 'text-[#737373]',
    bg: 'bg-black',
    surface: 'bg-[#0d0d0d]',
    border: 'border-[#262626]',
    borderStrong: 'border-[#3d3d3d]',
    ring: 'ring-[#262626]',
    ringStrong: 'ring-[#3d3d3d]',
    divide: 'divide-[#262626]',
    bgLine: 'bg-[#262626]',
  },
  light: {
    ink: 'text-black',
    inkMuted: 'text-[#5c5c5c]',
    inkSubtle: 'text-[#8f8f8f]',
    bg: 'bg-white',
    surface: 'bg-[#f4f4f4]',
    border: 'border-[#e4e4e4]',
    borderStrong: 'border-[#c4c4c4]',
    ring: 'ring-[#e4e4e4]',
    ringStrong: 'ring-[#c4c4c4]',
    divide: 'divide-[#e4e4e4]',
    bgLine: 'bg-[#e4e4e4]',
  },
}

/* ============================================================
   MOTION — complete literal strings for the two reveal patterns every
   section used to get from `.reveal` / `.mask` in index.css. Consumers pick
   the "shown" or "hidden" string based on the same `shown`/`entered`
   boolean useInView already returned; nothing here is assembled at runtime.
   ============================================================ */

/** Scroll-triggered fade-up, was `.reveal` / `[data-shown='true'] .reveal`. */
export const revealBase =
  'transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
export const revealHidden = 'opacity-0 translate-y-4'
export const revealShown = 'opacity-100 translate-y-0'
/** Was `.reveal--delay-1` (140ms). */
export const revealDelay1 = 'delay-[140ms]'

/** Headline wipe reveal, was `.mask` / `.mask__line`. The wrapper (`.mask`)
 *  is simple enough to write inline (`block overflow-hidden pb-[0.1em]`)
 *  wherever it's used; only the animated line needs shared constants. */
export const maskLineBase =
  'block transition-transform duration-[1100ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
export const maskLineHidden = 'translate-y-[105%]'
export const maskLineShown = 'translate-y-0'

/** Mount-triggered hero entrance, was `.hero-reveal` (+ delay-1/2 modifiers)
 *  and `.hero-mark-fade`. Kept separate from the scroll-triggered `reveal*`
 *  exports above for the same reason the old CSS kept them as separate
 *  classes — see About.tsx-era commentary in the removed index.css: the
 *  hero's reveal is mount-triggered (first thing anyone sees), everything
 *  after it waits for actual scroll visibility. */
export const heroRevealBase =
  'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
export const heroRevealHidden = 'opacity-0 translate-y-4'
export const heroRevealShown = 'opacity-100 translate-y-0'
export const heroRevealDelay1 = 'delay-[640ms]'
export const heroRevealDelay2 = 'delay-[780ms]'

export const heroMarkFadeBase =
  'transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none'
export const heroMarkFadeHidden = 'opacity-0 scale-95 blur-[10px]'
export const heroMarkFadeShown = 'opacity-100 scale-100 blur-none'

/** Was `.river-glow` — a static two-tone blob for dark-plate sections that
 *  want a hint of the hero's ambience. No animation, so it converts cleanly
 *  into one arbitrary background-image utility on a plain absolutely
 *  positioned div. The section using it still needs `relative overflow-hidden`,
 *  and its content wrapper still needs `relative z-10`. */
export const riverGlow =
  'pointer-events-none absolute -inset-[20%] z-0 blur-[50px] ' +
  '[background-image:radial-gradient(ellipse_50%_40%_at_18%_15%,rgb(45_212_191/0.12),transparent_65%),radial-gradient(ellipse_45%_40%_at_88%_85%,rgb(56_189_248/0.1),transparent_65%)]'

/* ============================================================
   ACCENT — cyan/teal, the ONE hue the brand allows past black and white
   (2026-09-18, brand-palette correction pass). Black/white is the base
   everywhere; this exists so every section that wants a single deliberate
   highlight — a live indicator, an in-view badge, one hero word, one glow —
   reaches for the SAME hue instead of each section inventing its own
   (earlier passes had cyan-400, sky-400, teal-300, teal-500 and Tailwind
   `blue-500` all live at once across five files, which is what made the
   site read as navy/cyan-led instead of black/white-led). `riverGlow` above
   is this same hue, already baked into an ambient-blob shape — reach for
   that when the accent is a background glow, reach for `accent.*` below
   when it needs to sit on text, a ring, or a badge. Never a background
   fill on its own; a colour this saturated as a fill reads as "the section
   is cyan," not "cyan is highlighting one thing in the section." */
export const accent = {
  text: 'text-cyan-300',
  ring: 'ring-cyan-400/30',
  border: 'border-cyan-400/30',
  bg: 'bg-cyan-400/10',
} as const
