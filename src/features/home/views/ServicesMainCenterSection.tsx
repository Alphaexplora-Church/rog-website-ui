import { site } from '../../../shared/config/site'
import { useInView } from '../../../shared/hooks/useInView'
import { revealBase, revealHidden, revealShown } from '../../../shared/styles/tokens'

/**
 * Home — "Our Services & Main Center," last section before the footer.
 * Reads straight from `site.services` / `site.location` / `site.phone`, so
 * there is exactly one source of truth for all of it.
 *
 * ── REWORKED 2026-09-23 ──────────────────────────────────────────────────
 * Jude: "under the Our Services & Main Center, fix the UI and the design."
 *
 * WHAT WAS ACTUALLY WRONG:
 *   1. THE SCHEDULE WAS ONE RUN-ON LINE. All three Sunday services were
 *      `.join(' · ')` into "10:00 AM Taglish · 1:00 PM Taglish · 4:00 PM
 *      English" — a single sentence for the most looked-up fact on a church
 *      site. Times are a list; they are rows now, each with its own line and
 *      its language beside it.
 *   2. THE ADDRESS WAS ONE RUN-ON LINE TOO. Venue and area were
 *      concatenated into a 150-character paragraph. Two lines now, venue
 *      over area, the way an address is actually read.
 *   3. THE HEADING WAS 24px. Every other section on this page now opens at
 *      text-3xl/4xl, so this one read as a subsection of the thing above it
 *      rather than its own section. It also had no eyebrow pill while all
 *      its neighbours do (Doc 9 §4C).
 *   4. THE PHONE NUMBER WAS MISSING. `site.phone` exists and this is the
 *      "how do I reach the church" card — it is now here, as a real `tel:`
 *      link.
 *   5. THE MAIN CENTER PHOTO NEVER LOADED. `photo-1760367121593…` returns
 *      nothing (it fails on the Facebook card in LiveServicesSection too).
 *      It sat under a 90%-opaque teal wash so the failure was invisible,
 *      but it was still a broken request on every page load. Swapped for a
 *      URL confirmed to load.
 *
 * Note for the record: `bg-white/6` on the old tiles was *not* broken — it
 * compiles fine. It is simply 6% white, which is close enough to nothing
 * that the tiles read as unstyled. They now use the same
 * `bg-white/[0.02]` + hairline-border treatment as every other card on the
 * site, which is fainter in fill but actually visible because it has an
 * edge.
 *
 * The Figma asymmetric corners (`rounded-[20px_6px_20px_6px]`) are gone for
 * the same reason they went everywhere else — nothing else on the site
 * rounds that way any more.
 */
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.location.venue}, ${site.location.area}`,
)}`

export function ServicesMainCenterSection() {
  const { ref, shown } = useInView<HTMLElement>()
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  const sundayServices = site.services.filter((s) => s.day.toLowerCase().includes('sunday'))
  const midweekServices = site.services.filter((s) => !s.day.toLowerCase().includes('sunday'))

  return (
    <section
      ref={ref}
      id="service-times"
      data-plate="dark"
      aria-labelledby="services-main-center-heading"
      className="relative overflow-hidden bg-[#232323] text-white"
    >
      <div className="relative mx-auto max-w-[86rem] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44">
        <div className={reveal} style={{ transitionDelay: '0ms' }}>
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{
              color: '#8FD4C9',
              backgroundColor: 'rgb(27 122 112 / 0.18)',
              boxShadow: 'inset 0 0 0 1px rgb(143 212 201 / 0.25)',
            }}
          >
            Visit Us
          </span>
          <h2
            id="services-main-center-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Our Services &amp; Main Center
          </h2>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/55">
            Come as you are — there&apos;s a seat for you at every service.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
          <div
            className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${reveal}`}
            style={{ transitionDelay: '120ms' }}
          >
            <ServiceCard day="Sundays" services={sundayServices} />
            <ServiceCard day="Wednesdays" services={midweekServices} />
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl ${reveal}`}
            style={{ transitionDelay: '200ms' }}
          >
            {/* Texture under the wash. Was a URL that returns nothing. */}
            <img
              src="https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&w=900&q=80"
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(160deg, rgba(27,122,112,0.92), rgba(12,62,56,0.96))',
              }}
            />

            <div className="relative flex h-full flex-col p-7 sm:p-8">
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase">
                Main Center
              </span>

              {/* Venue over area — this used to be one 150-character line. */}
              <p className="mt-4 font-heading text-lg leading-snug font-bold text-white sm:text-xl">
                {site.location.venue}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{site.location.area}</p>

              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-white underline-offset-4 transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[#8FD4C9] hover:underline"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 5c0 8.284 6.716 15 15 15a2 2 0 002-2v-2a1 1 0 00-.76-.97l-3.6-.9a1 1 0 00-1 .27l-1.1 1.1a12 12 0 01-5.44-5.44l1.1-1.1a1 1 0 00.27-1l-.9-3.6A1 1 0 007.6 3H5.6A2 2 0 003 5z" />
                </svg>
                {site.phone}
              </a>

              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="group mt-auto inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-white px-6 pt-0 text-sm font-semibold text-[#0b3b36] transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#8FD4C9] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
              >
                Get directions
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Wave divider into the footer (bg-black — see Footer.tsx). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[90px] w-full sm:h-[120px]"
      >
        <path
          d="M0,70 C240,10 480,130 720,60 C960,10 1200,120 1440,55 L1440,140 L0,140 Z"
          fill="#000000"
        />
      </svg>
    </section>
  )
}

/**
 * One day's services as rows rather than a joined sentence. The time leads
 * because that is what someone is scanning for; the language sits beside it
 * because at ROG it is the thing that decides which service you attend.
 */
function ServiceCard({
  day,
  services,
}: {
  day: string
  services: typeof site.services
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <span className="text-[10px] font-bold tracking-[0.2em] text-[#8FD4C9] uppercase">{day}</span>

      <ul className="mt-4 flex flex-col">
        {services.map((s, i) => (
          <li
            key={`${s.day}-${s.time}-${s.language}`}
            className={`flex items-baseline justify-between gap-4 py-3 ${
              i > 0 ? 'border-t border-white/10' : ''
            }`}
          >
            <span className="font-heading text-lg font-bold text-white tabular-nums">{s.time}</span>
            <span className="text-right text-sm text-white/55">{s.label ?? s.language}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
