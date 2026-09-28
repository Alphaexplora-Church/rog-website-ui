import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Pill } from '../../../shared/components/ui/River'
import { sermonThumbnail, type Sermon } from '../data/mediaData'
import type { SeriesCard } from '../viewModels/useMediaBrowseViewModel'
import { ArrowGlyph, Cover, MetaLine, PlayGlyph } from './MediaParts'
import { markCover } from './mediaViewHelpers'

/**
 * Netflix-style rows for `/media` (2026-09-27), in the River language:
 *
 *  MediaRail    one titled row: eyebrow + shout title + "See all", then a
 *               side-scrolling shelf that bleeds to the right edge (the next
 *               card peeks, like Netflix) and aligns its first card with the
 *               page container on the left. Desktop gets paging arrows on
 *               hover; touch just swipes. Arrows hide at either end.
 *  MessageCard  16:9 thumbnail — duotone at rest, Colour Bloom on hover /
 *               focus / screen-centre on touch — with an ember "current" bar
 *               that fills along the bottom edge and a play badge. Title and
 *               meta sit BELOW the image (sermon thumbnails rarely carry a
 *               readable title the way Netflix art does).
 *  SeriesPoster tall 4:5 poster for the Series shelf.
 *  RailSkeleton the loading shape of a row.
 *
 * Hard edges (radius 0) on every image — ROG 11's "hard edges, soft light".
 */

/** Left/right padding that lines the first card up with `container`
 *  (max-w-[88rem], px-4 / sm:px-8) while the shelf itself runs edge to edge. */
const BLEED =
  'px-4 scroll-px-4 sm:px-[max(2rem,calc((100vw-88rem)/2+2rem))] sm:scroll-px-[max(2rem,calc((100vw-88rem)/2+2rem))]'
const HEAD = 'mx-auto w-full max-w-[88rem] px-4 sm:px-8'

export function MediaRail({
  id,
  eyebrow,
  title,
  count,
  seeAll,
  children,
}: {
  id: string
  eyebrow?: string
  title: string
  count?: number
  seeAll?: string
  children: ReactNode
}) {
  const scroller = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const start = el.scrollLeft <= 4
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
    setEdge((e) => (e.start === start && e.end === end ? e : { start, end }))
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    measure()
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [measure])

  function page(dir: 1 | -1) {
    const el = scroller.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? 'auto' : 'smooth' })
  }

  const headingId = `${id}-title`

  return (
    <section aria-labelledby={headingId} className="group/rail relative min-w-0">
      <div className={`${HEAD} flex items-end justify-between gap-4 sm:gap-6`}>
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-shallows sm:text-[0.7rem] sm:tracking-[0.24em]">{eyebrow}</p>
          )}
          <h3
            id={headingId}
            className="mt-1 truncate font-shout text-[1.3rem] font-extrabold uppercase leading-[0.95] sm:mt-1.5 sm:text-[clamp(1.6rem,2.6vw,2.4rem)]"
          >
            {title}
            {typeof count === 'number' && (
              <span className="ml-3 align-middle font-sans text-[0.8rem] font-semibold tabular-nums tracking-normal text-bone/45">
                {count}
              </span>
            )}
          </h3>
        </div>
        {seeAll && (
          <Link
            to={seeAll}
            viewTransition
            className="group/see mb-0.5 inline-flex flex-none items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:mb-1 sm:gap-1.5 sm:text-[0.78rem] sm:tracking-[0.16em] text-bone/60 transition-colors duration-300 hover:text-sky focus-visible:text-sky"
          >
            See all
            <span className="sr-only"> — {title}</span>
            <ArrowGlyph className="h-3.5 w-3.5 transition-transform duration-[400ms] ease-current group-hover/see:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="relative mt-2.5 sm:mt-4">
        <ul
          ref={scroller}
          className={`no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pt-2 pb-3 sm:gap-4 sm:pb-4 ${BLEED}`}
        >
          {children}
        </ul>

        {/* Paging arrows — desktop pointers only; touch swipes. */}
        <RailArrow dir={-1} hidden={edge.start} onClick={() => page(-1)} label={`Scroll ${title} back`} />
        <RailArrow dir={1} hidden={edge.end} onClick={() => page(1)} label={`Scroll ${title} forward`} />
      </div>
    </section>
  )
}

function RailArrow({ dir, hidden, onClick, label }: { dir: 1 | -1; hidden: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      tabIndex={-1}
      className={`absolute top-2 bottom-4 z-10 hidden w-16 items-center justify-center text-bone transition-opacity duration-300 ease-current [@media(hover:hover)_and_(pointer:fine)]:flex ${
        dir === -1 ? 'left-0 bg-gradient-to-r' : 'right-0 bg-gradient-to-l'
      } from-abyss via-abyss/70 to-transparent ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-0 group-hover/rail:opacity-100 focus-visible:opacity-100'
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/35 bg-abyss/60 backdrop-blur-sm transition-[background-color,border-color,color,transform] duration-300 ease-current hover:scale-110 hover:border-ember hover:bg-ember hover:text-abyss">
        <ArrowGlyph className={`h-4 w-4 ${dir === -1 ? 'rotate-180' : ''}`} />
      </span>
    </button>
  )
}

/* ── Cards ────────────────────────────────────────────────────────────── */

/** Width of a 16:9 card inside a rail: ~1.3 on phones, ~5.3 on a wide desktop. */
export const RAIL_CARD = 'w-[42vw] flex-none snap-start sm:w-[42vw] md:w-[31vw] lg:w-[22.5vw] 2xl:w-[20rem]'

export function MessageCard({
  s,
  showCategory = false,
  isNew = false,
  className = '',
}: {
  s: Sermon
  showCategory?: boolean
  isNew?: boolean
  className?: string
}) {
  return (
    <li className={className}>
      <Link
        to={`/media/watch/${s.slug}`}
        viewTransition
        onClick={(e) => markCover(e, s.slug)}
        className="group block text-bone outline-none"
      >
        <div className="relative transition-transform duration-[500ms] ease-current group-hover:-translate-y-1 group-focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <Cover
            src={sermonThumbnail(s)}
            title={s.title}
            className="aspect-video w-full ring-0 ring-ember ring-offset-2 ring-offset-abyss transition-shadow duration-300 group-focus-visible:ring-2"
          />
          {/* The current: fills along the bottom edge on hover/focus. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 z-[3] h-[3px] origin-left scale-x-0 bg-ember transition-transform duration-[600ms] ease-current group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          />
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 z-[3] flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-ember text-abyss opacity-0 transition-[opacity,transform] duration-[400ms] ease-current group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          >
            <PlayGlyph className="h-4 w-4" />
          </span>
          {(isNew || showCategory) && (
            <span className="absolute top-1.5 left-1.5 z-[3] flex gap-1 sm:top-2.5 sm:left-2.5 sm:gap-1.5">
              {isNew && (
                <span className="bg-ember px-1.5 py-px text-[0.52rem] font-bold uppercase tracking-[0.16em] text-abyss sm:px-2 sm:py-0.5 sm:text-[0.62rem] sm:tracking-[0.18em]">
                  New
                </span>
              )}
              {showCategory && (
                <span className="bg-abyss/80 px-1.5 py-px text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur-sm sm:px-2 sm:py-0.5 sm:text-[0.62rem] sm:tracking-[0.18em]">
                  {s.category === 'series' ? 'Series' : 'Sermon'}
                </span>
              )}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-[0.8rem] font-semibold leading-snug transition-colors sm:mt-3 sm:font-shout sm:text-[1.35rem] sm:font-extrabold sm:uppercase sm:leading-[0.95] duration-300 group-hover:text-sky group-focus-visible:text-sky">
          {s.title}
        </p>
        <MetaLine s={s} className="mt-0.5 truncate text-[0.66rem] text-sand sm:mt-1.5 sm:text-[0.8rem] sm:whitespace-normal" />
      </Link>
    </li>
  )
}

export function SeriesPoster({ card, className = '' }: { card: SeriesCard; className?: string }) {
  const body = (
    <>
      <Cover src={card.cover} title={card.title} className="aspect-[2/3] w-full sm:aspect-[4/5]" scrim="bottom" />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-[4] h-[3px] origin-left scale-x-0 bg-ember transition-transform duration-[600ms] ease-current group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
      <div className="absolute inset-x-0 bottom-0 z-[3] p-2.5 text-bone sm:p-5">
        {card.isPlaceholder ? (
          <Pill className="max-sm:px-2 max-sm:text-[0.6rem]">coming soon</Pill>
        ) : (
          <p className="text-[0.5rem] font-semibold uppercase tracking-[0.18em] text-shallows sm:text-[0.68rem] sm:tracking-[0.22em]">
            {card.count} {card.count === 1 ? 'message' : 'messages'}
          </p>
        )}
        <p className="mt-1 font-shout text-[1.15rem] font-extrabold uppercase leading-[0.88] sm:mt-2 sm:text-[clamp(1.9rem,3vw,2.6rem)] sm:leading-[0.86]">{card.title}</p>
      </div>
    </>
  )
  return (
    <li className={className}>
      {card.isPlaceholder ? (
        <div className="group relative">{body}</div>
      ) : (
        <Link
          to={`/media/series/${card.slug}`}
          viewTransition
          onClick={(e) => markCover(e, card.slug)}
          className="group relative block outline-none transition-transform duration-[500ms] ease-current hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 focus-visible:ring-offset-abyss motion-reduce:transition-none"
        >
          {body}
        </Link>
      )}
    </li>
  )
}

export const RAIL_POSTER = 'w-[29vw] flex-none snap-start sm:w-[15rem] lg:w-[16.5rem]'

/* ── Loading ──────────────────────────────────────────────────────────── */

export function RailSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div role="status" aria-live="polite" className="grid grid-cols-[minmax(0,1fr)] gap-14">
      <span className="sr-only">Loading messages…</span>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} aria-hidden="true" className="motion-safe:animate-pulse" style={{ animationDelay: `${r * 160}ms` }}>
          <div className={HEAD}>
            <div className="h-2.5 w-20 rounded-full bg-bone/[0.08]" />
            <div className="mt-3 h-7 w-56 bg-bone/[0.08]" />
          </div>
          <div className={`mt-5 flex gap-4 overflow-hidden ${BLEED}`}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={RAIL_CARD}>
                <div className="aspect-video w-full bg-bone/[0.07]" />
                <div className="mt-3 h-5 w-3/4 bg-bone/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
