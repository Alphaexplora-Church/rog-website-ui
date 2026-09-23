import { useInView } from '../../../shared/hooks/useInView'
import { site } from '../../../shared/config/site'
import {
  revealBase,
  revealHidden,
  revealShown,
  riverGlow,
  textH1,
} from '../../../shared/styles/tokens'
import { useWatchLiveViewModel } from '../viewModels/useWatchLiveViewModel'

const countdownUnits = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
] as const

/**
 * Watch Live, section 1 — full-bleed cinematic hero.
 *
 * REBUILT 2026-09-22 on Jude's call ("change the layout and design… pangit ng
 * colorway"). The previous version was a centred stack of bordered boxes on
 * flat black in a `max-w-4xl` column, and it was wrong on three counts that
 * are worth writing down so nobody rebuilds it that way again:
 *
 *   1. WRONG CONTAINER. Every other page on this site lays out in
 *      `max-w-[86rem]` (29 call sites). `max-w-4xl` is a third narrower, so
 *      the page read as a cramped centred column next to its own siblings.
 *   2. NOTHING TO LOOK AT. EventsHero and MinistriesHero are both full-bleed
 *      photo + gradient + wave divider. The one page whose entire subject is
 *      video had no imagery at all — the flattest hero on the site.
 *   3. MIXED ALIGNMENT. Eyebrow and headline were left-aligned, then the
 *      countdown, CTA and notify form were centred. The eye had no single
 *      edge to track down.
 *
 * So: photo bg + dual gradient scrim + the shared `riverGlow` ambience,
 * left-aligned all the way down the same `max-w-[86rem]` edge, and a wave
 * divider into PreviousMessagesSection (fill `#161616` — that section's own
 * background; if it ever changes, this fill changes with it).
 *
 * TEAL IS LOUD HERE, ALSO ON JUDE'S CALL ("mas malakas na teal"). The
 * countdown sits in a teal-tinted glass panel, the CTA is a teal fill rather
 * than the shared white Button, and the eyebrow/labels carry `#8FD4C9`.
 * That's a deliberate departure from tokens.ts's "never a saturated fill"
 * note, which predates the site's move to the teal accent — 12 files already
 * ship `bg-[#1b7a70]` fills.
 *
 * NOTIFY-ME REMOVED 2026-09-23 on Jude's call. The hero now ends on the
 * single Watch Live action. The view model's notify state went with it
 * rather than being left dangling — nothing else imported it. If an email
 * capture comes back, it belongs on the `signup` Strapi type (Doc 2 §4.8),
 * not in local component state.
 *
 * THE CTA IS HAND-ROLLED rather than the shared `<Button>`. Button's `solid`
 * variant hardcodes `bg-white text-black`, and overriding a Tailwind utility
 * by passing a competing one through `className` is decided by stylesheet
 * order, not attribute order — it is not reliable. Same reason PlanAVisit's
 * submit button is hand-rolled. The class recipe below is copied from
 * Button.tsx so press feedback, sheen timing and the live dot stay identical
 * to every other CTA on the site.
 *
 * MOTION (kept from the previous pass, it was not what was wrong): entrance
 * is a staircase — headline 0ms, countdown 140, services 220, CTA 300 — with
 * delays inline because Tailwind cannot see a class name built at runtime.
 * The countdown digits deliberately do not animate; the seconds column
 * changes sixty times a minute and animating it would be the most repeated
 * motion on the site. `tabular-nums` keeps the ticking from nudging layout.
 */
export function WatchLiveHero() {
  const { ref, shown } = useInView<HTMLElement>()
  const { next, countdown } = useWatchLiveViewModel()

  const sundayServices = site.services.filter((s) => s.day === 'Sunday')
  const reveal = `${revealBase} ${shown ? revealShown : revealHidden}`

  return (
    <section data-plate="dark" className="relative overflow-hidden bg-black text-white">
      {/* Congregation under stage lights — the same asset LiveServicesSection
          already ships, so it is a known-good URL, and it was picked by
          actually looking at it rather than trusting a filename. Worth
          knowing: ServiceTimesSection's "Sunday Worship" card
          (photo-1438283173091-…) is a photograph of a hippopotamus. */}
      <img
        src="https://images.unsplash.com/photo-1622598453695-4fbaf151aadc?auto=format&fit=crop&q=80&w=2000"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      {/* Two scrims, not one, and each does exactly one job. The vertical
          only darkens the bottom edge, so the wave divider can hand off to
          `#161616` without a seam — it fades to transparent well before the
          crowd, which is the part of this photo worth seeing. The horizontal
          keeps the left column legible no matter how busy the image gets.
          A third, evenly-dark scrim is what made the first version look like
          flat black with a rumour of a photo behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"
      />
      <div aria-hidden="true" className={riverGlow} />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-[86rem] px-6 pt-40 pb-24 sm:pt-48 sm:pb-32"
      >
        <div className={reveal} style={{ transitionDelay: '0ms' }}>
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#8FD4C9] uppercase">
            <span aria-hidden="true" className="relative flex h-[7px] w-[7px] flex-none">
              <span className="absolute inset-0 animate-ping rounded-full bg-current motion-reduce:hidden" />
              <span className="relative h-[7px] w-[7px] rounded-full bg-current" />
            </span>
            Live Stream
          </p>
          <h1
            className="mt-5 max-w-[16ch] text-balance font-heading leading-[1.02] font-bold"
            style={{ fontSize: textH1, letterSpacing: '-0.045em' }}
          >
            Watch Live
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-[#a6a6a6] sm:text-lg">
            Can&apos;t make it in person? Join us live every Sunday — wherever you are, no seat
            needed.
          </p>
        </div>

        {/* Countdown — teal glass, inline rather than a padded box so the
            hero stays a composition instead of a stack of cards. */}
        <div className={`mt-12 ${reveal}`} style={{ transitionDelay: '140ms' }}>
          <p className="text-[11px] font-bold tracking-[0.22em] text-white/50 uppercase">
            Next stream — <span className="text-[#8FD4C9]">{next.label}</span>
          </p>
          {/* The teal wash is an inline style, not `bg-[#1b7a70]/10`.
              Tailwind only emits utilities whose exact class string it has
              already seen somewhere in the project, and the teal-with-opacity
              variants are not in that set — `ring-[#1b7a70]/40` is (see
              MediaLibrarySection), which is why the edge is a ring. Inline
              style is the same escape hatch tokens.ts uses for textH1. */}
          <div
            aria-hidden="true"
            className="mt-4 inline-flex items-center gap-5 rounded-2xl px-6 py-5 ring-1 ring-[#1b7a70]/40 backdrop-blur-md sm:gap-8 sm:px-8"
            style={{ backgroundColor: 'rgb(27 122 112 / 0.12)' }}
          >
            {countdownUnits.map(({ key, label }, i) => (
              <div key={key} className="flex items-center gap-5 sm:gap-8">
                {i > 0 && <span className="text-2xl font-bold text-[#1b7a70]">:</span>}
                <div className="flex flex-col items-center">
                  {/* No transition by design — see the file header. */}
                  <span className="font-heading text-4xl font-bold tabular-nums sm:text-5xl">
                    {String(countdown[key]).padStart(2, '0')}
                  </span>
                  <span className="mt-1 text-[10px] font-bold tracking-[0.22em] text-white/45 uppercase">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service times as one compact row — three separate cards was the
            other thing making this page read as a stack of boxes. */}
        <div
          className={`mt-8 flex flex-wrap items-center gap-2 ${reveal}`}
          style={{ transitionDelay: '220ms' }}
        >
          {sundayServices.map((svc) => {
            const isNext = next.label === `${svc.time} — ${svc.language}`
            return (
              <span
                key={`${svc.time}-${svc.language}`}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ring-1 backdrop-blur-md transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isNext ? 'text-white ring-[#1b7a70]/40' : 'bg-white/[0.02] text-white/60 ring-white/15'
                }`}
                style={isNext ? { backgroundColor: 'rgb(27 122 112 / 0.22)' } : undefined}
              >
                {svc.time}
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${
                    isNext ? 'text-[#8FD4C9]' : 'text-white/35'
                  }`}
                >
                  {svc.language}
                </span>
              </span>
            )
          })}
        </div>

        {/* The hero ends on one action. */}
        <div
          className={`mt-10 flex ${reveal}`}
          style={{ transitionDelay: '300ms' }}
        >
          <a
            href={site.liveStreamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#1b7a70] px-7 font-heading text-sm font-semibold tracking-[0.04em] whitespace-nowrap text-white shadow-[0_0_35px_-8px_rgba(56,189,248,0.55)] transition-[transform,background-color,color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#166059] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <span aria-hidden="true" className="relative flex h-[7px] w-[7px] flex-none">
              <span className="absolute inset-0 animate-ping rounded-full bg-current motion-reduce:hidden" />
              <span className="relative h-[7px] w-[7px] rounded-full bg-current" />
            </span>
            <span className="relative z-10">Watch Live</span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-[120%] rounded-[inherit] transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[120%] [background:linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.26)_50%,transparent_70%)]"
            />
          </a>
        </div>
      </div>

      {/* Divider into PreviousMessagesSection — same wave EventsHero uses. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="relative block h-[70px] w-full sm:h-[100px]"
      >
        <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#161616" />
      </svg>
    </section>
  )
}
