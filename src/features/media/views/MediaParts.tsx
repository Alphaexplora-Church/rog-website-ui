import { useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import sermonPlaceholder from '../../../shared/assets/sermon-placeholder.svg'
import { Pill, WaveMark } from '../../../shared/components/ui/River'
import { useCenterBloom } from '../../../shared/hooks/useCenterBloom'
import { Button } from '../../../shared/components/ui/Button'
import { container } from '../../../shared/styles/tokens'
import { categoryLabel, sermonThumbnail, type Sermon } from '../data/mediaData'
import { dateParts, markCover } from './mediaViewHelpers'

/**
 * Media building blocks shared by the library and the three detail routes
 * (REVAMP 2026-09-25, ROG 11 §6). One file so the library row and the
 * browse-page row are literally the same component.
 *
 *  Cover         image frame: duotone + Colour Bloom, grain, and a DESIGNED
 *                fallback (River gradient, wave mark, the title set big and
 *                faint). The fallback sits under the <img>, so it is also the
 *                loading state, and it takes over when a YouTube thumbnail
 *                fails or the generic "thumbnail pending" SVG is all we have.
 *  MessageIndex  the index list — date numerals · shout title · speaker ·
 *                pills · arrow — with a Cursor Preview on desktop and an
 *                inline thumbnail on touch/small screens.
 *  PosterGrid    the same messages as staggered 16:9 duotone posters.
 *  markCover     (mediaViewHelpers.ts) Poster Morph: names the clicked card's image
 *                `cover-<slug>` just before React Router's view transition,
 *                so it morphs into the detail page's hero. Named on click
 *                (not statically) because two visible elements with one
 *                name abort the transition — the featured hero and its own
 *                library row would otherwise collide.
 */

/* ── Glyphs ───────────────────────────────────────────────────────────── */

export function PlayGlyph({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M8 5.5v13l10.5-6.5z" />
    </svg>
  )
}

export function ArrowGlyph({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/* ── Cover ────────────────────────────────────────────────────────────── */

/** The designed stand-in for a missing image. `@container` lets the faint
 *  title scale with the frame, from a row thumbnail up to a full hero. */
export function CoverArt({ title }: { title?: string }) {
  return (
    <div aria-hidden="true" className="@container absolute inset-0 overflow-hidden bg-gradient-to-br from-river via-deep to-abyss">
      <div className="absolute inset-0 [background-image:radial-gradient(ellipse_60%_55%_at_85%_100%,rgb(242_118_28/0.28),transparent_70%),radial-gradient(ellipse_50%_60%_at_0%_0%,rgb(127_194_184/0.22),transparent_70%)]" />
      <WaveMark className="absolute top-[58%] -right-[12%] h-auto w-[85%] -translate-y-1/2 text-bone/[0.16]" strokeWidth={4} />
      {title && (
        <span className="absolute inset-x-[7%] top-[9%] line-clamp-3 font-shout text-[clamp(0.9rem,15cqw,9rem)] font-extrabold uppercase leading-[0.84] text-bone/[0.2]">
          {title}
        </span>
      )}
    </div>
  )
}

export function Cover({
  src,
  alt = '',
  title,
  className = '',
  imgClassName = '',
  bloom = 'hover',
  scrim = 'none',
  priority = false,
  vtName,
}: {
  src?: string
  alt?: string
  /** Set into the fallback art. */
  title?: string
  className?: string
  imgClassName?: string
  bloom?: 'hover' | 'always'
  scrim?: 'none' | 'bottom' | 'hero'
  priority?: boolean
  /** Static view-transition name (detail-page heroes only). */
  vtName?: string
}) {
  const ref = useCenterBloom<HTMLDivElement>(bloom === 'hover')
  const [failedSrc, setFailedSrc] = useState<string>()
  const real = src && src !== sermonPlaceholder && failedSrc !== src ? src : undefined
  return (
    <div
      ref={ref}
      data-cover=""
      className={`grain relative overflow-hidden bg-deep ${bloom === 'hover' ? 'duotone' : ''} ${className}`}
      style={vtName ? { viewTransitionName: vtName } : undefined}
    >
      <CoverArt title={title} />
      {real && (
        <img
          src={real}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          onError={() => setFailedSrc(real)}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-current group-hover:scale-[1.04] motion-reduce:transition-none ${imgClassName}`}
        />
      )}
      {scrim === 'bottom' && (
        <div aria-hidden="true" className="absolute inset-0 z-[2] bg-gradient-to-t from-abyss via-abyss/50 to-transparent" />
      )}
      {scrim === 'hero' && (
        <div aria-hidden="true" className="absolute inset-0 z-[2]">
          <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/60 to-abyss/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-abyss/80 via-abyss/25 to-transparent" />
        </div>
      )}
    </div>
  )
}

/** "Mar 10, 2024 · Pastor Rachel Sanchez", placeholder dates set in italic. */
export function MetaLine({ s, className = '' }: { s: Sermon; className?: string }) {
  return (
    <p className={`text-[0.85rem] font-medium tracking-[0.02em] tabular-nums ${className}`}>
      {s.date && <span className={s.dateIsPlaceholder ? 'italic' : undefined}>{s.date}</span>}
      {s.date && s.speakerName ? <span aria-hidden="true"> · </span> : ''}
      {s.speakerName}
    </p>
  )
}

/* ── MessageIndex ─────────────────────────────────────────────────────── */

/** Touch or narrow screens get an inline thumbnail; wide + hover-capable
 *  screens get the date numerals and the floating Cursor Preview instead. */
const PREVIEW_MQ = '(hover: hover) and (pointer: fine) and (min-width: 64rem)'

export function MessageIndex({
  items,
  showCategory = false,
  topicTitle,
  tone = 'light',
}: {
  items: Sermon[]
  showCategory?: boolean
  topicTitle: (slug: string) => string | undefined
  tone?: 'light' | 'dark'
}) {
  const light = tone === 'light'
  const previewRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0, fresh: true })
  const enabled = useRef(false)
  const reduce = useRef(false)
  const [active, setActive] = useState<Sermon | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PREVIEW_MQ)
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      enabled.current = mq.matches
      reduce.current = rm.matches
      if (!mq.matches) setVisible(false)
    }
    sync()
    mq.addEventListener('change', sync)
    rm.addEventListener('change', sync)
    const p = pos.current
    return () => {
      mq.removeEventListener('change', sync)
      rm.removeEventListener('change', sync)
      cancelAnimationFrame(p.raf)
    }
  }, [])

  /* Position lives in refs and is written straight to `transform` — the
     pointer can move 120 times a second without React rendering once. The
     preview trails the cursor slightly (a lerp) and tilts with its speed:
     water, not a sticker. Reduced motion → it simply sits by the cursor. */
  function tick() {
    const p = pos.current
    const el = previewRef.current
    if (!el) return
    const k = reduce.current || p.fresh ? 1 : 0.2
    p.fresh = false
    const dx = p.tx - p.x
    p.x += dx * k
    p.y += (p.ty - p.y) * k
    const w = el.offsetWidth
    const h = el.offsetHeight
    let x = p.x + 32
    if (x + w > window.innerWidth - 16) x = p.x - w - 32
    const y = Math.min(Math.max(p.y - h / 2, 16), window.innerHeight - h - 16)
    const tilt = reduce.current ? 0 : Math.max(-5, Math.min(5, dx * 0.06))
    el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`
    if (Math.abs(p.tx - p.x) > 0.4 || Math.abs(p.ty - p.y) > 0.4) p.raf = requestAnimationFrame(tick)
    else p.raf = 0
  }

  function onMove(e: PointerEvent<HTMLUListElement>) {
    if (e.pointerType !== 'mouse' || !enabled.current) return
    const p = pos.current
    p.tx = e.clientX
    p.ty = e.clientY
    if (!p.raf) p.raf = requestAnimationFrame(tick)
  }

  function onEnterRow(e: PointerEvent<HTMLElement>, s: Sermon) {
    if (e.pointerType !== 'mouse' || !enabled.current) return
    setActive(s)
    setVisible(true)
  }

  function onLeaveList() {
    setVisible(false)
    pos.current.fresh = true
  }

  function onClickRow(e: MouseEvent<HTMLElement>, s: Sermon) {
    if (visible && previewRef.current) previewRef.current.style.viewTransitionName = `cover-${s.slug}`
    else markCover(e, s.slug)
  }

  const line = light ? 'border-abyss/15' : 'border-bone/12'
  const ink = light ? 'text-abyss' : 'text-bone'
  const muted = light ? 'text-abyss/65' : 'text-sand'
  const flood = light ? 'bg-bone-2' : 'bg-abyss-2'

  return (
    <>
      <ul onPointerMove={onMove} onPointerLeave={onLeaveList} className={`border-t ${line}`}>
        {items.map((s) => {
          const d = dateParts(s)
          const topics = s.topicSlugs.map((t) => topicTitle(t)).filter(Boolean) as string[]
          return (
            <li key={s.slug} className={`border-b ${line}`}>
              <Link
                to={`/media/watch/${s.slug}`}
                viewTransition
                onPointerEnter={(e) => onEnterRow(e, s)}
                onClick={(e) => onClickRow(e, s)}
                className={`group relative grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 sm:grid-cols-[11rem_minmax(0,1fr)_3rem] sm:gap-x-6 lg:grid-cols-[9rem_minmax(0,1fr)_14rem_3.5rem] lg:py-7 ${ink}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 -inset-x-4 -z-0 origin-left scale-x-0 transition-transform duration-[700ms] ease-current group-hover:scale-x-100 motion-reduce:transition-none sm:-inset-x-6 ${flood}`}
                />

                {/* Inline thumbnail (touch / narrow) */}
                <div className="relative block [@media(hover:hover)_and_(pointer:fine)_and_(min-width:64rem)]:hidden">
                  <Cover src={sermonThumbnail(s)} title={s.title} className="aspect-video w-full" />
                </div>
                {/* Date numerals (wide + hover) */}
                <div className="relative hidden [@media(hover:hover)_and_(pointer:fine)_and_(min-width:64rem)]:block">
                  <span className="block font-shout text-[4.5rem] font-extrabold leading-[0.8] tabular-nums">{d.day}</span>
                  <span className={`mt-2 block text-[0.72rem] font-semibold uppercase tracking-[0.2em] ${d.pending ? 'italic normal-case tracking-[0.04em]' : ''} ${muted}`}>
                    {d.rest}
                  </span>
                </div>

                <div className="relative min-w-0">
                  <p className="font-shout text-[clamp(1.45rem,3.4vw,3.1rem)] font-extrabold uppercase leading-[0.92] transition-transform duration-[600ms] ease-current group-hover:translate-x-2 motion-reduce:transition-none">
                    {s.title}
                  </p>
                  <MetaLine s={s} className={`mt-2 lg:hidden ${muted}`} />
                  {(showCategory || topics.length > 0) && (
                    <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                      {showCategory && (
                        <Pill tone={light ? 'light' : 'dark'} active>
                          {categoryLabel(s.category)}
                        </Pill>
                      )}
                      {topics.map((t) => (
                        <Pill key={t} tone={light ? 'light' : 'dark'}>
                          {t}
                        </Pill>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`relative hidden text-[0.9rem] lg:block ${muted}`}>
                  {s.speakerName && <p className={`font-semibold ${ink}`}>{s.speakerName}</p>}
                  <p className="mt-1 text-[0.8rem]">{d.pending ? 'Date pending' : s.date}</p>
                </div>

                <span
                  aria-hidden="true"
                  className={`relative hidden h-12 w-12 items-center justify-center justify-self-end rounded-full border transition-[background-color,border-color,color,transform] duration-[500ms] ease-current group-hover:translate-x-1 group-hover:border-ember group-hover:bg-ember group-hover:text-abyss motion-reduce:transition-none sm:flex ${light ? 'border-abyss/25' : 'border-bone/30'}`}
                >
                  <ArrowGlyph />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      {createPortal(
          <div
            ref={previewRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-40 w-[22rem] will-change-transform"
          >
            <div
              className={`origin-center transition-[opacity,scale] duration-[450ms] ease-current motion-reduce:transition-none ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
              {active && (
                <div className="relative">
                  <Cover
                    key={active.slug}
                    src={sermonThumbnail(active)}
                    title={active.title}
                    bloom="always"
                    className="aspect-video w-full"
                  />
                  <span className="absolute bottom-3 left-3 z-[3] flex h-10 w-10 items-center justify-center rounded-full bg-ember text-abyss">
                    <PlayGlyph className="h-4 w-4" />
                  </span>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

/* ── PosterGrid ───────────────────────────────────────────────────────── */

/** The posters view: 16:9 duotone frames that bloom to colour, staggered
 *  down the middle column so it reads as a wall, not a card grid. */
export function PosterGrid({ items, showCategory = false }: { items: Sermon[]; showCategory?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:pb-16">
      {items.map((s) => (
        <li key={s.slug} className="lg:[&:nth-child(3n+2)]:translate-y-16">
          <Link to={`/media/watch/${s.slug}`} viewTransition onClick={(e) => markCover(e, s.slug)} className="group block text-abyss">
            <div className="relative">
              <Cover src={sermonThumbnail(s)} title={s.title} className="aspect-video w-full" />
              <span
                aria-hidden="true"
                className="absolute right-4 bottom-4 z-[3] flex h-12 w-12 items-center justify-center rounded-full bg-bone text-abyss transition-[background-color,transform] duration-500 ease-current group-hover:scale-110 group-hover:bg-ember motion-reduce:transition-none"
              >
                <PlayGlyph className="h-4 w-4" />
              </span>
              {showCategory && (
                <span className="absolute top-3 right-3 z-[3]">
                  <Pill tone="dark" active>
                    {categoryLabel(s.category)}
                  </Pill>
                </span>
              )}
            </div>
            <MetaLine s={s} className="mt-4 text-abyss/65" />
            <p className="mt-1 font-shout text-[1.9rem] font-extrabold uppercase leading-[0.95]">
              <span className="bg-[linear-gradient(var(--color-ember),var(--color-ember))] bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-[600ms] ease-current group-hover:bg-[length:100%_3px]">
                {s.title}
              </span>
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/* ── Small page pieces ────────────────────────────────────────────────── */

export function BackLink({ to, children = 'Media Library', className = 'text-shallows' }: { to: string; children?: ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      viewTransition
      className={`group inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300 hover:text-bone ${className}`}
    >
      <ArrowGlyph className="h-4 w-4 rotate-180 transition-transform duration-[400ms] ease-current group-hover:-translate-x-1" />
      {children}
    </Link>
  )
}

/** Shared "not found" plate for the three detail routes. */
export function MediaNotFound({ message, backTo = '/media' }: { message: string; backTo?: string }) {
  return (
    <section data-plate="dark" className="relative isolate flex min-h-[72svh] items-end overflow-hidden bg-abyss text-bone">
      <WaveMark className="absolute -right-[10%] top-[18%] -z-10 h-auto w-[80vw] max-w-[1000px] text-bone/[0.05]" strokeWidth={3} />
      <div className={`${container} pb-24 pt-36`}>
        <BackLink to={backTo} />
        <h1 className="mt-8 font-shout text-[clamp(4rem,12vw,10rem)] font-extrabold uppercase leading-[0.85]">
          Not here.
        </h1>
        <p className="mt-6 max-w-[40ch] font-whisper text-[clamp(1.2rem,1.8vw,1.6rem)] italic text-bone/80">{message}</p>
        <div className="mt-10">
          <Button to={backTo} variant="solid" arrow>
            Back to Media Library
          </Button>
        </div>
      </div>
    </section>
  )
}
