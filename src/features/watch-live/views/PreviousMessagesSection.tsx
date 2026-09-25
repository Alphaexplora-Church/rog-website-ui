import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { ErrorBlock, LoadingBlock } from '../../../shared/components/ui/LoadState'
import { sermonThumbnail } from '../../media/data/mediaData'
import { usePreviousMessagesViewModel } from '../viewModels/usePreviousMessagesViewModel'

/** Stagger between card entrances, capped so a long library doesn't cascade
 *  for a second and a half before the last row lands. */
const STAGGER_MS = 60
const STAGGER_CAP = 5

/**
 * Watch Live, section 2 — "Previous Messages". Jude's reference used a fake
 * two-language archive with fabricated titles/speakers; that's exactly the
 * kind of invented content this project avoids (see mediaData.ts's own
 * history). This pulls the REAL Sermons-category messages seeded there
 * (Sunday + Midweek; they were a "Sunday Service" series until 2026-09-23),
 * newest-first is not tracked yet so this is array order (same convention
 * SeriesDetail/BrowseDetail use elsewhere) — which is also why this does NOT
 * mark any card "Latest": that would claim an ordering the data doesn't
 * actually guarantee. No language tabs — our sermon data doesn't carry a
 * language field, unlike the reference's sample set. "Watch" links to the
 * real `/media/watch/:slug` route; the reference's "Notes" button and
 * Subscribe/Podcast/Share row are dropped since none of those features exist
 * yet rather than link to something that doesn't work.
 *
 * MOTION PASS, 2026-09-22 (emil-design-eng):
 *
 * ARRIVAL AND INTERACTION ARE ON DIFFERENT ELEMENTS. A card can't carry both
 * the reveal transition (`transition-[opacity,transform]`, 700ms) and the
 * hover/press transition (200ms) — one `transition-*` utility overwrites the
 * other. The `<li>` owns arrival, the `<Link>` inside owns interaction, and
 * neither can clobber the other. That split is also why this is a real
 * `<ul>`/`<li>` now: it always was a list of messages, and the wrapper the
 * stagger needed was the honest place to say so.
 *
 * THE TITLE USED TO SNAP. `group-hover:text-[#8FD4C9]` sat on an element
 * with no transition at all, so the hover colour changed in one frame while
 * everything around it eased. It now shares the 200ms interaction timing.
 *
 * HOVER OUT IS FASTER THAN HOVER IN (300ms in, 200ms out on the thumbnail
 * zoom) — the system should answer faster than it commits. If
 * `group-hover:duration-300` is ever dropped by the JIT the effect simply
 * runs symmetrically at 200ms, which is why it's expressed this way round.
 *
 * THE PLAY BADGE FADES BUT DOES NOT SCALE, on purpose. It sits on top of an
 * image that is already scaling under it; giving the badge its own scale
 * puts two competing motions in the same 288px box and reads as wobble.
 */
export function PreviousMessagesSection() {
  const { ref, shown } = useInView<HTMLDivElement>()
  // From the CMS (2026-09-23) — the newest Sermons-category messages.
  const { sermons, isLoading, error } = usePreviousMessagesViewModel()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section data-plate="dark" className="bg-[#161616] text-white">
      <div ref={ref} className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div
          className={`flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between ${reveal}`}
          style={{ transitionDelay: '0ms' }}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-[#8FD4C9] uppercase">
              Sermon Library
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">Previous Messages</h2>
          </div>
          <Link
            to="/media?category=sermon"
            className="group inline-flex items-center gap-1 text-xs font-bold tracking-[0.15em] text-white/60 uppercase transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
          >
            Browse full library
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10">
            <LoadingBlock tone="dark" rows={2} />
          </div>
        ) : error ? (
          <div className="mt-10">
            <ErrorBlock tone="dark" error={error} />
          </div>
        ) : sermons.length === 0 ? (
          <div
            className={`mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center ${reveal}`}
            style={{ transitionDelay: '80ms' }}
          >
            <p className="text-sm text-white/50">No messages yet — check back soon.</p>
          </div>
        ) : (
          <ul className="mt-10 flex flex-col gap-4">
            {sermons.map((s, i) => (
              <li
                key={s.slug}
                className={reveal}
                style={{ transitionDelay: `${80 + Math.min(i, STAGGER_CAP) * STAGGER_MS}ms` }}
              >
                <Link
                  to={`/media/watch/${s.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#1b7a70]/40 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-row sm:items-center"
                >
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl sm:w-72">
                    <img
                      src={sermonThumbnail(s)}
                      alt={s.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:duration-300 motion-reduce:transition-none"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-lg font-bold transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[#8FD4C9]">
                      {s.title}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      {s.date && (
                        <span className={s.dateIsPlaceholder ? 'text-white/30 italic' : undefined}>
                          {s.date}
                        </span>
                      )}
                      {s.date && s.speakerName ? ' · ' : ''}
                      {s.speakerName}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 px-4 py-2 text-[10px] font-bold tracking-widest text-white/70 uppercase transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-[#8FD4C9] group-hover:text-[#8FD4C9]">
                    Watch
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
