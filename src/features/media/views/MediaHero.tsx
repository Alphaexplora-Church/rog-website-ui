import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown, riverGlow } from '../../../shared/styles/tokens'
import { findSermon, sermonThumbnail } from '../data/mediaData'

/**
 * Media, section 1 — hero spotlight. Modeled on the real site's "Most
 * Recent" hero (screenshot Jude shared), but relabeled "Featured Message"
 * rather than "Most Recent" — of our sample sermons only this one carries a
 * confirmed real date, so claiming it's the most *recent* upload would be a
 * guess we can't back up. Real most-recent ordering is a job for the actual
 * CMS/API once that's wired.
 *
 * UPDATED 2026-09-22: featured sermon switched from "Spirit of Elijah" to
 * "Redemption, Reconciliation and Restoration" — the sourced videoId for
 * Spirit of Elijah turned out to belong to a different church entirely
 * (Grace Church Shah Alam, not River of God), so it is no longer a safe pick
 * to feature until Jude sends the real link.
 *
 * ── REDESIGNED 2026-09-23 ────────────────────────────────────────────────
 * Jude: "fix also the design of the hero section… in the Media tab."
 *
 * THE REAL BUG FIRST. The section had `py-20` and no top padding, so its
 * first line sat underneath the floating navbar — "FEATURED MESSAGE" was
 * physically clipped by the nav pill at every viewport width. Every other
 * hero on this site clears it with `pt-40 sm:pt-48`; this one never did.
 * That alone was most of why the page read as broken rather than merely
 * plain.
 *
 * The rest of it: the headline was `text-3xl`, a body-copy size for a page
 * hero; the thumbnail of a *video* carried no play affordance, so it read as
 * a decorative still; there was no eyebrow pill (Doc 9 §4C); no depth behind
 * the plate; and the single CTA left no route down to the library.
 *
 * Now: cleared top padding, eyebrow pill, hero-scale headline, the shared
 * `riverGlow` ambience, a double-bezel media card (Doc 9 §4A) carrying the
 * same play badge LatestSermonSection already uses, and a second link down
 * to `#media-library`. Section padding is `py-24`+ per Doc 9.
 *
 * ⚠ THE SAMPLE THUMBNAIL IS ANOTHER CHURCH'S ARTWORK. The frame this pulls
 * reads "DESTINYC3 SERMONS" across the top — the same class of problem as
 * the Spirit of Elijah videoId noted above. It is sample data, not ROG's,
 * and should not ship. Replacing it is a `mediaData.ts` job, not a layout
 * one.
 */
export function MediaHero() {
  const { ref, shown } = useInView<HTMLElement>()
  const sermon = findSermon('redemption-reconciliation-and-restoration')!
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section
      data-plate="dark"
      aria-labelledby="media-hero-heading"
      className="relative overflow-hidden bg-black text-white"
    >
      <div aria-hidden="true" className={riverGlow} />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid max-w-[86rem] grid-cols-1 items-center gap-10 px-6 pt-32 pb-24 sm:pt-40 sm:pb-28 lg:grid-cols-2 lg:gap-16"
      >
        <div className={reveal} style={{ transitionDelay: '0ms' }}>
          {/* Doc 9 §4C eyebrow pill — this was bare tracked-out text, and it
              was the exact element the navbar used to sit on top of. */}
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            Featured Message
          </span>

          <h1
            id="media-hero-heading"
            className="mt-5 text-balance font-heading text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl"
            style={{ letterSpacing: '-0.035em' }}
          >
            {sermon.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#a6a6a6]">
            {sermon.date && (
              <span className={sermon.dateIsPlaceholder ? 'text-white/35 italic' : undefined}>
                {sermon.date}
              </span>
            )}
            {sermon.date && (
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
            )}
            <span>{sermon.speakerName}</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={`/media/watch/${sermon.slug}`}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1b7a70] px-7 font-heading text-sm font-semibold tracking-[0.04em] text-white transition-[transform,background-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#166059] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>

            <a
              href="#media-library"
              className="group inline-flex h-12 items-center gap-2 text-sm font-semibold text-white/70 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
            >
              Browse the library
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-1 motion-reduce:transition-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 4v12M5 11l5 5 5-5" />
              </svg>
            </a>
          </div>
        </div>

        {/* Double-bezel media card (Doc 9 §4A): gradient shell, photo core. */}
        <Link
          to={`/media/watch/${sermon.slug}`}
          aria-label={`Watch ${sermon.title}`}
          className={`group block rounded-3xl p-[1.5px] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 ${reveal}`}
          style={{
            transitionDelay: '140ms',
            background:
              'linear-gradient(160deg, #1b7a70, rgb(143 212 201 / 0.35) 55%, transparent)',
          }}
        >
          <div className="relative aspect-video overflow-hidden rounded-[1.4rem] bg-[#0B0F14]">
            <img
              src={sermonThumbnail(sermon)}
              alt={sermon.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
            />
            {/* It is a video. Say so — same play badge LatestSermonSection uses. */}
            <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 motion-reduce:transition-none"
                style={{ backgroundColor: 'rgb(27 122 112 / 0.85)' }}
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
