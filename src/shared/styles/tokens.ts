/**
 * Shared class-string tokens. REVAMP 2026-09-25 ("Textured Editorial",
 * ROG 11).
 *
 * The palette itself now lives in `src/index.css` `@theme` — that generates
 * named utilities (`bg-abyss`, `text-bone`, `text-ember`, `font-shout`,
 * `font-whisper`, `ease-tide`…). This file keeps only COMPLETE class strings
 * that several components share, so a type step or reveal timing is one
 * edit.
 *
 * ⚠ Tailwind's scanner reads literal source text. Every export below is a
 * complete class string; never build one by interpolating a fragment
 * (`text-${x}`) at runtime — it will silently generate no CSS.
 */

export const ease = 'cubic-bezier(0.32,0.72,0,1)'

/* ── Type scale (ROG 11 §4.2) ─────────────────────────────────────────── */

/** Shout — tall condensed, uppercase. Keep lines to 2–4 words. */
export const displayXL =
  'font-shout font-extrabold uppercase leading-[0.86] tracking-[-0.01em] text-[clamp(4.25rem,13vw,12rem)]'
export const displayL =
  'font-shout font-extrabold uppercase leading-[0.9] tracking-[-0.005em] text-[clamp(3.25rem,8.5vw,8rem)]'
export const displayM =
  'font-shout font-bold uppercase leading-[0.92] text-[clamp(2.5rem,5.4vw,4.5rem)]'
export const displayS =
  'font-shout font-bold uppercase leading-[0.95] text-[clamp(1.75rem,3vw,2.5rem)]'
export const numeral =
  'font-shout font-bold leading-none tabular-nums text-[clamp(3.5rem,9vw,9rem)]'

/** Whisper — italic didone for scripture, leads, pull quotes. */
export const whisperL =
  'font-whisper italic font-medium leading-[1.1] text-[clamp(1.75rem,3.6vw,3.5rem)]'
export const lead =
  'font-whisper italic leading-[1.45] text-[clamp(1.2rem,1.7vw,1.5rem)]'

/** Body / UI. */
export const meta = 'text-[0.8125rem] font-medium tracking-[0.02em] tabular-nums'
export const eyebrow = 'text-[0.72rem] font-semibold uppercase tracking-[0.22em]'

/** The page container every section uses. */
export const container = 'mx-auto w-full max-w-[88rem] px-4 sm:px-8'

/** Legacy aliases — some older call sites still size headings inline. */
export const textH1 = 'clamp(3.25rem, 8.5vw, 8rem)'
export const textH2 = 'clamp(2.5rem, 5.4vw, 4.5rem)'
export const fontFamily = "'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif"

/* ── Plates — kept for call sites that switch dark/light by prop ──────── */

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
    ink: 'text-bone',
    inkMuted: 'text-bone/70',
    inkSubtle: 'text-sand',
    bg: 'bg-abyss',
    surface: 'bg-abyss-2',
    border: 'border-bone/12',
    borderStrong: 'border-bone/25',
    ring: 'ring-bone/12',
    ringStrong: 'ring-bone/25',
    divide: 'divide-bone/12',
    bgLine: 'bg-bone/12',
  },
  light: {
    ink: 'text-abyss',
    inkMuted: 'text-abyss/70',
    inkSubtle: 'text-abyss/55',
    bg: 'bg-bone',
    surface: 'bg-bone-2',
    border: 'border-abyss/10',
    borderStrong: 'border-abyss/25',
    ring: 'ring-abyss/10',
    ringStrong: 'ring-abyss/25',
    divide: 'divide-abyss/10',
    bgLine: 'bg-abyss/10',
  },
}

/* ── Motion — "water moves": drift and tide, never bounce ─────────────── */

/** Scroll-triggered rise. Pair with useInView's `shown`. */
export const revealBase =
  'transition-[opacity,transform] duration-[900ms] ease-tide motion-reduce:transition-none'
export const revealHidden = 'opacity-0 translate-y-8 motion-reduce:opacity-100 motion-reduce:translate-y-0'
export const revealShown = 'opacity-100 translate-y-0'
export const revealDelay1 = 'delay-[120ms]'
export const revealDelay2 = 'delay-[240ms]'
export const revealDelay3 = 'delay-[360ms]'

/** Headline tide — each line rises out of a mask. */
export const maskLineBase =
  'block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none'
export const maskLineHidden = 'translate-y-[108%] motion-reduce:translate-y-0'
export const maskLineShown = 'translate-y-0'

/** Mount-triggered hero entrance. */
export const heroRevealBase =
  'transition-[opacity,transform] duration-[1200ms] ease-tide motion-reduce:transition-none'
export const heroRevealHidden = 'opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0'
export const heroRevealShown = 'opacity-100 translate-y-0'
export const heroRevealDelay1 = 'delay-[500ms]'
export const heroRevealDelay2 = 'delay-[700ms]'

export const heroMarkFadeBase =
  'transition-[opacity,transform,filter] duration-[1200ms] ease-tide motion-reduce:transition-none'
export const heroMarkFadeHidden = 'opacity-0 scale-95 blur-[10px]'
export const heroMarkFadeShown = 'opacity-100 scale-100 blur-none'

/** Ambient light for dark sections — teal pool + one ember ember-glow. */
export const riverGlow =
  'pointer-events-none absolute -inset-[15%] z-0 blur-[60px] ' +
  '[background-image:radial-gradient(ellipse_45%_40%_at_15%_20%,color-mix(in_srgb,var(--color-river)_55%,transparent),transparent_70%),radial-gradient(ellipse_35%_30%_at_90%_85%,color-mix(in_srgb,var(--color-ember)_16%,transparent),transparent_70%)]'

/** Ember glow — ONLY behind the primary CTA and the LIVE badge (ROG 11 §4.5). */
export const emberGlow =
  'pointer-events-none absolute -inset-3 -z-10 rounded-full bg-ember/30 blur-2xl'

/* ── Accent ─ ember is the ONE hue past the river palette ─────────────── */
export const accent = {
  text: 'text-ember',
  ring: 'ring-ember/40',
  border: 'border-ember/40',
  bg: 'bg-ember/12',
} as const
