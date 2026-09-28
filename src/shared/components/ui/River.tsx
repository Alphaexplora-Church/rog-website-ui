import { useState, type ReactNode } from 'react'
import { useCenterBloom } from '../../hooks/useCenterBloom'
import { useInView } from '../../hooks/useInView'
import { eyebrow, revealBase, revealHidden, revealShown } from '../../styles/tokens'

/**
 * River primitives — the small vocabulary every revamped section is built
 * from (ROG 11 §4–5). Kept in one file because they're tiny and always
 * travel together.
 *
 *  WaveMark     ROG's three-wave logo artwork (logo1), in currentColor; can wipe in
 *  WaveRule     one full-width wave hairline — the section divider
 *  Pill         outlined, italic, lowercase label — ROG's own label style
 *  Eyebrow      wave glyph + small uppercase label
 *  RiverImage   image with River duotone (Colour Bloom), scrim, grain
 *  Reveal       one scroll-entrance wrapper for a section GROUP
 *  Marquee      the slow sideways river of text, with a pause control
 */

/* ── WaveMark ─────────────────────────────────────────────────────────── */

/**
 * ROG's own three-wave mark (2026-09-28, Jude: "palitan mo lahat ng
 * wavemark to … logo1.png"). Was a hand-drawn SVG approximation; now the
 * real artwork, `public/assets/logo1-mark.webp` — a trimmed, alpha-only copy
 * of `public/assets/logo1.png` (373 KB → 14 KB; the original is untouched).
 *
 * Used as a CSS MASK filled with `currentColor`, not as an <img>, so every
 * existing call keeps its colour (ember in the hero, faint bone behind
 * sections, abyss on light plates) from its `text-*` class. The file's shape
 * is 4:1; `aspect-[4/1]` lets `h-auto w-[…]` callers size by width alone,
 * and `mask-size: contain` keeps it undistorted when both are set.
 * `draw` wipes it in left → right. `strokeWidth` is accepted and ignored
 * (it belonged to the SVG), so no caller had to change.
 */
export function WaveMark({
  className = 'h-6 w-16',
  draw = false,
}: {
  className?: string
  draw?: boolean
  strokeWidth?: number
}) {
  return (
    <span
      aria-hidden="true"
      className={`block aspect-[4/1] flex-none bg-current [-webkit-mask:url('/assets/logo1-mark.webp')_center/contain_no-repeat] [mask:url('/assets/logo1-mark.webp')_center/contain_no-repeat] ${draw ? 'animate-wave-draw' : ''} ${className}`}
    />
  )
}

/* ── WaveRule ─────────────────────────────────────────────────────────── */

export function WaveRule({ className = 'text-bone/15' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 24"
      preserveAspectRatio="none"
      className={`block h-6 w-full ${className}`}
      fill="none"
    >
      <path
        d="M0 12 C 120 2, 240 2, 360 12 S 600 22, 720 12 S 960 2, 1080 12 S 1320 22, 1440 12"
        stroke="currentColor"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* ── Pill ─────────────────────────────────────────────────────────────── */

export function Pill({
  children,
  tone = 'dark',
  active = false,
  className = '',
}: {
  children: ReactNode
  tone?: 'dark' | 'light' | 'ember'
  active?: boolean
  className?: string
}) {
  const tones = {
    dark: active ? 'border-bone bg-bone text-abyss' : 'border-bone/35 text-bone/85',
    light: active ? 'border-abyss bg-abyss text-bone' : 'border-abyss/30 text-abyss/80',
    ember: 'border-ember/60 text-ember',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-[0.2rem] text-[0.82rem] font-medium italic lowercase leading-snug ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* ── Eyebrow ──────────────────────────────────────────────────────────── */

export function Eyebrow({
  children,
  className = 'text-shallows',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={`flex items-center gap-3 ${eyebrow} ${className}`}>
      <WaveMark className="h-3 w-8 flex-none" strokeWidth={7} />
      <span>{children}</span>
    </p>
  )
}

/* ── RiverImage ───────────────────────────────────────────────────────── */

export function RiverImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  bloom = 'hover',
  scrim = 'none',
  priority = false,
  position,
}: {
  src: string
  alt?: string
  className?: string
  imgClassName?: string
  /** 'hover' = duotone at rest, true colour on engage (lists).
   *  'always' = full colour (detail pages). On touch devices 'hover'
   *  blooms when the image reaches the middle of the screen. */
  bloom?: 'hover' | 'always'
  scrim?: 'none' | 'bottom' | 'left' | 'full'
  priority?: boolean
  position?: string
}) {
  const ref = useCenterBloom<HTMLDivElement>(bloom === 'hover')
  const scrims = {
    none: '',
    bottom: 'bg-gradient-to-t from-abyss via-abyss/55 to-transparent',
    left: 'bg-gradient-to-r from-abyss via-abyss/60 to-transparent',
    full: 'bg-abyss/55',
  }
  const duo = bloom === 'always' ? '' : 'duotone'
  return (
    <div
      ref={ref}
      className={`grain relative overflow-hidden bg-deep ${duo} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        style={position ? { objectPosition: position } : undefined}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-current group-hover:scale-[1.04] motion-reduce:transition-none ${imgClassName}`}
      />
      {scrim !== 'none' && (
        <div aria-hidden="true" className={`absolute inset-0 z-[2] ${scrims[scrim]}`} />
      )}
    </div>
  )
}

/* ── Reveal ───────────────────────────────────────────────────────────── */

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'section' | 'header'
}) {
  const { ref, shown } = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={`${revealBase} ${shown ? revealShown : revealHidden} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

/* ── Marquee ──────────────────────────────────────────────────────────── */

export function Marquee({
  items,
  className = 'bg-ember text-abyss',
  label = 'Announcements',
}: {
  items: string[]
  className?: string
  label?: string
}) {
  const [paused, setPaused] = useState(false)
  const set = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={`${t}-${i}`} className="flex items-center">
          <span className="px-6 font-shout text-[1.35rem] font-bold uppercase tracking-[0.02em] sm:text-2xl">
            {t}
          </span>
          <WaveMark className="h-4 w-10 opacity-70" strokeWidth={8} />
        </span>
      ))}
    </div>
  )
  return (
    <section aria-label={label} className={`relative flex items-center overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee py-3 motion-reduce:animate-none"
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {set(false)}
        {set(true)}
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play scrolling announcements' : 'Pause scrolling announcements'}
        className="absolute right-0 z-10 flex h-full w-12 items-center justify-center bg-inherit [background:inherit]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current/40">
          {paused ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          )}
        </span>
      </button>
    </section>
  )
}

/* ── SectionHead ──────────────────────────────────────────────────────── */

export function SectionHead({
  eyebrow: eb,
  title,
  lead: leadText,
  tone = 'dark',
  className = '',
  titleClassName = 'font-shout font-extrabold uppercase leading-[0.9] text-[clamp(2.75rem,6.5vw,6rem)]',
  id,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  lead?: ReactNode
  tone?: 'dark' | 'light'
  className?: string
  titleClassName?: string
  id?: string
}) {
  const { ref, shown } = useInView<HTMLDivElement>()
  const ink = tone === 'dark' ? 'text-bone' : 'text-abyss'
  const muted = tone === 'dark' ? 'text-bone/75' : 'text-abyss/70'
  return (
    <div ref={ref} className={className}>
      {eb && (
        <div className={`${revealBase} ${shown ? revealShown : revealHidden}`}>
          <Eyebrow className={tone === 'dark' ? 'text-shallows' : 'text-current'}>{eb}</Eyebrow>
        </div>
      )}
      <h2 id={id} className={`mt-5 text-balance ${ink} ${titleClassName}`}>
        <span className="block overflow-hidden pb-[0.06em]">
          <span
            className={`block transition-transform duration-[1200ms] ease-tide motion-reduce:transition-none ${shown ? 'translate-y-0' : 'translate-y-[105%] motion-reduce:translate-y-0'}`}
          >
            {title}
          </span>
        </span>
      </h2>
      {leadText && (
        <p
          className={`mt-6 max-w-[40ch] font-whisper text-[clamp(1.2rem,1.7vw,1.5rem)] italic leading-[1.45] ${muted} ${revealBase} delay-[200ms] ${shown ? revealShown : revealHidden}`}
        >
          {leadText}
        </p>
      )}
    </div>
  )
}
