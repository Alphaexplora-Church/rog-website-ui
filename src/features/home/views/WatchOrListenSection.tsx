import { Link } from 'react-router-dom'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'
import { sermonsBySeries, sermonThumbnail } from '../../media/data/mediaData'

/** A teaser shows a taste, not the shelf. Three is the taste. */
const TEASER_COUNT = 3

/**
 * Home — "Watch or Listen." A teaser for the Media tab, not a copy of it.
 *
 * ── REBUILT 2026-09-23 ───────────────────────────────────────────────────
 * Jude: "ayusin mo na rin yung watch or listen section sa may home tab,
 * pero wag mo lagay don lahat, parang teaser lang para atleast sile mismo
 * mag locate sa tab na yon."
 *
 * Two things were wrong, and the second one mattered more than the layout:
 *
 *   1. THE FOUR TABS DID NOTHING. Series / Topics / Speakers / Scripture sat
 *      here as a `role="tablist"` with `aria-selected`, and clicking any of
 *      them changed the selected state and nothing else — the same five
 *      cards rendered for all four. A control that announces itself to a
 *      screen reader as a tab set and then filters nothing is worse than no
 *      control. The real filtering lives on /media, which is where it
 *      belongs and where this section now sends people.
 *   2. EVERY SERMON ON IT WAS INVENTED. "Living Water, Pt. 3", "Faith That
 *      Moves", "Prayer as Posture", "The Father's Heart", "Seasoned in the
 *      Spirit" — with dates through Sep 2026 and five different speakers —
 *      were the designer's layout placeholders. The file's own comment said
 *      to swap them "once the real Media/sermon collection is live". It is
 *      live: these are now real rows out of `mediaData.ts`, the same source
 *      the Media tab and PreviousMessagesSection read.
 *
 * Also gone: the carousel, its arrow buttons and its dot pagination. Five
 * cards behind a slider is browsing machinery, and browsing is the Media
 * tab's job. Three cards and one clear way in.
 *
 * DATES SHOW, PLACEHOLDERS INCLUDED (Jude, 2026-09-23: "lagyan mo rin ng
 * date"). An earlier pass here hid them, because most sermons in mediaData
 * still carry `date: 'Date pending'` / `dateIsPlaceholder: true` and three
 * rows of that reads as unfinished. Showing them is the better call: it is
 * what the data actually says, and a visible gap is the thing most likely
 * to get the real dates filled in. They use the same dimmed-italic
 * treatment PreviousMessagesSection and MediaHero already give a
 * placeholder date, so the moment real dates land in mediaData these turn
 * into ordinary text with no change here.
 *
 * ORDER IS ARRAY ORDER, NOT RECENCY. `mediaData` does not track upload date
 * yet, so this takes the first three of the Sunday Service series and calls
 * them "a few", never "the latest" — same reason MediaHero says "Featured
 * Message" rather than "Most Recent".
 *
 * The four browse modes still appear at the bottom, but as plain text now:
 * they tell you what is waiting on the Media tab without pretending to be
 * controls here. That is the "para sila mismo mag-locate sa tab na yon".
 */
export function WatchOrListenSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`
  const teasers = sermonsBySeries('sunday-service').slice(0, TEASER_COUNT)

  return (
    <section
      ref={ref}
      data-plate="dark"
      aria-labelledby="watch-or-listen-heading"
      className="relative overflow-hidden bg-[#232323] text-white"
    >
      <div className="relative mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
        <div
          className={`flex flex-wrap items-end justify-between gap-6 ${reveal}`}
          style={{ transitionDelay: '0ms' }}
        >
          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
              style={{
                color: '#8FD4C9',
                backgroundColor: 'rgb(27 122 112 / 0.18)',
                boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
              }}
            >
              Messages
            </span>
            <h2
              id="watch-or-listen-heading"
              className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Watch or Listen
            </h2>
            <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-white/55">
              Missed a Sunday? A few from the library to get you started.
            </p>
          </div>

          <Link
            to="/media"
            className="group inline-flex h-11 items-center gap-2 text-sm font-semibold text-[#8FD4C9] transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-white"
          >
            Browse the library
            <svg
              viewBox="0 0 20 20"
              className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12M11 5l5 5-5 5" />
            </svg>
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teasers.map((s, i) => (
            <li key={s.slug} className={reveal} style={{ transitionDelay: `${120 + i * 70}ms` }}>
              <Link
                to={`/media/watch/${s.slug}`}
                className="group block transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                  <img
                    src={sermonThumbnail(s)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 motion-reduce:transition-none"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  />
                  <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110 motion-reduce:transition-none"
                      style={{ backgroundColor: 'rgb(27 122 112 / 0.85)' }}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                </div>

                <p className="mt-4 font-heading text-base font-bold transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-[#8FD4C9]">
                  {s.title}
                </p>
                <p className="mt-1 text-[13px] text-white/55">
                  {/* Placeholder dates render dimmed and italic — the same
                      treatment they get everywhere else on the site. */}
                  {s.date && (
                    <span className={s.dateIsPlaceholder ? 'text-white/30 italic' : undefined}>
                      {s.date}
                    </span>
                  )}
                  {s.date ? ' · ' : ''}
                  {s.speakerName}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* What's actually on the Media tab. Plain text, not controls — the
            point is to send people there, not to re-implement it here. */}
        <div
          className={`mt-12 flex flex-col items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between ${reveal}`}
          style={{ transitionDelay: '340ms' }}
        >
          <p className="text-sm font-semibold text-white">
            Browse by series, topic, speaker or scripture.
          </p>
          <Link
            to="/media"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#1b7a70] px-6 text-sm font-semibold text-white transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#166059] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Open Media
          </Link>
        </div>
      </div>

      {/* Wave divider into Watch Our Live Services (#161616). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,90 C240,150 480,10 720,80 C960,150 1200,10 1440,75 L1440,150 L0,150 Z"
          fill="#161616"
        />
      </svg>
    </section>
  )
}
